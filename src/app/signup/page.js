// // app/signup/page.js
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('/api/addUser', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success(`${name} Signed Up Successfully!`)
//         router.push('/signin'); // Redirect to sign-in page after successful sign-up
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       console.error('Error signing up:', err);
//       setError('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="w-full px-4 py-2 border rounded"
//           required
//         />
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
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;




// app/signup/page.js
'use client';
import "./style.css"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         

        },

        body: JSON.stringify({ name, email, password }),
        
      });
      // console.log(USERS)
      const result = await response.json();

      if (response.ok) {
        router.push('/signin'); // Redirect to sign-in page after successful sign-up
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Something went wrong. Please try again.');
    }
  };
  function handleSignin() {
    router.push("/signin");
  }

  return (
    <div className=" main_container flex flex-col items-center justify-center min-h-screen  p-4">
          <h1 className="text-5xl text-center mb-8 text-blue-500 font-bold"  >SIGN UP</h1>
        
      
         
          
             {error && <p className="text-red-500 mb-4">{error}</p>}
             <form onSubmit={handleSubmit} >
            <input type="text"
              value={name}
               placeholder="Name"
               onChange={(e) => setName(e.target.value)}
                required />
              <input type="email"
              value={email}
               placeholder="Email"
               onChange={(e) => setEmail(e.target.value)}
                required />
              <input type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required />
              <div className="fb-submit">
                <button type="submit" className="login">Sign up</button>
                <p>If you have an acount</p>
              </div>
              <hr />
              <button className="button">
                <a onClick={handleSignin} >Please Login Now</a>
              </button>
            </form>
          </div>
  );
};

export default SignUp;