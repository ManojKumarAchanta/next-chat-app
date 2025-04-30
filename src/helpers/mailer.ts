import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcryptjs from "bcryptjs";

// Looking to send emails in production? Check out our Email API/SMTP product!
export default async function sendEmail({ email, emailType, userId }: any) {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
    const emailOptions = {
      from: process.env.SOURCE_EMAIL,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
  <h2 style="color: #4CAF50;">Action Required!</h2>
  <p>
    Click the button below to 
    <strong>
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
    </strong>.
  </p>
  <a 
    href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" 
    style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    "
    target="_blank"
  >
    ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
  </a>
  <p style="margin-top: 20px; font-size: 12px; color: #888;">
    If you didn't request this, you can safely ignore this email.
  </p>
</div>
`,
    };
    const mailresponse = await transporter.sendMail(emailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error("Error sending email: " + error.message);
  }
}
