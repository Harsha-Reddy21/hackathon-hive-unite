
import { Hackathon } from "@/components/HackathonCard";

export const mockHackathons: Hackathon[] = [
  {
    id: "1",
    title: "Future Tech Summit",
    theme: "Quantum Computing and AI Integration",
    startDate: "2025-07-15",
    endDate: "2025-07-17",
    registrationDeadline: "2025-07-01",
    prizes: [
      { place: "1st Place", reward: "$20,000 and mentorship" },
      { place: "2nd Place", reward: "$10,000 and cloud credits" }
    ],
    tags: ["Quantum Computing", "AI", "Machine Learning"],
    participantCount: 350,
    location: "Boston, MA",
    schedule: [
      { 
        date: "2025-07-15", 
        events: [
          { time: "09:00 AM", title: "Opening Ceremony" },
          { time: "10:30 AM", title: "Team Formation" },
          { time: "01:00 PM", title: "Workshops Begin" }
        ]
      },
      { 
        date: "2025-07-16", 
        events: [
          { time: "09:00 AM", title: "Coding Day" },
          { time: "06:00 PM", title: "Mentor Sessions" }
        ]
      },
      { 
        date: "2025-07-17", 
        events: [
          { time: "10:00 AM", title: "Project Submissions" },
          { time: "02:00 PM", title: "Judging" },
          { time: "05:00 PM", title: "Award Ceremony" }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "GreenTech Challenge",
    theme: "Sustainable Solutions for Climate Action",
    startDate: "2025-08-20",
    endDate: "2025-08-22",
    registrationDeadline: "2025-08-05",
    prizes: [
      { place: "1st Place", reward: "$15,000 and accelerator program" },
      { place: "2nd Place", reward: "$7,500 and mentorship" }
    ],
    tags: ["Sustainability", "CleanTech", "IoT", "Data Science"],
    participantCount: 280,
    location: "Seattle, WA",
    schedule: [
      { 
        date: "2025-08-20", 
        events: [
          { time: "10:00 AM", title: "Kickoff and Team Formation" },
          { time: "02:00 PM", title: "Sustainability Workshop" }
        ]
      },
      { 
        date: "2025-08-21", 
        events: [
          { time: "All Day", title: "Hacking and Mentoring" }
        ]
      },
      { 
        date: "2025-08-22", 
        events: [
          { time: "11:00 AM", title: "Project Submissions" },
          { time: "03:00 PM", title: "Demo Day and Awards" }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "MedTech Innovation",
    theme: "Next Generation Healthcare Solutions",
    startDate: "2025-09-10",
    endDate: "2025-09-12",
    registrationDeadline: "2025-08-27",
    prizes: [
      { place: "1st Place", reward: "$25,000 and clinical trial opportunity" },
      { place: "2nd Place", reward: "$12,500 and incubator placement" }
    ],
    tags: ["Healthcare", "Wearables", "AI", "Telehealth"],
    participantCount: 220,
    location: "Minneapolis, MN",
    schedule: [
      { 
        date: "2025-09-10", 
        events: [
          { time: "08:30 AM", title: "Registration" },
          { time: "09:30 AM", title: "Opening Remarks" },
          { time: "10:30 AM", title: "Healthcare Challenges Presentation" }
        ]
      },
      { 
        date: "2025-09-11", 
        events: [
          { time: "09:00 AM", title: "Hacking Continues" },
          { time: "02:00 PM", title: "Healthcare Expert Office Hours" }
        ]
      },
      { 
        date: "2025-09-12", 
        events: [
          { time: "10:00 AM", title: "Final Submissions" },
          { time: "01:00 PM", title: "Presentations to Judges" },
          { time: "04:30 PM", title: "Awards Ceremony" }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "EdTech Revolution",
    theme: "Transforming Education with Technology",
    startDate: "2025-10-05",
    endDate: "2025-10-07",
    registrationDeadline: "2025-09-20",
    prizes: [
      { place: "1st Place", reward: "$18,000 and school district pilot" },
      { place: "2nd Place", reward: "$9,000 and publisher partnership" }
    ],
    tags: ["Education", "Accessibility", "AI", "Gamification"],
    participantCount: 190,
    location: "Austin, TX",
    schedule: [
      { 
        date: "2025-10-05", 
        events: [
          { time: "09:00 AM", title: "Welcome and Team Building" },
          { time: "12:00 PM", title: "Education Workshop" }
        ]
      },
      { 
        date: "2025-10-06", 
        events: [
          { time: "All Day", title: "Hacking and Mentorship" }
        ]
      },
      { 
        date: "2025-10-07", 
        events: [
          { time: "09:00 AM", title: "Submission Deadline" },
          { time: "11:00 AM", title: "Demos and Judging" },
          { time: "03:00 PM", title: "Closing and Awards" }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Fintech Forward",
    theme: "Financial Innovation for All",
    startDate: "2025-11-12",
    endDate: "2025-11-14",
    registrationDeadline: "2025-10-29",
    prizes: [
      { place: "1st Place", reward: "$30,000 and VC pitch opportunity" },
      { place: "2nd Place", reward: "$15,000 and accelerator program" }
    ],
    tags: ["Finance", "Blockchain", "Inclusion", "Security"],
    participantCount: 310,
    location: "New York, NY",
    schedule: [
      { 
        date: "2025-11-12", 
        events: [
          { time: "10:00 AM", title: "Opening Ceremony" },
          { time: "11:30 AM", title: "Financial Inclusion Panel" },
          { time: "01:30 PM", title: "Hacking Begins" }
        ]
      },
      { 
        date: "2025-11-13", 
        events: [
          { time: "09:00 AM", title: "Mentor Sessions" },
          { time: "04:00 PM", title: "Progress Check-in" }
        ]
      },
      { 
        date: "2025-11-14", 
        events: [
          { time: "10:00 AM", title: "Submission Deadline" },
          { time: "12:30 PM", title: "Demo Day" },
          { time: "05:00 PM", title: "Fintech Awards" }
        ]
      }
    ]
  }
];

export const upcomingHackathons = mockHackathons.filter(
  hackathon => new Date(hackathon.startDate) > new Date()
).sort((a, b) => 
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
);

// Add mock teams data
export const mockTeams = [
  {
    id: "team-1",
    name: "Code Wizards",
    hackathonName: "Future Tech Summit",
    hackathonId: "1",
    description: "Building an AI solution to help identify and reduce food waste in restaurants. Our team aims to create an innovative solution that uses computer vision and machine learning to analyze kitchen inventory and make recommendations for menu adjustments and food usage to minimize waste.",
    members: [
      { id: 1, name: "Alex Johnson", role: "Team Lead", skills: ["Frontend", "UX/UI", "React"], avatar: null },
      { id: 2, name: "Jamie Smith", role: "Backend Developer", skills: ["Node.js", "Database", "API"], avatar: null },
      { id: 3, name: "Taylor Brown", role: "UI/UX Designer", skills: ["Figma", "Prototyping", "User Research"], avatar: null }
    ],
    maxMembers: 5,
    skills: ["AI", "Machine Learning", "Backend", "UI/UX"],
    projectIdea: {
      title: "AI Food Waste Reducer",
      description: "An AI-powered system that helps restaurants reduce food waste through smart inventory management and predictive analytics.",
      techStack: ["TensorFlow", "React", "Node.js", "PostgreSQL"],
      progress: 35
    }
  },
  {
    id: "team-2",
    name: "Blockchain Pioneers",
    hackathonName: "GreenTech Challenge",
    hackathonId: "2",
    description: "Creating a decentralized marketplace for carbon credits using blockchain technology. Our project aims to make carbon offset trading more accessible, transparent, and efficient through smart contracts.",
    members: [
      { id: 4, name: "Robin Chen", role: "Blockchain Developer", skills: ["Solidity", "Web3", "Smart Contracts"], avatar: null },
      { id: 5, name: "Morgan Wilson", role: "Project Manager", skills: ["Agile", "Product Management", "Business Strategy"], avatar: null }
    ],
    maxMembers: 4,
    skills: ["Blockchain", "Smart Contracts", "Frontend", "Solidity"],
    projectIdea: {
      title: "Carbon Credit DEX",
      description: "A decentralized exchange for carbon credits that makes offset trading accessible and transparent.",
      techStack: ["Ethereum", "Solidity", "React", "Web3.js"],
      progress: 20
    }
  },
  {
    id: "team-3",
    name: "Health Innovators",
    hackathonName: "MedTech Innovation",
    hackathonId: "3",
    description: "Developing a mobile app for remote patient monitoring using IoT devices. Our application connects with various health monitoring devices to provide doctors with real-time patient data.",
    members: [
      { id: 6, name: "Jordan Lee", role: "Mobile Developer", skills: ["React Native", "IoT", "API Integration"], avatar: null },
      { id: 7, name: "Casey Kim", role: "Healthcare Specialist", skills: ["Medical Knowledge", "User Research", "Healthcare Regulations"], avatar: null },
      { id: 8, name: "Riley Patel", role: "Backend Developer", skills: ["Node.js", "MongoDB", "Security"], avatar: null }
    ],
    maxMembers: 4,
    skills: ["Mobile Dev", "IoT", "Healthcare", "Backend"],
    projectIdea: {
      title: "RemoteHealth Monitor",
      description: "A comprehensive platform connecting IoT health devices with healthcare providers for better remote patient monitoring.",
      techStack: ["React Native", "Node.js", "MongoDB", "IoT Protocols"],
      progress: 60
    }
  }
];

// Initialize the data in localStorage if using the application
if (typeof window !== 'undefined') {
  // Check if teams data exists in localStorage, if not, initialize it
  if (!localStorage.getItem('hackmap-teams')) {
    localStorage.setItem('hackmap-teams', JSON.stringify(mockTeams));
    console.log('Teams data initialized in localStorage');
  }
}
