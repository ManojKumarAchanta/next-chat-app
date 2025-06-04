import { getDataFromToken } from "../../../../helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";

import connect from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken(request);
    const user = await User.findOne()
      .where({ _id: userId })
      .select("-password");
    return NextResponse.json(
      { message: "user found", data: user },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
