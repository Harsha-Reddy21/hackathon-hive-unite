
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  username: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  description: string;
  members: TeamMember[];
  membersCount: number;
  maxMembers: number;
  skills: string[];
}

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Load teams from localStorage
  useEffect(() => {
    const loadTeams = () => {
      const teamsData = localStorage.getItem("hackmap-teams");
      if (teamsData) {
        const loadedTeams = JSON.parse(teamsData);
        setTeams(loadedTeams);
      }
    };
    
    const loadCurrentUser = () => {
      const userData = localStorage.getItem("hackmap-user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    };
    
    loadTeams();
    loadCurrentUser();
    
    // Listen for storage changes in case teams are updated in another tab
    window.addEventListener('storage', loadTeams);
    
    return () => {
      window.removeEventListener('storage', loadTeams);
    };
  }, []);
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.hackathonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleJoinTeamRequest = (team: Team) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join teams",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is already a member of this team
    const isMember = team.members.some(member => member.id === currentUser.id);
    if (isMember) {
      toast({
        title: "Already a Member",
        description: "You are already a member of this team",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the team is full
    if (team.membersCount >= team.maxMembers) {
      toast({
        title: "Team Full",
        description: "This team has reached its maximum number of members",
        variant: "destructive",
      });
      return;
    }
    
    // Add request to team
    const updatedTeams = teams.map(t => {
      if (t.id === team.id) {
        const joinRequests = t.joinRequests || [];
        // Check if already requested
        if (joinRequests.some(req => req.userId === currentUser.id)) {
          toast({
            title: "Request Already Sent",
            description: "You have already requested to join this team",
            variant: "destructive",
          });
          return t;
        }
        
        return {
          ...t,
          joinRequests: [
            ...joinRequests,
            {
              id: `request-${Date.now()}`,
              userId: currentUser.id,
              username: currentUser.username,
              requestDate: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    });
    
    // Update localStorage
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
    
    toast({
      title: "Request Sent!",
      description: `Your request to join ${team.name} has been sent to the team leader.`,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams</h1>
            <p className="text-gray-600 max-w-3xl">
              Find teams looking for members with your skills or create your own team
            </p>
          </div>
          <Button asChild>
            <Link to="/teams/create">
              <Plus className="h-4 w-4 mr-2" /> Create Team
            </Link>
          </Button>
        </div>

        <div className="relative w-full md:w-2/3 mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search teams by name, skills, or hackathon..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    <span>{team.name}</span>
                    <Badge className="ml-2 bg-hackmap-blue">
                      {team.membersCount}/{team.maxMembers} Members
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{team.hackathonName}</p>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm mb-4">{team.description}</p>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Skills Needed:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {team.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-muted text-muted-foreground text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <div className="flex space-x-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/teams/${team.id}`}>
                        <Users className="h-4 w-4 mr-2" /> View Team
                      </Link>
                    </Button>
                    <Button
                      className="flex-1 bg-hackmap-purple hover:bg-hackmap-purple/90"
                      onClick={() => handleJoinTeamRequest(team)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" /> Join Team
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No teams found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or create a new team</p>
            <Button asChild>
              <Link to="/teams/create">
                <Plus className="h-4 w-4 mr-2" /> Create New Team
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
