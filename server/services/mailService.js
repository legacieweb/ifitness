const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev';

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY is missing. Email notifications will not be sent.');
} else {
  console.log('✅ Email service (Resend) is ready to send emails');
}

const sendSignUpEmail = async (userEmail, userName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to iFitness! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for signing up for iFitness! We're excited to have you on board.</p>
            <p>Your account has been created and you can now start tracking your fitness journey with us.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>Log your workouts and track your progress</li>
              <li>Set fitness goals and monitor your achievements</li>
              <li>Join bootcamps and connect with other fitness enthusiasts</li>
              <li>View detailed analytics of your fitness activities</li>
            </ul>
            <p>Get started by logging in to your account and creating your first workout!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn">Go to Dashboard</a>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 iFitness. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'Welcome to iFitness!',
      html: htmlContent,
    });
    console.log(`✅ Sign-up email sent to ${userEmail}. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Failed to send sign-up email to', userEmail, ':', error.message);
    throw error;
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
            <p>&copy; 2025 iFitness. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `🔥 You're Invited to ${bootcampName}!`,
      html: htmlContent,
    });
    console.log(`✅ Bootcamp invitation email sent to ${userEmail}. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Failed to send bootcamp invitation email to', userEmail, ':', error.message);
    throw error;
  }
};

const sendBootcampAcceptanceEmail = async (userEmail, userName, bootcampName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Bootcamp Accepted!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Congratulations! You have successfully accepted the <strong>${bootcampName}</strong> bootcamp.</p>
            <div class="success-box">
              <h3>🎉 You're All Set!</h3>
              <p>You're now registered for this exciting bootcamp. This is a great opportunity to:</p>
              <ul>
                <li>Push your fitness limits</li>
                <li>Connect with other fitness enthusiasts</li>
                <li>Achieve your fitness goals</li>
                <li>Earn amazing achievements</li>
              </ul>
            </div>
            <p>Get ready for an incredible experience! Check your dashboard for more details about the bootcamp.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">View Your Dashboard</a>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">If you have any questions about the bootcamp, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 iFitness. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `✅ Bootcamp Accepted: ${bootcampName}`,
      html: htmlContent,
    });
    console.log(`✅ Bootcamp acceptance email sent to ${userEmail}. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Failed to send bootcamp acceptance email to', userEmail, ':', error.message);
    throw error;
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
            <p>We regret to inform you that your iFitness account has been suspended.</p>
            <div class="warning-box">
              <h3>Suspension Reason:</h3>
              <p>${reason}</p>
            </div>
            <p>If you believe this suspension is a mistake, please contact our support team immediately at support@ifitness.com</p>
            <p>Your account will remain locked until further notice from our administrators.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 iFitness. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'Your iFitness Account Has Been Suspended',
      html: htmlContent,
    });
    console.log(`✅ Suspension email sent to ${userEmail}. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Failed to send suspension email to', userEmail, ':', error.message);
    throw error;
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
            <p>Great news! Your iFitness account has been unsuspended and is now active again.</p>
            <p>You can now log in and continue your fitness journey with us.</p>
            <p>We look forward to seeing you back on the platform!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn">Log In to Your Account</a>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">If you have any questions, please don't hesitate to contact our support team at support@ifitness.com</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 iFitness. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'Your iFitness Account Has Been Restored',
      html: htmlContent,
    });
    console.log(`✅ Unsuspension email sent to ${userEmail}. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Failed to send unsuspension email to', userEmail, ':', error.message);
    throw error;
  }
};

module.exports = {
  sendSignUpEmail,
  sendBootcampInvitationEmail,
  sendBootcampAcceptanceEmail,
  sendSuspensionEmail,
  sendUnsuspensionEmail,
};
