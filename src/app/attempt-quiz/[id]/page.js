// 'use client';

// import { useParams } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const AttemptQuizPage = () => {
//   const [quiz, setQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [showResult, setShowResult] = useState(false);
//   const [score, setScore] = useState(0);

//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const fetchQuiz = async () => {
//         try {
//           const response = await fetch(`/api/quiz/${id}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch quiz');
//           }
//           const data = await response.json();
//           setQuiz(data);
//           setQuestions(data.questions);
//         } catch (error) {
//           console.error('Error fetching quiz:', error);
//         }
//       };

//       fetchQuiz();
//     }
//   }, [id]);

//   const handleAnswerChange = (questionId, answer) => {
//     if (answer === 'true') {
//       setAnswers({ ...answers, [questionId]: 1 });
//     } else if (answer === 'false') {
//       setAnswers({ ...answers, [questionId]: 0 });
//     } else {
//       setAnswers({ ...answers, [questionId]: answer });
//     }
//   };

//   const handleSubmitQuiz = async () => {
//     let correctAnswersCount = 0;
//     questions.forEach((question) => {
//       if (question.type === 'MCQs' && question.correctOption === parseInt(answers[question._id])) {
//         correctAnswersCount++;
//       } else if (question.type === 'True/False Questions' && question.correctOption === answers[question._id]) {
//         console.log("question.correctOption === answers[question._id]", question.correctOption, "    ",answers[question._id])
//         correctAnswersCount++;
//       } else if (question.type === 'Fill in the Blanks' && question.correctAnswer.toLowerCase() === answers[question._id]?.toLowerCase()) {
//         correctAnswersCount++;
//       }
//     });

//     const percentageScore = (correctAnswersCount / questions.length) * 100;
//     setScore(percentageScore);
//     setShowResult(true);
//    const notificationId = localStorage.getItem("notificationId");
//     await fetch(`/api/notifications/${notificationId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: notificationId, status: 'completed', quizScore: percentageScore }),
//     });
  
//   };

//   if (!quiz) {
//     return <div>Loading...</div>;
//   }

//   if (showResult) {
//     return (
//       <div>
//         <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
//         <p>Your score: {score.toFixed(2)}%</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">{quiz.name}</h1>
//       <p>Assigned By: {quiz.assignedBy?.name}</p> {/* Display the name of the user who assigned the quiz */}
//       {questions?.map((question) => (
//         <div key={question._id} className="mb-4">
//           <p>{question.questionText}</p>
//           {question.type === 'MCQs' &&
//             question.options.map((option, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={`${question._id}-${index}`}
//                   name={question._id}
//                   value={index}
//                   onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//                 />
//                 <label htmlFor={`${question._id}-${index}`}>{option}</label>
//               </div>
//             ))}
//           {question.type === 'True/False Questions' && (
//             <>
//               <input
//                 type="radio"
//                 id={`${question._id}-true`}
//                 name={question._id}
//                 value="true"
//                 onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               />
//               <label htmlFor={`${question._id}-true`}>True</label>
//               <input
//                 type="radio"
//                 id={`${question._id}-false`}
//                 name={question._id}
//                 value="false"
//                 onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               />
//               <label htmlFor={`${question._id}-false`}>False</label>
//             </>
//           )}
//           {question.type === 'Fill in the Blanks' && (
//             <input
//               type="text"
//               onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               className="block w-full px-4 py-2 mb-4 border rounded"
//             />
//           )}
//         </div>
//       ))}
//       {questions?.length > 0 && (
//         <button onClick={handleSubmitQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//           Submit Quiz
//         </button>
//       )}
//     </div>
//   );
// };

// export default AttemptQuizPage;





'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

const AttemptQuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        try {
          const response = await fetch(`/api/quiz/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch quiz');
          }
          const data = await response.json();
          setQuiz(data);
          setQuestions(data.questions);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      };

      fetchQuiz();
    }
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    let correctAnswersCount = 0;
    questions.forEach((question) => {
      if (question.type === 'MCQs' && question.correctOption === parseInt(answers[question._id])) {
        correctAnswersCount++;
      } else if (question.type === 'True/False Questions' && question.correctOption === answers[question._id]) {
        correctAnswersCount++;
      } else if (question.type === 'Fill in the Blanks' && question.correctAnswer.toLowerCase() === answers[question._id]?.toLowerCase()) {
        correctAnswersCount++;
      }
    });

    const percentageScore = (correctAnswersCount / questions.length) * 100;
    setScore(percentageScore);
    setShowResult(true);

    const notificationId = localStorage.getItem("notificationId");
    await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: notificationId, status: 'completed', quizScore: percentageScore }),
    });
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
        <p>Your score: {score.toFixed(2)}%</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Start Quiz
          </button>
        </DialogTrigger>
        <DialogContent className="p-6 max-w-md mx-auto bg-white rounded shadow-lg">
          <DialogTitle className="text-2xl font-bold mb-4">{quiz.name}</DialogTitle>
          <div className="flex flex-col items-center">
            <Tabs value={`question${currentQuestionIndex + 1}`} onValueChange={(value) => setCurrentQuestionIndex(parseInt(value.replace('question', '')) - 1)}>
              <TabsList className="flex mb-4">
                {quiz.questions.map((_, index) => (
                  <TabsTrigger key={index} value={`question${index + 1}`} className="px-4 py-2 border rounded-l-md">
                    {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {quiz.questions.map((question, index) => (
                <TabsContent key={index} value={`question${index + 1}`} className="p-4">
                  <div className="mb-4">
                    <p>{question.questionText}</p>
                    {question.type === 'MCQs' &&
                      question.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="radio"
                            id={`${question._id}-${index}`}
                            name={question._id}
                            value={index}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="mr-2"
                          />
                          <label htmlFor={`${question._id}-${index}`}>{option}</label>
                        </div>
                      ))}
                    {question.type === 'True/False Questions' && (
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`${question._id}-true`}
                          name={question._id}
                          value="true"
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="mr-2"
                        />
                        <label htmlFor={`${question._id}-true`}>True</label>
                        <input
                          type="radio"
                          id={`${question._id}-false`}
                          name={question._id}
                          value="false"
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="ml-4 mr-2"
                        />
                        <label htmlFor={`${question._id}-false`}>False</label>
                      </div>
                    )}
                    {question.type === 'Fill in the Blanks' && (
                      <input
                        type="text"
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="block w-full px-4 py-2 mb-4 border rounded"
                      />
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                disabled={currentQuestionIndex === quiz.questions.length - 1}
              >
                Next
              </button>
            </div>
            {quiz.questions.length > 0 && (
              <button
                onClick={handleSubmitQuiz}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttemptQuizPage;




















// 'use client';

// import { useParams } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const AttemptQuizPage = () => {
//   const [quiz, setQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [showResult, setShowResult] = useState(false);
//   const [score, setScore] = useState(0);

//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const fetchQuiz = async () => {
//         try {
//           const response = await fetch(`/api/quiz/${id}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch quiz');
//           }
//           const data = await response.json();
//           setQuiz(data);
//           setQuestions(data.questions);
//         } catch (error) {
//           console.error('Error fetching quiz:', error);
//         }
//       };

//       fetchQuiz();
//     }
//   }, [id]);

//   const handleAnswerChange = (questionId, answer) => {
//     setAnswers({ ...answers, [questionId]: answer });
//   };

//   const handleSubmitQuiz = () => {
//     let correctAnswersCount = 0;
//     questions.forEach((question) => {
//       if (question.type === 'MCQs' && question.correctOption === parseInt(answers[question._id])) {
//         correctAnswersCount++;
//       } else if (question.type === 'True/False Questions' && question.correctAnswer === answers[question._id]) {
//         console.log("question.correctAnswer === answers[question._id]", question.correctAnswer, "    ",answers[question._id])
//         correctAnswersCount++;
//       } else if (question.type === 'Fill in the Blanks' && question.correctAnswer.toLowerCase() === answers[question._id]?.toLowerCase()) {
//         correctAnswersCount++;
//       }
//     });

//     const percentageScore = (correctAnswersCount / questions.length) * 100;
//     setScore(percentageScore);
//     setShowResult(true);
//   };

//   if (!quiz) {
//     return <div>Loading...</div>;
//   }

//   if (showResult) {
//     return (
//       <div>
//         <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
//         <p>Your score: {score.toFixed(2)}%</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">{quiz.name}</h1>
//       <p>Assigned By: {quiz.assignedBy?.name}</p> {/* Display the name of the user who assigned the quiz */}
//       {questions?.map((question) => (
//         <div key={question._id} className="mb-4">
//           <p>{question.questionText}</p>
//           {question.type === 'MCQs' &&
//             question.options.map((option, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={`${question._id}-${index}`}
//                   name={question._id}
//                   value={index}
//                   onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//                 />
//                 <label htmlFor={`${question._id}-${index}`}>{option}</label>
//               </div>
//             ))}
//           {question.type === 'True/False Questions' && (
//             <>
//               <input
//                 type="radio"
//                 id={`${question._id}-true`}
//                 name={question._id}
//                 value="true"
//                 onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               />
//               <label htmlFor={`${question._id}-true`}>True</label>
//               <input
//                 type="radio"
//                 id={`${question._id}-false`}
//                 name={question._id}
//                 value="false"
//                 onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               />
//               <label htmlFor={`${question._id}-false`}>False</label>
//             </>
//           )}
//           {question.type === 'Fill in the Blanks' && (
//             <input
//               type="text"
//               onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//               className="block w-full px-4 py-2 mb-4 border rounded"
//             />
//           )}
//         </div>
//       ))}
//       {questions?.length > 0 && (
//         <button onClick={handleSubmitQuiz} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
//           Submit Quiz
//         </button>
//       )}
//     </div>
//   );
// };

// export default AttemptQuizPage;

