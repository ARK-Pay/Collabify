// api/auth.js
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    // Return a structured error response
    return {
      status: error.response?.status || 500,
      data: {
        message: error.response?.data?.message || 'An error occurred during signup'
      }
    };
  }
};