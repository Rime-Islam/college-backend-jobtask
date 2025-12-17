import nodemailer from 'nodemailer';
import config from '../../config';



// transporter for email
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
    auth: {
        user: config.user_name,
        pass: config.password
    }
});

// Generic function to send email
export const sendEmail = async (mailOptions: any) => {
    try {
     await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

// reset password Email Template
export const resetPasswordEmail = async (email: string, URL: string) => {
    const mailOptions = {
        from: `"College" <${config.user_name}>`,
        to: email,
        subject: 'Password Reset Request',
        text: `
        Dear User,
  
        We received a request to reset the password for your College account. To complete the process, please click on the link below.
  
        ${URL}
  
        If you did not request a password reset, please disregard this email. Your password will remain unchanged.
  
        For your security, please do not share this link with anyone.
  
        Best regards,
        College Team
              `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <p>Dear User,</p>
                  <p>We received a request to reset the password for your College account. To complete the process, please click on the link below:</p>
                  <p> <a href="${URL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #1a73e8; text-decoration: none; border-radius: 5px;">
                  Reset your password
                  </a></p>
                  <p>If you did not request a password reset, please disregard this email. Your password will remain unchanged.</p>
                  <p>For your security, please do not share this link with anyone.</p>
                  <p style="font-size: 0.9em; color: #777;">
                      Best regards,<br>
                      College Team
                  </p>
              </div>
              `
    };
    sendEmail(mailOptions);
};