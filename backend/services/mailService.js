const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendSignUpEmail = async (userEmail, userName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to FitnessPro!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for signing up for FitnessPro! We're excited to have you on board.</p>
            <p>Your account has been created and you can now start tracking your fitness journey with us.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>Log your workouts and track your progress</li>
              <li>Set fitness goals and monitor your achievements</li>
              <li>Join bootcamps and connect with other fitness enthusiasts</li>
              <li>View detailed analytics of your fitness activities</li>
            </ul>
            <p>Get started by logging in to your account and creating your first workout!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Dashboard</a>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 FitnessPro. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Welcome to FitnessPro!',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Sign-up email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send sign-up email:', error);
  }
};

const sendBootcampInvitationEmail = async (userEmail, userName, bootcampName, bootcampDetails) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 You're Invited to a Bootcamp!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Great news! You've been invited to join an exciting bootcamp: <strong>${bootcampName}</strong></p>
            <div class="details">
              <h3>${bootcampName}</h3>
              <div class="detail-item"><strong>Description:</strong> ${bootcampDetails.description}</div>
              <div class="detail-item"><strong>Difficulty:</strong> ${bootcampDetails.difficulty}</div>
              <div class="detail-item"><strong>Starts:</strong> ${new Date(bootcampDetails.startTime).toLocaleString()}</div>
              <div class="detail-item"><strong>Ends:</strong> ${new Date(bootcampDetails.endTime).toLocaleString()}</div>
              <div class="detail-item"><strong>What to Expect:</strong> ${bootcampDetails.expectations}</div>
            </div>
            <p>This is an amazing opportunity to push yourself and achieve your fitness goals!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">View Bootcamp</a>
          </div>
          <div class="footer">
            <p>&copy; 2025 FitnessPro. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `You're Invited to ${bootcampName}!`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Bootcamp invitation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send bootcamp invitation email:', error);
  }
};

const sendSuspensionEmail = async (userEmail, userName, reason) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⛔ Account Suspended</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We regret to inform you that your FitnessPro account has been suspended.</p>
            <div class="warning-box">
              <h3>Suspension Reason:</h3>
              <p>${reason}</p>
            </div>
            <p>If you believe this suspension is a mistake, please contact our support team immediately.</p>
            <p>Your account will remain locked until further notice from our administrators.</p>
            <p>If you have any questions or concerns, please reach out to our support team at support@fitnessPro.com</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 FitnessPro. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your FitnessPro Account Has Been Suspended',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Suspension email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send suspension email:', error);
  }
};

const sendUnsuspensionEmail = async (userEmail, userName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Account Unsuspended</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Great news! Your FitnessPro account has been unsuspended and is now active again.</p>
            <p>You can now log in and continue your fitness journey with us.</p>
            <p>We look forward to seeing you back on the platform!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn">Log In to Your Account</a>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">If you have any questions, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 FitnessPro. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your FitnessPro Account Has Been Restored',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Unsuspension email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send unsuspension email:', error);
  }
};

module.exports = {
  sendSignUpEmail,
  sendBootcampInvitationEmail,
  sendSuspensionEmail,
  sendUnsuspensionEmail,
};
