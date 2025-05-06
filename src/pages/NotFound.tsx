
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Try to extract ID from the URL to check if it's a valid resource
    const pathParts = location.pathname.split('/');
    const resourceType = pathParts[1]; // 'hackathons', 'teams', etc.
    const resourceId = pathParts[2];
    
    // If it's a hackathon or team route with ID, check if it exists in localStorage
    if (resourceType === 'hackathons' && resourceId) {
      const hackathons = JSON.parse(localStorage.getItem('hackmap-hackathons') || '[]');
      if (!hackathons.some(h => h.id === resourceId)) {
        console.error(`Hackathon with ID ${resourceId} not found`);
      }
    } else if (resourceType === 'teams' && resourceId) {
      const teams = JSON.parse(localStorage.getItem('hackmap-teams') || '[]');
      if (!teams.some(t => t.id === resourceId)) {
        console.error(`Team with ID ${resourceId} not found`);
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
          <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <Button onClick={goBack} className="w-full bg-hackmap-purple hover:bg-hackmap-purple/90">
              Go Back
            </Button>
            <div className="flex space-x-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/hackathons">Browse Hackathons</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
