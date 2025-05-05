
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Users, Lightbulb } from "lucide-react";
import { mockHackathons } from "@/data/hackathons";

interface UserData {
  email: string;
  username?: string;
  isLoggedIn: boolean;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [registeredHackathons, setRegisteredHackathons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [sharedIdeas, setSharedIdeas] = useState<any[]>([]);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("hackmap-user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Simulate fetching user's registered hackathons (first 2 hackathons)
      setRegisteredHackathons(mockHackathons.slice(0, 2));
      
      // Simulate fetching user's teams
      setTeams([
        {
          id: "personal-team-1",
          name: "Code Wizards",
          hackathonName: "AI for Good Hackathon",
          members: 3,
          maxMembers: 5,
          skills: ["AI", "Machine Learning", "Backend"]
        }
      ]);
      
      // Simulate fetching user's shared ideas
      setSharedIdeas([
        {
          id: "idea-1",
          title: "AI-Powered Food Waste Reduction",
          description: "An AI solution that helps restaurants identify and reduce food waste by analyzing patterns and making recommendations.",
          likes: 12,
          tags: ["AI", "Sustainability", "Food"]
        }
      ]);
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
          <DashboardCard 
            title="Current Teams" 
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Hackathons</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/hackathons">Explore More</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {registeredHackathons.map((hackathon) => (
                <Card key={hackathon.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 bg-hackmap-purple/10 rounded-md flex items-center justify-center mr-4">
                      <Calendar className="text-hackmap-purple h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{hackathon.title}</h3>
                      <p className="text-sm text-gray-500">{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</p>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/hackathons/${hackathon.id}`}>View</Link>
                    </Button>
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
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Teams</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/teams">Manage Teams</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {teams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 bg-hackmap-blue/10 rounded-md flex items-center justify-center mr-4">
                      <Users className="text-hackmap-blue h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.hackathonName} • {team.members}/{team.maxMembers} members</p>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/teams/${team.id}`}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {teams.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't joined any teams yet.</p>
                    <Button asChild>
                      <Link to="/teams">Find Teams</Link>
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
