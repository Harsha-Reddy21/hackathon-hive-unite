import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Trophy, Users, Clock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Hackathon } from "@/components/HackathonCard";

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log("Fetching hackathon data for ID:", id);
      
      // Check if user is logged in
      const userData = localStorage.getItem("hackmap-user");
      if (userData) {
        setIsLoggedIn(true);
        
        // Check if user is already registered for this hackathon
        const parsedUserData = JSON.parse(userData);
        const registeredHackathons = parsedUserData.registeredHackathons || [];
        setIsRegistered(registeredHackathons.includes(id));
      } else {
        setIsLoggedIn(false);
        setIsRegistered(false);
      }
      
      // First check localStorage for hackathon data
      const storedHackathons = localStorage.getItem("hackmap-hackathons");
      let foundHackathon = null;
      
      if (storedHackathons) {
        const parsedHackathons = JSON.parse(storedHackathons);
        console.log("Available hackathons:", parsedHackathons.map((h: any) => ({id: h.id, title: h.title})));
        foundHackathon = parsedHackathons.find((h: any) => h.id === id);
      }
      
      if (foundHackathon) {
        console.log("Found hackathon:", foundHackathon);
        // Add some additional data to the hackathon if needed
        setHackathon({
          ...foundHackathon,
          location: foundHackathon.location || "San Francisco, CA",
          organizer: foundHackathon.organizer || "TechFoundation",
          description: foundHackathon.description || 
            "Join us for an exciting hackathon focused on " + foundHackathon.theme + 
            ". Teams will collaborate to build innovative solutions addressing real-world challenges. " +
            "This event brings together developers, designers, and problem solvers for 48 hours of creativity and coding.",
          schedule: foundHackathon.schedule || [
            { date: "Day 1, 9:00 AM", events: [{ time: "9:00 AM", title: "Opening Ceremony" }] },
            { date: "Day 1, 10:00 AM", events: [{ time: "10:00 AM", title: "Team Formation" }] },
            { date: "Day 1, 12:00 PM", events: [{ time: "12:00 PM", title: "Lunch Break" }] },
            { date: "Day 1, 1:00 PM", events: [{ time: "1:00 PM", title: "Hacking Begins" }] },
            { date: "Day 2, 12:00 PM", events: [{ time: "12:00 PM", title: "Project Submission Deadline" }] },
            { date: "Day 2, 2:00 PM", events: [{ time: "2:00 PM", title: "Judging" }] },
            { date: "Day 2, 4:00 PM", events: [{ time: "4:00 PM", title: "Awards Ceremony" }] }
          ],
          prizes: foundHackathon.prizes || [
            { place: "1st Place", reward: "$5,000 and mentorship opportunities" },
            { place: "2nd Place", reward: "$2,500 and cloud credits" },
            { place: "3rd Place", reward: "$1,000 and developer tools" },
            { place: "Best UI/UX", reward: "$500" }
          ],
          sponsors: foundHackathon.sponsors || ["TechCorp", "DevTools Inc.", "CloudServices", "StartupLabs"]
        });
      } else {
        console.error("Hackathon not found with ID:", id);
        toast({
          title: "Hackathon not found",
          description: "We couldn't find the hackathon you're looking for.",
          variant: "destructive",
        });
        navigate('/hackathons');
        return;
      }
      
      setIsLoading(false);
    };
    
    if (id) {
      fetchData();
    } else {
      console.error("No hackathon ID provided");
      navigate('/hackathons');
    }
  }, [id, navigate, toast]);

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

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

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

  // Get teams for this hackathon
  const getTeamsForHackathon = () => {
    const storedTeams = localStorage.getItem("hackmap-teams");
    if (!storedTeams) return [];
    
    const allTeams = JSON.parse(storedTeams);
    return allTeams.filter((team: any) => team.hackathonId === hackathon.id);
  };

  const hackathonTeams = getTeamsForHackathon();

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
              {hackathon.tags && hackathon.tags.map((tag: string) => (
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
                      {hackathon.sponsors && hackathon.sponsors.map((sponsor: string) => (
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
                      {Array.isArray(hackathon.prizes) && hackathon.prizes.length > 0 ? (
                        <>
                          {(typeof hackathon.prizes[0] === 'object' ? hackathon.prizes : hackathon.prizes.map(prize => ({ place: prize, reward: '' }))).slice(0, 2).map((prize: any, index: number) => (
                            <div key={index}>
                              <p className="text-sm font-medium">{prize.place || `Prize ${index+1}`}</p>
                              <p className="text-gray-600">{prize.reward || prize}</p>
                            </div>
                          ))}
                          <Button variant="link" className="p-0 h-auto text-hackmap-purple">
                            View All Prizes
                          </Button>
                        </>
                      ) : (
                        <p className="text-gray-600">Prizes to be announced</p>
                      )}
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
                  {hackathon.schedule && hackathon.schedule.map((day, dayIndex) => (
                    <div key={dayIndex} className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">{day.date}</h3>
                      <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex">
                            <div className="w-1/4 font-medium">{event.time}</div>
                            <div className="w-3/4">{event.title}</div>
                          </div>
                        ))}
                      </div>
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
                  {Array.isArray(hackathon.prizes) && hackathon.prizes.length > 0 ? (
                    (typeof hackathon.prizes[0] === 'object' ? hackathon.prizes : hackathon.prizes.map((prize, index) => ({ 
                      place: `${index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index+1}th`} Place`, 
                      reward: prize 
                    }))).map((prize: any, index: number) => (
                      <Card key={index} className={index === 0 ? "border-2 border-yellow-400" : ""}>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-bold mb-2">{prize.place}</h3>
                          <p className="text-gray-700">{prize.reward}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-2">
                      <CardContent className="pt-6 text-center py-12">
                        <h3 className="text-lg font-semibold">Prizes to be announced</h3>
                      </CardContent>
                    </Card>
                  )}
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
                  {hackathonTeams.length > 0 ? (
                    hackathonTeams.map((team: any) => (
                      <Card key={team.id}>
                        <CardContent className="pt-6">
                          <h3 className="font-bold mb-1">{team.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{team.members?.length || 0} members</p>
                          <p className="text-sm mb-3">{team.description?.substring(0, 100)}...</p>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/teams/${team.id}`}>View Team</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-1 md:col-span-3">
                      <CardContent className="pt-6 text-center py-12">
                        <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                        <p className="text-gray-600 mb-6">Be the first to create a team for this hackathon!</p>
                        <Button asChild>
                          <Link to="/teams/create">Create Team</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
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
