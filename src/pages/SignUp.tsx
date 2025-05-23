
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"organizer" | "attendee">("attendee");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check username availability when username changes
  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(true);
      return;
    }
    
    setIsCheckingUsername(true);
    
    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
      setIsCheckingUsername(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);
  
  // Check email availability when email changes
  useEffect(() => {
    if (!email) {
      setIsEmailAvailable(true);
      return;
    }
    
    const timer = setTimeout(() => {
      checkEmailAvailability(email);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [email]);

  const checkUsernameAvailability = (username: string) => {
    // Check if username exists in localStorage
    const allUsers = getAllUsers();
    const isAvailable = !allUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
    setIsUsernameAvailable(isAvailable);
    return isAvailable;
  };
  
  const checkEmailAvailability = (email: string) => {
    // Check if email exists in localStorage
    const allUsers = getAllUsers();
    const isAvailable = !allUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    setIsEmailAvailable(isAvailable);
    return isAvailable;
  };
  
  const getAllUsers = () => {
    const usersData = localStorage.getItem("hackmap-all-users");
    return usersData ? JSON.parse(usersData) : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword || !username) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    // Check if username and email are available
    if (!checkUsernameAvailability(username)) {
      toast({
        title: "Error",
        description: "Username is already taken",
        variant: "destructive",
      });
      return;
    }
    
    if (!checkEmailAvailability(email)) {
      toast({
        title: "Error",
        description: "Email is already registered",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create new user
      const newUser = { 
        email, 
        username, 
        role, 
        isLoggedIn: true, 
        createdAt: new Date().toISOString(),
        id: `user-${Date.now()}`
      };
      
      // Store in localStorage
      localStorage.setItem("hackmap-user", JSON.stringify(newUser));
      
      // Also add to all-users collection for uniqueness checking
      const allUsers = getAllUsers();
      allUsers.push(newUser);
      localStorage.setItem("hackmap-all-users", JSON.stringify(allUsers));
      
      toast({
        title: "Account created!",
        description: "You have successfully registered.",
      });
      
      navigate("/");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Select your role:
                <div className="mt-2 flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="organizer"
                      name="role"
                      value="organizer"
                      checked={role === "organizer"}
                      onChange={(e) => setRole(e.target.value as "organizer" | "attendee")}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="organizer" className="ml-2 block text-sm font-medium text-gray-700">
                      Organizer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="attendee"
                      name="role"
                      value="attendee"
                      checked={role === "attendee"}
                      onChange={(e) => setRole(e.target.value as "organizer" | "attendee")}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="attendee" className="ml-2 block text-sm font-medium text-gray-700">
                      Attendee
                    </label>
                  </div>
                </div>
              </CardDescription>
              <CardDescription>
                Join HackMap to discover hackathons and build amazing teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourusername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={!isUsernameAvailable ? "border-red-500" : ""}
                  />
                  {!isUsernameAvailable && (
                    <p className="text-red-500 text-xs mt-1">Username already taken</p>
                  )}
                  {isCheckingUsername && (
                    <p className="text-gray-500 text-xs mt-1">Checking availability...</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={!isEmailAvailable ? "border-red-500" : ""}
                  />
                  {!isEmailAvailable && (
                    <p className="text-red-500 text-xs mt-1">Email already registered</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-hackmap-purple font-medium hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
