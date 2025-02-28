import { createSlice } from "@reduxjs/toolkit";

// Initial state for the snackbar component
const initialState = {
    open: false,
    message: "",
    severity: "success",
};

// Create a slice for the snackbar with its name, initial state, and reducers
const snackbar = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        // Action to open the snackbar with a message and severity
        openSnackbar: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.severity = action.payload.severity;
        },
        // Action to close the snackbar
        closeSnackbar: (state) => {
            state.open = false;
        }
    }
});

// Exporting the actions for use in components
export const { openSnackbar, closeSnackbar } = snackbar.actions;

// Exporting the reducer to be used in the store
export default snackbar.reducer;