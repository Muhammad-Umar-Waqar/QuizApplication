'use client'

import React, { useContext, useEffect, useState } from 'react';
import userContext from '@/context/userDetails/UserContext';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, Button, Grid, CircularProgress, Box } from '@mui/material';

function NotificationsPage() {
    const router = useRouter();
    const context = useContext(userContext);
    const { user } = context;
    const myID = user?._id;

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (myID) {
                    const response = await fetch(`/api/notifications?userId=${myID}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch notifications');
                    }
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [myID]);

    const handleNotificationClick = async (notificationId, quizId) => {
        // Mark the notification as read
        await fetch(`/api/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: notificationId, status: 'read', quizScore: 0 }),
        });

        // Redirect to the quiz page with the selected quizId
        router.push(`/dashboard/attempt-quiz/${quizId._id}`);
        localStorage.setItem("notificationId", notificationId);
    };

    const completedQuizzes = notifications.filter(n => n.status === 'completed');
    const attemptedQuizzes = notifications.filter(n => n.status !== 'completed');

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                Notifications
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" component="h2" sx={{ my: 2, color: '#1976D2', fontWeight: 'bold' }}>
                        Attempt Quiz
                    </Typography>
                    {attemptedQuizzes.length > 0 ? (
                        <Grid container spacing={3}>
                            {attemptedQuizzes.map((notification) => (
                                <Grid item xs={12} sm={6} md={4} key={notification._id}>
                                    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Assigned By: {notification.assignedBy.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Status: {notification.status}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Score: {notification.quizScore.toFixed(2)}
                                            </Typography>
                                            <Button
                                                onClick={() => handleNotificationClick(notification._id, notification.quizId)}
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Start Quiz
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="h6" align="center" color="text.secondary">
                            No attempted quizzes
                        </Typography>
                    )}

                    <Typography variant="h5" component="h2" sx={{ my: 4, color: '#1976D2', fontWeight: 'bold' }}>
                        Completed Quizzes
                    </Typography>
                    {completedQuizzes.length > 0 ? (
                        <Grid container spacing={3}>
                            {completedQuizzes.map((notification) => (
                                <Grid item xs={12} sm={6} md={4} key={notification._id}>
                                    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Assigned By: {notification.assignedBy.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Status: {notification.status}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Score: {notification.quizScore.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="h6" align="center" color="text.secondary">
                            No completed quizzes
                        </Typography>
                    )}
                </Box>
            )}
        </Container>
    );
}

export default NotificationsPage;
