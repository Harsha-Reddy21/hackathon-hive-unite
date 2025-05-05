
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HackathonCard from "@/components/HackathonCard";
import { upcomingHackathons } from "@/data/hackathons";
import Navbar from "@/components/Navbar";

const Index = () => {
  // Get the next 3 upcoming hackathons
  const featuredHackathons = upcomingHackathons.slice(0, 3);

  return (
    <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          </div>
        </section>
        
        <StatsSection />
        
        {/* How It Works Section */}
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
