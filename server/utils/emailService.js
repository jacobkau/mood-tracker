const nodemailer = require('nodemailer');

// Check if email credentials are available
const hasEmailCredentials = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

// Create transporter with Gmail configuration only if credentials are available
let transporter;

if (hasEmailCredentials()) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('Email transporter verification failed:', error.message);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });
} else {
  console.warn('Email credentials not found. Email functionality will be disabled.');
  console.warn('Please set EMAIL_USER and EMAIL_PASS environment variables.');
}

// Support email template
const sendSupportEmail = async ({ ticketId, name, email, subject, message }) => {
  if (!transporter) {
    console.warn('Email transporter not available. Skipping support email.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.SUPPORT_EMAIL || 'kaujacob4@gmail.com',
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
    console.error('Error sending support email:', error.message);
    return false; // Don't throw error, just return false
  }
};

// Support confirmation email to user
const sendSupportConfirmation = async ({ to, name, ticketId, subject }) => {
  if (!transporter) {
    console.warn('Email transporter not available. Skipping confirmation email.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    console.error('Error sending support confirmation:', error.message);
    return false;
  }
};

// Contact form email template
const sendContactEmail = async ({ name, email, subject, message, type }) => {
  if (!transporter) {
    console.warn('Email transporter not available. Skipping contact email.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com',
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
    console.error('Error sending contact email:', error.message);
    return false;
  }
};

// Newsletter welcome email
const sendNewsletterWelcome = async (email) => {
  if (!transporter) {
    console.warn('Email transporter not available. Skipping newsletter welcome.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    console.error('Error sending newsletter welcome:', error.message);
    return false;
  }
};

const sendVerificationEmail = async (to, link) => {
  if (!transporter) {
    console.warn("Email transporter not available. Skipping verification email.");
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #4F46E5;">Welcome!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; border-radius: 4px; text-decoration: none;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">If you did not create this account, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    return false;
  }
};


const sendReviewNotificationEmail = async (review) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: 'New Review Submission - Requires Approval',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Review Submitted</h2>
          <p>A user has submitted a new review that requires your approval.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Review Details:</h3>
            <p><strong>User:</strong> ${review.user.username} (${review.user.email})</p>
            <p><strong>Rating:</strong> ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
            <p><strong>Title:</strong> ${review.title}</p>
            <p><strong>Comment:</strong> ${review.comment}</p>
          </div>
          
          <p>Please log in to the admin panel to approve or reject this review.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><a href="${process.env.ADMIN_URL}/admin/reviews" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Panel</a></p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending review notification email:', error);
    throw error;
  }
};

const sendReviewResponseEmail = async (review, adminMessage) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: review.user.email,
      subject: 'Response to Your Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Response to Your Review</h2>
          <p>Dear ${review.user.username},</p>
          
          <p>Thank you for taking the time to review our service. Here's our response:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p><em>${adminMessage}</em></p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending review response email:', error);
    throw error;
  }
};




module.exports = {
  transporter,
  sendReviewNotificationEmail,
  hasEmailCredentials,
  sendReviewResponseEmail,
  sendSupportEmail,
  sendSupportConfirmation,
  sendContactEmail,
  sendNewsletterWelcome,
  sendVerificationEmail
};


