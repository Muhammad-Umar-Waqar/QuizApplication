'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Box, Card, CardContent, Input } from '@mui/material';
import { toast } from 'react-toastify';
import QuestionDropdown from '@/app/components/QuestionDropdown';
import QuestionPrototype from '@/app/components/QuestionPrototype';
import userContext from '@/context/userDetails/UserContext';

function CreateQuizPage() {
    const context = useContext(userContext);
    const { user } = context;
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [question, setQuestion] = useState(null);
    const myID = user?._id;
    const [assignedQuiz, setAssignedQuizID] = useState('');
    const [quizName, setQuizName] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('/api/getquiz');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Failed to fetch quizzes from api/quiz:', error);
            }
        };

        fetchQuizzes();
    }, [myID]);

    const handleSelect = (type) => {
        setQuestionType(type);
        setQuestion(
            type === 'MCQs' ? { questionText: '', options: ['', '', '', ''], correctOption: null } :
            type === 'True/False Questions' ? { questionText: '', correctOption: null } :
            { questionText: '', correctAnswer: '' }
        );
    };

    const handleSave = async () => {
        if (!selectedQuiz || !questionType || !question) {
            toast.error('Please select a quiz and enter question details.');
            return;
        }

        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quizId: selectedQuiz, type: questionType, ...question }),
        });

        setAssignedQuizID(selectedQuiz);

        if (response.ok) {
            setQuestion(null);
            toast.success('Question saved successfully!');
        } else {
            toast.error('Failed to save question.');
        }
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
      toast.warning('Give Name to Quiz');
    }
  };
  

    return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            




          




            <Box>
            <Card sx={{ minWidth: 500, boxShadow: 5, borderRadius: 4, padding: "32px" }}>
                <CardContent>
                  
                  
                    <Box mt={4} display="flex" flexDirection="column" gap={3}>
                    <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                        Name Your Quiz
                    </Typography>
                <Input
                    type="text"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Quiz Name"
                    className="block text-gray-700 w-full px-4 py-2 mb-4 border rounded"
                />
            
                    <Button onClick={handleCreateQuiz}
                            variant="contained"
                            color="primary"
                            sx={{
                                background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                marginTop: "20px",
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 60%, #21CBF3 100%)',
                                },
                            }}
                        >
                                 Create Quiz
                        </Button>
                        <Typography variant="h4" component="div" align="center" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                        Add Questions to Your Quiz
                    </Typography>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="select-quiz-label">Select Quiz</InputLabel>
                            <Select
                                labelId="select-quiz-label"
                                value={selectedQuiz}
                                onChange={(e) => setSelectedQuiz(e.target.value)}
                                label="Select Quiz"
                            >
                                <MenuItem value="" disabled>
                                    Select Quiz
                                </MenuItem>
                                {quizzes.map((quiz) => (
                                    <MenuItem key={quiz._id} value={quiz._id}>
                                        {quiz.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Updated Question Type Dropdown for Consistency */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="select-question-type-label">Select Question Type</InputLabel>
                            <Select
                                labelId="select-question-type-label"
                                value={questionType}
                                onChange={(e) => handleSelect(e.target.value)}
                                label="Select Question Type"
                            >
                                <MenuItem value="" disabled>
                                    Select Question Type
                                </MenuItem>
                                <MenuItem value="MCQs">MCQs</MenuItem>
                                <MenuItem value="True/False Questions">True/False</MenuItem>
                                <MenuItem value="Fill in the Blanks">Fill in the Blanks</MenuItem>
                            </Select>
                        </FormControl>

                        <QuestionPrototype
                            type={questionType}
                            question={question}
                            setQuestion={setQuestion}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{
                                background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                marginTop: "20px",
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 60%, #21CBF3 100%)',
                                },
                            }}
                        >
                            Save Question
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            </Box>
        </Container>
    );
}

export default CreateQuizPage;
