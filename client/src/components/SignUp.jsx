import React, { useState, useEffect } from "react";
import {
  CloseRounded,
  EmailRounded,
  PasswordRounded,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IconButton, Modal, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginStart, loginFailure } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import validator from "validator";
import axios from "axios";
import OTP from "./OTP";
import { ThemeProvider } from "styled-components";

const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
  // State management for the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // New states to track field interactions
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  // Error states
  const [emailError, setEmailError] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameCorrect, setNameCorrect] = useState(false);

  const [values, setValues] = useState({
    showPassword: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const dispatch = useDispatch();

  // Form submission logic
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      dispatch(openSnackbar({ message: "Please fill all fields", severity: "error" }));
      return;
    }

    try {
      setLoading(true);
      dispatch(loginStart());

      const response = await axios.post("http://localhost:3001/user/signup", {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        dispatch(
          openSnackbar({
            message: "Account created successfully. Please verify your OTP.",
            severity: "success",
          })
        );
        setOtpSent(true);
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 400) {
        dispatch(openSnackbar({ message: "User already exists", severity: "error" }));
      } else if (error.response?.status === 500) {
        dispatch(
          openSnackbar({
            message: "Server error. Please try again later.",
            severity: "error",
          })
        );
      } else {
        dispatch(loginFailure());
        setCredentialError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Validates the email
  const validateEmail = () => {
    setEmailError(
      touched.email && !validator.isEmail(email) 
        ? "Enter a valid email ID!" 
        : ""
    );
  };

  // Validates the password
  const validatePassword = () => {
    if (!touched.password) {
      setCredentialError("");
      return;
    }

    if (password.length < 8) {
      setCredentialError("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setCredentialError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^a-zA-Z\d]/.test(password)
    ) {
      setCredentialError(
        "Password must include at least one uppercase, one lowercase, one number, and one special character!"
      );
      setPasswordCorrect(false);
    } else {
      setCredentialError("");
      setPasswordCorrect(true);
    }
  };

  // Validates the name
  const validateName = () => {
    setNameCorrect(
      touched.name && name.length >= 4
    );
  };

  // Handle field blur (when user moves away from input)
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Updates disabled state based on validations
  useEffect(() => {
    // Validate fields
    validateEmail();
    validatePassword();
    validateName();

    // Determine button state
    setDisabled(
      !(
        name &&
        validator.isEmail(email) &&
        passwordCorrect &&
        nameCorrect
      )
    );
  }, [name, email, password, touched, nameCorrect, passwordCorrect]);

  // Account creation after OTP verification
  const createAccount = () => {
    if (otpVerified) {
      dispatch(openSnackbar({ message: "Your account has been verified!", severity: "success" }));
      setSignUpOpen(false);
    }
  };

  return (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-black dark:text-white p-3 flex flex-col relative">
          <CloseRounded
            className="absolute top-6 right-8 cursor-pointer"
            onClick={() => setSignUpOpen(false)}
          />
          {!otpSent ? (
            <>
              <h1 className="text-[22px] font-medium mx-7 my-4 text-center">Join Teamsync</h1>
              <div className="h-11 rounded-xl border mx-5 mt-6 px-4 flex items-center">
                <Person className="mr-3" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  onInput={(e) => {
                    setName(e.target.value);
                    setTouched(prev => ({ ...prev, name: true }));
                  }}
                />
              </div>
              {touched.name && name.length > 0 && name.length < 4 && (
                <p className="text-red-500 text-xs mx-6">Name must be at least 4 characters long!</p>
              )}
              <div className="h-11 rounded-xl border mx-5 mt-3 px-4 flex items-center">
                <EmailRounded className="mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  onInput={(e) => {
                    setEmail(e.target.value);
                    setTouched(prev => ({ ...prev, email: true }));
                  }}
                />
              </div>
              {emailError && <p className="text-red-500 text-xs mx-6">{emailError}</p>}
              <div className="h-11 rounded-xl border mx-5 mt-3 px-4 flex items-center">
                <PasswordRounded className="mr-3" />
                <input
                  type={values.showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onInput={(e) => {
                    setPassword(e.target.value);
                    setTouched(prev => ({ ...prev, password: true }));
                  }}
                />
                <IconButton onClick={() => setValues({ showPassword: !values.showPassword })}>
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
              {credentialError && <p className="text-red-500 text-xs mx-6">{credentialError}</p>}
              <div className="px-5">
                <button
                  onClick={handleSignUp}
                  disabled={disabled}
                  className={`w-full h-11 rounded-md text-white mt-3 ${
                    disabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </button>
              </div>
              <p className="text-sm mt-5 mx-5 text-center">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setSignInOpen(true);
                    setSignUpOpen(false);
                  }}
                >
                  Sign In
                </span>
              </p>
            </>
          ) : (
              <OTP email={email} setOtpVerified={setOtpVerified} createAccount={createAccount} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SignUp;