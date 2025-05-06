
/**
 * Utility functions for handling data storage operations with Supabase
 */
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if supabase configuration is valid
const isSupabaseConfigured = supabaseUrl.includes('your-supabase-project-url.supabase.co') ? false : true;

// Initialize database tables if needed
export const initializeDatabase = async () => {
  console.info("Checking database tables...");
  
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using fallback storage.");
    return;
  }
  
  try {
    // This function would normally create tables if they don't exist,
    // but with Supabase we usually create tables through the dashboard
    // This is just a placeholder for any initialization logic
    
    // Verify connection is working
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.info("Supabase connection successful");
    }
  } catch (err) {
    console.error("Database initialization error:", err);
  }
  
  console.info("Database initialization complete");
};

// For backwards compatibility with code that was using localStorage
export const initializeLocalStorage = () => {
  console.info("initializeLocalStorage called - using Supabase database instead of localStorage");
  // This function is kept for backward compatibility only
  // We're now using Supabase for data storage, not localStorage
};

// Get the current user data
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const userData = localStorage.getItem("hackmap-user");
    return userData ? JSON.parse(userData) : null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get additional user data from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      return { ...user, ...profile };
    }
  } catch (err) {
    console.error("Error getting current user:", err);
  }
  
  return null;
};

// Update user in the database
export const updateUserInStorage = async (updatedUser) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const users = JSON.parse(localStorage.getItem("hackmap-users") || "[]");
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem("hackmap-users", JSON.stringify(updatedUsers));
    return updatedUser;
  }
  
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
    throw err;
  }
};

// Add a hackathon to the database
export const addHackathonToStorage = async (hackathon) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    const newHackathon = { ...hackathon, id: `hack-${Date.now()}` };
    hackathons.push(newHackathon);
    localStorage.setItem("hackmap-hackathons", JSON.stringify(hackathons));
    return newHackathon;
  }
  
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
    throw err;
  }
};

// Add a team to the database
export const addTeamToStorage = async (team) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    const newTeam = { ...team, id: `team-${Date.now()}` };
    teams.push(newTeam);
    localStorage.setItem("hackmap-teams", JSON.stringify(teams));
    return newTeam;
  }
  
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
    throw err;
  }
};

// Get all hackathons
export const getAllHackathons = async () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    return hackathons;
  }
  
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
    return [];
  }
};

// Get all teams
export const getAllTeams = async () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams;
  }
  
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
    return [];
  }
};

// Get team by ID
export const getTeamById = async (id) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams.find(team => team.id === id) || null;
  }
  
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching team:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching team:", err);
    return null;
  }
};

// Get hackathon by ID
export const getHackathonById = async (id) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const hackathons = JSON.parse(localStorage.getItem("hackmap-hackathons") || "[]");
    return hackathons.find(hackathon => hackathon.id === id) || null;
  }
  
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching hackathon:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Error fetching hackathon:", err);
    return null;
  }
};

// Update team in database
export const updateTeamInStorage = async (updatedTeam) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    const updatedTeams = teams.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    );
    localStorage.setItem("hackmap-teams", JSON.stringify(updatedTeams));
    return updatedTeam;
  }
  
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
    throw err;
  }
};

// Get teams for a specific hackathon
export const getTeamsByHackathonId = async (hackathonId) => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not properly configured. Using localStorage fallback.");
    const teams = JSON.parse(localStorage.getItem("hackmap-teams") || "[]");
    return teams.filter(team => team.hackathonId === hackathonId);
  }
  
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('hackathonId', hackathonId);
      
    if (error) {
      console.error("Error fetching teams by hackathon:", error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Error fetching teams by hackathon:", err);
    return [];
  }
};
