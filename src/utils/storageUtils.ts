
/**
 * Utility functions for handling data storage operations with Supabase
 */
import { supabase } from '@/integrations/supabase/client';

// Export supabase for use in other files
export { supabase };

// Check if supabase configuration is valid
const isSupabaseConfigured = true; // We're now using the configured client

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

// For backwards compatibility with code that was using localStorage
export const initializeLocalStorage = () => {
  console.info("initializeLocalStorage called - using Supabase database");
  // Initialize local data if needed for fallback
  const teams = localStorage.getItem("hackmap-teams");
  if (!teams) {
    console.info("Initializing fresh teams data");
    localStorage.setItem("hackmap-teams", JSON.stringify([]));
  }
  
  const hackathons = localStorage.getItem("hackmap-hackathons");
  if (!hackathons) {
    console.info("Initializing fresh hackathons data");
    localStorage.setItem("hackmap-hackathons", JSON.stringify([]));
  }
  
  const user = localStorage.getItem("hackmap-user");
  if (!user) {
    console.info("Initializing fresh user data");
    localStorage.setItem("hackmap-user", JSON.stringify(null));
  }
  
  const ideas = localStorage.getItem("hackmap-shared-ideas");
  if (!ideas) {
    console.info("Initializing fresh ideas data");
    localStorage.setItem("hackmap-shared-ideas", JSON.stringify([]));
  }
  
  console.info("Fresh data initialization complete");
};

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
    // Fallback to localStorage
    const userData = localStorage.getItem("hackmap-user");
    return userData ? JSON.parse(userData) : null;
  }
  
  return null;
};

// Update user in the database
export const updateUserInStorage = async (updatedUser: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedUser)
      .eq('id', updatedUser.id);
      
    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error updating user:", err);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem("hackmap-users") || "[]");
    const updatedUsers = users.map((user: any) => 
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem("hackmap-users", JSON.stringify(updatedUsers));
    return updatedUser;
  }
};

// Add a hackathon to the database
export const addHackathonToStorage = async (hackathon: any) => {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .insert(hackathon)
      .select();
      
    if (error) {
      console.error("Error adding hackathon:", error);
      throw error;
    }
    
    return data[0];
  } catch (err) {
    console.error("Error adding hackathon:", err);
    // Fallback to localStorage
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    const newHackathon = { ...hackathon, id: `hack-${Date.now()}` };
    hackathons.push(newHackathon);
    localStorage.setItem("hackmap-hackathons", JSON.stringify(hackathons));
    return newHackathon;
  }
};

// Add a team to the database
export const addTeamToStorage = async (team: any) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select();
      
    if (error) {
      console.error("Error adding team:", error);
      throw error;
    }
    
    return data[0];
  } catch (err) {
    console.error("Error adding team:", err);
    // Fallback to localStorage
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    const newTeam = { ...team, id: `team-${Date.now()}` };
    teams.push(newTeam);
    localStorage.setItem("hackmap-teams", JSON.stringify(teams));
    return newTeam;
  }
};

// Get all hackathons
export const getAllHackathons = async () => {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*');
      
    if (error) {
      console.error("Error fetching hackathons:", error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Error fetching hackathons:", err);
    // Fallback to localStorage
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    return hackathons;
  }
};

// Get all teams
export const getAllTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*');
      
    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Error fetching teams:", err);
    // Fallback to localStorage
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams;
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
      // Fallback to localStorage
      const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
      return teams.find((team: any) => team.id === id) || null;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching team:", err);
    // Fallback to localStorage
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams.find((team: any) => team.id === id) || null;
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
      // Fallback to localStorage
      const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
      return hackathons.find((hackathon: any) => hackathon.id === id) || null;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching hackathon:", err);
    // Fallback to localStorage
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    return hackathons.find((hackathon: any) => hackathon.id === id) || null;
  }
};

// Update team in database
export const updateTeamInStorage = async (updatedTeam: any) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update(updatedTeam)
      .eq('id', updatedTeam.id)
      .select();
      
    if (error) {
      console.error("Error updating team:", error);
      throw error;
    }
    
    return data[0];
  } catch (err) {
    console.error("Error updating team:", err);
    // Fallback to localStorage
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    const updatedTeams = teams.map((team: any) => 
      team.id === updatedTeam.id ? updatedTeam : team
    );
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    return updatedTeam;
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
    // Fallback to localStorage
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams.filter((team: any) => team.hackathonId === hackathonId);
  }
};
