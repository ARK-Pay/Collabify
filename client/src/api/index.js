// Import the axios library for making HTTP requests
import axios from "axios";

// Create an instance of the axios client with a base URL set to the API_BASE_URL environment variable
const API = axios.create({ baseURL: process.env.API_BASE_URL });

// Authentication endpoints

// Sign in endpoint: sends a POST request to /user/signin with email and password in the request body
export const signIn = async ({ email, password }) =>
  await API.post("/user/signin", { email, password });

// Sign up endpoint: sends a POST request to /user/signup with name, email, and password in the request body
export const signUp = async ({ name, email, password }) =>
  await API.post("/user/signup", {
    name,
    email,
    password,
  });

// Find user by email endpoint: sends a GET request to /auth/findbyemail with email as a query parameter
export const findUserByEmail = async (email) =>
  await API.get(`/auth/findbyemail?email=${email}`);

// Generate OTP endpoint: sends a GET request to /auth/generateotp with email, name, and reason as query parameters
export const generateOtp = async (email, name, reason) =>
  await API.get(
    `/auth/generateotp?email=${email}&name=${name}&reason=${reason}`
  );

// Verify OTP endpoint: sends a GET request to /auth/verifyotp with OTP code as a query parameter
export const verifyOtp = async (otp) =>
  await API.get(`/auth/verifyotp?code=${otp}`);

// Reset password endpoint: sends a PUT request to /auth/forgetpassword with email and new password in the request body
export const resetPassword = async (email, password) =>
  await API.put(`/auth/forgetpassword`, { email, password });
