
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Search } from "lucide-react";
import { Link } from "react-router-dom";

const TeamCreate = () => {
  const [teamName, setTeamName] = useState("");
  const [hackathon, setHackathon] = useState("");
  const [hackathonId, setHackathonId] = useState("");
  const [availableHackathons, setAvailableHackathons] = useState<any[]>([]);
  const [hackathonSuggestions, setHackathonSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState<number>(5);
  const [skills, setSkills] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load available hackathons on component mount
  useEffect(() => {
    const loadHackathons = () => {
      const storedHackathons = localStorage.getItem("hackmap-hackathons");
      if (storedHackathons) {
        const hackathons = JSON.parse(storedHackathons);
        setAvailableHackathons(hackathons);
      }
    };
    
    loadHackathons();
  }, []);
  
  // Check team name availability
  useEffect(() => {
    if (!teamName.trim() || !hackathonId) return;
    
    const checkTeamName = () => {
      const storedTeams = localStorage.getItem("hackmap-teams");
      if (!storedTeams) return true;
      
      const teams = JSON.parse(storedTeams);
      const isAvailable = !teams.some(
        (team: any) => 
          team.name.toLowerCase() === teamName.toLowerCase() && 
          team.hackathonId === hackathonId
      );
      
      setIsNameAvailable(isAvailable);
    };
    
    checkTeamName();
  }, [teamName, hackathonId]);

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !hackathonId || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!isNameAvailable) {
      toast({
        title: "Error",
        description: "Team name already exists for this hackathon",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user data
      const userData = localStorage.getItem("hackmap-user");
      if (!userData) {
        throw new Error("User not logged in");
      }

      const parsedUserData = JSON.parse(userData);
      
      // Get selected hackathon
      const selectedHackathon = availableHackathons.find(h => h.id === hackathonId);
      if (!selectedHackathon) {
        throw new Error("Selected hackathon not found");
      }

      // Create new team
      const newTeam = {
        id: `team-${Date.now()}`,
        name: teamName,
        hackathonId: hackathonId,
        hackathonName: selectedHackathon.title,
        description: description,
        members: [
          {
            id: parsedUserData.id,
            username: parsedUserData.username,
            role: "leader"
          }
        ],
        membersCount: 1,
        maxMembers: parseInt(maxMembers.toString()),
        skills: skills.filter(skill => skill.trim() !== ""),
        createdAt: new Date().toISOString(),
        joinRequests: []
      };

      // Update user's team count
      const updatedUserData = {
        ...parsedUserData,
        teamCount: (parsedUserData.teamCount || 0) + 1,
        teams: [...(parsedUserData.teams || []), newTeam.id]
      };
      localStorage.setItem("hackmap-user", JSON.stringify(updatedUserData));
      
      // Update all users array
      const allUsersData = localStorage.getItem("hackmap-all-users");
      if (allUsersData) {
        const allUsers = JSON.parse(allUsersData);
        const updatedAllUsers = allUsers.map((user: any) => 
          user.id === parsedUserData.id ? updatedUserData : user
        );
        localStorage.setItem("hackmap-all-users", JSON.stringify(updatedAllUsers));
      }

      // Add team to global teams
      const storedTeams = localStorage.getItem("hackmap-teams") || "[]";
      const teams = JSON.parse(storedTeams);
      teams.push(newTeam);
      localStorage.setItem("hackmap-teams", JSON.stringify(teams));
      
      // Update hackathon with new team
      selectedHackathon.teams = [...(selectedHackathon.teams || []), newTeam.id];
      const updatedHackathons = availableHackathons.map(h => 
        h.id === hackathonId ? selectedHackathon : h
      );
      localStorage.setItem("hackmap-hackathons", JSON.stringify(updatedHackathons));

      toast({
        title: "Success",
        description: "Team created successfully!",
      });

      // Redirect to teams page
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

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  // Handle hackathon search
  const handleHackathonSearch = (query: string) => {
    setHackathon(query);
    
    if (!query.trim()) {
      setHackathonSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const matchingHackathons = availableHackathons.filter(
      h => h.title.toLowerCase().includes(query.toLowerCase())
    );
    
    setHackathonSuggestions(matchingHackathons.map(h => h.title));
    setShowSuggestions(true);
  };
  
  // Select hackathon from suggestions
  const selectHackathon = (hackathonName: string) => {
    const selectedHackathon = availableHackathons.find(
      h => h.title === hackathonName
    );
    
    if (selectedHackathon) {
      setHackathon(selectedHackathon.title);
      setHackathonId(selectedHackathon.id);
    }
    
    setShowSuggestions(false);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Team</h1>
          <p className="text-gray-600">Fill in the details to create your team</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                  className={!isNameAvailable ? "border-red-500" : ""}
                />
                {!isNameAvailable && (
                  <p className="text-red-500 text-xs mt-1">
                    This team name is already taken for this hackathon
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hackathon</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <div className="relative">
                    <Input
                      value={hackathon}
                      onChange={(e) => handleHackathonSearch(e.target.value)}
                      placeholder="Search for a hackathon..."
                      className="pl-10"
                    />
                    {showSuggestions && hackathonSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        {hackathonSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectHackathon(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    {showSuggestions && hackathonSuggestions.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <div className="px-3 py-2 text-gray-500">
                          No hackathons found. You may need to create one first.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your team's project and goals"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <Select value={maxMembers.toString()} onValueChange={(value) => setMaxMembers(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maximum members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Members</SelectItem>
                    <SelectItem value="4">4 Members</SelectItem>
                    <SelectItem value="5">5 Members</SelectItem>
                    <SelectItem value="6">6 Members</SelectItem>
                    <SelectItem value="7">7 Members</SelectItem>
                    <SelectItem value="8">8 Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Needed</label>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Enter a skill"
                        className="flex-1"
                      />
                      {skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addSkill}
                    className="mt-2"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Skill
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="/teams">Cancel</Link>
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={isLoading}
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
