
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockHackathons } from "@/data/hackathons";
import { Calendar, MapPin, Trophy, Users, Clock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [hackathon, setHackathon] = useState<any | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("hackmap-user");
    if (userData) {
      setIsLoggedIn(true);
      
      // Check if user is already registered for this hackathon
      // In a real app, this would be fetched from API/database
      const randomRegistered = Math.random() > 0.5;
      setIsRegistered(randomRegistered);
    }
    
    // Find hackathon by ID
    const foundHackathon = mockHackathons.find(h => h.id === id);
    if (foundHackathon) {
      // Add some additional data to the hackathon
      setHackathon({
        ...foundHackathon,
        location: "San Francisco, CA",
        organizer: "TechFoundation",
        description: "Join us for an exciting hackathon focused on " + foundHackathon.theme + 
          ". Teams will collaborate to build innovative solutions addressing real-world challenges. " +
          "This event brings together developers, designers, and problem solvers for 48 hours of creativity and coding.",
        schedule: [
          { time: "Day 1, 9:00 AM", activity: "Opening Ceremony" },
          { time: "Day 1, 10:00 AM", activity: "Team Formation" },
          { time: "Day 1, 12:00 PM", activity: "Lunch Break" },
          { time: "Day 1, 1:00 PM", activity: "Hacking Begins" },
          { time: "Day 2, 12:00 PM", activity: "Project Submission Deadline" },
          { time: "Day 2, 2:00 PM", activity: "Judging" },
          { time: "Day 2, 4:00 PM", activity: "Awards Ceremony" }
        ],
        prizes: [
          { place: "1st Place", reward: "$5,000 and mentorship opportunities" },
          { place: "2nd Place", reward: "$2,500 and cloud credits" },
          { place: "3rd Place", reward: "$1,000 and developer tools" },
          { place: "Best UI/UX", reward: "$500" }
        ],
        sponsors: ["TechCorp", "DevTools Inc.", "CloudServices", "StartupLabs"]
      });
    }
  }, [id]);

  const handleRegister = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to register for this hackathon",
        variant: "destructive",
      });
      return;
    }
    
    // Save registration status to localStorage
    const userData = JSON.parse(localStorage.getItem("hackmap-user") || "{}");
    const registeredHackathons = userData.registeredHackathons || [];
    if (!registeredHackathons.includes(hackathon.id)) {
      registeredHackathons.push(hackathon.id);
      const updatedUserData = {
        ...userData,
        registeredHackathons,
        hackathonCount: (userData.hackathonCount || 0) + 1
      };
      localStorage.setItem("hackmap-user", JSON.stringify(updatedUserData));
    }
    
    setIsRegistered(true);
    toast({
      title: "Success!",
      description: "You've registered for this hackathon.",
    });
  };
  
  const handleUnregister = () => {
    // Remove registration status from localStorage
    const userData = JSON.parse(localStorage.getItem("hackmap-user") || "{}");
    const registeredHackathons = userData.registeredHackathons || [];
    const updatedHackathons = registeredHackathons.filter(id => id !== hackathon.id);
    const updatedUserData = {
      ...userData,
      registeredHackathons: updatedHackathons,
      hackathonCount: (userData.hackathonCount || 1) - 1
    };
    localStorage.setItem("hackmap-user", JSON.stringify(updatedUserData));
    
    setIsRegistered(false);
    toast({
      title: "Unregistered",
      description: "You've been removed from this hackathon.",
    });
  };

  if (!hackathon) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hackathon Not Found</h1>
          <p className="text-gray-600 mb-6">The hackathon you're looking for doesn't exist or has been removed</p>
          <Button asChild>
            <Link to="/hackathons">Browse Hackathons</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/hackathons" className="hover:text-gray-900">Hackathons</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{hackathon.title}</span>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hackathon.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{hackathon.theme}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {hackathon.tags.map((tag: string) => (
                <Badge key={tag} className="bg-hackmap-purple">{tag}</Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{hackathon.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{hackathon.participantCount || 200}+ participants</span>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            {isRegistered ? (
              <div className="text-right flex flex-col gap-2">
                <Button className="bg-green-500 hover:bg-green-600" disabled>
                  Registered
                </Button>
                <Button variant="outline" onClick={handleUnregister}>
                  Unregister
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={handleRegister}
                className="bg-hackmap-purple hover:bg-hackmap-purple/90"
              >
                Register Now
              </Button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <Tabs defaultValue="about">
          <TabsList className="mb-6 w-full md:w-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Hackathon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {hackathon.description}
                    </p>
                    <h3 className="font-semibold text-lg mb-2">Sponsors</h3>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {hackathon.sponsors.map((sponsor: string) => (
                        <div key={sponsor} className="px-4 py-2 bg-gray-100 rounded-md">
                          {sponsor}
                        </div>
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Organized by</h3>
                    <p>{hackathon.organizer}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" /> Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Registration Deadline</p>
                        <p className="text-gray-600">{new Date(hackathon.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Event Starts</p>
                        <p className="text-gray-600">{new Date(hackathon.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Event Ends</p>
                        <p className="text-gray-600">{new Date(hackathon.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2" /> Prizes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {hackathon.prizes.slice(0, 2).map((prize: any) => (
                        <div key={prize.place}>
                          <p className="text-sm font-medium">{prize.place}</p>
                          <p className="text-gray-600">{prize.reward}</p>
                        </div>
                      ))}
                      <Button variant="link" className="p-0 h-auto text-hackmap-purple">
                        View All Prizes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hackathon.schedule.map((item: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="w-1/4 font-medium">{item.time}</div>
                      <div className="w-3/4">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prizes">
            <Card>
              <CardHeader>
                <CardTitle>Prizes & Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hackathon.prizes.map((prize: any, index: number) => (
                    <Card key={index} className={index === 0 ? "border-2 border-yellow-400" : ""}>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-bold mb-2">{prize.place}</h3>
                        <p className="text-gray-700">{prize.reward}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            {isRegistered ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Registered Teams</h2>
                  <Button asChild>
                    <Link to="/teams/create">Create Team</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(num => (
                    <Card key={num}>
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-1">Team {num}</h3>
                        <p className="text-sm text-gray-500 mb-2">5 members</p>
                        <p className="text-sm mb-3">Building a solution for {hackathon.theme}</p>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/teams/${num}`}>View Team</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">You need to register first</h3>
                  <p className="text-gray-600 mb-6">Register for this hackathon to view and join teams</p>
                  <Button onClick={handleRegister}>Register Now</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HackathonDetail;
