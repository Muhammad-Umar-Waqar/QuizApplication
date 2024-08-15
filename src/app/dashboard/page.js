'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionDropdown from '../components/QuestionDropdown';
import QuestionPrototype from '../components/QuestionPrototype';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import './style.css'

const Dashboard = () => {
  const [quizName, setQuizName] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [question, setQuestion] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userId, setUserId] = useState(''); // Fetch or set the current user's ID
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [error, setError] = useState('');
  const [myID, setMyID] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [assignedQuiz, setassignedQuizID] =  useState('');



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          return;
        }
    
        const response = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          const result = await response.json();
          setError(result.error);
          return;
        }

        
  
        const userData = await response.json();
        console.log(userData._id);
        setMyID(userData._id);
        setassignedQuizID(userData.quizId);
        setUser(userData);


      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user');
      }
    };
    
    fetchUser();
  }, []);
  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        
        if(myID){
          const response = await fetch(`/api/notifications?userId=${myID}`);
          console.log("Response from Notifications", response)
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
          
          const data = await response.json();
          console.log("Notifications Data", data); 
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [myID]);

  // Fetch quizzes
  // useEffect(() => {
  //   const fetchQuizzes = async () => {
  //     try {
  //       const response = await fetch('/api/quiz');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();

  //       console.log("Data from /api/quiz", data);
  //       setQuizzes(data);
  //     } catch (error) {
  //       console.error('Failed to fetch quizzes from api/qioz:', error);
  //       alert('Failed to fetch quizzes. Check the console for details.');
  //     }
  //   };
    
  //   fetchQuizzes();
  // }, []);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/getquiz');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log("Data from /api/quiz", data);
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes from api/quiz:', error);
        // alert('Failed to fetch quizzes from api/quiz. Check the console for details.');
      }
    };
    
    fetchQuizzes();
  }, [myID]);


  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        console.log("USERS", data);
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);
  
  // Handle question type selection
  const handleSelect = (type) => {
    setQuestionType(type);
    setQuestion(
      type === 'MCQs' ? { questionText: '', options: ['', '', '', ''], correctOption: null } :
      type === 'True/False Questions' ? { questionText: '', correctOption: null } :
      { questionText: '', correctAnswer: '' }
    );
  };
  
  // Handle quiz creation
  const handleCreateQuiz = async () => {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: quizName, userId: myID }),
    });
  
    if (response.ok) {
      const data = await response.json();
      setQuizzes([...quizzes, data.quiz]);
      setQuizName('');
      // alert('Quiz created successfully!');
      toast.success("Quiz Created Successfully");
    } else {
      alert('Failed to create quiz.');
    }
  };
  
  // Handle saving questions
  const handleSave = async () => {
    if (!selectedQuiz || !questionType || !question) {
      alert('Please select a quiz and enter question details.');
      return;
    }
  
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizId: selectedQuiz, type: questionType, ...question }),
    });
    console.log("QuizId", selectedQuiz, "questionType", question)
    setassignedQuizID(selectedQuiz);
    console.log(selectedQuiz)
    if (response.ok) {
      setQuestion(null); // Clear question input after saving
      // alert('Question saved successfully!');
      toast.success("Question Saved Successfully");
    } else {
      alert('Failed to save question.');
    }
  };
  
  // Handle assigning quiz to user
  const handleAssignQuiz = async () => {
    if (!selectedUser || !selectedQuiz || !myID) {
      console.error('User or quiz not selected');
      toast.error("User or Quiz Not Selected")
      return;
    }
    // console.log('User: ', selectedUser, ' quiz', selectedQuiz, 'Assigned By ', myID);
  
    const response = await fetch('/api/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: selectedUser, quizId: selectedQuiz, assignedBy: myID }),
    });
    
    if (response.ok) {
      const result = await response.json();  
      console.log('Quiz assigned successfully:', result);
      // alert("Quiz Assigned Successfully");
      toast.success("Quiz Assigned Successfully");
    } else {
      const error = await response.json();
      console.error('Error assigning quiz:', error);
    }
  };
  
  
  


  const handleNotificationClick = async (notificationId, quizId) => {
    
    // Mark the notification as read
    await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: notificationId, status: 'read', quizScore: 0 }),
    });

   console.log("Notifiaction Quiz ID:", quizId._id);
   console.log("Notifiaction Quiz ID:", assignedQuiz);
    // Redirect to the quiz page with the selected quizId
    router.push(`/attempt-quiz/${quizId._id}`);
    localStorage.setItem("notificationId", notificationId );
    
    // router.push(`/attempt-quiz/quizId=${quizId._id}?notificationId=${notificationId}`);
  };



  async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            // Handle successful logout (e.g., redirect to sign-in page)
            router.push('/signin');
        } else {
            console.error('Failed to log out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}


const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
};

const toggleUserMenu = () => {
  setIsUserMenuOpen(!isUserMenuOpen);
};



const SITEMAP = [
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Tutorials'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press'],
  },
  {
    title: 'Support',
    links: ['Contact Us', 'Help Center', 'Privacy Policy'],
  },
  {
    title: 'Legal',
    links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
  },
];


  return (
    // <div className="mx-auto">
      

    //   <nav className="bg-gray-800">
    //   <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    //     <div className="relative flex h-16 items-center justify-between">
    //       <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
    //         <button
    //           type="button"
    //           className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    //           aria-controls="mobile-menu"
    //           aria-expanded={isMobileMenuOpen}
    //           onClick={toggleMobileMenu}
    //         >
    //           <span className="sr-only">Open main menu</span>
    //           <svg
    //             className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="1.5"
    //             stroke="currentColor"
    //             aria-hidden="true"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    //             />
    //           </svg>
    //           <svg
    //             className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="1.5"
    //             stroke="currentColor"
    //             aria-hidden="true"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M6 18L18 6M6 6l12 12"
    //             />
    //           </svg>
    //         </button>
    //       </div>
    //       <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
    //         <div className="flex flex-shrink-0 items-center">
    //           <img
    //             className="h-8 w-auto"
    //             src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
    //             alt="Your Company"
    //           />
    //         </div>
    //         <div className="hidden sm:ml-6 sm:block">
    //           <div className="flex space-x-4">
    //             <a
    //               href="#"
    //               className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
    //               aria-current="page"
    //             >
    //               Dashboard
    //             </a>
    //             <a
    //               href="#"
    //               className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //             >
    //               Team
    //             </a>
    //             <a
    //               href="#"
    //               className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //             >
    //               Projects
    //             </a>
    //             <a
    //               href="#"
    //               className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //             >
    //               Calendar
    //             </a>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
    //         <button
    //           type="button"
    //           className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    //         >
    //           <span className="sr-only">View notifications</span>
    //           <svg
    //             className="h-6 w-6"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="1.5"
    //             stroke="currentColor"
    //             aria-hidden="true"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    //             />
    //           </svg>
    //         </button>

    //         <div className="relative ml-3">
    //           <div>
    //             <button
    //               type="button"
    //               className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    //               id="user-menu-button"
    //               aria-expanded={isUserMenuOpen}
    //               aria-haspopup="true"
    //               onClick={toggleUserMenu}
    //             >
    //               <span className="sr-only">Open user menu</span>
    //               <img
    //                 className="h-8 w-8 rounded-full"
    //                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    //                 alt=""
    //               />
    //             </button>
    //           </div>

    //           {isUserMenuOpen && (
    //             <div
    //               className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    //               role="menu"
    //               aria-orientation="vertical"
    //               aria-labelledby="user-menu-button"
    //             >
    //               <a
    //                 href="#"
    //                 className="block px-4 py-2 text-sm text-gray-700"
    //                 role="menuitem"
    //               >
    //                 Your Profile
    //               </a>
    //               <a
    //                 href="#"
    //                 className="block px-4 py-2 text-sm text-gray-700"
    //                 role="menuitem"
    //               >
    //                 Settings
    //               </a>
    //               <a
    //                 href="#"
    //                 className="block px-4 py-2 text-sm text-gray-700"
    //                 role="menuitem"
    //               >
    //                 Sign out
    //               </a>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {isMobileMenuOpen && (
    //     <div className="sm:hidden" id="mobile-menu">
    //       <div className="space-y-1 px-2 pb-3 pt-2">
    //         <a
    //           href="#"
    //           className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
    //           aria-current="page"
    //         >
    //           Dashboard
    //         </a>
    //         <a
    //           href="#"
    //           className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //         >
    //           Team
    //         </a>
    //         <a
    //           href="#"
    //           className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //         >
    //           Projects
    //         </a>
    //         <a
    //           href="#"
    //           className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    //         >
    //           Calendar
    //         </a>
    //       </div>
    //     </div>
    //   )}
    // </nav>






    //   <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    //   {user && (
    //     <div>
    //       <p>Welcome, {user.name}!</p>
    //       {/* Add more dashboard functionality here */}
    //     </div>
    //   )}
    //       <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
    //       Logout
    //     </button>
    //   <div className=''>
    //     <h1 className="text-2xl font-bold mb-4">Create Your Quiz</h1>
    //     <input
    //       type="text"
    //       value={quizName}
    //       onChange={(e) => setQuizName(e.target.value)}
    //       placeholder="Quiz Name"
    //       className="block w-full px-4 py-2 mb-4 border rounded"
    //     />
    //     <button onClick={handleCreateQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
    //       Create Quiz
    //     </button>
  
    //     <h1 className="text-2xl font-bold mb-4 mt-8">Add Questions to Your Quiz</h1>
    //     <select
    //       value={selectedQuiz}
    //       onChange={(e) => setSelectedQuiz(e.target.value)}
    //       className="block w-full px-4 py-2 mb-4 border rounded"
    //     >
    //       <option value="" disabled>Select Quiz</option>

    //       {
    //       quizzes.map((quiz) => (
    //         <option key={quiz._id} value={quiz._id}>{quiz.name}</option>
    //       ))}

    //     </select>
    //     <QuestionDropdown type={questionType} onSelect={handleSelect} />
    //     <QuestionPrototype
    //       type={questionType}
    //       question={question}
    //       setQuestion={setQuestion}
    //     />
    //     <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
    //       Save Question
    //     </button>
  
    //     <h1 className="text-2xl font-bold mb-4 mt-8">Assign Quiz</h1>
    //     <select
    //       value={selectedUser}
    //       onChange={(e) => setSelectedUser(e.target.value)}
    //       className="block w-full px-4 py-2 mb-4 border rounded"
    //     >
    //       <option value="" disabled>Select User</option>
    //       {users.map((user) => (
    //         <option key={user._id} value={user._id}>{user.name}</option>
    //       ))}
    //     </select>
    //     <button onClick={handleAssignQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
    //       Assign Quiz
    //     </button>
    //   </div>
    //   <div>
    //     <h1 className="text-2xl font-bold mb-4 mt-8">Notifications</h1>
    //     {notifications.length > 0 ? (
    //       notifications.map((notification) => (
    //         <div key={notification._id} className="mb-4 p-4 border rounded">
    //           <p> Status: {notification.status}</p>
    //           <p> Assigned By: {notification.assignedBy?.name}</p>
    //         <p>{notification.quizScore ? `${notification.quizScore.toFixed(2)} %` : "Attempt Quiz to display Score"}</p>
    //           <button
    //             onClick={() => handleNotificationClick(notification._id, notification.quizId)}
    //             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    //           >
    //             Start Quiz
    //           </button>
    //         </div>
    //       ))
    //     ) : (
    //       <p>No notifications</p>
    //     )}
    //   </div>
    // </div>









<>
    <div className='container '>

    <nav className="bg-gray-600 mb-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* <!-- Mobile menu button --> */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* <!-- Logo and navigation links --> */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              {/* <!-- Add your logo here --> */}
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link href="/dashboard" className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white" aria-current="page">
                  Dashboard
                </Link>
                <Link href="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  Contact
                </Link>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  Projects
                </a>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  Calendar
                </a>
              </div>
            </div>
          </div>

          {/* <!-- Logout button --> */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              onClick={handleLogout}
              className="relative font-bold py-2 px-4 rounded-full bg-yellow-500 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu --> */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="/dashboard" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">
              Dashboard
            </Link>
            <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              Contact
            </Link>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              Projects
            </a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              Calendar
            </a>
          </div>
        </div>
      )}
    </nav>






<div className="container mx-auto p-4">
  {/* {user && (
    <div className="">
      <span className="text-3xl sm:text-center sm:text-4xl  lg:text-5xl text-slate-500 font-bold  sm:mt-16 lg:mt-7 tracking-widest">Welcome, {user.name}!</span>
      <img className="inline-block  mb-10 h-20 w-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" src="https://media1.giphy.com/media/7D1osJjZckLk0ayEby/giphy.gif?cid=6c09b952v7a3wsnptctbs4z8ytvl8ux915gy7rpblnki2taf&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s" alt="Welcome GIF" />
      Add more dashboard functionality here
    </div>
  )}
   */}
  <div className="flex flex-col lg:flex-row items-center justify-between ">
    <div className="w-full text-animate lg:w-1/2 text-center lg:text-left  lg:mb-0">
      <h2 className="text-5xl sm:text-4xl lg:text-5xl  font-bold tracking-widest">QUIZ APPLICATION</h2>
      <p className="text-xl  sm:text-2xl lg:text-3xl mt-5 text-white leading-loose tracking-widest">Create, Attempt, and Assign Quizzes to your Friends </p>
      
    </div>
    <div className="">
    <img src="./bgQuiz.png" className=" h-[200px] w-[300px] sm:h-[500px] sm:w-[500px] " />
    </div>
  </div>

  <div className="flex flex-col lg:flex-row items-start lg:items-center mt-20">
    <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-widest font-bold mb-10 text-amber-500 text-center lg:text-left">Create Your Quiz</h1>
      <input
        type="text"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        placeholder="Quiz Name"
        className="block text-gray-700 w-full px-4 py-2 mb-4 border rounded"
      />
      <button onClick={handleCreateQuiz} className="w-full lg:w-auto px-4 py-2 mt-6 bg-yellow-500 text-white rounded hover:bg-yellow-700">
        Create Quiz
      </button>
    </div>
    <div className="w-full lg:w-1/2 flex justify-center lg:ml-10">
      {/* <img className="min-w-full  h-[200px] sm:w-[400px] w-[200px] sm:h-[400px]" src="./quiz.svg" alt="Create Quiz Image" width={500} /> */}
      
      <img className="h-[200px]  sm:h-[359px]" src="./quiz.png" alt="Banner Image" />
    </div>
  </div>
</div>

      
<div className="container mx-auto p-4 mt-[40px] sm:mt-auto ">
  <div className="flex flex-col lg:flex-row items-start lg:items-center">
    <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl sm:text-start text-center text-amber-500 font-bold py-6 sm:py-8 mt-4 sm:mt-6 lg:mt-8">Add Questions to Your Quiz</h1>
      <select
        value={selectedQuiz}
        onChange={(e) => setSelectedQuiz(e.target.value)}
        className="block my-6 sm:my-8 w-full px-4 py-2 mb-4 border rounded bg-white text-gray-800"
      >
        <option className= "  bg-white text-gray-800" disabled>Select Quiz</option>
        {quizzes.map((quiz) => (
          <option className="text-gray-800 bg-white" key={quiz._id} value={quiz._id}>{quiz.name}</option>
        ))}
      </select>
      
      <QuestionDropdown className="text-gray-800" type={questionType} onSelect={handleSelect} />
      <QuestionPrototype
        type={questionType}
        question={question}
        setQuestion={setQuestion}
      />
      <button onClick={handleSave} className="w-full lg:w-auto px-4 py-2 mt-6 bg-yellow-500 text-white rounded hover:bg-yellow-700">
        Save Question
      </button>
    </div>
    <div className="w-full lg:w-1/2 flex justify-center lg:ml-10 mt-10 lg:mt-20">
      <img className="max-w-full h-auto" src="./question.png" alt="Assign Quiz Image" />
    </div>
  </div>
</div>

        <div className="flex flex-col lg:flex-row justify-evenly  items-center my-5">
          <div className="mt-10 w-3/6">
          <h1 className="text-5xl font-bold mb-7  tracking-widest  text-amber-500">Assign Quiz</h1>
        <select 
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="block text-gray-800 w-[60%] py-2 mb-4 border rounded "
        >
          <option className="text-gray-800" value={user?.name} disabled>Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id} className="text-gray-800">{user.name}</option>
          ))}
        </select>
        <button onClick={handleAssignQuiz} className="px-4 py-2 bg-yellow-500 mt-5 text-white rounded hover:bg-yellow-700">
          Assign Quiz
        </button>
          </div>
          <div>
            <img src="./assignQuiz.png" className="h-[400px] "/>
          </div>
        </div>
       
      </div>
      <div className="flex justify-center items-center">
      <div>
        <h1 className="text-5xl font-bold text-center text-amber-500 mb-10 mt-8">Notifications</h1>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="mb-4 p-4 border border-amber-500 rounded">
              <p>Assigned By: {notification.assignedBy.name}</p>
              <p>Status: {notification.status}</p>
              <p>Score: {notification.quizScore.toFixed(2)}</p>

              
              <button
                onClick={() => handleNotificationClick(notification._id, notification.quizId)}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              >
                Start Quiz
              </button>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
      </div>
     
   
   
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key} className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-4 font-bold text-amber-500 uppercase "
              >
                {title}
              </Typography>
              <ul className="space-y-1">
                {links.map((link, key) => (
                  <Typography key={key} as="li" color="blue-gray" className="font-normal">
                    <a
                      href="#"
                      className="inline-block py-1 pr-2 transition-transform hover:scale-105"
                    >
                      {link}
                    </a>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy;  <a href="#">Quiz Application</a>. All
            Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clip-rule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </Typography>
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clip-rule="evenodd"
                />
              </svg>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
</>
  );
};

export default Dashboard;















































































// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import QuestionDropdown from '../components/QuestionDropdown';
// import QuestionPrototype from '../components/QuestionPrototype';

// const Dashboard = () => {
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
        
//         const text = await response.text(); // Read the response as text
//         console.log('Response Text:', text); // Log the response text to debug
//         const myId = JSON.parse(text);
//         console.log(myId._id);
//         setMyID(myId._id);
//         setassignedQuizID(myId.quizId);

//         if (!response.ok) {
//           const result = JSON.parse(text);
//           setError(result.error);
//           return;
//         }
    
//         const userData = JSON.parse(text);
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
//         if (!myID) {
//           console.error('User ID not found');
//           return;
//         }

//         const response = await fetch(`/api/notifications?userId=${myID}`);
//         console.log("Response from Notifications", response)
//         if (!response.ok) {
//           throw new Error('Failed to fetch notifications');
//         }

//         const data = await response.json();
//         setNotifications(data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, [myID]);

//   // Fetch quizzes
//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await fetch('/api/quiz');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();

//         console.log("Data from /api/quiz", data);
//         setQuizzes(data);
//       } catch (error) {
//         console.error('Failed to fetch quizzes:', error);
//         alert('Failed to fetch quizzes. Check the console for details.');
//       }
//     };
    
//     fetchQuizzes();
//   }, []);
  
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
//       alert('Quiz created successfully!');
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
//       alert('Question saved successfully!');
//     } else {
//       alert('Failed to save question.');
//     }
//   };
  
//   // Handle assigning quiz to user
//   const handleAssignQuiz = async () => {
//     if (!selectedUser || !selectedQuiz || !myID) {
//       console.error('User or quiz not selected');
//       return;
//     }
//     console.error('User: ', selectedUser,  ' quiz', selectedQuiz,'Assigned By ', myID);
  
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
//       body: JSON.stringify({ id: notificationId, status: 'read' }),
//     });

//    console.log("Notifiaction Quiz ID:", quizId._id);
//    console.log("Notifiaction Quiz ID:", assignedQuiz);
//     // Redirect to the quiz page with the selected quizId
//     router.push(`/attempt-quiz/${quizId._id}`);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       {user && (
//         <div>
//           <p>Welcome, {user.name}!</p>
//           {/* Add more dashboard functionality here */}
//         </div>
//       )}
//       <div className=''>
//         <h1 className="text-2xl font-bold mb-4">Create Your Quiz</h1>
//         <input
//           type="text"
//           value={quizName}
//           onChange={(e) => setQuizName(e.target.value)}
//           placeholder="Quiz Name"
//           className="block w-full px-4 py-2 mb-4 border rounded"
//         />
//         <button onClick={handleCreateQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//           Create Quiz
//         </button>
  
//         <h1 className="text-2xl font-bold mb-4 mt-8">Add Questions to Your Quiz</h1>
//         <select
//           value={selectedQuiz}
//           onChange={(e) => setSelectedQuiz(e.target.value)}
//           className="block w-full px-4 py-2 mb-4 border rounded"
//         >
//           <option value="" disabled>Select Quiz</option>
//           {quizzes.map((quiz) => (
//             <option key={quiz._id} value={quiz._id}>{quiz.name}</option>
//           ))}
//         </select>
//         <QuestionDropdown type={questionType} onSelect={handleSelect} />
//         <QuestionPrototype
//           type={questionType}
//           question={question}
//           setQuestion={setQuestion}
//         />
//         <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
//           Save Question
//         </button>
  
//         <h1 className="text-2xl font-bold mb-4 mt-8">Assign Quiz</h1>
//         <select
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//           className="block w-full px-4 py-2 mb-4 border rounded"
//         >
//           <option value="" disabled>Select User</option>
//           {users.map((user) => (
//             <option key={user._id} value={user._id}>{user.name}</option>
//           ))}
//         </select>
//         <button onClick={handleAssignQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//           Assign Quiz
//         </button>
//       </div>
//       <div>
//         <h1 className="text-2xl font-bold mb-4 mt-8">Notifications</h1>
//         {notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div key={notification._id} className="mb-4 p-4 border rounded">
//               <p> {notification.status}</p>
              
//               <button
//                 onClick={() => handleNotificationClick(notification._id, notification.quizId)}
//                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//               >
//                 Start Quiz
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No notifications</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
