
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("attendee");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("hackmap-user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsLoggedIn(!!user.isLoggedIn);
        setUsername(user.username || "User");
        setRole(user.role || "attendee");
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
    
    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("hackmap-user");
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Navigate to home page
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-hackmap-purple to-hackmap-blue bg-clip-text text-transparent">
                HackMap
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <NavLink to="/" label="Home" />
              {role === "organizer" && (
                <NavLink to="/hackathons/create" label="Create Hackathon" />
              )}
              <NavLink to="/hackathons" label="Hackathons" />
              <NavLink to="/teams" label="Teams" />
              <NavLink to="/ideas" label="Ideas" />
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <User className="h-6 w-6" />
                          {role === "organizer" && (
                            <span className="absolute -top-1 -right-1 bg-hackmap-purple text-white text-xs px-1.5 py-0.5 rounded-full">
                              Organizer
                            </span>
                          )}
                          {role === "attendee" && (
                            <span className="absolute -top-1 -right-1 bg-hackmap-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                              Attendee
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{username}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hackmap-purple"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/hackathons" label="Hackathons" />
            <MobileNavLink to="/teams" label="Teams" />
            <MobileNavLink to="/ideas" label="Ideas" />
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="space-y-1">
                <MobileNavLink to="/dashboard" label="Dashboard" />
                <MobileNavLink to="/profile" label="Profile" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Button asChild variant="outline" className="w-full mb-2">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-hackmap-purple"
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-hackmap-purple"
  >
    {label}
  </Link>
);

export default Navbar;
