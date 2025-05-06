
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
  // Force data reset
  const shouldReinitialize = true;

  // Initialize mock teams with fresh data
  if (!localStorage.getItem("hackmap-teams") || shouldReinitialize) {
    console.log("Initializing fresh teams data");
    const mockTeams = [
      {
        id: "1",
        name: "Quantum Coders",
        hackathonName: "Future Tech Summit",
        hackathonId: "1",
        description: "Building a quantum computing simulator for educational purposes that makes complex concepts accessible to students.",
        members: [
          { id: "user-1", name: "Taylor Swift", username: "taylordev", role: "Team Lead" },
          { id: "user-2", name: "Ryan Reynolds", username: "ryandev", role: "Frontend Developer" }
        ],
        membersCount: 2,
        maxMembers: 5,
        skills: ["Quantum Computing", "React", "Python", "Education"],
        inviteCode: "QUANTUM42",
        projectIdea: {
          title: "Quantum Classroom",
          description: "An interactive platform that simulates quantum computing concepts through visual exercises and games.",
          techStack: ["React", "Python", "TensorFlow", "Three.js"],
          progress: 40
        }
      },
      {
        id: "2",
        name: "EcoSolutions",
        hackathonName: "GreenTech Challenge",
        hackathonId: "2",
        description: "Creating a mobile app that helps users track and reduce their carbon footprint through personalized recommendations.",
        members: [
          { id: "user-3", name: "Zendaya Coleman", username: "zendaya", role: "Team Lead" },
          { id: "user-4", name: "Tom Holland", username: "tomdev", role: "Mobile Developer" },
          { id: "user-5", name: "Timothée Chalamet", username: "timothee", role: "UI Designer" }
        ],
        membersCount: 3,
        maxMembers: 5,
        skills: ["Mobile Development", "UX Design", "Data Analysis", "Sustainability"],
        inviteCode: "ECOSAVE24",
        projectIdea: {
          title: "CarboTrack",
          description: "A gamified mobile application that calculates personal carbon footprints and suggests actionable steps to reduce environmental impact.",
          techStack: ["React Native", "Firebase", "Node.js", "TensorFlow Lite"],
          progress: 65
        }
      },
      {
        id: "3",
        name: "HealthMinders",
        hackathonName: "MedTech Innovation",
        hackathonId: "3",
        description: "Developing a wearable solution that monitors vital health metrics and provides early warning for potential health issues.",
        members: [
          { id: "user-6", name: "Chadwick Newman", username: "chadwick", role: "Team Lead" },
          { id: "user-7", name: "Emma Stone", username: "emma", role: "Hardware Engineer" }
        ],
        membersCount: 2,
        maxMembers: 4,
        skills: ["IoT", "Machine Learning", "Hardware Design", "Healthcare"],
        inviteCode: "HEALTH365",
        projectIdea: {
          title: "VitalAlert",
          description: "A smart wearable device that continuously monitors vital signs and uses ML to detect anomalies before they become serious health concerns.",
          techStack: ["Arduino", "TensorFlow", "React Native", "AWS"],
          progress: 30
        }
      },
      {
        id: "4",
        name: "EdAccessibility",
        hackathonName: "EdTech Revolution",
        hackathonId: "4",
        description: "Building an AI-powered tool that makes educational content accessible to students with different learning abilities.",
        members: [
          { id: "user-8", name: "Lupita Nyong'o", username: "lupita", role: "Team Lead" },
          { id: "user-9", name: "Donald Glover", username: "donald", role: "AI Engineer" }
        ],
        membersCount: 2,
        maxMembers: 6,
        skills: ["Artificial Intelligence", "Education", "Accessibility", "UX Design"],
        inviteCode: "EDACCESS",
        projectIdea: {
          title: "LearningLens",
          description: "An adaptive platform that automatically tailors educational content to individual learning styles and needs using AI.",
          techStack: ["Python", "React", "TensorFlow", "AWS"],
          progress: 25
        }
      },
      {
        id: "5",
        name: "FinanceForAll",
        hackathonName: "Fintech Forward",
        hackathonId: "5",
        description: "Developing a financial literacy application that makes investing and saving accessible to underserved communities.",
        members: [
          { id: "user-10", name: "Michael B. Jordan", username: "michael", role: "Team Lead" },
          { id: "user-11", name: "Zoe Saldana", username: "zoe", role: "Backend Developer" }
        ],
        membersCount: 2,
        maxMembers: 5,
        skills: ["Finance", "Mobile Development", "Data Visualization", "Security"],
        inviteCode: "FINTECH21",
        projectIdea: {
          title: "WealthWise",
          description: "A mobile platform that simplifies financial concepts and provides personalized guidance for budgeting, saving, and investing.",
          techStack: ["Flutter", "Firebase", "Node.js", "Plaid API"],
          progress: 55
        }
      }
    ];
    localStorage.setItem("hackmap-teams", JSON.stringify(mockTeams));
  }
  
  // Initialize fresh hackathons data
  if (!localStorage.getItem("hackmap-hackathons") || shouldReinitialize) {
    console.log("Initializing fresh hackathons data");
    const mockHackathons = [
      {
        id: "1",
        title: "Future Tech Summit",
        theme: "Quantum Computing and AI Integration",
        startDate: "2025-07-15",
        endDate: "2025-07-17",
        tags: ["Quantum Computing", "AI", "Machine Learning"],
        location: "Boston, MA",
        prizes: [
          { place: "1st Place", reward: "$20,000 and mentorship from leading quantum computing experts" },
          { place: "2nd Place", reward: "$10,000 and quantum computing cloud credits" },
          { place: "3rd Place", reward: "$5,000 and professional certification courses" }
        ],
        participantCount: 350,
        description: "The Future Tech Summit brings together innovators to explore the intersection of quantum computing and artificial intelligence. Participants will tackle challenges in quantum algorithm optimization, AI acceleration using quantum principles, and creating accessible quantum computing educational tools.",
        organizer: "Quantum Future Foundation",
        registrationDeadline: "2025-07-01",
        website: "https://futuretechsummit.example.com",
        teams: ["1"], // Reference to team IDs
        sponsors: ["IBM Quantum", "Google AI", "MIT Technology Review"],
        schedule: [
          { time: "Day 1, 9:00 AM", activity: "Opening Keynote: The Quantum Revolution" },
          { time: "Day 1, 11:00 AM", activity: "Workshop: Quantum Algorithm Basics" },
          { time: "Day 1, 2:00 PM", activity: "Team Formation and Challenge Briefing" },
          { time: "Day 2, 9:00 AM", activity: "Hacking Begins" },
          { time: "Day 2, 7:00 PM", activity: "Expert Panel: Future of Quantum Computing" },
          { time: "Day 3, 12:00 PM", activity: "Project Submissions Deadline" },
          { time: "Day 3, 3:00 PM", activity: "Finalist Presentations" },
          { time: "Day 3, 5:00 PM", activity: "Awards Ceremony" }
        ]
      },
      {
        id: "2",
        title: "GreenTech Challenge",
        theme: "Sustainable Solutions for Climate Action",
        startDate: "2025-08-20",
        endDate: "2025-08-22",
        tags: ["Sustainability", "CleanTech", "IoT", "Data Science"],
        location: "Seattle, WA",
        prizes: [
          { place: "1st Place", reward: "$15,000 and accelerator program placement" },
          { place: "2nd Place", reward: "$7,500 and sustainable business mentorship" },
          { place: "Best Carbon Impact", reward: "$5,000 grant for project development" }
        ],
        participantCount: 280,
        description: "The GreenTech Challenge focuses on developing innovative technological solutions to combat climate change. From carbon footprint tracking to renewable energy optimization, we're looking for ideas that can make a measurable environmental impact while being practical to implement at scale.",
        organizer: "Climate Innovation Collective",
        registrationDeadline: "2025-08-05",
        website: "https://greentechallenge.example.com",
        teams: ["2"], // Reference to team IDs
        sponsors: ["Patagonia", "Tesla Energy", "National Renewable Energy Laboratory"],
        schedule: [
          { time: "Day 1, 8:30 AM", activity: "Opening Ceremony and Climate Impact Briefing" },
          { time: "Day 1, 10:00 AM", activity: "Workshop: Environmental Data Sources and APIs" },
          { time: "Day 1, 1:00 PM", activity: "Team Formation and Challenge Selection" },
          { time: "Day 2, 9:00 AM", activity: "Development Sprint" },
          { time: "Day 2, 4:00 PM", activity: "Sustainability Expert Office Hours" },
          { time: "Day 3, 1:00 PM", activity: "Project Submissions" },
          { time: "Day 3, 3:30 PM", activity: "Finalist Demos" },
          { time: "Day 3, 6:00 PM", activity: "Awards and Networking Mixer" }
        ]
      },
      {
        id: "3",
        title: "MedTech Innovation",
        theme: "Next Generation Healthcare Solutions",
        startDate: "2025-09-10",
        endDate: "2025-09-12",
        tags: ["Healthcare", "Wearables", "AI", "Telehealth"],
        location: "Minneapolis, MN",
        prizes: [
          { place: "1st Place", reward: "$25,000 and clinical trial opportunity" },
          { place: "2nd Place", reward: "$12,500 and healthcare incubator placement" },
          { place: "Patient Impact Award", reward: "$8,000 and mentorship from medical professionals" }
        ],
        participantCount: 220,
        description: "MedTech Innovation challenges participants to create cutting-edge solutions for healthcare challenges. Whether it's wearable devices for remote patient monitoring, AI for early disease detection, or telehealth innovations for underserved communities, we're looking for ideas that can transform patient care and healthcare delivery.",
        organizer: "Mayo Clinic Innovation Lab",
        registrationDeadline: "2025-08-27",
        website: "https://medtechinnovation.example.com",
        teams: ["3"], // Reference to team IDs
        sponsors: ["Mayo Clinic", "Medtronic", "UnitedHealth Group"],
        schedule: [
          { time: "Day 1, 9:00 AM", activity: "Opening Keynote: Healthcare Challenges and Opportunities" },
          { time: "Day 1, 11:30 AM", activity: "Panel: Regulatory Considerations for Medical Innovations" },
          { time: "Day 1, 2:00 PM", activity: "Team Formation and Challenge Selection" },
          { time: "Day 2, 8:30 AM", activity: "Development Day with Clinical Advisor Check-ins" },
          { time: "Day 2, 6:00 PM", activity: "Healthcare Professionals Feedback Session" },
          { time: "Day 3, 12:00 PM", activity: "Final Submissions" },
          { time: "Day 3, 2:30 PM", activity: "Finalist Presentations" },
          { time: "Day 3, 5:00 PM", activity: "Awards Ceremony" }
        ]
      },
      {
        id: "4",
        title: "EdTech Revolution",
        theme: "Transforming Education with Technology",
        startDate: "2025-10-05",
        endDate: "2025-10-07",
        tags: ["Education", "Accessibility", "AI", "Gamification"],
        location: "Austin, TX",
        prizes: [
          { place: "1st Place", reward: "$18,000 and school district pilot program" },
          { place: "2nd Place", reward: "$9,000 and education publisher partnership" },
          { place: "Accessibility Champion", reward: "$5,000 and inclusive design mentorship" }
        ],
        participantCount: 190,
        description: "EdTech Revolution focuses on creating innovative solutions that make quality education more accessible, engaging, and effective for all learners. From AI-powered tutoring to gamified learning experiences to tools that support diverse learning needs, we're seeking technologies that can make a meaningful impact in education.",
        organizer: "Digital Learning Consortium",
        registrationDeadline: "2025-09-20",
        website: "https://edtechrevolution.example.com",
        teams: ["4"], // Reference to team IDs
        sponsors: ["Khan Academy", "Microsoft Education", "National Education Association"],
        schedule: [
          { time: "Day 1, 9:30 AM", activity: "Opening Session: The Future of Learning" },
          { time: "Day 1, 11:00 AM", activity: "Workshop: Understanding Diverse Learning Needs" },
          { time: "Day 1, 2:30 PM", activity: "Team Formation and Ideation" },
          { time: "Day 2, 9:00 AM", activity: "Development and Educator Feedback Sessions" },
          { time: "Day 2, 5:00 PM", activity: "Student Panel: What Learners Really Need" },
          { time: "Day 3, 11:00 AM", activity: "Project Submissions" },
          { time: "Day 3, 2:00 PM", activity: "Finalist Demos" },
          { time: "Day 3, 4:30 PM", activity: "Awards and Implementation Planning" }
        ]
      },
      {
        id: "5",
        title: "Fintech Forward",
        theme: "Financial Innovation for All",
        startDate: "2025-11-12",
        endDate: "2025-11-14",
        tags: ["Finance", "Blockchain", "Inclusion", "Security"],
        location: "New York, NY",
        prizes: [
          { place: "1st Place", reward: "$30,000 and venture capital pitch opportunity" },
          { place: "2nd Place", reward: "$15,000 and financial accelerator program" },
          { place: "Financial Inclusion Award", reward: "$10,000 and community pilot program" }
        ],
        participantCount: 310,
        description: "Fintech Forward challenges innovators to develop solutions that make financial services more accessible, secure, and beneficial for everyone. From inclusive banking solutions to blockchain applications to financial literacy tools, we're looking for technologies that can democratize finance and create economic opportunities.",
        organizer: "Open Finance Initiative",
        registrationDeadline: "2025-10-29",
        website: "https://fintechforward.example.com",
        teams: ["5"], // Reference to team IDs
        sponsors: ["Visa", "Goldman Sachs", "Square"],
        schedule: [
          { time: "Day 1, 8:00 AM", activity: "Welcome and Financial Inclusion Keynote" },
          { time: "Day 1, 10:00 AM", activity: "Workshop: Financial APIs and Data Security" },
          { time: "Day 1, 1:00 PM", activity: "Challenge Briefing and Team Formation" },
          { time: "Day 2, 8:30 AM", activity: "Development and Mentor Sessions" },
          { time: "Day 2, 6:30 PM", activity: "Industry Expert Panel: The Future of Money" },
          { time: "Day 3, 12:00 PM", activity: "Final Submissions" },
          { time: "Day 3, 3:00 PM", activity: "Finalist Presentations" },
          { time: "Day 3, 5:30 PM", activity: "Awards Ceremony and Networking Reception" }
        ]
      }
    ];
    localStorage.setItem("hackmap-hackathons", JSON.stringify(mockHackathons));
  }
  
  // Initialize default user if needed for testing
  if (!localStorage.getItem("hackmap-user") || shouldReinitialize) {
    console.log("Initializing fresh user data");
    const defaultUser = {
      id: "default-user",
      username: "techstar",
      name: "Alex Chen",
      email: "alexchen@example.com",
      isLoggedIn: true,
      hackathonCount: 2,
      teamCount: 2,
      role: "attendee",
      registeredHackathons: ["1", "2"],
      skills: ["React", "TypeScript", "UI/UX Design", "Node.js"],
      bio: "Full-stack developer passionate about creating impactful tech solutions. Always looking to collaborate on innovative projects!",
      location: "San Francisco, CA",
      github: "alexchen-dev",
      twitter: "alexchen_tech",
      website: "https://alexchen.example.com"
    };
    localStorage.setItem("hackmap-user", JSON.stringify(defaultUser));
  }
  
  // Initialize shared ideas
  if (!localStorage.getItem("hackmap-shared-ideas") || shouldReinitialize) {
    console.log("Initializing fresh ideas data");
    const sharedIdeas = [
      {
        id: "idea-1",
        author: "techstar",
        authorId: "default-user",
        title: "AR Guide for Museum Exhibits",
        description: "A mobile app that uses augmented reality to provide interactive guides for museum exhibits. Users can point their phone at an exhibit to see additional information, historical context, and interactive 3D models.",
        tags: ["AR/VR", "Education", "Mobile"],
        likes: 24,
        comments: 8,
        createdAt: "2025-05-01T14:30:00Z",
        lookingForTeam: true
      },
      {
        id: "idea-2",
        author: "techstar",
        authorId: "default-user",
        title: "Community Food Sharing Platform",
        description: "A platform that connects restaurants and grocery stores with excess food to local shelters and food banks. The app would help reduce food waste while addressing food insecurity in communities.",
        tags: ["Social Impact", "Mobile", "Maps"],
        likes: 36,
        comments: 12,
        createdAt: "2025-04-27T09:15:00Z",
        lookingForTeam: false
      }
    ];
    localStorage.setItem("hackmap-shared-ideas", JSON.stringify(sharedIdeas));
  }
  
  console.log("Fresh data initialization complete");
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
