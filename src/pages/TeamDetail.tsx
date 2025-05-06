
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Users, Lightbulb, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTeamById, getCurrentUser, updateTeamInStorage } from "@/utils/storageUtils";
import { supabase } from '@/integrations/supabase/client';
import { Json } from "@/integrations/supabase/types";

interface TeamMember {
  id: string;
  username: string;
  role: string;
  avatar?: string;
  name?: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  username: string;
  requestDate: string;
}

// Helper function to parse JSON fields
const parseJsonField = <T,>(field: string | Json | null | undefined, defaultValue: T): T => {
  if (!field) return defaultValue;
  
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch (e) {
      return defaultValue;
    }
  }
  
  return field as unknown as T;
};

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Subscribe to real-time updates for the team
  useEffect(() => {
    if (!id) return;
    
    // Set up real-time subscription for team updates
    const teamSubscription = supabase
      .channel('team-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'teams',
        filter: `id=eq.${id}`
      }, (payload) => {
        setTeam(payload.new);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(teamSubscription);
    };
  }, [id]);
  
  useEffect(() => {
    async function loadData() {
      // Check if user is logged in
      const userData = await getCurrentUser();
      if (userData) {
        setIsLoggedIn(true);
        setCurrentUser(userData);
      }
      
      // Find team by ID from Supabase
      if (id) {
        const teamData = await getTeamById(id);
        
        if (teamData) {
          // Parse JSON fields
          const parsedMembers = parseJsonField<TeamMember[]>(teamData.members, []);
          const parsedJoinRequests = parseJsonField<JoinRequest[]>(teamData.join_requests, []);
          
          const enrichedTeam = {
            ...teamData,
            members: parsedMembers,
            joinRequests: parsedJoinRequests
          };
          
          setTeam(enrichedTeam);
          
          // Check if the current user is a member of this team
          if (userData) {
            const userIsMember = parsedMembers.some((member: TeamMember) => 
              member.id === userData.id || member.username === userData.username
            );
            setIsMember(userIsMember);
            
            // Check if user has already requested to join
            const hasAlreadyRequested = parsedJoinRequests.some((request: JoinRequest) =>
              request.userId === userData.id
            );
            setHasRequested(Boolean(hasAlreadyRequested));
          }
        } else {
          console.error("Team not found with ID:", id);
        }
      }
    }
    
    loadData();
  }, [id]);

  const handleJoinRequest = async () => {
    if (!isLoggedIn) {
      toast({
        description: "Please login to join this team",
        variant: "destructive",
      });
      return;
    }
    
    if (!team || !currentUser) return;
    
    try {
      setHasRequested(true);
      
      // Get existing join requests
      const existingRequests = parseJsonField<JoinRequest[]>(team.join_requests, []);
      
      // Update team in database with join request
      const updatedTeam = {
        ...team,
        join_requests: [
          ...existingRequests,
          {
            id: `request-${Date.now()}`,
            userId: currentUser.id,
            username: currentUser.username || currentUser.email,
            requestDate: new Date().toISOString()
          }
        ]
      };
      
      await updateTeamInStorage(updatedTeam);
      
      toast({
        description: "Your request to join the team has been sent to the team leader.",
      });
      
      // Send email notification (simulated)
      console.log("Sending email to team leader about join request");
      
    } catch (error) {
      console.error("Error sending join request:", error);
      toast({
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
      setHasRequested(false);
    }
  };
  
  const handleLeaveTeam = async () => {
    if (!team || !currentUser) return;
    
    try {
      const members = parseJsonField<TeamMember[]>(team.members, []);
      
      // Remove user from team members
      const updatedTeam = {
        ...team,
        members: members.filter((member: TeamMember) => 
          member.id !== currentUser.id && member.username !== currentUser.username
        ),
        members_count: team.members_count > 0 ? team.members_count - 1 : 0
      };
      
      await updateTeamInStorage(updatedTeam);
      
      setIsMember(false);
      toast({
        description: "You have successfully left the team.",
      });
    } catch (error) {
      console.error("Error leaving team:", error);
      toast({
        description: "Failed to leave team. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!team) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Not Found</h1>
          <p className="text-gray-600 mb-6">The team you're looking for doesn't exist or has been removed</p>
          <Button asChild>
            <Link to="/teams">Browse Teams</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Parse members for rendering
  const members = parseJsonField<TeamMember[]>(team.members, []);
  const maxMembers = team.max_members || 5;

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/teams" className="hover:text-gray-900">Teams</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{team.name}</span>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
            <Link to={`/hackathons/${team.hackathon_id}`} className="text-hackmap-purple hover:underline">
              {team.hackathon_name}
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            {isMember ? (
              <Button variant="outline" onClick={handleLeaveTeam}>
                Leave Team
              </Button>
            ) : hasRequested ? (
              <Button disabled>
                Request Pending
              </Button>
            ) : (
              <Button 
                className="bg-hackmap-purple hover:bg-hackmap-purple/90"
                onClick={handleJoinRequest}
                disabled={members.length >= maxMembers}
              >
                {members.length >= maxMembers ? "Team Full" : "Request to Join"}
              </Button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  {team.description}
                </p>
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {parseJsonField<string[]>(team.skills, []).map((skill: string) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{members.length}</span>/{maxMembers} members
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {team.project_idea && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" /> Project Idea
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{team.project_idea.title}</h3>
                  <p className="text-gray-700 mb-4">{team.project_idea.description}</p>
                  
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {team.project_idea.techStack && team.project_idea.techStack.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Project Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div 
                      className="bg-hackmap-purple h-2.5 rounded-full" 
                      style={{ width: `${team.project_idea.progress}%` }}
                    ></div>
                  </div>
                  
                  {isMember && (
                    <div className="flex justify-end">
                      <Button asChild variant="outline">
                        <Link to="#">Edit Project Details</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" /> Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member: TeamMember) => (
                    <div key={member.id} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.username ? member.username.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name || member.username || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array(maxMembers - members.length).fill(0).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center text-gray-400">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5" />
                      </div>
                      <span>Open Position</span>
                    </div>
                  ))}
                </div>
                
                {isMember && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-2">
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="#">
                          <MessageSquare className="h-4 w-4 mr-2" /> Team Chat
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="#">Manage Team</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
