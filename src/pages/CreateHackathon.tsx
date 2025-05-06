
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Tag, Users, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";

const CreateHackathon = () => {
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([""]);
  const [prizes, setPrizes] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !theme.trim() || !description.trim() || !startDate.trim() || !endDate.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user data to verify organizer status
      const userData = localStorage.getItem("hackmap-user");
      if (!userData) {
        throw new Error("User not logged in");
      }

      const parsedUserData = JSON.parse(userData);

      // Create new hackathon
      const newHackathon = {
        id: `hackathon-${Date.now()}`,
        title,
        theme,
        description,
        startDate,
        endDate,
        location,
        tags: tags.filter(tag => tag.trim()),
        prizes: prizes.filter(prize => prize.trim()),
        organizer: {
          id: parsedUserData.id || `user-${Date.now()}`,
          username: parsedUserData.username
        },
        createdAt: new Date().toISOString(),
        status: "active",
        participants: [],
        teams: [],
        isActive: true,
        participantCount: 0
      };

      console.log("Creating new hackathon:", newHackathon);

      // Save hackathon to localStorage
      const storedHackathons = localStorage.getItem("hackmap-hackathons") || "[]";
      const hackathons = JSON.parse(storedHackathons);
      hackathons.push(newHackathon);
      localStorage.setItem("hackmap-hackathons", JSON.stringify(hackathons));

      // Update user's organized hackathons
      if (!parsedUserData.createdHackathons) {
        parsedUserData.createdHackathons = [];
      }
      parsedUserData.createdHackathons.push(newHackathon.id);
      localStorage.setItem("hackmap-user", JSON.stringify(parsedUserData));
      
      // Update all users storage with the updated user
      const allUsersData = localStorage.getItem("hackmap-all-users");
      if (allUsersData) {
        const allUsers = JSON.parse(allUsersData);
        const updatedAllUsers = allUsers.map((u) => 
          u.id === parsedUserData.id ? parsedUserData : u
        );
        localStorage.setItem("hackmap-all-users", JSON.stringify(updatedAllUsers));
      }

      // Trigger a storage event so other tabs update
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Success",
        description: "Hackathon created successfully!",
      });

      navigate("/my-hackathons");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create hackathon. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating hackathon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addPrize = () => {
    setPrizes([...prizes, ""]);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Hackathon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Hackathon Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., AI Hackathon 2024"
                  required
                />
              </div>

              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                  Theme/Category
                </label>
                <Input
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g., Artificial Intelligence, Web3"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your hackathon and what participants can expect..."
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA or Online"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (add multiple tags to help participants find your hackathon)
                </label>
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...tags];
                        newTags[index] = e.target.value;
                        setTags(newTags);
                      }}
                      placeholder="e.g., AI, Machine Learning"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTag(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  Add Tag
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prizes (add multiple prizes to attract participants)
                </label>
                {prizes.map((prize, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={prize}
                      onChange={(e) => {
                        const newPrizes = [...prizes];
                        newPrizes[index] = e.target.value;
                        setPrizes(newPrizes);
                      }}
                      placeholder="e.g., $5000 cash prize, mentorship opportunities"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePrize(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPrize}
                >
                  Add Prize
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-hackmap-purple hover:bg-hackmap-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Hackathon"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateHackathon;
