import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import axios from "axios";
import {
  CloseRounded,
  EmailRounded,
  Visibility,
  VisibilityOff,
  PasswordRounded,
} from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import OTP from "./OTP";
import ResetPassword from "./ResetPassword";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  userEmailState,
  userIdState,
  isAdminState,
  userNameState,
} from "../store/atoms/authAtoms";
import { jwtDecode } from "jwt-decode";

/**
 * SignIn component handles user authentication and login functionality.
 * It manages local state for email, password, loading status, and error messages.
 * It also integrates with Redux for global state management and Recoil for local state.
 */
const SignIn = ({ setSignInOpen, setSignUpOpen }) => {
  const navigate = useNavigate(); // Hook for navigation
  const setEmailRecoil = useSetRecoilState(userEmailState); // Recoil state for user email
  const setIsAdminRecoil = useSetRecoilState(isAdminState); // Recoil state for admin status
  const setUserIdRecoil = useSetRecoilState(userIdState); // Recoil state for user ID
  const setNameRecoil = useSetRecoilState(userNameState); // Recoil state for user name

  const [email, setEmail] = useState(""); // Local state for email input
  const [password, setPassword] = useState(""); // Local state for password input
  const [Loading, setLoading] = useState(false); // Local state for loading status
  const [disabled, setDisabled] = useState(true); // Local state for button disable status
  const [values, setValues] = useState({
    // Local state for password visibility
    password: "",
    showPassword: false,
  });
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false); // Local state for reset password modal
  const [showOTP, setShowOTP] = useState(false); // Local state for OTP visibility
  const [otpVerified, setOtpVerified] = useState(false); // Local state for OTP verification status
  const dispatch = useDispatch(); // Hook for dispatching Redux actions
  const [isAdmin, setIsAdmin] = useState(false); // Local state for admin status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state for login status
  const [userBlocked, setUserBlocked] = useState(false); // Local state for user block status
  const [needsOTPVerification, setNeedsOTPVerification] = useState(false); // Local state for OTP requirement
  const [apiResponse, setApiResponse] = useState(null); // Local state for API response
  const [emailError, setEmailError] = useState(""); // Local state for email error message
  const [credentialError, setcredentialError] = useState(""); // Local state for credential error message

  useEffect(() => {
    if (email !== "") validateEmail(); // Validate email if not empty
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false); // Enable button if email is valid and password length is sufficient
    } else {
      setDisabled(true); // Disable button otherwise
    }
  }, [email, password]);

  useEffect(() => {
    if (otpVerified && needsOTPVerification && apiResponse) {
      localStorage.setItem("token", apiResponse.data.token); // Store token in local storage
      dispatch(loginSuccess("Success")); // Dispatch success action
      setIsLoggedIn(true); // Update login status
      setSignInOpen(false); // Close sign-in modal
      dispatch(
        openSnackbar({
          message: "Logged In Successfully", // Show success message
          severity: "success",
        })
      );
    }
  }, [otpVerified, needsOTPVerification, apiResponse]);

  /**
   * handleLogin function manages the login process, including API calls and state updates.
   * It handles various response statuses and updates the UI accordingly.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!disabled) {
      dispatch(loginStart()); // Dispatch login start action
      setDisabled(true); // Disable button during login
      setLoading(true); // Set loading state

      setUserBlocked(false); // Reset user block status
      setNeedsOTPVerification(false); // Reset OTP requirement
      setcredentialError(""); // Clear credential error

      try {
        const res = await axios.post(
          `${
            isAdmin
              ? "http://localhost:3001/admin/signin"
              : "http://localhost:3001/user/signin"
          }`,
          { email, password } // Send email and password to API
        );

        setApiResponse(res); // Store API response

        switch (res.status) {
          case 200:
            localStorage.setItem("token", res.data.token); // Store token in local storage
            const decoded = jwtDecode(res.data.token); // Decode JWT token

            setEmailRecoil(decoded.email); // Update Recoil state with email
            setIsAdminRecoil(!!decoded.admin_id); // Update Recoil state with admin status
            setUserIdRecoil(decoded.admin_id || decoded.user_id); // Update Recoil state with user ID
            setNameRecoil(res.data.name); // Update Recoil state with user name
            localStorage.setItem("userName", res.data.name); // Store user name in local storage
            localStorage.setItem("userEmail", decoded.email); // Store user email in local storage
            localStorage.setItem("isAdmin", !!decoded.admin_id); // Store admin status in local storage
            localStorage.setItem("userId", decoded.admin_id || decoded.user_id); // Store user ID in local storage
            localStorage.setItem("userJoindate", res.data.joined_at); // Store join date in local storage
            dispatch(loginSuccess(res.data)); // Dispatch success action with user data
            setIsLoggedIn(true); // Update login status
            setSignInOpen(false); // Close sign-in modal
            dispatch(
              openSnackbar({
                message: "Logged In Successfully", // Show success message
                severity: "success",
              })
            );
            setTimeout(() => {
              console.log(isAdmin);
              if (!isAdmin) {
                navigate("/dashboard/user"); // Navigate to user dashboard
              } else {
                navigate("/dashboard/admin"); // Navigate to admin dashboard
              }
            }, 100);
            break;

          case 401:
            setUserBlocked(true); // Set user block status
            dispatch(loginFailure()); // Dispatch failure action
            setcredentialError(
              "Your account has been blocked. Please contact support."
            ); // Set error message
            dispatch(
              openSnackbar({
                message: "Account blocked", // Show error message
                severity: "error",
              })
            );
            break;

          case 402:
            dispatch(
              openSnackbar({
                message: "Please verify your account", // Show verification message
                severity: "success",
              })
            );
            setNeedsOTPVerification(true); // Set OTP requirement
            setShowOTP(true); // Show OTP component
            break;

          case 400:
            dispatch(loginFailure()); // Dispatch failure action
            setcredentialError(res.data.errors[0]); // Set error message
            dispatch(
              openSnackbar({
                message: `Error: ${res.data.errors[0]}`, // Show error message
                severity: "error",
              })
            );
            break;

          default:
            dispatch(loginFailure()); // Dispatch failure action
            setcredentialError(`Unexpected Error: ${res.data}`); // Set unexpected error message
        }
      } catch (err) {
        console.log(err); // Log error
        if (err.response) {
          switch (err.response.status) {
            case 400:
              setcredentialError("Invalid credentials"); // Set invalid credentials error
              break;
            case 401:
              setUserBlocked(true); // Set user block status
              setcredentialError(
                "Your account has been blocked. Please contact support."
              ); // Set error message
              break;
            case 402:
              setNeedsOTPVerification(true); // Set OTP requirement
              setShowOTP(true); // Show OTP component
              break;
            default:
              setcredentialError(
                err.response.data.errors[0] || "An error occurred"
              ); // Set general error message
          }
        } else {
          setcredentialError("Network error. Please try again."); // Set network error message
        }

        dispatch(loginFailure()); // Dispatch failure action
        dispatch(
          openSnackbar({
            message: credentialError, // Show error message
            severity: "error",
          })
        );
      } finally {
        setLoading(false); // Reset loading state
        setDisabled(false); // Enable button
      }
    }

    if (email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields", // Show error message for empty fields
          severity: "error",
        })
      );
    }
  };

  /**
   * validateEmail function checks if the email is valid and updates the email error state.
   */
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError(""); // Clear email error if valid
    } else {
      setEmailError("Enter a valid Email Id!"); // Set email error if invalid
    }
  };

  return !isLoggedIn ? (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        {!resetPasswordOpen && (
          <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-black dark:text-white p-3 flex flex-col relative">
            <CloseRounded
              className="absolute top-6 right-8 cursor-pointer text-black dark:text-white"
              onClick={() => setSignInOpen(false)}
            />
            {needsOTPVerification && showOTP ? (
              <OTP
                email={email}
                name="User"
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
                reason="LOGIN"
              />
            ) : (
              <>
                <h1 className="text-[22px] font-medium mx-7 my-4 text-center text-black dark:text-white">
                  Welcome back!
                </h1>
                <h1 className="text-[13px] text-center text-gray-600 dark:text-blue-500">
                  Sign in to seamlessly collaborate with your team.
                </h1>

                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 mx-5 my-1 mt-6 px-4 flex items-center">
                  <EmailRounded className="mr-3 text-gray-600 dark:text-white" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-950 dark:text-white"
                    placeholder="Email Id"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {emailError}
                  </div>
                )}
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 mx-5 my-1 px-4 flex items-center">
                  <PasswordRounded className="mr-3 text-gray-600 dark:text-white" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-950 dark:text-white"
                    placeholder="Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton 
                    color="inherit" 
                    onClick={() =>
                      setValues({
                        ...values,
                        showPassword: !values.showPassword,
                      })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility className="text-gray-600 dark:text-white" />
                    ) : (
                      <VisibilityOff className="text-gray-600 dark:text-white" />
                    )}
                  </IconButton>
                </div>
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 mx-5 mt-3 px-4 flex items-center">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor="admin" className="text-black dark:text-white">Admin</label>
                </div>
                {credentialError && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {credentialError}
                  </div>
                )}
                {userBlocked && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {credentialError}
                  </div>
                )}
                <div
                  className={`text-sm mx-7 my-2 text-right 
                    ${isAdmin 
                      ? 'text-gray-400 opacity-30 cursor-not-allowed' 
                      : 'text-blue-500 dark:text-blue-400 cursor-pointer hover:underline'
                    }`}
                  onClick={() => !isAdmin && setResetPasswordOpen(true)}
                >
                  <b>Forgot password?</b>
                </div>

                <div className="px-5">
                  <button
                    onClick={handleLogin}
                    disabled={disabled}
                    className={`w-full h-11 rounded-md text-white text-base mt-3 transition-colors
                    ${
                      disabled
                        ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    }`}
                  >
                    {Loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-5 my-5 mb-10 flex justify-center items-center">
                  Don't have an account?{" "}
                  <span
                    className={`ml-1 ${
                      isAdmin
                        ? 'text-gray-400 opacity-30 cursor-not-allowed'
                        : 'text-blue-500 cursor-pointer hover:underline'
                    }`}
                    onClick={() => {
                      if (!isAdmin) {
                        setSignUpOpen(true);
                        setSignInOpen(false);
                      }
                    }}
                  >
                    Sign Up
                  </span>
                </p>
              </>
            )}
          </div>
        )}
        {resetPasswordOpen && (
          <ResetPassword
            setResetPasswordOpen={setResetPasswordOpen}
            setSignInOpen={setSignInOpen}
          />
        )}
      </div>
    </Modal>
  ) : null;
};

export default SignIn; // Export SignIn component
