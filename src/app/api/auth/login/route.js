import { connectToDB } from '@lib/mongodb';

import User from '@models/login';
import UserReferences from '@models/userreferences';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    const references = await UserReferences.findOne({ userId: user._id });

    return Response.json(
      { message: "Login successful", token, user: userResponse,references },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", process.env.NODE_ENV === 'development' ? error : error.message);
    return Response.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  const { token, name, email, password } = await req.json();

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return Response.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", process.env.NODE_ENV === 'development' ? error : error.message);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
