
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  const shouldReinitialize = false; // Set to true to force data reset for debugging

  // Initialize mock teams if not already present or force reinitialize
  if (!localStorage.getItem("hackmap-teams") || shouldReinitialize) {
    console.log("Initializing mock teams data");
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
        inviteCode: "WIZARDS123",
        projectIdea: {
          title: "AI Food Waste Reducer",
          description: "An AI-powered system that helps restaurants reduce food waste through smart inventory management and predictive analytics.",
          techStack: ["TensorFlow", "React", "Node.js", "PostgreSQL"],
          progress: 35
        }
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
        inviteCode: "PIONEERS456",
        projectIdea: {
          title: "Carbon Credit DEX",
          description: "A decentralized exchange for carbon credits that makes offset trading accessible and transparent.",
          techStack: ["Ethereum", "Solidity", "React", "Web3.js"],
          progress: 20
        }
      },
      {
        id: "3",
        name: "HealthTech Innovators",
        hackathonName: "HealthTech Hackathon",
        hackathonId: "3",
        description: "Developing a mobile app that helps patients track medication and appointments.",
        members: [
          { id: "user-4", name: "Sam Wilson", username: "samw", role: "Team Lead" },
          { id: "user-5", name: "Jordan Lee", username: "jlee", role: "UI Designer" }
        ],
        membersCount: 2,
        maxMembers: 5,
        skills: ["Healthcare", "Mobile Development", "UX Design"],
        inviteCode: "HEALTH789",
        projectIdea: {
          title: "MediTrack App",
          description: "A comprehensive mobile application for patients to track medications, appointments, and health metrics.",
          techStack: ["React Native", "Firebase", "Node.js", "MongoDB"],
          progress: 45
        }
      }
    ];
    localStorage.setItem("hackmap-teams", JSON.stringify(mockTeams));
  }
  
  // Initialize mock hackathons if not already present or force reinitialize
  if (!localStorage.getItem("hackmap-hackathons") || shouldReinitialize) {
    console.log("Initializing mock hackathons data");
    const mockHackathons = [
      {
        id: "1",
        title: "AI for Good Hackathon",
        theme: "Using AI to solve social problems",
        startDate: "2025-06-15",
        endDate: "2025-06-17",
        tags: ["AI", "Social Impact", "Machine Learning"],
        location: "San Francisco, CA",
        prizes: ["$10,000 Grand Prize", "Mentorship Opportunities"],
        participantCount: 250,
        description: "Join us for 3 days of innovation as we explore how artificial intelligence can address pressing social challenges. Teams will collaborate to build solutions that make a positive impact on society. This event brings together developers, designers, and domain experts to create technology with purpose.",
        organizer: "Tech for Good Foundation",
        registrationDeadline: "2025-06-01",
        website: "https://aiforgood-hackathon.example.com",
        teams: ["1"], // Reference to team IDs
        sponsors: ["Microsoft", "Google", "OpenAI"]
      },
      {
        id: "2",
        title: "Web3 Innovation Challenge",
        theme: "Building the decentralized future",
        startDate: "2025-07-22",
        endDate: "2025-07-24",
        tags: ["Blockchain", "Web3", "DeFi"],
        location: "New York, NY",
        prizes: ["$15,000 in ETH", "Accelerator Program Access"],
        participantCount: 320,
        description: "Dive into the world of Web3 technologies in this exciting hackathon. Build innovative solutions using blockchain, smart contracts, and decentralized technologies. Whether you're an experienced blockchain developer or just getting started, this hackathon offers an opportunity to shape the future of digital ownership and transactions.",
        organizer: "Blockchain Consortium",
        registrationDeadline: "2025-07-15",
        website: "https://web3-challenge.example.com",
        teams: ["2"], // Reference to team IDs
        sponsors: ["Ethereum Foundation", "Binance", "Coinbase"]
      },
      {
        id: "3",
        title: "HealthTech Hackathon",
        theme: "Innovation in healthcare technology",
        startDate: "2025-08-10",
        endDate: "2025-08-12",
        tags: ["Healthcare", "IoT", "Mobile"],
        location: "Boston, MA",
        prizes: ["$8,000 in Cash Prizes", "Pilot Program with Hospitals"],
        participantCount: 180,
        description: "This hackathon focuses on technological solutions for healthcare challenges. From patient care to hospital operations, teams will develop innovative tools that can improve health outcomes and streamline medical processes. Join healthcare professionals, engineers, and designers to create the next generation of medical technology.",
        organizer: "MedTech Alliance",
        registrationDeadline: "2025-08-01",
        website: "https://healthtech-hackathon.example.com",
        teams: ["3"], // Reference to team IDs
        sponsors: ["Johnson & Johnson", "Mayo Clinic", "Philips Healthcare"]
      }
    ];
    localStorage.setItem("hackmap-hackathons", JSON.stringify(mockHackathons));
  }
  
  // Initialize default user if needed for testing
  if (!localStorage.getItem("hackmap-user")) {
    console.log("Initializing mock user data");
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
  
  console.log("Mock data initialization complete");
};

const queryClient = new QueryClient();

const App = () => {
  // Initialize mock data
  useEffect(() => {
    try {
      initMockData();
      console.log("Data initialization successful");
    } catch (error) {
      console.error("Error initializing mock data:", error);
    }
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
