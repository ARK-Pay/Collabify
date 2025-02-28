const nodemailer = require('nodemailer');
require("dotenv").config();

// Set up the Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'diodexhackathon@gmail.com',    // Your Gmail email address
        pass: process.env.MAILER_PASS        // Your Gmail password or App Password (if 2FA is enabled)
    }
});

// Function to send OTP email
const sendOtpEmail = async (recipientEmail, otp, message) => {
    try {
        const mailOptions = {
            from: 'diodexhackathon@gmail.com',        // Sender's email address
            to: recipientEmail,                  // Recipient's email address
            subject: 'Your OTP Code',            // Subject of the email
            text: `${message}: ${otp}`     // Email body (plain text)
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email.');
    }
};


//export 
module.exports = { sendOtpEmail };


