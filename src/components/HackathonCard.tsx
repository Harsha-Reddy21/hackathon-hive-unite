
import { Calendar, Award, Tag, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface Hackathon {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  prizes?: string[];
  tags?: string[];
  participantCount?: number;
  description?: string;
  location?: string;
  organizer?: string;
  website?: string;
  teams?: string[];
  sponsors?: string[];
}

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const formattedStartDate = new Date(hackathon.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedEndDate = new Date(hackathon.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">{hackathon.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{hackathon.theme}</p>
      </CardHeader>
      <CardContent className="pb-4 space-y-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-hackmap-purple" />
          <span>
            {formattedStartDate} - {formattedEndDate}
          </span>
        </div>
        {hackathon.prizes && hackathon.prizes.length > 0 && (
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-hackmap-blue" />
            <span>{typeof hackathon.prizes[0] === 'string' ? hackathon.prizes[0] : (hackathon.prizes[0] as any).reward}</span>
          </div>
        )}
        {hackathon.participantCount && (
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>{hackathon.participantCount} participants</span>
          </div>
        )}
        {hackathon.tags && hackathon.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center text-sm mr-2">
              <Tag className="h-4 w-4 mr-1 text-gray-500" />
            </div>
            {hackathon.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-muted text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link to={`/hackathons/${hackathon.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HackathonCard;
