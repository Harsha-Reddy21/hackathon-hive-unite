import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const MyTeams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data to check if logged in
    const userData = localStorage.getItem("hackmap-user");
    if (!userData) {
      setIsLoading(false);
      return;
    }

    // Get teams from userData
    const parsedUserData = JSON.parse(userData);
    const teamsData = [];
    for (let i = 0; i < (parsedUserData.teamCount || 0); i++) {
      teamsData.push({
        id: `team-${i + 1}`,
        name: `Team ${i + 1}`,
        hackathonName: "AI for Good Hackathon",
        members: 3,
        maxMembers: 5,
        skills: ["AI", "Machine Learning", "Backend"]
      });
    }
    setTeams(teamsData);
    setIsLoading(false);
  }, []);

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
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-hackmap-blue" />
                  <CardTitle>{team.name}</CardTitle>
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
                        {team.members}/{team.maxMembers}
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
    </div>
  );
};

export default MyTeams;
