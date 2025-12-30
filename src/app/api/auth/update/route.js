import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@lib/mongodb";
import User from "@models/login";

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

async function authenticate(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function PUT(req) {
  const { name, email, password, phoneNumber, receiveEmails } = await req.json();
  
  await connectToDB();

  const userData = await authenticate(req);
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (receiveEmails !== undefined) user.receiveEmails = receiveEmails;

    // Update password only if user has a password (not OAuth)
    if (password) {
      if (!user.password) {
        return NextResponse.json(
          { error: "Password update not allowed for Google login users" },
          { status: 400 }
        );
      }
      const bcrypt = (await import("bcryptjs")).default;
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          receiveEmails: user.receiveEmails,
          googleAccount: !user.password,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
