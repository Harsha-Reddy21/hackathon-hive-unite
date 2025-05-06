import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getTeamById } from "@/utils/storageUtils";
import { useToast } from "@/hooks/use-toast";
import { parseMembers, parseInvitations, parseJoinRequests, parseSkills } from "@/utils/storageUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from "lucide-react";

interface TeamDetailProps {}

const TeamDetail: React.FC<TeamDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTeam = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const teamData = await getTeamById(id);
        
        if (!teamData) {
          toast({
            title: "Team not found",
            description: "The requested team could not be found",
            variant: "destructive",
          });
          return;
        }
        
        // Parse JSON fields
        const parsedTeam = {
          ...teamData,
          members: parseMembers(teamData.members || null),
          skills: parseSkills(teamData.skills || null),
          invitations: parseInvitations(teamData.invitations || null),
          joinRequests: parseJoinRequests(teamData.join_requests || null)
        };
        
        setTeam(parsedTeam);
      } catch (error) {
        console.error("Error loading team:", error);
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeam();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading team details...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Team not found</h1>
            <p className="text-gray-600">The requested team does not exist.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{team?.name}</h1>
          <p className="text-gray-600">{team?.description}</p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pt-4 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-hackmap-blue" />
              <CardTitle>Team Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Hackathon</h3>
                <p className="text-gray-500">{team?.hackathon_name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Members</h3>
                <div className="flex items-center space-x-2">
                  {team?.members && team.members.map((member: any) => (
                    <Badge key={member.id} className="bg-hackmap-blue/10 text-hackmap-blue">
                      {member.username} ({member.role})
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {team?.skills && team.skills.map((skill: string) => (
                    <Badge key={skill} className="bg-hackmap-purple/10 text-hackmap-purple">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              {team?.invitations && team.invitations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Pending Invitations</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.invitations.map((invitation: any) => (
                      <Badge key={invitation.username} className="bg-yellow-100 text-yellow-800">
                        {invitation.username}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetail;
