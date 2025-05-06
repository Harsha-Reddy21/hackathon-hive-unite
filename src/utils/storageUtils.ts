
/**
 * Utility functions for handling data storage operations with Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Export supabase for use in other files
export { supabase };

// Check if supabase configuration is valid
const isSupabaseConfigured = true; // We're now using the configured client

// Initialize local storage for fallback (used when Supabase is not available)
export const initializeLocalStorage = () => {
  console.info("Initializing local storage fallback...");
  // This is just a placeholder function to maintain compatibility
  // with existing code. We're fully using Supabase now.
};

// Initialize database tables if needed
export const initializeDatabase = async () => {
  console.info("Checking database tables...");
  
  try {
    // Verify connection is working
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    } else {
      console.info("Supabase connection successful");
      return true;
    }
  } catch (err) {
    console.error("Database initialization error:", err);
    return false;
  }
};

// Type definitions for better type safety
export interface TeamMember {
  id: string;
  username: string;
  role: string;
}

export interface Invitation {
  username: string;
  invitedAt: string;
  status: "pending" | "accepted" | "declined";
}

export interface JoinRequest {
  id: string;
  userId: string;
  username: string;
  requestDate: string;
}

// Get the current user data
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get additional user data from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      return { ...user, ...profile };
    }
  } catch (err) {
    console.error("Error getting current user:", err);
    throw err;
  }
  
  return null;
};

// Helper functions for type-safe parsing of JSON fields
export const parseMembers = (data: Json | null): TeamMember[] => {
  if (!data) return [];
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    if (Array.isArray(data)) {
      // Type cast with explicit mapping to ensure correct structure
      return data.map(member => {
        if (typeof member === 'object' && member !== null) {
          const m = member as Record<string, any>;
          return {
            id: String(m.id || ''),
            username: String(m.username || ''),
            role: String(m.role || '')
          };
        }
        return {
          id: '',
          username: '',
          role: ''
        };
      });
    }
    
    return [];
  } catch (e) {
    console.error("Error parsing members:", e);
    return [];
  }
};

export const parseInvitations = (data: Json | null): Invitation[] => {
  if (!data) return [];
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    if (Array.isArray(data)) {
      // Type cast with explicit mapping to ensure correct structure
      return data.map(item => {
        // Ensure the item has the correct shape
        if (typeof item === 'object' && item !== null) {
          const invitation = item as Record<string, any>;
          return {
            username: String(invitation.username || ''),
            invitedAt: String(invitation.invitedAt || invitation.invited_at || new Date().toISOString()),
            status: (invitation.status as "pending" | "accepted" | "declined") || "pending"
          };
        }
        return {
          username: '',
          invitedAt: new Date().toISOString(),
          status: "pending" as const
        };
      });
    }
    
    return [];
  } catch (e) {
    console.error("Error parsing invitations:", e);
    return [];
  }
};

export const parseJoinRequests = (data: Json | null): JoinRequest[] => {
  if (!data) return [];
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    if (Array.isArray(data)) {
      // Type cast with explicit mapping to ensure correct structure
      return data.map(item => {
        if (typeof item === 'object' && item !== null) {
          const req = item as Record<string, any>;
          return {
            id: String(req.id || ''),
            userId: String(req.userId || req.user_id || ''),
            username: String(req.username || ''),
            requestDate: String(req.requestDate || req.request_date || new Date().toISOString())
          };
        }
        return {
          id: '',
          userId: '',
          username: '',
          requestDate: ''
        };
      });
    }
    
    return [];
  } catch (e) {
    console.error("Error parsing join requests:", e);
    return [];
  }
};

export const parseSkills = (data: Json | null): string[] => {
  if (!data) return [];
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(skill => String(skill));
    }
    
    return [];
  } catch (e) {
    console.error("Error parsing skills:", e);
    return [];
  }
};

// Update user in the database
export const updateUserInStorage = async (updatedUser: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedUser)
      .eq('id', updatedUser.id)
      .select();
      
    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }
    
    toast.success("User profile updated successfully");
    return data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

// Get all hackathons
export const getAllHackathons = async () => {
  try {
    console.log("Fetching all hackathons from Supabase");
    const { data, error } = await supabase
      .from('hackathons')
      .select('*');
      
    if (error) {
      console.error("Error fetching hackathons:", error);
      throw error;
    }
    
    console.log("Hackathons fetched:", data);
    return data || [];
  } catch (err) {
    console.error("Error fetching hackathons:", err);
    throw err;
  }
};

// Add a hackathon to the database
export const addHackathonToStorage = async (hackathon: any) => {
  console.log("Adding hackathon to storage:", hackathon);
  try {
    // Ensure proper structure for Supabase
    const formattedHackathon = {
      name: hackathon.title || hackathon.name,
      description: hackathon.description,
      location: hackathon.location,
      start_date: hackathon.startDate || hackathon.start_date,
      end_date: hackathon.endDate || hackathon.end_date,
      organizer_id: hackathon.organizerId || hackathon.organizer_id
    };

    const { data, error } = await supabase
      .from('hackathons')
      .insert(formattedHackathon)
      .select();
      
    if (error) {
      console.error("Error adding hackathon:", error);
      toast.error("Failed to create hackathon");
      throw error;
    }
    
    toast.success("Hackathon created successfully");
    console.log("Hackathon created:", data);
    
    return data[0];
  } catch (err) {
    console.error("Error adding hackathon:", err);
    throw err;
  }
};

// Add a team to the database
export const addTeamToStorage = async (team: any) => {
  console.log("Adding team to storage:", team);
  try {
    // Ensure the data is properly formatted for Supabase
    // Make sure JSON fields are properly formatted
    const formattedTeam = {
      ...team,
      members: typeof team.members === 'string' ? team.members : JSON.stringify(team.members),
      skills: typeof team.skills === 'string' ? team.skills : JSON.stringify(team.skills),
      invitations: typeof team.invitations === 'string' ? team.invitations : JSON.stringify(team.invitations),
      join_requests: typeof team.join_requests === 'string' ? team.join_requests : JSON.stringify(team.join_requests || [])
    };
    
    console.log("Formatted team for Supabase:", formattedTeam);
    
    const { data, error } = await supabase
      .from('teams')
      .insert(formattedTeam)
      .select();
      
    if (error) {
      console.error("Error adding team:", error);
      toast.error("Failed to create team");
      throw error;
    }
    
    toast.success("Team created successfully");
    console.log("Team created:", data);
    
    return data[0];
  } catch (err) {
    console.error("Error adding team:", err);
    throw err;
  }
};

// Get all teams
export const getAllTeams = async () => {
  try {
    console.log("Fetching all teams from Supabase");
    const { data, error } = await supabase
      .from('teams')
      .select('*');
      
    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
    
    console.log("Teams fetched:", data);
    return data || [];
  } catch (err) {
    console.error("Error fetching teams:", err);
    throw err;
  }
};

// Get team by ID
export const getTeamById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching team:", error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching team:", err);
    throw err;
  }
};

// Get hackathon by ID
export const getHackathonById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching hackathon:", error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching hackathon:", err);
    throw err;
  }
};

// Update team in database
export const updateTeamInStorage = async (updatedTeam: any) => {
  try {
    // Ensure the data is properly formatted for Supabase
    const formattedTeam = {
      ...updatedTeam,
      members: typeof updatedTeam.members === 'string' ? updatedTeam.members : JSON.stringify(updatedTeam.members),
      skills: typeof updatedTeam.skills === 'string' ? updatedTeam.skills : JSON.stringify(updatedTeam.skills),
      invitations: typeof updatedTeam.invitations === 'string' ? updatedTeam.invitations : JSON.stringify(updatedTeam.invitations),
      join_requests: typeof updatedTeam.join_requests === 'string' ? updatedTeam.join_requests : JSON.stringify(updatedTeam.join_requests || [])
    };
    
    const { data, error } = await supabase
      .from('teams')
      .update(formattedTeam)
      .eq('id', updatedTeam.id)
      .select();
      
    if (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
      throw error;
    }
    
    toast.success("Team updated successfully");
    
    return data[0];
  } catch (err) {
    console.error("Error updating team:", err);
    throw err;
  }
};

// Get teams for a specific hackathon
export const getTeamsByHackathonId = async (hackathonId: string) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('hackathon_id', hackathonId);
      
    if (error) {
      console.error("Error fetching teams by hackathon:", error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Error fetching teams by hackathon:", err);
    throw err;
  }
};
