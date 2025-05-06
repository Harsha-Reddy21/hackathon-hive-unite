
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HackathonCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [prizes, setPrizes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateHackathon = async () => {
    if (!title || !description || !location || !startDate || !endDate || !registrationDeadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }

    if (registrationDeadline > startDate) {
      toast({
        title: "Error",
        description: "Registration deadline cannot be after start date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user data
      const userData = localStorage.getItem("hackmap-user");
      if (!userData) {
        throw new Error("You must be logged in to create a hackathon");
      }
      const currentUser = JSON.parse(userData);
      
      // Create new hackathon object
      const newHackathon = {
        id: `hackathon-${Date.now()}`,
        title,
        description,
        location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        registrationDeadline: registrationDeadline.toISOString(),
        tags: tags.length > 0 ? tags : ["General"],
        prizes: prizes || "Prizes to be announced",
        createdAt: new Date().toISOString(),
        organizer: {
          id: currentUser.id || `user-${Date.now()}`,
          username: currentUser.username
        },
        participants: [],
        teams: [],
        isActive: true,
        theme: title, // Use title as theme if not specified
        participantCount: 0
      };

      // Get existing hackathons or initialize empty array
      const existingHackathons = localStorage.getItem("hackmap-hackathons");
      const hackathons = existingHackathons ? JSON.parse(existingHackathons) : [];
      
      // Add new hackathon to array
      hackathons.push(newHackathon);
      
      // Save back to localStorage (this makes it globally available)
      localStorage.setItem("hackmap-hackathons", JSON.stringify(hackathons));
      
      // Update user's created hackathons list
      if (!currentUser.createdHackathons) {
        currentUser.createdHackathons = [];
      }
      currentUser.createdHackathons.push(newHackathon.id);
      localStorage.setItem("hackmap-user", JSON.stringify(currentUser));

      toast({
        title: "Success",
        description: "Hackathon created successfully!",
      });

      // Trigger a storage event so other tabs update
      window.dispatchEvent(new Event('storage'));

      // Navigate to hackathons page
      navigate("/hackathons");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create hackathon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Hackathon</h1>
          <p className="text-gray-600">Fill in the details to create your hackathon</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Hackathon Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Hackathon Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter hackathon title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your hackathon"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Online or Physical Location"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Registration Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !registrationDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {registrationDeadline ? format(registrationDeadline, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={registrationDeadline}
                      onSelect={setRegistrationDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="e.g., AI, Web3, Healthcare"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    size="sm"
                    disabled={!currentTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="prizes">Prizes (optional)</Label>
                <Textarea
                  id="prizes"
                  value={prizes}
                  onChange={(e) => setPrizes(e.target.value)}
                  placeholder="Describe prizes and rewards"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/hackathons")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateHackathon}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Hackathon"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HackathonCreate;
