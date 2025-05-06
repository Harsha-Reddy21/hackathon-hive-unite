
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
    location: "Boston, MA"
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
    location: "Seattle, WA"
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
    location: "Minneapolis, MN"
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
    location: "Austin, TX"
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
    location: "New York, NY"
  }
];

export const upcomingHackathons = mockHackathons.filter(
  hackathon => new Date(hackathon.startDate) > new Date()
).sort((a, b) => 
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
);
