// app/signin/page.js

// 'use client';


// 'use client'
// import './style.css'

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('/api/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Save JWT token to localStorage/session
//         localStorage.setItem('token', result.token);
//         toast.success("User Signed In Successfully!")
//         router.push('/dashboard'); // Redirect to dashboard after successful sign-in
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       console.error('Error signing in:', err);
//       setError('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Sign In</h1>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full px-4 py-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full px-4 py-2 border rounded"
//           required
//         />
//         <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;





// app/page.js
// 'use client';
// import { Link } from 'next/link';
// import "./style.css"
// import { useRouter } from "next/navigation";
// import { useState } from 'react';
// import { toast } from 'react-toastify';


// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch('/api/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // Save JWT token to localStorage/session
//         localStorage.setItem('token', result.token);
//         toast.success("User Signed In Successfully!")
//         router.push('/dashboard'); // Redirect to dashboard after successful sign-in
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       console.error('Error signing in:', err);
//       setError('Something went wrong. Please try again.');
//     } 
//     finally {
//         setLoading(false); // Set loading to false after submission is complete
//       }
//     }
    
  

//   function handleSignup() {
//     router.push("/signup");
//   }


// return (
//         <div className=" main_container flex flex-col items-center justify-center min-h-screen  p-4">
//           <h1 className="text-5xl text-center mb-8 text-primaryBlue font-bold" >LOGIN</h1>
        
      
         
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//             <div className='formPrimary'>
//             <form >
//               <img src="./profile.svg" className='h-[150px] my-2'/>
//               <input type="email"
//               className="text-gray-800"
//               value={email}
//                placeholder="Email"
//                onChange={(e) => setEmail(e.target.value)}
//                 required />
//               <input type="password"
//               className="text-gray-800"
//                value={password}
//                onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password" required />
//               <div className="fb-submit">
//                 <button disabled={loading}  onClick={handleSubmit} className="bg-primaryBlue text-white hover:bg-blue-700 p-5 rounded-md   " >{loading ? 'Signing in...' : 'Login'} {/* Display loading text */}</button>
//                 <p className='text-gray-800'>If you don't have acount</p>
//               </div>
//               <hr />
//             </form>
//             <div className='flex items-center justify-center'>
//               <button className=" bg-gray-200 p-3 w-fit rounded-md hover:bg-gray-300  " disabled={loading} onClick={handleSignup}> Create new account
//               </button>
//             </div>
//             </div>

//           </div>
       
      
     
//     );
//   };
  
//   export default SignIn;











"use client"
import React, { useState } from 'react'

import { Link } from 'next/link';
import "./style.css"
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';



export default function page() {

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const router = useRouter();
  
  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Save JWT token to localStorage/session
        localStorage.setItem('token', result.token);
        toast.success("User Signed In Successfully!")
        router.push('/dashboard/profile'); // Redirect to dashboard after successful sign-in
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Something went wrong. Please try again.');
    } 
    finally {
        setLoading(false); // Set loading to false after submission is complete
      }
    }
    


  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };


  // handleSignup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${name} Signed Up Successfully!`)
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Something went wrong. Please try again.');
    }finally{
      setLoading(false);
    }
  };


  return (
    <div className="mt-20">
    
     <div className={`containers ${isRightPanelActive ? 'right-panel-active' : ''}`} id="containers">
      <div className="form-containers sign-up-containers">
        <form action="#">
          <h1>Create Account</h1>
          <div className="social-containers">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text"
              value={name}
              className="text-gray-800"
               placeholder="Name"
               onChange={(e) => setName(e.target.value)}
                required />
          <input type="email"
              value={email}
              className="text-gray-800"
               placeholder="Email"
               onChange={(e) => setEmail(e.target.value)}
                required />
          <input type="password"
              className="text-gray-800"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required  />
          <button onClick={handleSignup}>{loading ? 'Signing Up...' : 'Sign Up'} </button>
        </form>
        
      </div>
      <div className="form-containers sign-in-containers">
        <form action="#">
          <h1>Sign in</h1>
          <div className="social-containers">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input  type="email" className="text-gray-800" value={email}  placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password"
              className="text-gray-800"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required  />
          <a href="#">Forgot your password?</a>
          <button  onClick={handleSignin}>{loading ? 'Signing in...' : 'Login'} </button>
        </form>
      </div>
      <div className="overlay-containers">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
