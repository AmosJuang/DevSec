import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in');
    }

    const data = await response.json();
    console.log('Sign in response:', data);

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Token stored in localStorage');
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};