import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Lightbulb, MessageSquare, Heart, Share2 } from "lucide-react";

const IdeaDetail = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Simulate fetching the idea from localStorage
    const storedIdeas = localStorage.getItem("hackmap-shared-ideas");
    if (storedIdeas) {
      const ideas = JSON.parse(storedIdeas);
      const foundIdea = ideas.find((i: any) => i.id === id);
      if (foundIdea) {
        setIdea(foundIdea);
      }
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading idea...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Idea not found</h1>
            <Button asChild>
              <Link to="/ideas">Back to Ideas</Link>
            </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h1>
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
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pt-4 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-green-500" />
              <CardTitle>{idea.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-500 mb-6">{idea.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <Button asChild variant="outline">
                <Link to="/ideas">Back to Ideas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IdeaDetail;
