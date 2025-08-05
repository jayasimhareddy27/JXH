import { connectToDB } from '@lib/mongodb';
import User from '@models/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function PUT(req) {
  const { token, name, email, password } = await req.json();

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      if (!user.password) {
        return new Response(JSON.stringify({ error: 'Password update not allowed for Google login users' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      googleAccount: !user.password,
    };

    return new Response(JSON.stringify({ message: 'Profile updated successfully', user: updatedUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update user error:', process.env.NODE_ENV === 'development' ? error : error.message);
    return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
