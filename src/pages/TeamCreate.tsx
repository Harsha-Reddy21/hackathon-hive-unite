
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
import { Plus, X, Users, Copy, Check, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Hackathon {
  id: string;
  title: string;
  name?: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  skills?: string[];
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
  const [inviteCode, setInviteCode] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<UserData[]>([]);
  const [inviteMethod, setInviteMethod] = useState("username");
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        uiToast({
          title: "Not logged in",
          description: "You must be logged in to create a team",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      setCurrentUser({
        id: user.id,
        username: profile?.username || user.email || '',
        email: profile?.email || user.email || '',
        skills: []
      });
    };
    
    loadUserData();

    // Load hackathons from Supabase
    const fetchHackathons = async () => {
      try {
        const { data: hackathonData, error } = await supabase
          .from('hackathons')
          .select('id, name');
          
        if (error) throw error;
        
        if (hackathonData) {
          const hackathonsForSelect = hackathonData.map(h => ({
            id: h.id,
            title: h.name
          }));
          setHackathons(hackathonsForSelect);
        }
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        toast.error("Failed to load hackathons");
      }
    };
    
    fetchHackathons();
    
    // Load all users for skill matching
    const fetchUsers = async () => {
      try {
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) throw error;
        
        if (userData) {
          setAllUsers(userData.map(user => ({
            id: user.id,
            username: user.username || '',
            email: user.email || '',
            skills: []
          })));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    
    fetchUsers();
    
    // Generate unique invite code
    generateInviteCode();
  }, [toast, navigate, uiToast]);
  
  // Generate a random invite code
  const generateInviteCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setInviteCode(result);
  };
  
  // Copy invite code to clipboard
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
    
    toast({
      title: "Code Copied",
      description: "Invite code copied to clipboard",
    });
  };

  useEffect(() => {
    // Find users with matching skills
    if (skills.length > 0 && allUsers.length > 0) {
      const skillMatches = allUsers.filter(user => {
        // Don't include the current user
        if (user.id === currentUser?.id) return false;
        
        // Don't include already invited users
        if (invitedUsers.includes(user.username)) return false;
        
        // Check if user has matching skills
        if (!user.skills) return false;
        
        // User should have at least one skill that the team is looking for
        return skills.some(skill => 
          user.skills?.includes(skill)
        );
      });
      
      setMatchedUsers(skillMatches);
    } else {
      setMatchedUsers([]);
    }
  }, [skills, allUsers, currentUser, invitedUsers]);

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
    const userExists = allUsers.some(user => user.username === usernameToInvite);

    if (!userExists) {
      uiToast({
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

  const addMatchedUser = (username: string) => {
    if (!invitedUsers.includes(username)) {
      setInvitedUsers([...invitedUsers, username]);
      
      toast({
        title: "User Invited",
        description: `${username} has been added to invitations`,
      });
    }
  };

  const removeInvitedUser = (username: string) => {
    setInvitedUsers(invitedUsers.filter(u => u !== username));
  };

  const handleCreateTeam = async () => {
    if (!selectedHackathonId) {
      uiToast({
        title: "Missing hackathon",
        description: "Please select a hackathon for your team",
        variant: "destructive",
      });
      return;
    }

    if (!teamName) {
      uiToast({
        title: "Missing team name",
        description: "Please provide a name for your team",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      uiToast({
        title: "Not logged in",
        description: "You must be logged in to create a team",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Find hackathon details for the selected hackathon
      const { data: selectedHackathon, error: hackathonError } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', selectedHackathonId)
        .maybeSingle();
      
      if (hackathonError || !selectedHackathon) {
        throw new Error("Selected hackathon not found");
      }

      const teamMembers = [
        {
          id: currentUser.id,
          username: currentUser.username,
          role: "leader"
        }
      ];
      
      const teamInvitations = invitedUsers.map(username => ({
        username,
        invitedAt: new Date().toISOString(),
        status: "pending"
      }));

      // Create new team object for Supabase
      const newTeam = {
        name: teamName,
        hackathon_id: selectedHackathonId,
        hackathon_name: selectedHackathon.name,
        description: teamDescription,
        members: teamMembers,
        members_count: 1,
        max_members: parseInt(maxMembers, 10),
        skills: skills.length > 0 ? skills : ["General"],
        invitations: teamInvitations,
        invite_code: inviteCode,
        created_at: new Date().toISOString(),
      };

      console.log("Creating team:", newTeam);
      
      // Save to Supabase
      const { data: createdTeam, error } = await supabase
        .from('teams')
        .insert(newTeam)
        .select()
        .single();
      
      if (error || !createdTeam) {
        throw new Error(error?.message || "Failed to create team");
      }
      
      toast({
        title: "Team created",
        description: `Your team ${teamName} has been created successfully`,
      });

      navigate("/teams");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create team");
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
                <Tabs defaultValue="username" onValueChange={setInviteMethod}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="username">Invite by Username</TabsTrigger>
                    <TabsTrigger value="code">Invite by Code</TabsTrigger>
                    <TabsTrigger value="matching">Skill Matching</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="username" className="mt-0">
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
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="code" className="mt-0">
                    <div className="bg-gray-50 rounded-md p-4 flex flex-col space-y-4">
                      <p className="text-sm mb-2">
                        Share this invite code with potential team members:
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="bg-white border border-gray-300 rounded px-4 py-2 font-mono text-lg flex-1 text-center">
                          {inviteCode}
                        </div>
                        <Button
                          variant="outline"
                          onClick={copyInviteCode}
                          size="sm"
                        >
                          {showCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Team members can join using this code from the Teams page
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="matching" className="mt-0">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        These users have skills that match your team's requirements:
                      </p>
                      {matchedUsers.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {matchedUsers.map((user) => (
                            <div 
                              key={user.id} 
                              className="flex justify-between items-center border rounded-md p-2"
                            >
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {user.skills?.filter(skill => skills.includes(skill)).map((skill) => (
                                    <Badge 
                                      key={skill}
                                      className="bg-hackmap-purple/10 text-hackmap-purple text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addMatchedUser(user.username)}
                              >
                                <UserPlus className="h-3 w-3 mr-1" /> Invite
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 border rounded-md">
                          <p className="text-muted-foreground">No skill matches found</p>
                          <p className="text-xs mt-1">Try adding more skills or invite by username</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {invitedUsers.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Invited Users:</Label>
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
