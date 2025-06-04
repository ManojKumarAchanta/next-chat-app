import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      maxAge: 0, // Set maxAge to 0 to delete the cookie
    });
    return response;
  } catch (error) {
    console.log("Failed to logout", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
