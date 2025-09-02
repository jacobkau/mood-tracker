const nodemailer = require('nodemailer');

// Create transporter with Mailtrap configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Mailtrap specific settings
  tls: {
    rejectUnauthorized: false // For development with Mailtrap
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Support email template
const sendSupportEmail = async ({ ticketId, name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SUPPORT_EMAIL,
    subject: `Support Ticket #${ticketId}: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Support Ticket Received</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
          <h3 style="color: #374151;">Message:</h3>
          <p style="color: #6B7280; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div style="margin-top: 30px; padding: 15px; background: #4F46E5; color: white; border-radius: 6px; text-align: center;">
          <p style="margin: 0;">Please respond to this ticket within 24 hours.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Support email sent for ticket ${ticketId}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending support email:', error);
    throw new Error('Failed to send support email');
  }
};

// Support confirmation email to user
const sendSupportConfirmation = async ({ to, name, ticketId, subject }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: `Support Request Received - Ticket #${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Thank You for Contacting Support</h2>
        <p>Hello ${name},</p>
        <p>We've received your support request and will get back to you within 24 hours.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Status:</strong> <span style="color: #059669;">Open</span></p>
        </div>
        
        <p>You can view the status of your ticket or add additional information by replying to this email.</p>
        
        <div style="margin-top: 30px; padding: 15px; background: #FEF3C7; border-radius: 6px;">
          <p style="margin: 0; color: #92400E;">
            <strong>Note:</strong> This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Support confirmation sent to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending support confirmation:', error);
    throw new Error('Failed to send confirmation email');
  }
};

// Contact form email template
const sendContactEmail = async ({ name, email, subject, message, type }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: `Contact Form: ${subject} (${type})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
          <h3 style="color: #374151;">Message:</h3>
          <p style="color: #6B7280; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Contact email sent from ${email}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact email');
  }
};

// Newsletter welcome email
const sendNewsletterWelcome = async (email) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome to Our Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Our Community! 🎉</h2>
        <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
        <ul>
          <li>Weekly mental health tips</li>
          <li>Latest blog posts and research</li>
          <li>Product updates and features</li>
          <li>Exclusive content and resources</li>
        </ul>
        <div style="background: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #065F46; margin: 0;">
            <strong>Tip:</strong> You can manage your subscription preferences at any time by clicking the unsubscribe link in any email.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Newsletter welcome sent to ${email}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending newsletter welcome:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  transporter,
  sendSupportEmail,
  sendSupportConfirmation,
  sendContactEmail,
  sendNewsletterWelcome
};
