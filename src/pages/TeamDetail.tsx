
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

// Sample team data
const mockTeamMembers = [
  { id: 1, name: "Alex Johnson", role: "Team Lead", skills: ["Frontend", "UX/UI", "React"], avatar: null },
  { id: 2, name: "Jamie Smith", role: "Backend Developer", skills: ["Node.js", "Database", "API"], avatar: null },
  { id: 3, name: "Taylor Brown", role: "UI/UX Designer", skills: ["Figma", "Prototyping", "User Research"], avatar: null },
  { id: 4, name: "Jordan Lee", role: "Data Scientist", skills: ["Python", "Machine Learning", "Data Visualization"], avatar: null }
];

const mockTeams = [
  {
    id: "1",
    name: "Code Wizards",
    hackathonName: "AI for Good Hackathon",
    hackathonId: "1",
    description: "Building an AI solution to help identify and reduce food waste in restaurants. Our team aims to create an innovative solution that uses computer vision and machine learning to analyze kitchen inventory and make recommendations for menu adjustments and food usage to minimize waste.",
    members: mockTeamMembers,
    maxMembers: 5,
    skills: ["AI", "Machine Learning", "Backend", "UI/UX"],
    projectIdea: {
      title: "AI Food Waste Reducer",
      description: "An AI-powered system that helps restaurants reduce food waste through smart inventory management and predictive analytics.",
      techStack: ["TensorFlow", "React", "Node.js", "PostgreSQL"],
      progress: 35
    }
  },
  {
    id: "2",
    name: "Blockchain Pioneers",
    hackathonName: "Web3 Innovation Challenge",
    hackathonId: "2",
    description: "Creating a decentralized marketplace for carbon credits using blockchain technology. Our project aims to make carbon offset trading more accessible, transparent, and efficient through smart contracts.",
    members: mockTeamMembers.slice(0, 2),
    maxMembers: 4,
    skills: ["Blockchain", "Smart Contracts", "Frontend", "Solidity"],
    projectIdea: {
      title: "Carbon Credit DEX",
      description: "A decentralized exchange for carbon credits that makes offset trading accessible and transparent.",
      techStack: ["Ethereum", "Solidity", "React", "Web3.js"],
      progress: 20
    }
  },
  {
    id: "3",
    name: "Health Innovators",
    hackathonName: "HealthTech Hackathon",
    hackathonId: "3",
    description: "Developing a mobile app for remote patient monitoring using IoT devices. Our application connects with various health monitoring devices to provide doctors with real-time patient data.",
    members: mockTeamMembers.slice(1, 4),
    maxMembers: 4,
    skills: ["Mobile Dev", "IoT", "Healthcare", "Backend"],
    projectIdea: {
      title: "RemoteHealth Monitor",
      description: "A comprehensive platform connecting IoT health devices with healthcare providers for better remote patient monitoring.",
      techStack: ["React Native", "Node.js", "MongoDB", "IoT Protocols"],
      progress: 60
    }
  }
];

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("hackmap-user");
    if (userData) {
      setIsLoggedIn(true);
      
      // For demo purposes, randomly determine if user is a member
      const randomMember = Math.random() > 0.7;
      setIsMember(randomMember);
    }
    
    // Find team by ID from localStorage first
    const storedTeams = localStorage.getItem("hackmap-teams");
    let foundTeam = null;
    
    if (storedTeams) {
      const parsedTeams = JSON.parse(storedTeams);
      foundTeam = parsedTeams.find((t: any) => t.id === id);
    }
    
    // If not found in localStorage, check mock data
    if (!foundTeam) {
      foundTeam = mockTeams.find(t => t.id === id);
    }
    
    if (foundTeam) {
      // Check if the current user is a member of this team
      if (userData) {
        const user = JSON.parse(userData);
        const userIsMember = foundTeam.members.some((member: any) => 
          member.username === user.username || member.name === user.username
        );
        setIsMember(userIsMember);
      }
      setTeam(foundTeam);
    } else {
      console.error("Team not found with ID:", id);
    }
  }, [id]);

  const handleJoinRequest = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to join this team",
        variant: "destructive",
      });
      return;
    }
    
    setHasRequested(true);
    toast({
      title: "Request Sent",
      description: "Your request to join the team has been sent to the team leader.",
    });
    
    // Send email notification (simulated)
    console.log("Sending email to team leader about join request");
    
    // Update team in localStorage
    const storedTeams = localStorage.getItem("hackmap-teams");
    if (storedTeams) {
      const userData = JSON.parse(localStorage.getItem("hackmap-user") || "{}");
      const allTeams = JSON.parse(storedTeams);
      const updatedTeams = allTeams.map((t: any) => {
        if (t.id === id) {
          const joinRequests = t.joinRequests || [];
          return {
            ...t,
            joinRequests: [
              ...joinRequests,
              {
                id: `request-${Date.now()}`,
                userId: userData.id || Date.now().toString(),
                username: userData.username || "User",
                requestDate: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    }
  };
  
  const handleLeaveTeam = () => {
    setIsMember(false);
    toast({
      title: "Team Left",
      description: "You have successfully left the team.",
    });
    
    // Update team in localStorage
    const storedTeams = localStorage.getItem("hackmap-teams");
    const userData = localStorage.getItem("hackmap-user");
    
    if (storedTeams && userData) {
      const user = JSON.parse(userData);
      const allTeams = JSON.parse(storedTeams);
      const updatedTeams = allTeams.map((t: any) => {
        if (t.id === id) {
          return {
            ...t,
            members: t.members.filter((member: any) => 
              member.username !== user.username && member.name !== user.username
            ),
            membersCount: t.membersCount > 0 ? t.membersCount - 1 : 0
          };
        }
        return t;
      });
      localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
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
            <Link to={`/hackathons/${team.hackathonId}`} className="text-hackmap-purple hover:underline">
              {team.hackathonName}
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
                disabled={team.members.length >= team.maxMembers}
              >
                {team.members.length >= team.maxMembers ? "Team Full" : "Request to Join"}
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
                  {team.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{team.members.length}</span>/{team.maxMembers} members
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {team.projectIdea && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" /> Project Idea
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{team.projectIdea.title}</h3>
                  <p className="text-gray-700 mb-4">{team.projectIdea.description}</p>
                  
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {team.projectIdea.techStack.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Project Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div 
                      className="bg-hackmap-purple h-2.5 rounded-full" 
                      style={{ width: `${team.projectIdea.progress}%` }}
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
                  {team.members.map((member: any) => (
                    <div key={member.id} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member && member.name ? member.name.charAt(0) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array(team.maxMembers - team.members.length).fill(0).map((_, i) => (
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
