import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import sendEmail from "../../../../helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }
    console.log(reqBody);

    //check if user already exists

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser._doc; // Exclude the password field from the response
    //send email verification
    const emailResponse = await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });
    console.log(emailResponse);

    return NextResponse.json(
      {
        message: "user created successfully",
        success: true,
        userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
