
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hackathon {
  id: string;
  title: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
}

const TeamCreate = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("5");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [usernameToInvite, setUsernameToInvite] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("hackmap-user");
    if (!userData) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to create a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(userData));

    // Load hackathons from localStorage
    const hackathonsData = localStorage.getItem("hackmap-hackathons");
    if (hackathonsData) {
      const loadedHackathons = JSON.parse(hackathonsData);
      const hackathonsForSelect = loadedHackathons.map((h: any) => ({
        id: h.id,
        title: h.title,
      }));
      setHackathons(hackathonsForSelect);
    }
  }, [toast, navigate]);

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addInvitedUser = () => {
    if (!usernameToInvite.trim()) return;

    // Check if username exists in the system
    const allUsers = getAllUsers();
    const userExists = allUsers.some(user => user.username === usernameToInvite);

    if (!userExists) {
      toast({
        title: "User not found",
        description: `No user with username "${usernameToInvite}" exists`,
        variant: "destructive",
      });
      return;
    }

    if (!invitedUsers.includes(usernameToInvite)) {
      setInvitedUsers([...invitedUsers, usernameToInvite]);
      setUsernameToInvite("");
    }
  };

  const removeInvitedUser = (username: string) => {
    setInvitedUsers(invitedUsers.filter(u => u !== username));
  };

  const getAllUsers = (): UserData[] => {
    // This function would normally query a database, but for demo purposes,
    // we'll use localStorage to get registered users
    const usersData = localStorage.getItem("hackmap-users");
    return usersData ? JSON.parse(usersData) : [];
  };

  const handleCreateTeam = () => {
    if (!selectedHackathonId) {
      toast({
        title: "Missing hackathon",
        description: "Please select a hackathon for your team",
        variant: "destructive",
      });
      return;
    }

    if (!teamName) {
      toast({
        title: "Missing team name",
        description: "Please provide a name for your team",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to create a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Find hackathon details
      const hackathonsData = localStorage.getItem("hackmap-hackathons");
      const hackathons = hackathonsData ? JSON.parse(hackathonsData) : [];
      const selectedHackathon = hackathons.find((h: any) => h.id === selectedHackathonId);

      if (!selectedHackathon) {
        throw new Error("Selected hackathon not found");
      }

      // Create new team object
      const newTeam = {
        id: `team-${Date.now()}`,
        name: teamName,
        hackathonId: selectedHackathonId,
        hackathonName: selectedHackathon.title,
        description: teamDescription,
        members: [
          {
            id: currentUser.id,
            username: currentUser.username,
            role: "leader"
          }
        ],
        membersCount: 1,
        maxMembers: parseInt(maxMembers, 10),
        skills: skills.length > 0 ? skills : ["General"],
        invitations: invitedUsers.map(username => ({
          username,
          invitedAt: new Date().toISOString(),
          status: "pending"
        })),
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const teamsData = localStorage.getItem("hackmap-teams");
      const teams = teamsData ? JSON.parse(teamsData) : [];
      teams.push(newTeam);
      localStorage.setItem("hackmap-teams", JSON.stringify(teams));

      // Update user's teams in localStorage
      const userData = JSON.parse(localStorage.getItem("hackmap-user") || "{}");
      userData.teams = userData.teams || [];
      userData.teams.push(newTeam.id);
      localStorage.setItem("hackmap-user", JSON.stringify(userData));

      toast({
        title: "Team created",
        description: `Your team ${teamName} has been created successfully`,
      });

      navigate("/teams");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Team</h1>
          <p className="text-gray-600">Form a team for an upcoming hackathon and invite members with the skills you need</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="hackathon">Select Hackathon</Label>
                <Select value={selectedHackathonId} onValueChange={setSelectedHackathonId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hackathon" />
                  </SelectTrigger>
                  <SelectContent>
                    {hackathons.map(hackathon => (
                      <SelectItem key={hackathon.id} value={hackathon.id}>
                        {hackathon.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                />
              </div>

              <div>
                <Label htmlFor="description">Team Description</Label>
                <Textarea
                  id="description"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Describe your team's goals and what you're building"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="max-members">Maximum Team Size</Label>
                <Select value={maxMembers} onValueChange={setMaxMembers}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maximum team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Members</SelectItem>
                    <SelectItem value="3">3 Members</SelectItem>
                    <SelectItem value="4">4 Members</SelectItem>
                    <SelectItem value="5">5 Members</SelectItem>
                    <SelectItem value="6">6 Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Skills Needed</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="e.g., React, ML, UI/UX"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill}
                    size="sm"
                    disabled={!currentSkill.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Invite Members</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={usernameToInvite}
                    onChange={(e) => setUsernameToInvite(e.target.value)}
                    placeholder="Enter username to invite"
                    onKeyPress={(e) => e.key === "Enter" && addInvitedUser()}
                  />
                  <Button 
                    type="button" 
                    onClick={addInvitedUser}
                    size="sm"
                    disabled={!usernameToInvite.trim()}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                {invitedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {invitedUsers.map((username, index) => (
                      <Badge
                        key={index}
                        className="bg-hackmap-blue/10 text-hackmap-blue px-3 py-1 rounded-full flex items-center"
                      >
                        <span>{username}</span>
                        <button
                          type="button"
                          onClick={() => removeInvitedUser(username)}
                          className="ml-2 text-hackmap-blue hover:text-hackmap-blue/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/teams")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={isLoading || !teamName || !selectedHackathonId}
                  className="bg-hackmap-purple hover:bg-hackmap-purple/90"
                >
                  {isLoading ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamCreate;
