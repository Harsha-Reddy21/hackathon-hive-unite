
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThumbsUp, MessageSquare, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectIdea {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorAvatar?: string;
  hackathonName: string;
  techStack: string[];
  likes: number;
  comments: number;
  likedByUser: boolean;
}

const mockProjectIdeas: ProjectIdea[] = [
  {
    id: "1",
    title: "Food Waste Reduction AI",
    summary: "An AI-powered system that helps restaurants identify and reduce food waste patterns",
    authorName: "Alex Johnson",
    authorAvatar: "",
    hackathonName: "AI for Good Hackathon",
    techStack: ["Python", "TensorFlow", "React", "Node.js"],
    likes: 24,
    comments: 7,
    likedByUser: false
  },
  {
    id: "2",
    title: "Decentralized Carbon Credit Exchange",
    summary: "A blockchain platform for transparent trading and verification of carbon credits",
    authorName: "Samantha Lee",
    authorAvatar: "",
    hackathonName: "Web3 Innovation Challenge",
    techStack: ["Solidity", "Ethereum", "React", "Web3.js"],
    likes: 32,
    comments: 12,
    likedByUser: true
  },
  {
    id: "3",
    title: "Remote Patient Monitoring System",
    summary: "A mobile app and IoT network for monitoring patients with chronic conditions",
    authorName: "Michael Chen",
    authorAvatar: "",
    hackathonName: "HealthTech Hackathon",
    techStack: ["React Native", "Firebase", "Arduino", "AWS"],
    likes: 19,
    comments: 5,
    likedByUser: false
  },
  {
    id: "4",
    title: "Personal Carbon Footprint Tracker",
    summary: "An application that helps users track and reduce their daily carbon emissions",
    authorName: "Emma Williams",
    authorAvatar: "",
    hackathonName: "Climate Change Challenge",
    techStack: ["Vue.js", "D3.js", "Node.js", "MongoDB"],
    likes: 27,
    comments: 9,
    likedByUser: false
  },
  {
    id: "5",
    title: "AR Educational Platform",
    summary: "An augmented reality platform for creating interactive educational experiences",
    authorName: "David Garcia",
    authorAvatar: "",
    hackathonName: "EdTech Innovation Jam",
    techStack: ["Unity", "ARKit", "React", "Express"],
    likes: 41,
    comments: 15,
    likedByUser: true
  },
  {
    id: "6",
    title: "AI Personal Finance Assistant",
    summary: "An intelligent assistant that helps users manage their finances and make better decisions",
    authorName: "Olivia Brown",
    authorAvatar: "",
    hackathonName: "FinTech Revolution",
    techStack: ["Python", "NLP", "React", "PostgreSQL"],
    likes: 36,
    comments: 11,
    likedByUser: false
  }
];

const Ideas = () => {
  const [projectIdeas, setProjectIdeas] = useState(mockProjectIdeas);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Filter project ideas based on search query
  const filteredIdeas = projectIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.hackathonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLikeIdea = (id: string) => {
    setProjectIdeas(
      projectIdeas.map((idea) => {
        if (idea.id === id) {
          const wasLiked = idea.likedByUser;
          return {
            ...idea,
            likes: wasLiked ? idea.likes - 1 : idea.likes + 1,
            likedByUser: !wasLiked
          };
        }
        return idea;
      })
    );
    
    toast({
      title: "Success",
      description: "Your endorsement has been recorded",
    });
  };

  const handleCommentIdea = (title: string) => {
    toast({
      title: "Coming Soon",
      description: `Discussion feature for "${title}" is coming soon!`,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Ideas</h1>
            <p className="text-gray-600 max-w-3xl">
              Explore project ideas from teams or share your own for feedback
            </p>
          </div>
          <Button asChild>
            <Link to="/ideas/new">
              <Plus className="h-4 w-4 mr-2" /> Share Idea
            </Link>
          </Button>
        </div>

        <div className="relative w-full md:w-2/3 mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search project ideas, tech stacks, or hackathons..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <Badge variant="outline">{idea.hackathonName}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm mb-4 line-clamp-3">{idea.summary}</p>
                  
                  <div className="flex items-center mb-4">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={idea.authorAvatar} alt={idea.authorName} />
                      <AvatarFallback>{idea.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{idea.authorName}</span>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-muted text-muted-foreground text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 flex justify-between">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={idea.likedByUser ? "text-hackmap-purple" : ""}
                      onClick={() => handleLikeIdea(idea.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{idea.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentIdea(idea.title)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{idea.comments}</span>
                    </Button>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/ideas/${idea.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No project ideas found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or share your own idea</p>
            <Button asChild>
              <Link to="/ideas/new">
                <Plus className="h-4 w-4 mr-2" /> Share New Idea
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;
