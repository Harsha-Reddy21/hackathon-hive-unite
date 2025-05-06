
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserPlus,
  Copy, 
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  inviteCode?: string;
  invitations?: {
    username: string;
    invitedAt: string;
    status: "pending" | "accepted" | "declined";
  }[];
}

interface UserData {
  id: string;
  username: string;
  email: string;
  skills?: string[];
}

const MyTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [usernameToInvite, setUsernameToInvite] = useState("");
  const [showCopied, setShowCopied] = useState<{ [key: string]: boolean }>({});
  const [activeTeamForInvite, setActiveTeamForInvite] = useState<Team | null>(null);
  const [matchedUsers, setMatchedUsers] = useState<UserData[]>([]);
  const [inviteMethod, setInviteMethod] = useState("username");
  const { toast } = useToast();

  useEffect(() => {
    // Get user data to check if logged in
    const userData = localStorage.getItem("hackmap-user");
    if (!userData) {
      setIsLoading(false);
      return;
    }

    const parsedUserData = JSON.parse(userData);
    setCurrentUser(parsedUserData);

    // Get all users data for invitations
    const usersData = localStorage.getItem("hackmap-users");
    if (usersData) {
      setAllUsers(JSON.parse(usersData));
    }

    // Get teams from localStorage
    const teamsData = localStorage.getItem("hackmap-teams");
    if (teamsData) {
      const allTeams = JSON.parse(teamsData);
      // Filter teams where user is a member
      const userTeams = allTeams.filter((team: Team) => 
        team.members.some((member: TeamMember) => member.username === parsedUserData.username)
      );
      setTeams(userTeams);
    }

    setIsLoading(false);
  }, []);

  // Find users with matching skills for a given team
  const findSkillMatches = (team: Team) => {
    if (!team.skills || team.skills.length === 0 || !allUsers.length) return [];
    
    const skillMatches = allUsers.filter(user => {
      // Don't include current team members
      if (team.members.some(member => member.id === user.id)) return false;
      
      // Don't include already invited users
      if (team.invitations?.some(inv => inv.username === user.username && inv.status === "pending")) return false;
      
      // Check if user has matching skills
      if (!user.skills) return false;
      
      // User should have at least one skill that the team is looking for
      return team.skills.some(skill => 
        user.skills?.includes(skill)
      );
    });
    
    return skillMatches;
  };

  const handleInviteUser = (team: Team) => {
    setActiveTeamForInvite(team);
    const matches = findSkillMatches(team);
    setMatchedUsers(matches);
    setInviteMethod("username");
    setUsernameToInvite("");
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setShowCopied({...showCopied, [code]: true});
    setTimeout(() => {
      setShowCopied({...showCopied, [code]: false});
    }, 2000);
    
    toast({
      title: "Code Copied",
      description: "Invite code copied to clipboard",
    });
  };

  const addInvitedUser = () => {
    if (!activeTeamForInvite || !usernameToInvite.trim()) return;

    // Check if username exists in the system
    const userExists = allUsers.some(user => user.username === usernameToInvite);

    if (!userExists) {
      toast({
        title: "User not found",
        description: `No user with username "${usernameToInvite}" exists`,
        variant: "destructive",
      });
      return;
    }

    // Check if user is already a member
    if (activeTeamForInvite.members.some(member => member.username === usernameToInvite)) {
      toast({
        title: "Already a member",
        description: `${usernameToInvite} is already a member of this team`,
        variant: "destructive",
      });
      return;
    }

    // Check if user is already invited
    if (activeTeamForInvite.invitations?.some(inv => inv.username === usernameToInvite && inv.status === "pending")) {
      toast({
        title: "Already invited",
        description: `${usernameToInvite} has already been invited to this team`,
        variant: "destructive",
      });
      return;
    }

    // Update the teams data
    const updatedTeams = teams.map(team => {
      if (team.id === activeTeamForInvite.id) {
        const invitations = team.invitations || [];
        return {
          ...team,
          invitations: [
            ...invitations,
            {
              username: usernameToInvite,
              invitedAt: new Date().toISOString(),
              status: "pending" as "pending" | "accepted" | "declined"
            }
          ]
        };
      }
      return team;
    });

    // Update localStorage
    const teamsData = localStorage.getItem("hackmap-teams");
    if (teamsData) {
      const allTeams = JSON.parse(teamsData);
      const updatedAllTeams = allTeams.map((t: Team) => {
        if (t.id === activeTeamForInvite.id) {
          const invitations = t.invitations || [];
          return {
            ...t,
            invitations: [
              ...invitations,
              {
                username: usernameToInvite,
                invitedAt: new Date().toISOString(),
                status: "pending" as "pending" | "accepted" | "declined"
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem("hackmap-teams", JSON.stringify(updatedAllTeams));
    }

    setTeams(updatedTeams);
    setUsernameToInvite("");

    toast({
      title: "Invitation sent",
      description: `${usernameToInvite} has been invited to join ${activeTeamForInvite.name}`,
    });

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const addMatchedUser = (username: string) => {
    if (!activeTeamForInvite) return;
    
    setUsernameToInvite(username);
    addInvitedUser();
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading your teams...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Teams</h1>
          <p className="text-gray-600">View and manage your teams</p>
        </div>

        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="pt-4 pb-2 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-hackmap-blue" />
                    <CardTitle>{team.name}</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleInviteUser(team)}
                    disabled={team.membersCount >= team.maxMembers}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite Members
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Hackathon</h3>
                    <p className="text-gray-500">{team.hackathonName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Members</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-blue/10 text-hackmap-blue">
                        {team.membersCount}/{team.maxMembers}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {team.skills.map((skill: string) => (
                        <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-blue/5 text-hackmap-blue/90">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Show pending invitations if any */}
                  {team.invitations && team.invitations.filter(inv => inv.status === "pending").length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Pending Invitations</h3>
                      <div className="flex flex-wrap gap-2">
                        {team.invitations
                          .filter(inv => inv.status === "pending")
                          .map((inv, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {inv.username}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  {/* Show invite code if available */}
                  {team.inviteCode && (
                    <div>
                      <h3 className="font-semibold mb-2">Invite Code</h3>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-50 px-3 py-1 rounded border">{team.inviteCode}</code>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => copyInviteCode(team.inviteCode || "")}
                        >
                          {showCopied[team.inviteCode || ""] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/teams/${team.id}`}>View Team</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {teams.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">You haven't joined any teams yet.</p>
                <Button asChild>
                  <Link to="/teams">Join a Team</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Invite Users Dialog */}
      <Dialog open={!!activeTeamForInvite} onOpenChange={(open) => !open && setActiveTeamForInvite(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Members to {activeTeamForInvite?.name}</DialogTitle>
            <DialogDescription>
              Add team members to collaborate on your hackathon project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="username" onValueChange={setInviteMethod}>
              <TabsList className="mb-4">
                <TabsTrigger value="username">Invite by Username</TabsTrigger>
                <TabsTrigger value="code">Invite by Code</TabsTrigger>
                <TabsTrigger value="matching">Skill Matching</TabsTrigger>
              </TabsList>
              
              <TabsContent value="username" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="username"
                        value={usernameToInvite}
                        onChange={(e) => setUsernameToInvite(e.target.value)}
                        placeholder="Enter username to invite"
                      />
                      <Button onClick={addInvitedUser} disabled={!usernameToInvite.trim()}>
                        Invite
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-0">
                <div className="bg-gray-50 rounded-md p-4 flex flex-col space-y-4">
                  <p className="text-sm mb-2">
                    Share this invite code with potential team members:
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white border border-gray-300 rounded px-4 py-2 font-mono text-lg flex-1 text-center">
                      {activeTeamForInvite?.inviteCode || "N/A"}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyInviteCode(activeTeamForInvite?.inviteCode || "")}
                      disabled={!activeTeamForInvite?.inviteCode}
                    >
                      {showCopied[activeTeamForInvite?.inviteCode || ""] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {matchedUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex justify-between items-center border rounded-md p-2"
                        >
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.skills?.filter(skill => activeTeamForInvite?.skills.includes(skill)).map((skill) => (
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveTeamForInvite(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTeams;
