import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { mockHackathons } from "@/data/hackathons";

const MyHackathons = () => {
  const [registeredHackathons, setRegisteredHackathons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data to check if logged in
    const userData = localStorage.getItem("hackmap-user");
    if (!userData) {
      setIsLoading(false);
      return;
    }

    // Fetch registered hackathons from userData
    const parsedUserData = JSON.parse(userData);
    const userHackathons = parsedUserData.registeredHackathons || [];
    const registeredHackathonsData = mockHackathons.filter(hackathon => userHackathons.includes(hackathon.id));
    setRegisteredHackathons(registeredHackathonsData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading your hackathons...</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Hackathons</h1>
          <p className="text-gray-600">View and manage the hackathons you're registered for</p>
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
      </div>
    </div>
  );
};

export default MyHackathons;
