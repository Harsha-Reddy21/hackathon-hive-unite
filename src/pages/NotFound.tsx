
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState<string>("");
  const [resourceId, setResourceId] = useState<string>("");
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);

  useEffect(() => {
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
    
    // Provide suggestions based on available data
    if (type === 'hackathons') {
      const hackathons = JSON.parse(localStorage.getItem('hackmap-hackathons') || '[]');
      setSuggestedItems(hackathons.slice(0, 3));
      
      // Log detailed error if ID was provided
      if (id && !hackathons.some((h: any) => h.id === id)) {
        console.error(`Hackathon with ID ${id} not found`);
      }
    } else if (type === 'teams') {
      const teams = JSON.parse(localStorage.getItem('hackmap-teams') || '[]');
      setSuggestedItems(teams.slice(0, 3));
      
      // Log detailed error if ID was provided
      if (id && !teams.some((t: any) => t.id === id)) {
        console.error(`Team with ID ${id} not found`);
      }
    }
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

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
          
          {suggestedItems.length > 0 && (
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
