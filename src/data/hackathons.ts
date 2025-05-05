
import { Hackathon } from "@/components/HackathonCard";

export const mockHackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI for Good Hackathon",
    theme: "Using AI to solve social problems",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    registrationDeadline: "2024-06-05",
    prizes: ["$10,000 Grand Prize", "Mentorship from Industry Leaders"],
    tags: ["AI", "Social Impact", "Machine Learning"],
    participantCount: 250
  },
  {
    id: "2",
    title: "Web3 Innovation Challenge",
    theme: "Building the decentralized future",
    startDate: "2024-06-20",
    endDate: "2024-06-22",
    registrationDeadline: "2024-06-15",
    prizes: ["$15,000 in ETH", "Accelerator Program Access"],
    tags: ["Blockchain", "Web3", "Ethereum", "DeFi"],
    participantCount: 320
  },
  {
    id: "3",
    title: "HealthTech Hackathon",
    theme: "Technology solutions for healthcare",
    startDate: "2024-07-05",
    endDate: "2024-07-07",
    registrationDeadline: "2024-06-30",
    prizes: ["$8,000 in Cash Prizes", "Pilot Program with Hospitals"],
    tags: ["Healthcare", "IoT", "Data Science", "Mobile"],
    participantCount: 180
  },
  {
    id: "4",
    title: "Climate Change Challenge",
    theme: "Tech solutions for environmental problems",
    startDate: "2024-07-15",
    endDate: "2024-07-18",
    registrationDeadline: "2024-07-10",
    prizes: ["$12,000 Grand Prize", "Sustainability Startup Incubation"],
    tags: ["Environment", "Sustainability", "IoT", "Data"],
    participantCount: 210
  },
  {
    id: "5",
    title: "EdTech Innovation Jam",
    theme: "Reimagining education with technology",
    startDate: "2024-07-25",
    endDate: "2024-07-27",
    registrationDeadline: "2024-07-20",
    prizes: ["$7,500 Cash Prize", "Partnership with Educational Institutions"],
    tags: ["Education", "Mobile", "AR/VR", "Gamification"],
    participantCount: 150
  },
  {
    id: "6",
    title: "FinTech Revolution",
    theme: "Disrupting financial services",
    startDate: "2024-08-05",
    endDate: "2024-08-08",
    registrationDeadline: "2024-07-30",
    prizes: ["$20,000 Investment Opportunity", "Financial Industry Mentors"],
    tags: ["Finance", "Blockchain", "AI", "Security"],
    participantCount: 280
  }
];

export const upcomingHackathons = mockHackathons.filter(
  hackathon => new Date(hackathon.startDate) > new Date()
).sort((a, b) => 
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
);
