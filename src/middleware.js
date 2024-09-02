// // middleware.js

// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Quiz from './models/Quiz';

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // Check if the request is for the quiz page
//   if (pathname === '/quiz') {
//     const quizzes = await Quiz.find({}).populate('questions');
//     if (quizzes.length === 0 || quizzes.every(quiz => quiz.questions.length === 0)) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/quiz'], // Apply middleware only to the quiz page
// };



// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";


// export function middleware(request){
//     const token = request.cookies.get("token")?.value;
//     console.log("Middle ware Executed");
//     const loggedInUserNotAccessPaths = 
//     request.nextUrl.pathname === "/" || 
//     request.nextUrl.pathname === "/signin" || 
//     request.nextUrl.pathname === "/signup";

//     if (loggedInUserNotAccessPaths){
//         if(token){
//                 return NextResponse.redirect(new URL("/dashboard", request.url));
//         }
//     }
// }

// export const config = {
//     matcher: [
//         "/",
//         "/signin",
//         "/signup",
//         "/dashboard",
//         "/attempt-quiz/:path*",
//         "/attempt-quiz"
//     ]
// }














import { NextResponse } from 'next/server';

export  function middleware(request) {
  const token = request.cookies.get('token')?.value;
  console.log('Middleware Executed!');

  const { pathname } = request.nextUrl;

  // Paths accessible only to logged-in users
  const loggedOutUserNotAccessPaths = ['/dashboard', '/dashboard/*'];

  // Redirect logged-out users from protected paths
  if (loggedOutUserNotAccessPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Paths accessible only to logged-out users
  const loggedInUserNotAccessPaths = [ '/signin', '/signup'];

  // Redirect logged-in users away from non-accessible paths
  if (loggedInUserNotAccessPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/signin',
    '/signup',
    '/dashboard/:path*',
    
  ],
};
