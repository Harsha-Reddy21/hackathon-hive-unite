
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HackathonCard from "@/components/HackathonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Hackathon {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizes: string[];
  tags: string[];
  participantCount?: number;
  description?: string;
}

const Hackathons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    // Load hackathons from localStorage
    const loadHackathons = () => {
      const hackathonsData = localStorage.getItem("hackmap-hackathons");
      if (hackathonsData) {
        const loadedHackathons = JSON.parse(hackathonsData);
        setHackathons(loadedHackathons);
        
        // Extract all unique tags - fix the type error by ensuring we have string[]
        const tags = Array.from(
          new Set(loadedHackathons.flatMap((hackathon: Hackathon) => hackathon.tags || []))
        ) as string[];
        setAllTags(tags.sort());
      }
    };
    
    loadHackathons();
    
    // Listen for storage changes in case hackathons are updated in another tab
    window.addEventListener('storage', loadHackathons);
    
    return () => {
      window.removeEventListener('storage', loadHackathons);
    };
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter hackathons based on search query and selected tags
  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch =
      searchQuery === "" ||
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hackathon.theme && hackathon.theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hackathon.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => hackathon.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Sort hackathons
  const sortedHackathons = [...filteredHackathons].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortBy === "popular") {
      return (b.participantCount || 0) - (a.participantCount || 0);
    }
    return 0;
  });

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hackathons</h1>
          <p className="text-gray-600 max-w-3xl">
            Browse through upcoming hackathons, filter by technologies you're interested in,
            and find the perfect event to showcase your skills
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search hackathons by name, theme, or skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="popular">Sort by Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-8">
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

        {sortedHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hackathons found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
