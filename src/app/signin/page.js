// app/signin/page.js

// 'use client';

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
'use client';
import { Link } from 'next/link';
import "./style.css"
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { toast } from 'react-toastify';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
        router.push('/dashboard'); // Redirect to dashboard after successful sign-in
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
    
  

  function handleSignup() {
    router.push("/signup");
  }


return (
        <div className=" main_container flex flex-col items-center justify-center min-h-screen  p-4">
          <h1 className="text-5xl text-center mb-8 text-white font-bold" >LOGIN</h1>
        
      
         
          {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className='formPrimary'>
            <form >
              <input type="email"
              className="text-gray-800"
              value={email}
               placeholder="Email"
               onChange={(e) => setEmail(e.target.value)}
                required />
              <input type="password"
              className="text-gray-800"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required />
              <div className="fb-submit">
                <button disabled={loading}  onClick={handleSubmit} className=" bg-yellow-500 hover:bg-customYellow p-5 rounded-md " >{loading ? 'Signing in...' : 'Login'} {/* Display loading text */}</button>
                <p className='text-gray-800'>If you don't have acount</p>
              </div>
              <hr />
            </form>
            <div className='flex items-center justify-center'>
              <button className="button bg-gray-800 text-white p-5 rounded-md hover:bg-gray-500 " disabled={loading} onClick={handleSignup}> Create new account
              </button>
            </div>
            </div>

          </div>
       
      
     
    );
  };
  
  export default SignIn;