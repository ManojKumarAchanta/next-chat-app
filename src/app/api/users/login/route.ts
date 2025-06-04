import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    const reqBody = await request.json();
    const { email, password } = reqBody;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }
    console.log(reqBody);

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    //check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    //cookies
    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    const loginResponse = NextResponse.json(
      {
        message: "Login successful",
        success: true,
      },
      { status: 200 }
    );
    loginResponse.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    });
    return loginResponse;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
