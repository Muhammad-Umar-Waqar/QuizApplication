import { NextResponse } from 'next/server';
import Quiz from '../../models/Quiz';
import dotenv from 'dotenv';
import connectToDatabase from '../../../db/db'
import { cookies } from 'next/headers';
dotenv.config();


connectToDatabase();
  export async function GET(){
    try {
      await connectToDatabase();
      const userId = cookies().get('userId')?.value;
      // const  {userID}  = await req.json();
      
      // if (!userID) {
      //   console.log("USER ID NOT FOUND!");
      //   return res.status(400).json({ message: 'User ID is required' });
      // }

      console.log("userID", userId)
      
      const quizzes = await Quiz.find({ createdBy: userId }).populate('questions').populate("assignedUsers");
      console.log("quizzes from QUIZ", quizzes)
      return NextResponse.json(quizzes);
    }
     catch (error) {
       return NextResponse.json({ error: 'Failed to fetch quizzes for Specific User' }, { status: 500 });
    }
  
};
  

  