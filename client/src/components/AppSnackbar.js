import React from 'react';
import { Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnackbar } from '../redux/snackbarSlice';

// Functional component that renders a Snackbar for notifications
const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  // Handles the closing of the Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      severity={severity} // This line might need to be adjusted depending on Snackbar prop usage
    />
  );
};

export default AppSnackbar;