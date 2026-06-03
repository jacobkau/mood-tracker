const nodemailer = require('nodemailer');

// Check if Gmail credentials are available
const hasEmailCredentials = () => {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
};

// Create transporter with optimized settings for serverless
let transporter;
let transporterPromise = null;

const getTransporter = async () => {
  if (transporter) return transporter;
  
  if (!hasEmailCredentials()) {
    console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not found.');
    console.warn('To set up:');
    console.warn('1. Enable 2-Factor Authentication on your Google account');
    console.warn('2. Generate an App Password at https://myaccount.google.com/apppasswords');
    console.warn('3. Add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file');
    return null;
  }

  // Create transporter with better timeout settings
  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    pool: false, // Disable connection pooling for serverless
    maxConnections: 1,
    maxMessages: 1,
    timeout: 30000, // 30 seconds timeout
    socketTimeout: 30000,
    connectionTimeout: 30000,
    tls: {
      rejectUnauthorized: false // Sometimes needed for some hosting environments
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Gmail transporter initialized and verified successfully');
  } catch (error) {
    console.error('❌ Gmail transporter verification failed:', error.message);
    transporter = null;
    return null;
  }
  
  return transporter;
};

// Helper function to get sender email
const getSenderEmail = () => {
  return process.env.GMAIL_USER || 'your-email@gmail.com';
};

// Send email helper function with retry logic
const sendEmail = async (to, subject, html, fromName = 'Witty MoodTracker', retries = 2) => {
  const currentTransporter = await getTransporter();
  
  if (!currentTransporter) {
    console.warn("⚠️ Gmail not configured. Skipping email.");
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📧 Sending email to ${to} (attempt ${attempt}/${retries})...`);
      
      const info = await currentTransporter.sendMail({
        from: `${fromName} <${getSenderEmail()}>`,
        to: to,
        subject: subject,
        html: html,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High'
        }
      });
      
      console.log(`✅ Email sent successfully to ${to}`, info.messageId);
      return true;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        console.error(`❌ All ${retries} attempts failed for ${to}`);
        return false;
      }
      
      // Wait before retry (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Recreate transporter on failure (might help with connection issues)
      transporter = null;
    }
  }
  
  return false;
};

// Base email template with consistent styling
const baseEmailTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .email-body {
            padding: 40px 30px;
        }
        .email-section {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .email-section h3 {
            color: #2d3748;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .email-footer {
            background: #2d3748;
            color: #cbd5e0;
            padding: 25px 30px;
            text-align: center;
            font-size: 14px;
        }
        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }
        .btn-primary {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 10px 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            background: #ffffff;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .info-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-value {
            color: #2d3748;
            font-size: 14px;
            margin-top: 5px;
        }
        .priority-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #fed7d7;
            color: #c53030;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        .success-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #c6f6d5;
            color: #2f855a;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${title}</h1>
        </div>
        <div class="email-body">
            ${content}
        </div>
        <div class="email-footer">
            <p>© ${new Date().getFullYear()} Witty MoodTracker. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Contact us: <a href="mailto:${process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com'}">${process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com'}</a></p>
        </div>
    </div>
</body>
</html>
`;

// Verification email
const sendVerificationEmail = async (to, link) => {
  console.log(`🔍 Attempting to send verification email to: ${to}`);
  console.log(`🔍 Link: ${link}`);
  
  const hasTransporter = await getTransporter();
  console.log(`🔍 Has Gmail transporter? ${!!hasTransporter}`);
  
  if (!hasTransporter) {
    console.warn("⚠️ Gmail not configured. Skipping verification email.");
    return false;
  }

  const content = `
    <div class="email-section">
        <h3>✅ Verify Your Email Address</h3>
        <p>Welcome to MoodTracker! To complete your registration and start your mental wellness journey, please verify your email address.</p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
        <a href="${link}" class="btn-primary" style="font-size: 16px; padding: 15px 40px;">
            Verify Email Address
        </a>
        <p style="color: #718096; margin-top: 20px; font-size: 14px;">
            This link will expire in 1 hour for your security.
        </p>
    </div>

    <div class="email-section">
        <h3>🔒 Security Notice</h3>
        <p>If you didn't create this account, please ignore this email. Your email address was used to register for MoodTracker, but no action is required if this wasn't you.</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #4a5568;">Need help? Contact our support team at <a href="mailto:${process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com'}">${process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com'}</a></p>
    </div>
  `;

  return await sendEmail(
    to,
    "🔐 Verify Your Witty MoodTracker Account",
    baseEmailTemplate(content, 'Email Verification')
  );
};

// Support email template
const sendSupportEmail = async ({ ticketId, name, email, subject, message }) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping support email.');
    return false;
  }

  const content = `
    <div class="email-section">
        <h3>🚨 New Support Ticket Received</h3>
        <p>A user has submitted a new support request that requires your attention.</p>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Ticket ID</div>
            <div class="info-value">#${ticketId}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Priority</div>
            <div class="info-value"><span class="priority-badge">High</span></div>
        </div>
        <div class="info-item">
            <div class="info-label">Customer Name</div>
            <div class="info-value">${name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value"><a href="mailto:${email}">${email}</a></div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
            <div class="info-label">Subject</div>
            <div class="info-value">${subject}</div>
        </div>
    </div>

    <div class="email-section">
        <h3>📋 Message Details</h3>
        <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #4a5568; margin-bottom: 20px;">Please respond to this ticket within 24 hours.</p>
        <a href="mailto:${email}" class="btn-primary">Reply to Customer</a>
    </div>
  `;

  return await sendEmail(
    process.env.SUPPORT_EMAIL || 'kaujacob4@gmail.com',
    `🚨 Support Ticket #${ticketId}: ${subject}`,
    baseEmailTemplate(content, 'New Support Ticket'),
    'MoodTracker Support'
  );
};

// Support confirmation email to user
const sendSupportConfirmation = async ({ to, name, ticketId, subject }) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping confirmation email.');
    return false;
  }

  const content = `
    <div class="email-section">
        <h3>✅ Support Request Received</h3>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to our support team. We've received your request and will get back to you within 24 hours.</p>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Ticket ID</div>
            <div class="info-value">#${ticketId}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value"><span class="success-badge">In Progress</span></div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
            <div class="info-label">Subject</div>
            <div class="info-value">${subject}</div>
        </div>
    </div>

    <div class="email-section">
        <h3>📋 What to Expect Next</h3>
        <ul style="margin: 0; padding-left: 20px;">
            <li>Our support team will review your request</li>
            <li>You'll receive a personalized response within 24 hours</li>
            <li>We may follow up with additional questions if needed</li>
            <li>Your ticket will be marked as resolved once your issue is addressed</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #4a5568;">You can add additional information by replying to this email.</p>
    </div>
  `;

  return await sendEmail(
    to,
    `✅ Support Request Received - Ticket #${ticketId}`,
    baseEmailTemplate(content, 'Support Request Confirmation'),
    'MoodTracker Support'
  );
};

// Contact form email template
const sendContactEmail = async ({ name, email, subject, message, type }) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping contact email.');
    return false;
  }

  const isPartnership = type === 'partnership';
  const emailType = isPartnership ? 'Partnership Inquiry' : 'Contact Form Submission';

  const content = `
    <div class="email-section">
        <h3>${isPartnership ? '🤝 New Partnership Opportunity' : '📧 New Contact Form Submission'}</h3>
        <p>A new ${isPartnership ? 'potential partner' : 'visitor'} has reached out through our website.</p>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Type</div>
            <div class="info-value">${isPartnership ? 'Partnership' : 'General Contact'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Priority</div>
            <div class="info-value"><span class="${isPartnership ? 'priority-badge' : 'success-badge'}">${isPartnership ? 'High' : 'Normal'}</span></div>
        </div>
        <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value"><a href="mailto:${email}">${email}</a></div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
            <div class="info-label">Subject</div>
            <div class="info-value">${subject}</div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
            <div class="info-label">Received</div>
            <div class="info-value">${new Date().toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            })}</div>
        </div>
    </div>

    <div class="email-section">
        <h3>💬 Message Content</h3>
        <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}" class="btn-primary">Respond to ${name}</a>
        ${isPartnership ? `
        <p style="color: #d69e2e; margin-top: 20px; font-style: italic;">
            ⚡ This is a partnership inquiry. Prompt response recommended for business opportunities.
        </p>
        ` : ''}
    </div>
  `;

  return await sendEmail(
    process.env.CONTACT_EMAIL || 'kaujacob4@gmail.com',
    `${isPartnership ? '🤝' : '📧'} ${emailType} from ${name}`,
    baseEmailTemplate(content, emailType),
    'Witty MoodTracker Contact'
  );
};

// Newsletter welcome email
const sendNewsletterWelcome = async (email) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping newsletter welcome.');
    return false;
  }

  const content = `
    <div class="email-section">
        <h3>🎉 Welcome to Our Mental Health Community!</h3>
        <p>We're thrilled to have you join our newsletter community. Get ready to receive valuable insights and resources to support your mental wellness journey.</p>
    </div>

    <div class="email-section">
        <h3>📬 What You'll Receive</h3>
        <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">💡</div>
                    <h4 style="margin: 0; color: #2d3748;">Weekly Tips</h4>
                    <p style="margin: 5px 0; color: #718096; font-size: 14px;">Practical mental health advice</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
                    <h4 style="margin: 0; color: #2d3748;">Latest Research</h4>
                    <p style="margin: 5px 0; color: #718096; font-size: 14px;">Evidence-based insights</p>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🆕</div>
                    <h4 style="margin: 0; color: #2d3748;">Product Updates</h4>
                    <p style="margin: 5px 0; color: #718096; font-size: 14px;">New features & improvements</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🎁</div>
                    <h4 style="margin: 0; color: #2d3748;">Exclusive Content</h4>
                    <p style="margin: 5px 0; color: #718096; font-size: 14px;">Special resources just for you</p>
                </div>
            </div>
        </div>
    </div>

    <div class="email-section">
        <h3>⚙️ Manage Your Preferences</h3>
        <p>You can update your subscription preferences or unsubscribe at any time using the link in any email. We respect your inbox and will only send valuable content.</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #4a5568;">Your first newsletter will arrive within 24 hours. We're excited to support your mental wellness journey! 🌈</p>
    </div>
  `;

  return await sendEmail(
    email,
    '🎉 Welcome to Witty MoodTracker Newsletter!',
    baseEmailTemplate(content, 'Welcome to Our Newsletter'),
    'Witty MoodTracker Newsletter'
  );
};

// Review notification email
const sendReviewNotificationEmail = async (review) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping review notification.');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'kaujacob4@gmail.com';
  
  const content = `
    <div class="email-section">
        <h3>⭐ New Review Submission</h3>
        <p>A user has submitted a new review that requires your approval before publication.</p>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">User</div>
            <div class="info-value">${review.user.username}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value"><a href="mailto:${review.user.email}">${review.user.email}</a></div>
        </div>
        <div class="info-item">
            <div class="info-label">Rating</div>
            <div class="info-value" style="font-size: 18px; color: #f59e0b;">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
        </div>
        <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value"><span class="priority-badge">Pending Review</span></div>
        </div>
    </div>

    <div class="email-section">
        <h3>📝 Review Content</h3>
        <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 15px 0; color: #2d3748;">${review.title}</h4>
            <p style="margin: 0; line-height: 1.6; color: #4a5568;">${review.comment}</p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.ADMIN_URL || 'https://mood-tracker-bice.vercel.app'}/admin/reviews" class="btn-primary">
          Review in Admin Panel
        </a>
        <p style="color: #718096; margin-top: 20px;">
          Please review this submission within 48 hours.
        </p>
    </div>
  `;

  try {
    const success = await sendEmail(
      adminEmail,
      '⭐ New Review Requires Approval',
      baseEmailTemplate(content, 'Review Submission'),
      'MoodTracker Reviews'
    );
    if (!success) {
      throw new Error('Failed to send email');
    }
    console.log(`✅ Review notification sent to admin`);
    return true;
  } catch (error) {
    console.error('❌ Error sending review notification:', error.message);
    throw error;
  }
};

// Review response email
const sendReviewResponseEmail = async (review, adminMessage) => {
  const hasTransporter = await getTransporter();
  if (!hasTransporter) {
    console.warn('⚠️ Gmail not configured. Skipping review response.');
    return false;
  }

  const content = `
    <div class="email-section">
        <h3>💌 Response to Your Review</h3>
        <p>Dear <strong>${review.user.username}</strong>,</p>
        <p>Thank you for taking the time to share your experience with Witty MoodTracker. We truly value your feedback and have personally reviewed your comments.</p>
    </div>

    <div class="email-section">
        <h3>📋 Our Response</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px;">
            <p style="margin: 0; line-height: 1.6; font-style: italic;">"${adminMessage}"</p>
        </div>
    </div>

    <div class="email-section">
        <h3>🤝 Continuing the Conversation</h3>
        <p>If you have any further thoughts or questions about our response, please don't hesitate to reply to this email. We're always here to listen and improve.</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #4a5568;">Thank you for being a valued member of our community. Together, we're making mental health support more accessible. 🌈</p>
    </div>
  `;

  try {
    const success = await sendEmail(
      review.user.email,
      '💌 Response to Your Witty MoodTracker Review',
      baseEmailTemplate(content, 'Review Response'),
      'MoodTracker Team'
    );
    if (!success) {
      throw new Error('Failed to send email');
    }
    console.log(`✅ Review response sent to ${review.user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending review response:', error.message);
    throw error;
  }
};

// Bulk email
const sendBulkEmail = async (to, subject, content) => {
  const currentTransporter = await getTransporter();
  if (!currentTransporter) {
    throw new Error("Gmail not configured");
  }

  try {
    const info = await currentTransporter.sendMail({
      from: `Witty MoodTracker <${getSenderEmail()}>`,
      to: to,
      subject: subject,
      html: content,
    });
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  hasEmailCredentials,
  sendSupportEmail,
  sendSupportConfirmation,
  sendContactEmail,
  sendNewsletterWelcome,
  sendBulkEmail,
  sendVerificationEmail,
  sendReviewNotificationEmail,
  sendReviewResponseEmail
};
