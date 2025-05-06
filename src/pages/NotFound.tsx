
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-hackmap-purple mb-6">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full bg-hackmap-purple hover:bg-hackmap-purple/90">
            <Link to="/">Return to Home</Link>
          </Button>
          <div className="flex space-x-3">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/hackathons">Browse Hackathons</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/teams">Browse Teams</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
