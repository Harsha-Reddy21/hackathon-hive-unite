
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Github, Globe, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  email: string;
  username?: string;
  isLoggedIn: boolean;
  bio?: string;
  github?: string;
  website?: string;
  skills?: string[];
  joinedDate?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  const [skillInput, setSkillInput] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("hackmap-user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      // Add mock data for the profile
      const enhancedUserData = {
        ...parsedUserData,
        bio: parsedUserData.bio || "No bio added yet",
        github: parsedUserData.github || "",
        website: parsedUserData.website || "",
        skills: parsedUserData.skills || ["JavaScript", "React", "Node.js"],
        joinedDate: parsedUserData.joinedDate || new Date().toISOString().split('T')[0]
      };
      setUserData(enhancedUserData);
      setEditedData(enhancedUserData);
    }
  }, []);

  const handleSaveProfile = () => {
    if (userData && editedData) {
      const updatedUserData = { ...userData, ...editedData };
      localStorage.setItem("hackmap-user", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };
  
  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    
    const skills = [...(editedData.skills || [])];
    if (!skills.includes(skill)) {
      const newSkills = [...skills, skill];
      setEditedData({ ...editedData, skills: newSkills });
      setSkillInput("");
    }
  };
  
  const removeSkill = (skill: string) => {
    const skills = [...(editedData.skills || [])];
    const newSkills = skills.filter(s => s !== skill);
    setEditedData({ ...editedData, skills: newSkills });
  };

  if (!userData) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Please log in to view your profile</h1>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            ) : (
              "Edit Profile"
            )}
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <Input 
                        id="username" 
                        value={editedData.username || ""} 
                        onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <Textarea 
                        id="bio" 
                        value={editedData.bio || ""} 
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">{userData.username || "User"}</h2>
                    <p className="text-gray-600 mt-2">{userData.bio}</p>
                    <div className="flex items-center text-gray-500 mt-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Joined {new Date(userData.joinedDate || "").toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <p>{userData.email}</p>
                </div>
                
                {isEditing ? (
                  <>
                    <div>
                      <label htmlFor="github" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Github className="h-4 w-4 mr-2" /> GitHub
                      </label>
                      <Input 
                        id="github" 
                        value={editedData.github || ""} 
                        onChange={(e) => setEditedData({ ...editedData, github: e.target.value })}
                        placeholder="Your GitHub username"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Globe className="h-4 w-4 mr-2" /> Website
                      </label>
                      <Input 
                        id="website" 
                        value={editedData.website || ""} 
                        onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                        placeholder="Your personal website URL"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {userData.github && (
                      <div className="flex items-center">
                        <Github className="h-4 w-4 text-gray-500 mr-2" />
                        <p>{userData.github}</p>
                      </div>
                    )}
                    {userData.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-500 mr-2" />
                        <p>{userData.website}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                  <Button onClick={() => addSkill(skillInput)}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {editedData.skills?.map((skill) => (
                    <Badge key={skill} className="bg-hackmap-purple hover:bg-hackmap-purple/90 cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userData.skills?.map((skill) => (
                  <Badge key={skill} className="bg-hackmap-purple">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
