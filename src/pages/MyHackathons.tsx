
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, getAllHackathons } from "@/utils/storageUtils";

const MyHackathons = () => {
  const [registeredHackathons, setRegisteredHackathons] = useState<any[]>([]);
  const [createdHackathons, setCreatedHackathons] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user data
        const currentUser = await getCurrentUser();
        setUserData(currentUser);
        
        if (!currentUser) {
          setIsLoading(false);
          return;
        }
        
        console.log("Current user data:", currentUser);
        
        // Get all hackathons from Supabase
        const allHackathons = await getAllHackathons();
        console.log("All hackathons:", allHackathons);
        
        // Filter registered hackathons (if any registrations exist)
        const userRegisteredHackathonsIds = currentUser?.registered_hackathons || [];
        const registeredHackathonsData = allHackathons.filter((hackathon) => 
          userRegisteredHackathonsIds.includes(hackathon.id)
        );
        
        console.log("User registered hackathons:", registeredHackathonsData);
        setRegisteredHackathons(registeredHackathonsData);
        
        // Filter hackathons created by this user
        const createdHackathonsData = allHackathons.filter((hackathon) => 
          hackathon.organizer_id === currentUser.id
        );
        
        console.log("User created hackathons:", createdHackathonsData);
        setCreatedHackathons(createdHackathonsData);
      } catch (error) {
        console.error("Error loading hackathons:", error);
        toast({
          title: "Error",
          description: "Failed to load hackathons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

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
          <p className="text-gray-600">View and manage your hackathons</p>
        </div>

        {userData?.role === 'organizer' && (
          <>
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Created Hackathons</h2>
              <Button asChild>
                <Link to="/hackathons/create">Create New Hackathon</Link>
              </Button>
            </div>
            <div className="space-y-4 mb-8">
              {createdHackathons.map((hackathon) => (
                <Card key={hackathon.id} className="overflow-hidden">
                  <CardHeader className="pt-4 pb-2 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-6 w-6 text-hackmap-purple" />
                      <CardTitle>{hackathon.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-500 mb-4">{hackathon.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/10 text-hackmap-purple">
                          {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                        </span>
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
          </>
        )}

        <div className="mb-2">
          <h2 className="text-xl font-semibold">Registered Hackathons</h2>
        </div>
        <div className="space-y-4">
          {registeredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="overflow-hidden">
              <CardHeader className="pt-4 pb-2 px-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-hackmap-purple" />
                  <CardTitle>{hackathon.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-500 mb-4">{hackathon.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hackmap-purple/10 text-hackmap-purple">
                      {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                    </span>
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
