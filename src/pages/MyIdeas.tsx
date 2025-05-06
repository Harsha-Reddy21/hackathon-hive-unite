import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const MyIdeas = () => {
  const [sharedIdeas, setSharedIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data to check if logged in
    const userData = localStorage.getItem("hackmap-user");
    if (!userData) {
      setIsLoading(false);
      return;
    }

    // Simulate fetching user's shared ideas
    const storedIdeas = localStorage.getItem("hackmap-shared-ideas");
    if (storedIdeas) {
      const ideas = JSON.parse(storedIdeas);
      // Filter ideas to show only the user's ideas
      const userIdeas = ideas.filter((idea: any) => idea.author === JSON.parse(userData).username);
      setSharedIdeas(userIdeas);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading your ideas...</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Shared Ideas</h1>
          <p className="text-gray-600">View and manage the ideas you've shared with the community</p>
        </div>

        <div className="space-y-4">
          {sharedIdeas.map((idea) => (
            <Card key={idea.id} className="overflow-hidden">
              <CardHeader className="pt-4 pb-2 px-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-green-500" />
                  <CardTitle>{idea.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-500 mb-4">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {idea.likes} likes
                    </span>
                    {idea.tags.map((tag: string) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button asChild variant="outline">
                    <Link to={`/ideas/${idea.id}`}>View Idea</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {sharedIdeas.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">You haven't shared any ideas yet.</p>
                <Button asChild>
                  <Link to="/ideas/new">Share Your First Idea</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIdeas;
