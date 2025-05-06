import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ThumbsUp, MessageSquare, Plus, Tag, Lightbulb, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock ideas data
const mockIdeas = [
  {
    id: "1",
    title: "AI-Powered Food Waste Reduction",
    description: "An AI solution that helps restaurants identify and reduce food waste by analyzing patterns in kitchen inventory and customer orders, then making recommendations for menu adjustments and food usage prioritization.",
    author: "Alex Johnson",
    date: "2025-04-15",
    tags: ["AI", "Sustainability", "Food", "Computer Vision"],
    likes: 24,
    comments: 8
  },
  {
    id: "2",
    title: "Blockchain Carbon Credit Marketplace",
    description: "A decentralized marketplace for carbon credits using blockchain to ensure transparency and prevent double-counting of carbon offsets. Companies can buy verified carbon credits directly from project developers.",
    author: "Jamie Smith",
    date: "2025-04-12",
    tags: ["Blockchain", "Climate", "Web3", "Marketplace"],
    likes: 18,
    comments: 5
  },
  {
    id: "3",
    title: "AR Education Platform for STEM",
    description: "An augmented reality application that helps students visualize and interact with complex scientific and mathematical concepts in 3D space, making learning more engaging and effective.",
    author: "Taylor Brown",
    date: "2025-04-08",
    tags: ["AR/VR", "Education", "Mobile", "3D"],
    likes: 32,
    comments: 12
  },
  {
    id: "4",
    title: "Mental Health Support Chatbot",
    description: "A privacy-focused AI chatbot that provides mental health support, resources, and coping strategies for users experiencing stress, anxiety, or other mental health challenges.",
    author: "Jordan Lee",
    date: "2025-04-05",
    tags: ["Healthcare", "AI", "Chatbot", "Mental Health"],
    likes: 29,
    comments: 7
  },
  {
    id: "5",
    title: "Decentralized Energy Trading Platform",
    description: "A platform that allows homeowners with solar panels to trade excess energy with neighbors, creating a more efficient and resilient local energy grid using blockchain for secure transactions.",
    author: "Morgan Chen",
    date: "2025-04-02",
    tags: ["Energy", "Blockchain", "IoT", "P2P"],
    likes: 15,
    comments: 4
  },
  {
    id: "6",
    title: "Inclusive Gaming Accessibility Tool",
    description: "A middleware solution that makes existing games more accessible to players with various disabilities by providing customizable input methods, visual aids, and audio cues.",
    author: "Casey Williams",
    date: "2025-03-28",
    tags: ["Gaming", "Accessibility", "UI/UX", "Inclusive Design"],
    likes: 21,
    comments: 9
  }
];

// All unique tags from ideas
const allTags = Array.from(new Set(mockIdeas.flatMap(idea => idea.tags))).sort();

const Ideas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ideas, setIdeas] = useState(mockIdeas);
  const [userIdeas, setUserIdeas] = useState(mockIdeas.filter(idea => idea.id.startsWith('user-')));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("hackmap-user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Filter ideas based on search query and selected tags
  const filteredIdeas = [...ideas, ...userIdeas].filter((idea) => {
    const matchesSearch =
      searchQuery === "" ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => idea.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !newIdea.tags.includes(tagInput.trim())) {
      setNewIdea({
        ...newIdea,
        tags: [...newIdea.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewIdea({
      ...newIdea,
      tags: newIdea.tags.filter(t => t !== tag)
    });
  };
  
  const handleSubmitIdea = (closeDialog: () => void) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You must be logged in to share ideas",
        variant: "destructive",
      });
      return;
    }
    
    if (!newIdea.title.trim() || !newIdea.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for your idea",
        variant: "destructive",
      });
      return;
    }
    
    // Create new idea
    const userData = JSON.parse(localStorage.getItem("hackmap-user") || "{}");
    const createdIdea = {
      id: `user-${Date.now()}`,
      title: newIdea.title,
      description: newIdea.description,
      author: userData.username || "User",
      date: new Date().toISOString().split('T')[0],
      tags: newIdea.tags.length > 0 ? newIdea.tags : ["General"],
      likes: 0,
      comments: 0
    };
    
    // Add to ideas list and save to localStorage
    const updatedIdeas = [createdIdea, ...ideas];
    setIdeas(updatedIdeas);
    
    // Save to localStorage
    const storedIdeas = localStorage.getItem("hackmap-shared-ideas");
    const existingIdeas = storedIdeas ? JSON.parse(storedIdeas) : [];
    const allIdeas = [...existingIdeas, createdIdea];
    localStorage.setItem("hackmap-shared-ideas", JSON.stringify(allIdeas));
    
    // Reset form
    setNewIdea({
      title: "",
      description: "",
      tags: []
    });
    
    toast({
      title: "Idea Shared!",
      description: "Your idea has been successfully shared with the community.",
    });
    
    closeDialog();
  };
  
  const handleLikeIdea = (id: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You must be logged in to like ideas",
        variant: "destructive",
      });
      return;
    }
    
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Ideas</h1>
            <p className="text-gray-600 max-w-3xl">
              Share your hackathon project ideas, get feedback from the community, and find inspiration
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" /> Share Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Share Your Project Idea</DialogTitle>
                <DialogDescription>
                  Share your hackathon project idea with the community to get feedback and find potential teammates.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    id="title" 
                    placeholder="Give your idea a catchy title" 
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your idea in detail" 
                    rows={5}
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex space-x-2">
                    <Input 
                      id="tags" 
                      placeholder="Add tags (e.g., AI, Mobile)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newIdea.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => {
                  const close = () => {
                    const closeButton = document.querySelector('[data-state="open"] button[toast-close]');
                    if (closeButton instanceof HTMLElement) {
                      closeButton.click();
                    }
                  };
                  handleSubmitIdea(close);
                }}>
                  Share Idea
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search for ideas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All Ideas</TabsTrigger>
                <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Filter size={16} className="mr-2 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Filter by Tags:</h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="ml-2 h-7 text-xs"
              >
                Clear all <X size={14} className="ml-1" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-hackmap-purple hover:bg-hackmap-purple/80"
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{idea.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted by {idea.author} on {new Date(idea.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Lightbulb className="h-5 w-5 text-hackmap-purple" />
                      <span className="text-hackmap-purple font-medium">{idea.id.startsWith('user-') ? 'New' : 'Featured'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{idea.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleLikeIdea(idea.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" /> {idea.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      asChild
                    >
                      <Link to={`/ideas/${idea.id}`}>
                        <MessageSquare className="h-4 w-4 mr-1" /> {idea.comments}
                      </Link>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/ideas/${idea.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No ideas found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button asChild>
              <Link to="/ideas">Reset Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;
