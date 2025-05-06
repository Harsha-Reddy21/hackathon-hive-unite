
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState<string>("");
  const [resourceId, setResourceId] = useState<string>("");
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);
  const [loadAttempted, setLoadAttempted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Extract information from the URL
    const pathParts = location.pathname.split('/');
    const type = pathParts[1]; // 'hackathons', 'teams', etc.
    const id = pathParts[2];
    
    setResourceType(type);
    setResourceId(id);
    
    // Show toast notification
    toast({
      title: "Page Not Found",
      description: `The page at ${location.pathname} doesn't exist.`,
      variant: "destructive",
    });
    
    // Provide suggestions based on available data
    if (type === 'hackathons') {
      const hackathonsData = localStorage.getItem('hackmap-hackathons');
      if (hackathonsData) {
        try {
          const hackathons = JSON.parse(hackathonsData);
          setSuggestedItems(hackathons.slice(0, 3));
          
          // Log detailed error if ID was provided
          if (id && !hackathons.some((h: any) => h.id === id)) {
            console.error(`Hackathon with ID ${id} not found. Available IDs:`, hackathons.map((h: any) => h.id));
          }
        } catch (e) {
          console.error('Error parsing hackathon data:', e);
        }
      } else {
        console.error('No hackathon data found in localStorage');
      }
    } else if (type === 'teams') {
      const teamsData = localStorage.getItem('hackmap-teams');
      if (teamsData) {
        try {
          const teams = JSON.parse(teamsData);
          setSuggestedItems(teams.slice(0, 3));
          
          // Log detailed error if ID was provided
          if (id && !teams.some((t: any) => t.id === id)) {
            console.error(`Team with ID ${id} not found. Available IDs:`, teams.map((t: any) => t.id));
          }
        } catch (e) {
          console.error('Error parsing team data:', e);
        }
      } else {
        console.error('No team data found in localStorage');
      }
    }
    
    setLoadAttempted(true);
    setIsLoading(false);
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-6xl font-bold text-hackmap-purple mb-6">404</h1>
          {resourceType ? (
            <p className="text-xl text-gray-700 mb-6">
              {resourceType === 'hackathons' 
                ? 'Hackathon Not Found' 
                : resourceType === 'teams'
                ? 'Team Not Found'
                : 'Page Not Found'}
            </p>
          ) : (
            <p className="text-xl text-gray-700 mb-6">Page Not Found</p>
          )}
          
          <p className="text-gray-500 mb-8">
            {resourceType === 'hackathons' 
              ? "The hackathon you're looking for doesn't exist or has been removed."
              : resourceType === 'teams'
              ? "The team you're looking for doesn't exist or has been removed."
              : "The page you're looking for doesn't exist or has been moved."}
          </p>
          
          {suggestedItems.length > 0 && loadAttempted && (
            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-3">
                You might be interested in:
              </p>
              <ul className="space-y-2">
                {suggestedItems.map((item: any) => (
                  <li key={item.id} className="bg-gray-50 px-4 py-2 rounded-md">
                    <Link 
                      to={`/${resourceType}/${item.id}`}
                      className="text-hackmap-purple hover:underline"
                    >
                      {item.title || item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {suggestedItems.length === 0 && loadAttempted && (
            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-3">
                No suggestions available
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button onClick={goBack} className="w-full bg-hackmap-purple hover:bg-hackmap-purple/90">
              Go Back
            </Button>
            <div className="flex space-x-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Return to Home</Link>
              </Button>
              {resourceType === 'hackathons' ? (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/hackathons">Browse Hackathons</Link>
                </Button>
              ) : resourceType === 'teams' ? (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/teams">Browse Teams</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/hackathons">Browse Hackathons</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
