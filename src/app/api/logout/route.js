// app/api/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    // Set the token cookie with an expiration date in the past to delete it
    // cookies().set('token', '', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     expires: new Date(0),  // Set the cookie to expire immediately
    //     path: '/',
    //     sameSite: 'strict',
    // });
    // cookies().set('userId', '', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     expires: new Date(0),  // Set the cookie to expire immediately
    //     path: '/',
    //     sameSite: 'strict',
    // });

    
    
    cookies().delete('token')
    cookies().delete('userId')
    return NextResponse.json({ message: 'Logged out successfully' });
}
