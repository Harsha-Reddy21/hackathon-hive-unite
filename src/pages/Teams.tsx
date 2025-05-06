
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
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
import { getAllTeams, getCurrentUser, updateTeamInStorage, initializeLocalStorage, supabase } from "@/utils/storageUtils";

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
  hackathon_id?: string;
  hackathonId?: string; // For backwards compatibility
  hackathon_name?: string;
  hackathonName?: string; // For backwards compatibility
  description: string;
  members: TeamMember[];
  membersCount: number;
  maxMembers: number;
  max_members?: number; // For database mapping
  members_count?: number; // For database mapping
  skills: string[];
  joinRequests?: JoinRequest[];
  join_requests?: JoinRequest[] | any; // For database mapping
  invitations?: Invitation[] | any;
  inviteCode?: string;
  invite_code?: string; // For database mapping
  createdAt?: string;
  created_at?: string; // For database mapping
}

// Type guard functions to check array properties
const isArrayOfMembers = (value: any): value is TeamMember[] => {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 
    'username' in item && 
    'id' in item);
};

const isArrayOfInvitations = (value: any): value is Invitation[] => {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 
    'username' in item && 
    'status' in item);
};

const isArrayOfJoinRequests = (value: any): value is JoinRequest[] => {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 
    'username' in item);
};

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();
  
  // Load teams from Supabase
  useEffect(() => {
    // Initialize storage if needed
    initializeLocalStorage();
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log("Loading teams and user data");
        
        // Load teams from Supabase
        const teamsData = await getAllTeams();
        console.log("Teams loaded:", teamsData);
        
        // Normalize data to handle both DB field names and client-side field names
        const normalizedTeams = teamsData.map((team: any) => {
          // Parse JSON fields that may be returned as strings from the database
          let members = [];
          try {
            members = typeof team.members === 'string' 
              ? JSON.parse(team.members) 
              : (Array.isArray(team.members) ? team.members : []);
          } catch (e) {
            members = [];
          }

          let skills = [];
          try {
            skills = typeof team.skills === 'string'
              ? JSON.parse(team.skills)
              : (Array.isArray(team.skills) ? team.skills : []);
          } catch (e) {
            skills = [];
          }
          
          let invitations = [];
          try {
            invitations = typeof team.invitations === 'string'
              ? JSON.parse(team.invitations)
              : (team.invitations || []);
          } catch (e) {
            invitations = [];
          }
          
          let joinRequests = [];
          try {
            joinRequests = typeof team.join_requests === 'string'
              ? JSON.parse(team.join_requests)
              : (team.join_requests || []);
          } catch (e) {
            joinRequests = [];
          }
          
          return {
            ...team,
            hackathonId: team.hackathon_id || team.hackathonId,
            hackathonName: team.hackathon_name || team.hackathonName,
            members: members,
            membersCount: team.members_count || team.membersCount || members.length || 0,
            maxMembers: team.max_members || team.maxMembers || 5,
            inviteCode: team.invite_code || team.inviteCode,
            skills: skills,
            invitations: invitations,
            joinRequests: joinRequests
          };
        });
        
        setTeams(normalizedTeams);
        
        // Load current user
        const user = await getCurrentUser();
        console.log("Current user:", user);
        setCurrentUser(user);
        
        // Check for invitations for this user
        if (user) {
          const invitations = [];
          
          for (const team of normalizedTeams) {
            const teamInvitations = isArrayOfInvitations(team.invitations) ? team.invitations : [];
            const userInvitation = teamInvitations.find(
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
          
          console.log("User invitations:", invitations);
          setMyInvitations(invitations);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load teams");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.hackathonName || team.hackathon_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(team.skills) && team.skills.some((skill) => 
        typeof skill === 'string' && skill.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  const handleJoinTeamRequest = async (team: Team) => {
    if (!currentUser) {
      uiToast({
        title: "Authentication Required",
        description: "Please log in to join teams",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is already a member of this team
    if (Array.isArray(team.members) && team.members.some(member => member.id === currentUser.id)) {
      uiToast({
        title: "Already a Member",
        description: "You are already a member of this team",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the team is full
    if (team.membersCount >= team.maxMembers) {
      uiToast({
        title: "Team Full",
        description: "This team has reached its maximum number of members",
        variant: "destructive",
      });
      return;
    }
    
    // Add request to team
    try {
      // Get the latest team data from the database
      const { data: latestTeam } = await supabase
        .from('teams')
        .select('*')
        .eq('id', team.id)
        .maybeSingle();
      
      if (!latestTeam) {
        toast.error("Team not found");
        return;
      }
      
      // Parse join_requests if needed
      let joinRequests = [];
      try {
        joinRequests = typeof latestTeam.join_requests === 'string' 
          ? JSON.parse(latestTeam.join_requests) 
          : (Array.isArray(latestTeam.join_requests) ? latestTeam.join_requests : []);
      } catch (e) {
        joinRequests = [];
      }
      
      // Check if already requested
      if (joinRequests.some((req: JoinRequest) => req.userId === currentUser.id)) {
        uiToast({
          title: "Request Already Sent",
          description: "You have already requested to join this team",
          variant: "destructive",
        });
        return;
      }
      
      // Add the new request
      const updatedRequests = [
        ...joinRequests,
        {
          id: `request-${Date.now()}`,
          userId: currentUser.id,
          username: currentUser.username,
          requestDate: new Date().toISOString()
        }
      ];
      
      // Update the team
      const { data: updatedTeam, error } = await supabase
        .from('teams')
        .update({ join_requests: updatedRequests })
        .eq('id', team.id)
        .select();
      
      if (error) {
        console.error("Error updating team:", error);
        toast.error("Failed to send join request");
        return;
      }
      
      // Update local state
      const updatedTeams = teams.map(t => 
        t.id === team.id ? { ...t, joinRequests: updatedRequests } : t
      );
      setTeams(updatedTeams);
      
      // Find team leader to send email notification
      const teamMembers = Array.isArray(team.members) ? team.members : [];
      const teamLeader = teamMembers.find(member => member.role === "leader" || member.role === "Team Lead");
      
      if (teamLeader) {
        // Send email notification to team leader
        try {
          await sendJoinRequestEmail(
            teamLeader.username.includes('@') ? teamLeader.username : `${teamLeader.username}@example.com`,
            currentUser.username,
            team.name
          );
        } catch (emailError) {
          console.error("Error sending email notification:", emailError);
          // Continue even if email fails
        }
      }
      
      uiToast({
        title: "Request Sent!",
        description: `Your request to join ${team.name} has been sent to the team leader.`,
      });
    } catch (err) {
      console.error("Error joining team:", err);
      toast.error("Failed to send join request");
    }
  };

  const handleAcceptInvitation = async (teamId: string) => {
    if (!currentUser) return;
    
    try {
      // Find the team
      const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .maybeSingle();
      
      if (!team) {
        toast.error("Team not found");
        return;
      }
      
      // Parse invitations if needed
      let invitations = [];
      try {
        invitations = typeof team.invitations === 'string' 
          ? JSON.parse(team.invitations) 
          : (Array.isArray(team.invitations) ? team.invitations : []);
      } catch (e) {
        invitations = [];
      }
      
      // Parse members if needed
      let members = [];
      try {
        members = typeof team.members === 'string' 
          ? JSON.parse(team.members) 
          : (Array.isArray(team.members) ? team.members : []);
      } catch (e) {
        members = [];
      }
      
      // Find and update the invitation
      const updatedInvitations = invitations.map((inv: Invitation) => {
        if (inv.username === currentUser.username) {
          return { ...inv, status: "accepted" as const };
        }
        return inv;
      });
      
      // Add user as a member
      const updatedMembers = [
        ...members,
        {
          id: currentUser.id,
          username: currentUser.username,
          role: "member"
        }
      ];
      
      // Update the team in the database
      const { data: updatedTeam, error } = await supabase
        .from('teams')
        .update({ 
          invitations: updatedInvitations,
          members: updatedMembers,
          members_count: (team.members_count || 0) + 1
        })
        .eq('id', teamId)
        .select();
      
      if (error) {
        console.error("Error accepting invitation:", error);
        toast.error("Failed to accept invitation");
        return;
      }
      
      // Update local state
      setTeams(teams.map(t => t.id === teamId ? {
        ...t,
        invitations: updatedInvitations,
        members: updatedMembers,
        membersCount: t.membersCount + 1
      } : t));
      
      // Remove invitation from user's list
      setMyInvitations(myInvitations.filter(inv => inv.teamId !== teamId));
      
      toast.success("You have joined the team!");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (teamId: string) => {
    if (!currentUser) return;
    
    try {
      // Find the team
      const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .maybeSingle();
      
      if (!team) {
        toast.error("Team not found");
        return;
      }
      
      // Parse invitations if needed
      let invitations = [];
      try {
        invitations = typeof team.invitations === 'string' 
          ? JSON.parse(team.invitations) 
          : (Array.isArray(team.invitations) ? team.invitations : []);
      } catch (e) {
        invitations = [];
      }
      
      // Find and update the invitation
      const updatedInvitations = invitations.map((inv: Invitation) => {
        if (inv.username === currentUser.username) {
          return { ...inv, status: "declined" as const };
        }
        return inv;
      });
      
      // Update the team in the database
      const { error } = await supabase
        .from('teams')
        .update({ invitations: updatedInvitations })
        .eq('id', teamId);
      
      if (error) {
        console.error("Error declining invitation:", error);
        toast.error("Failed to decline invitation");
        return;
      }
      
      // Update local state
      setTeams(teams.map(t => t.id === teamId ? { ...t, invitations: updatedInvitations } : t));
      
      // Remove invitation from user's list
      setMyInvitations(myInvitations.filter(inv => inv.teamId !== teamId));
      
      toast.success("Invitation declined");
    } catch (err) {
      console.error("Error declining invitation:", err);
      toast.error("Failed to decline invitation");
    }
  };
  
  const handleJoinByCode = async () => {
    if (!currentUser) {
      uiToast({
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
    
    try {
      // Find team with matching code
      const { data: matchingTeams, error } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode.trim());
      
      if (error) {
        console.error("Error finding team by code:", error);
        setCodeError("An error occurred. Please try again.");
        return;
      }
      
      if (!matchingTeams || matchingTeams.length === 0) {
        setCodeError("Invalid invite code. Please check and try again.");
        return;
      }
      
      const team = matchingTeams[0];
      
      // Parse members if needed
      let members = [];
      try {
        members = typeof team.members === 'string' 
          ? JSON.parse(team.members) 
          : (Array.isArray(team.members) ? team.members : []);
      } catch (e) {
        members = [];
      }
      
      // Check if user is already a member
      if (members.some(member => member.id === currentUser.id)) {
        setCodeError("You're already a member of this team");
        return;
      }
      
      // Check if team is full
      if ((team.members_count || 0) >= (team.max_members || 5)) {
        setCodeError("This team has reached its maximum number of members");
        return;
      }
      
      // Add user to team
      const updatedMembers = [
        ...members,
        {
          id: currentUser.id,
          username: currentUser.username,
          role: "member"
        }
      ];
      
      // Update the team in the database
      const { data: updatedTeam, error: updateError } = await supabase
        .from('teams')
        .update({ 
          members: updatedMembers,
          members_count: (team.members_count || 0) + 1
        })
        .eq('id', team.id)
        .select();
      
      if (updateError) {
        console.error("Error joining team:", updateError);
        toast.error("Failed to join team");
        return;
      }
      
      // Update local state
      setTeams(teams.map(t => t.id === team.id ? {
        ...t,
        members: updatedMembers,
        membersCount: (t.membersCount || 0) + 1
      } : t));
      
      // Close dialog and reset fields
      setJoinByCodeOpen(false);
      setInviteCode("");
      setCodeError("");
      
      toast.success(`You have successfully joined ${team.name}!`);
    } catch (err) {
      console.error("Error joining by code:", err);
      setCodeError("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading teams...</h1>
          </div>
        </div>
      </div>
    );
  }

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
