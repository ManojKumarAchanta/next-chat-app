import connect from "@/dbConfig/dbConfig";
import User from "../../../../models/userModel";

import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { token } = reqBody; // Extract email and token from the request body
    console.log("token: ", token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }, // Check if the token is not expired
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    console.log(user);
    user.isVerified = true; // Set the user as verified
    user.verifyToken = undefined; // Remove the token from the user document
    user.verifyTokenExpiry = undefined; // Remove the token expiry from the user document
    await user.save(); // Save the updated user document

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
    // If the user is found and verified, send a success response
  } catch (error) {
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
    console.log("Error in verify email route:", error);
  }
}
