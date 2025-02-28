import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  isLoggedIn: false, // Added isLoggedIn state
};

// Create a slice of the Redux store for user management
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to indicate the start of the login process
    loginStart: (state) => {
      state.loading = true;
    },
    // Action to handle successful login
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true; // Set isLoggedIn to true on successful login
      localStorage.setItem('token', action.payload.token);
    },
    // Action to handle failed login attempts
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    // Action to handle user logout
    logout: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false; // Set isLoggedIn to false on logout
      state.loading = false;
      state.error = false;
      localStorage.removeItem('token');
    },
    // Action to verify the current user
    verified: (state, action) => {
      if (state.currentUser) {
        state.currentUser.verified = action.payload;
      }
    },
  },
});

// Exporting actions for use in components
export const { loginStart, loginSuccess, loginFailure, logout, verified } = userSlice.actions;

export default userSlice.reducer;