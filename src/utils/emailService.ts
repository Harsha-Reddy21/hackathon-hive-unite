
// Simple email service utility to simulate sending emails

export interface EmailDetails {
  to: string;
  subject: string;
  body: string;
}

/**
 * Simulate sending an email notification
 * In a real application, this would connect to an email service API
 */
export const sendEmail = (details: EmailDetails): Promise<boolean> => {
  console.log('Sending email notification...');
  console.log('To:', details.to);
  console.log('Subject:', details.subject);
  console.log('Body:', details.body);
  
  // In a real implementation, this would use an email API
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      console.log('Email sent successfully!');
      resolve(true);
    }, 500);
  });
};

/**
 * Send team invitation email
 */
export const sendTeamInviteEmail = async (
  username: string, 
  teamName: string, 
  hackathonName: string,
  inviteCode?: string
): Promise<boolean> => {
  // In a real app, you'd fetch the user's email from your database
  // For this demo, we'll assume username is the email address
  const userEmail = username.includes('@') ? username : `${username}@example.com`;
  
  const emailDetails: EmailDetails = {
    to: userEmail,
    subject: `You've been invited to join ${teamName}!`,
    body: `
      Hello ${username},
      
      You've been invited to join the team "${teamName}" for the "${hackathonName}" hackathon.
      
      ${inviteCode ? `Your invite code is: ${inviteCode}` : ''}
      
      Click here to accept or decline this invitation: [link to team page]
      
      If you have any questions, please contact the team leader.
      
      Best regards,
      The HackMap Team
    `
  };
  
  return sendEmail(emailDetails);
};

/**
 * Send notification about a join request
 */
export const sendJoinRequestEmail = async (
  teamLeaderEmail: string,
  requestingUsername: string,
  teamName: string
): Promise<boolean> => {
  const emailDetails: EmailDetails = {
    to: teamLeaderEmail,
    subject: `New request to join your team ${teamName}`,
    body: `
      Hello,
      
      ${requestingUsername} has requested to join your team "${teamName}".
      
      Click here to review this request: [link to team management page]
      
      Best regards,
      The HackMap Team
    `
  };
  
  return sendEmail(emailDetails);
};

/**
 * Send notification when a request is accepted
 */
export const sendRequestAcceptedEmail = async (
  username: string,
  teamName: string,
  hackathonName: string
): Promise<boolean> => {
  // In a real app, you'd fetch the user's email from your database
  const userEmail = username.includes('@') ? username : `${username}@example.com`;
  
  const emailDetails: EmailDetails = {
    to: userEmail,
    subject: `Your request to join ${teamName} has been accepted!`,
    body: `
      Hello ${username},
      
      Great news! Your request to join "${teamName}" for the "${hackathonName}" hackathon has been accepted.
      
      Click here to view your team: [link to team page]
      
      Best regards,
      The HackMap Team
    `
  };
  
  return sendEmail(emailDetails);
};
