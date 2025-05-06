
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Hackathons from "./pages/Hackathons";
import HackathonDetail from "./pages/HackathonDetail";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Ideas from "./pages/Ideas";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MyIdeas from "./pages/MyIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import MyHackathons from "./pages/MyHackathons";
import MyTeams from "./pages/MyTeams";
import TeamCreate from "./pages/TeamCreate";
import HackathonCreate from "./pages/HackathonCreate";

// Create a centralized store for mock data to ensure consistency
const initMockData = () => {
  // Initialize mock teams if not already present
  if (!localStorage.getItem("hackmap-teams")) {
    const mockTeams = [
      {
        id: "1",
        name: "Code Wizards",
        hackathonName: "AI for Good Hackathon",
        hackathonId: "1",
        description: "Building an AI solution to help identify and reduce food waste in restaurants.",
        members: [
          { id: "user-1", name: "Alex Johnson", username: "alex", role: "Team Lead" },
          { id: "user-2", name: "Jamie Smith", username: "jamie", role: "Backend Developer" }
        ],
        membersCount: 2,
        maxMembers: 5,
        skills: ["AI", "Machine Learning", "Backend", "UI/UX"],
        inviteCode: "WIZARDS123"
      },
      {
        id: "2",
        name: "Blockchain Pioneers",
        hackathonName: "Web3 Innovation Challenge",
        hackathonId: "2",
        description: "Creating a decentralized marketplace for carbon credits using blockchain technology.",
        members: [
          { id: "user-3", name: "Taylor Brown", username: "taylor", role: "Team Lead" }
        ],
        membersCount: 1,
        maxMembers: 4,
        skills: ["Blockchain", "Smart Contracts", "Frontend", "Solidity"],
        inviteCode: "PIONEERS456"
      }
    ];
    localStorage.setItem("hackmap-teams", JSON.stringify(mockTeams));
  }
  
  // Initialize mock hackathons if not already present
  if (!localStorage.getItem("hackmap-hackathons")) {
    const mockHackathons = [
      {
        id: "1",
        title: "AI for Good Hackathon",
        theme: "Using AI to solve social problems",
        startDate: "2025-06-15",
        endDate: "2025-06-17",
        tags: ["AI", "Social Impact", "Machine Learning"],
        location: "San Francisco, CA"
      },
      {
        id: "2",
        title: "Web3 Innovation Challenge",
        theme: "Building the decentralized future",
        startDate: "2025-07-22",
        endDate: "2025-07-24",
        tags: ["Blockchain", "Web3", "DeFi"],
        location: "New York, NY"
      },
      {
        id: "3",
        title: "HealthTech Hackathon",
        theme: "Innovation in healthcare technology",
        startDate: "2025-08-10",
        endDate: "2025-08-12",
        tags: ["Healthcare", "IoT", "Mobile"],
        location: "Boston, MA"
      }
    ];
    localStorage.setItem("hackmap-hackathons", JSON.stringify(mockHackathons));
  }
  
  // Initialize default user if needed for testing
  if (!localStorage.getItem("hackmap-user")) {
    const defaultUser = {
      id: "default-user",
      username: "testuser",
      email: "test@example.com",
      isLoggedIn: true,
      hackathonCount: 1,
      teamCount: 1,
      role: "attendee",
      registeredHackathons: ["1"]
    };
    localStorage.setItem("hackmap-user", JSON.stringify(defaultUser));
  }
};

const queryClient = new QueryClient();

const App = () => {
  // Initialize mock data
  useEffect(() => {
    initMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/hackathons/:id" element={<HackathonDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/my-ideas" element={<MyIdeas />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-hackathons" element={<MyHackathons />} />
            <Route path="/my-teams" element={<MyTeams />} />
            <Route path="/teams/create" element={<TeamCreate />} />
            <Route path="/hackathons/create" element={<HackathonCreate />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
