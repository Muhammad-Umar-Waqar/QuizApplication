// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import QuestionDropdown from '../components/QuestionDropdown';
// import QuestionPrototype from '../components/QuestionPrototype';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// // import Typography from '@mui/material/Typography';
// import { Typography } from '@mui/material';
// import './style.css'
// // import Loading from '../loading/loading';

// const Dashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [quizName, setQuizName] = useState('');
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState('');
//   const [questionType, setQuestionType] = useState('');
//   const [question, setQuestion] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [userId, setUserId] = useState(''); // Fetch or set the current user's ID
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [myID, setMyID] = useState('');
//   const [notifications, setNotifications] = useState([]);
//   const [assignedQuiz, setassignedQuizID] =  useState('');



//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No token found');
//           return;
//         }
    
//         const response = await fetch('/api/me', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
  
//         if (!response.ok) {
//           const result = await response.json();
//           setError(result.error);
//           return;
//         }

        
  
//         const userData = await response.json();
//         console.log(userData._id);
//         setMyID(userData._id);
//         setassignedQuizID(userData.quizId);
//         setUser(userData);


//       } catch (err) {
//         console.error('Error fetching user:', err);
//         setError('Failed to fetch user');
//       }
//     };
    
//     fetchUser();
//   }, []);
  

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
        
//         if(myID){
//           const response = await fetch(`/api/notifications?userId=${myID}`);
//           console.log("Response from Notifications", response)
//           if (!response.ok) {
//             throw new Error('Failed to fetch notifications');
//           }
          
//           const data = await response.json();
//           console.log("Notifications Data", data); 
//           setNotifications(data);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, [myID]);


  
//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await fetch('/api/getquiz');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();

//         console.log("Data from /api/quiz", data);
//         setQuizzes(data);
//       } catch (error) {
//         console.error('Failed to fetch quizzes from api/quiz:', error);
//         // alert('Failed to fetch quizzes from api/quiz. Check the console for details.');
//       }
//     };
    
//     fetchQuizzes();
//   }, [myID]);


//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch('/api/users');
//       if (response.ok) {
//         const data = await response.json();
//         console.log("USERS", data);
//         setUsers(data);
//       } else {
//         console.error('Failed to fetch users');
//       }
//     };
//     fetchUsers();
//   }, []);
  
//   // Handle question type selection
//   const handleSelect = (type) => {
//     setQuestionType(type);
//     setQuestion(
//       type === 'MCQs' ? { questionText: '', options: ['', '', '', ''], correctOption: null } :
//       type === 'True/False Questions' ? { questionText: '', correctOption: null } :
//       { questionText: '', correctAnswer: '' }
//     );
//   };
  
//   // Handle quiz creation
//   const handleCreateQuiz = async () => {
//     const response = await fetch('/api/quiz', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ name: quizName, userId: myID }),
//     });
  
//     if (response.ok) {
//       const data = await response.json();
//       setQuizzes([...quizzes, data.quiz]);
//       setQuizName('');
//       // alert('Quiz created successfully!');
//       toast.success("Quiz Created Successfully");
//     } else {
//       alert('Failed to create quiz.');
//     }
//   };
  
//   // Handle saving questions
//   const handleSave = async () => {
//     if (!selectedQuiz || !questionType || !question) {
//       alert('Please select a quiz and enter question details.');
//       return;
//     }
  
//     const response = await fetch('/api/questions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ quizId: selectedQuiz, type: questionType, ...question }),
//     });
//     console.log("QuizId", selectedQuiz, "questionType", question)
//     setassignedQuizID(selectedQuiz);
//     console.log(selectedQuiz)
//     if (response.ok) {
//       setQuestion(null); // Clear question input after saving
//       // alert('Question saved successfully!');
//       toast.success("Question Saved Successfully");
//     } else {
//       alert('Failed to save question.');
//     }
//   };
  
//   // Handle assigning quiz to user
//   const handleAssignQuiz = async () => {
//     if (!selectedUser || !selectedQuiz || !myID) {
//       console.error('User or quiz not selected');
//       toast.error("User or Quiz Not Selected")
//       return;
//     }
//     // console.log('User: ', selectedUser, ' quiz', selectedQuiz, 'Assigned By ', myID);
  
//     const response = await fetch('/api/assign', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ userId: selectedUser, quizId: selectedQuiz, assignedBy: myID }),
//     });
    
//     if (response.ok) {
//       const result = await response.json();  
//       console.log('Quiz assigned successfully:', result);
//       // alert("Quiz Assigned Successfully");
//       toast.success("Quiz Assigned Successfully");
//     } else {
//       const error = await response.json();
//       console.error('Error assigning quiz:', error);
//     }
//   };
  
  
  


//   const handleNotificationClick = async (notificationId, quizId) => {
    
//     // Mark the notification as read
//     await fetch(`/api/notifications/${notificationId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: notificationId, status: 'read', quizScore: 0 }),
//     });

//    console.log("Notifiaction Quiz ID:", quizId._id);
//    console.log("Notifiaction Quiz ID:", assignedQuiz);
//     // Redirect to the quiz page with the selected quizId
//     router.push(`/dashboard/attempt-quiz/${quizId._id}`);
//     localStorage.setItem("notificationId", notificationId );
    
//     // router.push(`/attempt-quiz/quizId=${quizId._id}?notificationId=${notificationId}`);
//   };



//   async function handleLogout() {
//     setLoading(true)
//     try {
//         const response = await fetch('/api/logout', {
//             method: 'POST',
//         });
        
//         localStorage.removeItem('token');
//         localStorage.removeItem('notificationId');
//         if (response.ok) {
//             // Handle successful logout (e.g., redirect to sign-in page)
//             router.push('/signin');
//         } else {
//             console.error('Failed to log out');
//         }
//     } catch (error) {
//         console.error('Error during logout:', error);
//     } finally {
//       setLoading(false);
//     }
// }


// const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

// const toggleMobileMenu = () => {
//   setIsMobileMenuOpen(!isMobileMenuOpen);
// };

// const toggleUserMenu = () => {
//   setIsUserMenuOpen(!isUserMenuOpen);
// };



// const SITEMAP = [
//   {
//     title: 'Resources',
//     links: ['Documentation', 'API Reference', 'Tutorials'],
//   },
//   {
//     title: 'Company',
//     links: ['About Us', 'Careers', 'Press'],
//   },
//   {
//     title: 'Support',
//     links: ['Contact Us', 'Help Center', 'Privacy Policy'],
//   },
//   {
//     title: 'Legal',
//     links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
//   },
// ];


// const nameLength = user ? user.name.length : 0;
// const animationDuration = 8; // duration in seconds

// const styles = {
//   '--steps': nameLength,
//   '--duration': `${animationDuration}s`,
// };

//   return (
// <>
//     <div className='container '>

   





// <div className="container mx-auto p-4">
//   {/* {user && (
//     <div className="">
//       <span className="text-3xl sm:text-center sm:text-4xl  lg:text-5xl text-slate-500 font-bold  sm:mt-16 lg:mt-7 tracking-widest">Welcome, {user.name}!</span>
//       <img className="inline-block  mb-10 h-20 w-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" src="https://media1.giphy.com/media/7D1osJjZckLk0ayEby/giphy.gif?cid=6c09b952v7a3wsnptctbs4z8ytvl8ux915gy7rpblnki2taf&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s" alt="Welcome GIF" />
//       Add more dashboard functionality here
//     </div>
//   )}
//    */}
//   <div className="flex flex-col lg:flex-row items-center justify-between ">
//     <div className="w-full text-animate lg:w-1/2 text-center lg:text-left  lg:mb-0" style={styles}>

//       <h2 className="text-5xl sm:text-4xl lg:text-5xl  font-bold  tracking-widest " >{user && `Welcome ${user.name}` }</h2>

//       <p className="text-xl  sm:text-2xl lg:text-3xl mt-5 text-gray-800 leading-loose tracking-widest">Create, Attempt, and Assign Quizzes to your Friends </p>
      
//     </div>
//     <div className="">
//     <img src="./bgQuiz.png" className=" h-[200px] w-[300px] sm:h-[500px] sm:w-[540px] " />
//     </div>
//   </div>

//   <div className="flex flex-col lg:flex-row items-start lg:items-center mt-20">
//     <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
//       <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-widest font-bold mb-10 text-amber-500 text-center lg:text-left">Create Your Quiz</h1>
//       <input
//         type="text"
//         value={quizName}
//         onChange={(e) => setQuizName(e.target.value)}
//         placeholder="Quiz Name"
//         className="block text-gray-700 w-full px-4 py-2 mb-4 border rounded"
//       />
//       <button onClick={handleCreateQuiz} className="w-full lg:w-auto px-4 py-2 mt-6 bg-yellow-500 text-primaryBlue rounded hover:bg-yellow-700">
//         Create Quiz
//       </button>
//     </div>
//     <div className="w-full lg:w-1/2 flex justify-center lg:ml-10">
//       {/* <img className="min-w-full  h-[200px] sm:w-[400px] w-[200px] sm:h-[400px]" src="./quiz.svg" alt="Create Quiz Image" width={500} /> */}
      
//       <img className="h-[200px]  sm:h-[359px]" src="./quiz.png" alt="Banner Image" />
//     </div>
//   </div>
// </div>

      
// <div className="container mx-auto p-4 mt-[40px] sm:mt-auto ">
//   <div className="flex flex-col lg:flex-row items-start lg:items-center">
//     <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
//       <h1 className="text-3xl sm:text-4xl lg:text-5xl sm:text-start text-center text-amber-500 font-bold py-6 sm:py-8 mt-4 sm:mt-6 lg:mt-8">Add Questions to Your Quiz</h1>
//       <select
//         value={selectedQuiz}
//         onChange={(e) => setSelectedQuiz(e.target.value)}
//         className="block my-6 sm:my-8 w-full px-4 py-2 mb-4 border rounded bg-white text-gray-800"
//       >
//         <option className= "  bg-white text-gray-800" value="" disabled>Select Quiz</option>
//         {quizzes.map((quiz) => (
//           <option className="text-gray-800 bg-white" key={quiz._id} value={quiz._id}>{quiz.name}</option>
//         ))}
//       </select>
      
//       <QuestionDropdown className="text-gray-800" type={questionType} onSelect={handleSelect} />
//       <QuestionPrototype
//         type={questionType}
//         question={question}
//         setQuestion={setQuestion}
//       />
//       <button onClick={handleSave} className="w-full lg:w-auto px-4 py-2 mt-6 bg-yellow-500 text-primaryBlue rounded hover:bg-yellow-700">
//         Save Question
//       </button>
//     </div>
//     <div className="w-full lg:w-1/2 flex justify-center lg:ml-10 mt-10 lg:mt-20">
//       <img className="max-w-full h-auto" src="./question.png" alt="Assign Quiz Image" />
//     </div>
//   </div>
// </div>

//         <div className="flex flex-col lg:flex-row justify-evenly  items-center my-5">
//           <div className="mt-10 w-3/6">
//           <h1 className="text-5xl font-bold mb-7  tracking-widest  text-amber-500">Assign Quiz</h1>
//         <select 
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//           className="block text-gray-800 w-[60%] py-2 mb-4 border rounded "
//         >
//           <option className="text-gray-800" value="" disabled>Select User</option>
//           {users.map((user) => (
//             <option key={user._id} value={user._id} className="text-gray-800">{user.name}</option>
//           ))}
//         </select>
//         <button onClick={handleAssignQuiz} className="px-4 py-2 bg-yellow-500 mt-5 text-primaryBlue rounded hover:bg-yellow-700">
//           Assign Quiz
//         </button>
//           </div>
//           <div>
//             <img src="./assignQuiz.png" className="h-[400px] "/>
//           </div>
//         </div>
       
//       </div>
//         <h1 className="text-5xl font-bold text-center text-amber-500 mb-10 mt-8">Notifications</h1>
//       <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 mx-3 justify-evenly place-items-center">
     
//         {notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div key={notification._id} className="mb-4 p-4 border border-amber-500 rounded min-w-[300px]  lg:w-[400px]">
//               <p>Assigned By: {notification.assignedBy.name}</p>
//               <p>Status: {notification.status}</p>
//               <p>Score: {notification.quizScore.toFixed(2)}</p>

              
//               <button
//                 onClick={() => handleNotificationClick(notification._id, notification.quizId)}
//                 className="mt-2 px-4 py-2 bg-yellow-500 text-primaryBlue rounded hover:bg-yellow-700"
//                 >
//                 Start Quiz
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No notifications</p>
//         )}
    
//       </div>
     
   

// </>
//   );
// };

// export default Dashboard;










"use client"
import React from 'react'

function page() {
  return (
    <div className='min-w-screen'>page</div>
  )
}

export default page