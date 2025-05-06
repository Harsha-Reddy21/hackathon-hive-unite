
/**
 * Utility functions for handling data storage operations with Supabase
 */
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables if needed
export const initializeDatabase = async () => {
  console.info("Checking database tables...");
  
  // This function would normally create tables if they don't exist,
  // but with Supabase we usually create tables through the dashboard
  // This is just a placeholder for any initialization logic
  
  console.info("Database initialization complete");
};

// Get the current user data
export const getCurrentUser = async () => {
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
  
  return null;
};

// Update user in the database
export const updateUserInStorage = async (updatedUser) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updatedUser)
    .eq('id', updatedUser.id);
    
  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }
  
  return data;
};

// Add a hackathon to the database
export const addHackathonToStorage = async (hackathon) => {
  const { data, error } = await supabase
    .from('hackathons')
    .insert(hackathon)
    .select();
    
  if (error) {
    console.error("Error adding hackathon:", error);
    throw error;
  }
  
  return data[0];
};

// Add a team to the database
export const addTeamToStorage = async (team) => {
  const { data, error } = await supabase
    .from('teams')
    .insert(team)
    .select();
    
  if (error) {
    console.error("Error adding team:", error);
    throw error;
  }
  
  return data[0];
};

// Get all hackathons
export const getAllHackathons = async () => {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*');
    
  if (error) {
    console.error("Error fetching hackathons:", error);
    throw error;
  }
  
  return data || [];
};

// Get all teams
export const getAllTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*');
    
  if (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
  
  return data || [];
};

// Get team by ID
export const getTeamById = async (id) => {
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
};

// Get hackathon by ID
export const getHackathonById = async (id) => {
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
};

// Update team in database
export const updateTeamInStorage = async (updatedTeam) => {
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
};

// Get teams for a specific hackathon
export const getTeamsByHackathonId = async (hackathonId) => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('hackathonId', hackathonId);
    
  if (error) {
    console.error("Error fetching teams by hackathon:", error);
    throw error;
  }
  
  return data || [];
};
