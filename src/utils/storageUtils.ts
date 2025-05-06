
/**
 * Utility functions for handling localStorage operations
 */

// Initialize key collections in localStorage if they don't exist
export const initializeLocalStorage = () => {
  console.info("Initializing localStorage if needed");
  
  if (!localStorage.getItem("hackmap-hackathons")) {
    console.info("Initializing fresh hackathons data");
    localStorage.setItem("hackmap-hackathons", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("hackmap-teams")) {
    console.info("Initializing fresh teams data");
    localStorage.setItem("hackmap-teams", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("hackmap-all-users")) {
    console.info("Initializing fresh user data");
    localStorage.setItem("hackmap-all-users", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("hackmap-shared-ideas")) {
    console.info("Initializing fresh ideas data");
    localStorage.setItem("hackmap-shared-ideas", JSON.stringify([]));
  }
  
  console.info("Fresh data initialization complete");
};

// Update user in both current user and all-users storage
export const updateUserInStorage = (updatedUser) => {
  // Update current user
  localStorage.setItem("hackmap-user", JSON.stringify(updatedUser));
  
  // Update in all users array
  const allUsersData = localStorage.getItem("hackmap-all-users");
  if (allUsersData) {
    const allUsers = JSON.parse(allUsersData);
    const updatedAllUsers = allUsers.map((u) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("hackmap-all-users", JSON.stringify(updatedAllUsers));
  }
  
  // Trigger storage event
  window.dispatchEvent(new Event('storage'));
};

// Get the current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem("hackmap-user");
  return userData ? JSON.parse(userData) : null;
};

// Add a hackathon to storage
export const addHackathonToStorage = (hackathon) => {
  const hackathonsData = localStorage.getItem("hackmap-hackathons");
  const hackathons = hackathonsData ? JSON.parse(hackathonsData) : [];
  hackathons.push(hackathon);
  localStorage.setItem("hackmap-hackathons", JSON.stringify(hackathons));
  return hackathon;
};

// Add a team to storage
export const addTeamToStorage = (team) => {
  const teamsData = localStorage.getItem("hackmap-teams");
  const teams = teamsData ? JSON.parse(teamsData) : [];
  teams.push(team);
  localStorage.setItem("hackmap-teams", JSON.stringify(teams));
  return team;
};

// Get all hackathons
export const getAllHackathons = () => {
  const hackathonsData = localStorage.getItem("hackmap-hackathons");
  return hackathonsData ? JSON.parse(hackathonsData) : [];
};

// Get all teams
export const getAllTeams = () => {
  const teamsData = localStorage.getItem("hackmap-teams");
  return teamsData ? JSON.parse(teamsData) : [];
};
