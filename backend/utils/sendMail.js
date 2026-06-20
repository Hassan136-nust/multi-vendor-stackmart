const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  console.log("🚀 Sending email...");
  console.log("Host:", process.env.SMPT_HOST);
  console.log("Port:", process.env.SMPT_PORT);
  console.log("Mail:", process.env.SMPT_MAIL);

  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST || "smtp.elasticemail.com",
    port: parseInt(process.env.SMPT_PORT) || 2525,
    secure: process.env.SMPT_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"StackMart" <${process.env.SMPT_MAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.activationUrl ? `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your StackMart Account</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to StackMart!</h1>
          </div>
          <div class="content">
            <h2>Hello ${options.name}!</h2>
            <p>Thank you for signing up for StackMart. To complete your registration, please activate your account by clicking the button below:</p>
            <a href="${options.activationUrl}" class="button">Activate Account</a>
            <p>This link will expire in 5 minutes.</p>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 StackMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    ` : undefined,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent:", result);
  } catch (err) {
    console.error("❌ Mail error:", err);
  }
};

module.exports = sendMail;
