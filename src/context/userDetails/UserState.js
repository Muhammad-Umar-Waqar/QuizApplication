'use client';

import React, { useEffect, useState } from 'react';
import UserContext from './UserContext'; // Make sure the context is correctly imported

function UserState({ children }) {
  const [user, setUser] = useState(null); // Initialize to null
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.warn('No token found');
        return;
      }

      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user data');
          return;
        }

        const userData = await response.json();
        setUser(userData); // Update user state with fetched data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [token]); // Depend on token so it re-runs if the token changes

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserState;
