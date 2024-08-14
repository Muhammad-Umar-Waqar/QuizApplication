// app/api/signin/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../models/User';
import connectToDatabase from '../../../db/db';
import dotenv from 'dotenv';
import { cookies } from 'next/headers'



dotenv.config();

connectToDatabase();
export async function POST(request) {
    // await connectToDatabase();
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = user.generateToken();
        
        cookies().set('userId', user._id)
        cookies().set('token', token)
        return NextResponse.json({ message: 'Sign in successful', token });
    } catch (error) {
        console.error('Error signing in:', error);
        return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
    } 
}
