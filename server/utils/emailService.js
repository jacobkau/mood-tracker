const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Support email template
const sendSupportEmail = async ({ ticketId, name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SUPPORT_EMAIL,
    subject: `Support Ticket #${ticketId}: ${subject}`,
    html: `
      <h2>New Support Ticket</h2>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Support email sent for ticket ${ticketId}`);
  } catch (error) {
    console.error('Error sending support email:', error);
  }
};

// Contact form email template
const sendContactEmail = async ({ name, email, subject, message, type }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: `Contact Form: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent from ${email}`);
  } catch (error) {
    console.error('Error sending contact email:', error);
  }
};

module.exports = {
  sendSupportEmail,
  sendContactEmail
};
