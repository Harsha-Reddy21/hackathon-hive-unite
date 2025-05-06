import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { sendTeamInviteEmail, sendJoinRequestEmail } from "@/utils/emailService";
import { initializeLocalStorage } from "@/utils/storageUtils";

interface TeamMember {
  id: string;
  username: string;
  role: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  username: string;
  requestDate: string;
}

interface Invitation {
  username: string;
  invitedAt: string;
  status: "pending" | "accepted" | "declined";
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
  joinRequests?: JoinRequest[];
  invitations?: Invitation[];
  inviteCode?: string;
  createdAt?: string;
}

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const { toast } = useToast();
  
  // Load teams from localStorage
  useEffect(() => {
    // Initialize localStorage if needed
    initializeLocalStorage();
    
    const loadTeams = () => {
      console.log("Loading teams data");
      const teamsData = localStorage.getItem("hackmap-teams");
      if (teamsData) {
        const loadedTeams = JSON.parse(teamsData);
        console.log("Loaded teams:", loadedTeams);
        setTeams(loadedTeams as Team[]);
      } else {
        localStorage.setItem("hackmap-teams", JSON.stringify([]));
      }
    };
    
    const loadCurrentUser = () => {
      console.log("Loading current user data");
      const userData = localStorage.getItem("hackmap-user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Current user:", user);
        setCurrentUser(user);
        
        // Check for invitations for this user
        const teamsData = localStorage.getItem("hackmap-teams");
        if (teamsData) {
          const allTeams = JSON.parse(teamsData);
          const invitations = [];
          
          for (const team of allTeams) {
            if (team.invitations) {
              const userInvitation = team.invitations.find(
                (inv: Invitation) => inv.username === user.username && inv.status === "pending"
              );
              
              if (userInvitation) {
                invitations.push({
                  teamId: team.id,
                  teamName: team.name,
                  invitedAt: userInvitation.invitedAt
                });
              }
            }
          }
          
          console.log("User invitations:", invitations);
          setMyInvitations(invitations);
        }
      }
    };
    
    loadTeams();
    loadCurrentUser();
    
    // Listen for storage changes in case teams are updated in another tab
    window.addEventListener('storage', loadTeams);
    window.addEventListener('storage', loadCurrentUser);
    
    return () => {
      window.removeEventListener('storage', loadTeams);
      window.removeEventListener('storage', loadCurrentUser);
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

  const handleJoinTeamRequest = async (team: Team) => {
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
    
    // Find team leader to send email notification
    const teamToJoin = updatedTeams.find(t => t.id === team.id);
    if (teamToJoin) {
      const teamLeader = teamToJoin.members.find(member => member.role === "leader" || member.role === "Team Lead");
      if (teamLeader) {
        // Send email notification to team leader
        await sendJoinRequestEmail(
          teamLeader.username.includes('@') ? teamLeader.username : `${teamLeader.username}@example.com`,
          currentUser.username,
          team.name
        );
      }
    }
    
    // Update localStorage and trigger storage event
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams as Team[]);
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Request Sent!",
      description: `Your request to join ${team.name} has been sent to the team leader.`,
    });
  };

  const handleAcceptInvitation = async (teamId: string) => {
    if (!currentUser) return;
    
    // Find the team
    const teamToAccept = teams.find(team => team.id === teamId);
    
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        // Find and update the invitation
        const updatedInvitations = team.invitations?.map(inv => {
          if (inv.username === currentUser.username) {
            return { ...inv, status: "accepted" as "pending" | "accepted" | "declined" };
          }
          return inv;
        }) || [];
        
        // Add user as a member
        return {
          ...team,
          members: [
            ...team.members,
            {
              id: currentUser.id,
              username: currentUser.username,
              role: "member"
            }
          ],
          membersCount: team.membersCount + 1,
          invitations: updatedInvitations
        };
      }
      return team;
    });
    
    // Send email notification for acceptance
    if (teamToAccept) {
      await sendTeamInviteEmail(
        currentUser.username,
        teamToAccept.name,
        teamToAccept.hackathonName,
        undefined // No invite code needed as they're already accepting
      );
    }
    
    // Update localStorage
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams as Team[]);
    
    // Remove invitation from user's list
    setMyInvitations(myInvitations.filter(inv => inv.teamId !== teamId));
    
    toast({
      title: "Invitation Accepted",
      description: `You have joined the team!`,
    });
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeclineInvitation = (teamId: string) => {
    if (!currentUser) return;
    
    // Find the team
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        // Find and update the invitation
        const updatedInvitations = team.invitations?.map(inv => {
          if (inv.username === currentUser.username) {
            return { ...inv, status: "declined" as "pending" | "accepted" | "declined" };
          }
          return inv;
        }) || [];
        
        return {
          ...team,
          invitations: updatedInvitations
        };
      }
      return team;
    });
    
    // Update localStorage
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams as Team[]);
    
    // Remove invitation from user's list
    setMyInvitations(myInvitations.filter(inv => inv.teamId !== teamId));
    
    toast({
      title: "Invitation Declined",
      description: `You have declined the team invitation.`,
    });
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleJoinByCode = () => {
    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "Please log in to join a team",
        variant: "destructive",
      });
      return;
    }
    
    if (!inviteCode.trim()) {
      setCodeError("Please enter an invite code");
      return;
    }
    
    // Find team with matching code
    const team = teams.find(t => t.inviteCode === inviteCode.trim());
    
    if (!team) {
      setCodeError("Invalid invite code. Please check and try again.");
      return;
    }
    
    // Check if user is already a member
    if (team.members.some(member => member.id === currentUser.id)) {
      setCodeError("You're already a member of this team");
      return;
    }
    
    // Check if team is full
    if (team.membersCount >= team.maxMembers) {
      setCodeError("This team has reached its maximum number of members");
      return;
    }
    
    // Add user to team
    const updatedTeams = teams.map(t => {
      if (t.id === team.id) {
        return {
          ...t,
          members: [
            ...t.members,
            {
              id: currentUser.id,
              username: currentUser.username,
              role: "member"
            }
          ],
          membersCount: t.membersCount + 1
        };
      }
      return t;
    });
    
    // Update localStorage
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams as Team[]);
    
    // Close dialog and reset fields
    setJoinByCodeOpen(false);
    setInviteCode("");
    setCodeError("");
    
    toast({
      title: "Team Joined",
      description: `You have successfully joined ${team.name}!`,
    });
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
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
          <div className="flex space-x-3">
            <Dialog open={joinByCodeOpen} onOpenChange={setJoinByCodeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" /> Join by Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Team with Invite Code</DialogTitle>
                  <DialogDescription>
                    Enter the invite code you received from a team leader.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value.toUpperCase());
                      setCodeError("");
                    }}
                    placeholder="Enter code (e.g., ABC123)"
                    className="mt-2"
                    autoComplete="off"
                  />
                  {codeError && (
                    <p className="text-red-500 text-sm mt-1">{codeError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setJoinByCodeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleJoinByCode}>
                    Join Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button asChild>
              <Link to="/teams/create">
                <Plus className="h-4 w-4 mr-2" /> Create Team
              </Link>
            </Button>
          </div>
        </div>

        {myInvitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Team Invitations</h2>
            <div className="space-y-4">
              {myInvitations.map((invitation) => (
                <Card key={invitation.teamId} className="bg-hackmap-blue/5 border-hackmap-blue/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">You've been invited to join "{invitation.teamName}"</h3>
                        <p className="text-sm text-muted-foreground">
                          Invited {new Date(invitation.invitedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeclineInvitation(invitation.teamId)}
                        >
                          Decline
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation.teamId)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
