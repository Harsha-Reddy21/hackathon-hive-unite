
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HackathonCard from "@/components/HackathonCard";
import Navbar from "@/components/Navbar";

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
}

const Index = () => {
  const [featuredHackathons, setFeaturedHackathons] = useState<Hackathon[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Load hackathons from localStorage
    const loadHackathons = () => {
      const hackathonsData = localStorage.getItem("hackmap-hackathons");
      if (hackathonsData) {
        const loadedHackathons = JSON.parse(hackathonsData);
        // Get the next 3 upcoming hackathons
        const upcomingHackathons = [...loadedHackathons]
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .filter(h => new Date(h.startDate) > new Date())
          .slice(0, 3);
        setFeaturedHackathons(upcomingHackathons);
      }
    };
    
    // Check if user is logged in
    const userData = localStorage.getItem("hackmap-user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(!!user.isLoggedIn);
    }
    
    loadHackathons();
    
    // Listen for storage changes
    window.addEventListener('storage', loadHackathons);
    
    return () => {
      window.removeEventListener('storage', loadHackathons);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16"> {/* Adding padding to account for fixed navbar */}
        <HeroSection />
        
        {/* Featured Hackathons Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Hackathons</h2>
              <Button asChild variant="outline">
                <Link to="/hackathons">View All</Link>
              </Button>
            </div>
            {featuredHackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No upcoming hackathons found.</p>
                <Button asChild className="mt-4">
                  <Link to="/hackathons/create">Create a Hackathon</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <StatsSection />
        
        {/* How It Works Section - Only show for non-logged in users */}
        {!isLoggedIn && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">How HackMap Works</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Finding the right hackathon and building an amazing team has never been easier
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-hackmap-purple flex items-center justify-center text-white font-bold mb-4">1</div>
                  <h3 className="text-xl font-semibold mb-2">Discover Hackathons</h3>
                  <p className="text-gray-600">Browse and filter hackathons based on your interests, schedule, and preferred technologies</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-hackmap-blue flex items-center justify-center text-white font-bold mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                  <p className="text-gray-600">Showcase your skills, experience, and past projects to attract the right teammates</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-hackmap-purple flex items-center justify-center text-white font-bold mb-4">3</div>
                  <h3 className="text-xl font-semibold mb-2">Form or Join Teams</h3>
                  <p className="text-gray-600">Create a team for your project idea or join an existing team that needs your skills</p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link to="/signup">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Your Dashboard - Only show for logged in users */}
        {isLoggedIn && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Your Dashboard</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Manage your hackathons, teams, and ideas all in one place
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link to="/dashboard" className="block">
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-hackmap-purple flex items-center justify-center text-white font-bold mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 14v1" />
                        <path d="M9 19v2" />
                        <path d="M9 3v2" />
                        <path d="M9 9v1" />
                        <path d="m15 14 2 2" />
                        <path d="m12 12 4 4" />
                        <path d="m15 19 2 2" />
                        <path d="m12 17 4 4" />
                        <path d="m15 5 2-2" />
                        <path d="m12 7 4-4" />
                        <path d="m15 10 2-2" />
                        <path d="m12 12 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your Dashboard</h3>
                    <p className="text-gray-600">View your registered hackathons, teams, and upcoming events</p>
                  </div>
                </Link>
                
                <Link to="/teams" className="block">
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-hackmap-blue flex items-center justify-center text-white font-bold mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your Teams</h3>
                    <p className="text-gray-600">Manage your existing teams or create a new team for an upcoming hackathon</p>
                  </div>
                </Link>
                
                <Link to="/ideas" className="block">
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-hackmap-purple flex items-center justify-center text-white font-bold mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Share Ideas</h3>
                    <p className="text-gray-600">Post your project ideas and get feedback from the community</p>
                  </div>
                </Link>
              </div>
              
              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Footer */}
        <footer className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-hackmap-purple to-hackmap-blue bg-clip-text text-transparent">
                  HackMap
                </span>
                <p className="mt-2 text-sm text-gray-500">Find hackathons. Build teams. Create amazing projects.</p>
              </div>
              
              <div className="flex space-x-8">
                <Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link>
                <Link to="/hackathons" className="text-gray-500 hover:text-gray-900">Hackathons</Link>
                <Link to="/teams" className="text-gray-500 hover:text-gray-900">Teams</Link>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} HackMap. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
