import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import sendEmail from "@/helpers/mailer";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connect();
    const reqBody = await req.json();
    const { token } = reqBody; // Extract email and token from the request body
    console.log("token: ", token);
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }, // Check if the token is not expired
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json(
      { message: "Sent Reset password email successfully", success: true },
      { status: 200 }
    );
    // If the user is found and verified, send a success response
  } catch (error) {
    return NextResponse.json(
      { error: "Error Resetting password" },
      { status: 500 }
    );
    console.log("Error in forgot password:", error);
  }
}
