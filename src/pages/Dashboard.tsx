import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Users, Lightbulb } from "lucide-react";

interface UserData {
  email: string;
  username?: string;
  isLoggedIn: boolean;
  hackathonCount?: number;
  teamCount?: number;
  role?: 'organizer' | 'attendee';
  registeredHackathons?: string[];
  createdHackathons?: string[];
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [registeredHackathons, setRegisteredHackathons] = useState<any[]>([]);
  const [createdHackathons, setCreatedHackathons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [sharedIdeas, setSharedIdeas] = useState<any[]>([]);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("hackmap-user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Initialize data from localStorage
      const storedIdeas = localStorage.getItem("hackmap-shared-ideas");

      if (storedIdeas) {
        const ideas = JSON.parse(storedIdeas);
        const userIdeas = ideas.filter((idea: any) => idea.author === parsedUserData.username);
        setSharedIdeas(userIdeas);
      }

      // Get all hackathons
      const storedHackathons = localStorage.getItem("hackmap-hackathons");
      const mockHackathons = [
        {
          id: "1",
          title: "AI for Good Hackathon",
          theme: "Using AI to solve social problems",
          startDate: "2025-06-15",
          endDate: "2025-06-17",
          tags: ["AI", "Social Impact", "Machine Learning"],
          location: "San Francisco, CA"
        },
        {
          id: "2",
          title: "Web3 Innovation Challenge",
          theme: "Building the decentralized future",
          startDate: "2025-07-22",
          endDate: "2025-07-24",
          tags: ["Blockchain", "Web3", "DeFi"],
          location: "New York, NY"
        },
        {
          id: "3",
          title: "HealthTech Hackathon",
          theme: "Innovation in healthcare technology",
          startDate: "2025-08-10",
          endDate: "2025-08-12",
          tags: ["Healthcare", "IoT", "Mobile"],
          location: "Boston, MA"
        }
      ];
      
      if (storedHackathons) {
        const allHackathons = JSON.parse(storedHackathons);
        
        // Filter registered hackathons
        const registeredHackathons = parsedUserData.registeredHackathons || [];
        const registeredHackathonsData = allHackathons.filter((hackathon: any) => 
          registeredHackathons.includes(hackathon.id)
        );
        
        // If no registered hackathons found in localStorage, fallback to mock data
        if (registeredHackathonsData.length === 0 && registeredHackathons.length > 0) {
          const mockRegisteredHackathons = mockHackathons.filter((hackathon) => 
            registeredHackathons.includes(hackathon.id)
          );
          setRegisteredHackathons(mockRegisteredHackathons);
        } else {
          setRegisteredHackathons(registeredHackathonsData);
        }

        // Filter created hackathons for organizers
        if (parsedUserData.role === 'organizer') {
          const createdHackathons = allHackathons.filter((hackathon: any) => 
            hackathon.organizer && hackathon.organizer.username === parsedUserData.username
          );
          setCreatedHackathons(createdHackathons);
        }
      } else if (parsedUserData.registeredHackathons && parsedUserData.registeredHackathons.length > 0) {
        // Fallback to mock data if no hackathons in localStorage
        const mockRegisteredHackathons = mockHackathons.filter((hackathon) => 
          parsedUserData.registeredHackathons.includes(hackathon.id)
        );
        setRegisteredHackathons(mockRegisteredHackathons);
      }

      // Initialize teams
      const storedTeams = localStorage.getItem("hackmap-teams");
      if (storedTeams) {
        const allTeams = JSON.parse(storedTeams);
        // Filter teams where user is a member
        const userTeams = allTeams.filter((team: any) => 
          team.members.some((member: any) => 
            member.username === parsedUserData.username || member.name === parsedUserData.username
          )
        );
        
        setTeams(userTeams.length > 0 ? userTeams : []);
      } else {
        // Fallback to mock teams if no teams in localStorage
        const teamsData = [];
        for (let i = 0; i < (parsedUserData.teamCount || 0); i++) {
          teamsData.push({
            id: `team-${i + 1}`,
            name: `Team ${i + 1}`,
            hackathonName: "AI for Good Hackathon",
            hackathonId: "1",
            members: [
              { id: parsedUserData.id || "user-1", username: parsedUserData.username || "User", role: "member" }
            ],
            membersCount: 1,
            maxMembers: 5,
            skills: ["AI", "Machine Learning", "Backend"]
          });
        }
        
        // Save mock teams to localStorage for persistence
        if (teamsData.length > 0) {
          localStorage.setItem("hackmap-teams", JSON.stringify(teamsData));
          setTeams(teamsData);
        }
      }
    }
  }, []);

  if (!userData) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Please log in to access your dashboard</h1>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userData.username || "User"}!</h1>
          <p className="text-gray-600">Manage your hackathons, teams, and project ideas from your dashboard.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DashboardCard 
            title="Registered Hackathons" 
            count={registeredHackathons.length}
            icon={Calendar}
            color="bg-hackmap-purple"
          />
          {userData?.role === 'organizer' && (
            <DashboardCard 
              title="Created Hackathons" 
              count={createdHackathons.length}
              icon={Calendar}
              color="bg-hackmap-purple"
            />
          )}
          <DashboardCard 
            title="View Teams" 
            count={teams.length}
            icon={Users}
            color="bg-hackmap-blue"
          />
          <DashboardCard 
            title="Shared Ideas" 
            count={sharedIdeas.length}
            icon={Lightbulb}
            color="bg-green-500"
          />
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Shared Ideas</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/my-ideas">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {sharedIdeas.map((idea) => (
                <Card key={idea.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <Link to={`/ideas/${idea.id}`} className="block">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{idea.title}</h3>
                          <p className="text-sm text-gray-500">{idea.likes} likes</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {idea.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
              {sharedIdeas.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't shared any ideas yet.</p>
                    <Button asChild>
                      <Link to="/ideas">Share Your Ideas</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Hackathons</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/my-hackathons">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {registeredHackathons.map((hackathon) => (
                <Card key={hackathon.id} className="overflow-hidden">
                  <CardHeader className="pt-4 pb-2 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-6 w-6 text-hackmap-purple" />
                      <CardTitle>{hackathon.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-500 mb-4">{hackathon.description || hackathon.theme}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/10 text-hackmap-purple">
                          {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                        </span>
                        {hackathon.tags?.slice(0, 1).map((tag: string) => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/5 text-hackmap-purple/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button asChild variant="outline">
                        <Link to={`/hackathons/${hackathon.id}`}>View Hackathon</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {registeredHackathons.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't registered for any hackathons yet.</p>
                    <Button asChild>
                      <Link to="/hackathons">Find Hackathons</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
          {userData?.role === 'organizer' && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Created Hackathons</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/my-hackathons">View All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {createdHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="overflow-hidden">
                    <CardHeader className="pt-4 pb-2 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-6 w-6 text-hackmap-purple" />
                        <CardTitle>{hackathon.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-500 mb-4">{hackathon.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/10 text-hackmap-purple">
                            {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                          </span>
                          {hackathon.tags?.map((tag: string) => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/5 text-hackmap-purple/90">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button asChild variant="outline">
                          <Link to={`/hackathons/${hackathon.id}`}>View Hackathon</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {createdHackathons.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 mb-4">You haven't created any hackathons yet.</p>
                      <Button asChild>
                        <Link to="/hackathons/create">Create a Hackathon</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Teams</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/my-teams">View All</Link>
              </Button>
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
                            {team.members ? team.members.length : team.membersCount}/{team.maxMembers}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {team.skills?.map((skill: string) => (
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
          </section>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, count, icon: Icon, color }: { 
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <Card>
      <CardContent className="pt-6 pb-2 px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{count}</h3>
          </div>
          <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
