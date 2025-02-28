import React, { useEffect, useState, useRef } from "react";
import OtpInput from "react-otp-input";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import axios from "axios";
import { loginSuccess } from "../redux/userSlice"; // Import loginSuccess action
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { useSetRecoilState } from "recoil";
import {
  userEmailState,
  userIdState,
  isAdminState,
} from "../store/atoms/authAtoms";
import { jwtDecode } from "jwt-decode";

// OTP component for verifying user email with a one-time password
const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
  // Setting up Recoil state management for user email, admin status, and user ID
  const setEmailRecoil = useSetRecoilState(userEmailState);
  const setIsAdminRecoil = useSetRecoilState(isAdminState);
  const setUserIdRecoil = useSetRecoilState(userIdState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables for OTP input, error messages, loading state, and timer
  const [otp, setOtp] = useState(""); // Holds the OTP input value
  const [otpError, setOtpError] = useState(""); // Holds error messages related to OTP
  const [otpLoading, setOtpLoading] = useState(false); // Indicates if OTP submission is in progress
  const [disabled, setDisabled] = useState(true); // Controls the disabled state of the submit button
  const [showTimer, setShowTimer] = useState(false); // Controls the visibility of the timer
  const [otpSent, setOtpSent] = useState(false); // Indicates if OTP has been sent
  const [timer, setTimer] = useState("00:00"); // Holds the timer value

  const Ref = useRef(null); // Reference for the timer interval

  // Function to calculate remaining time for the OTP timer
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date()); // Calculate total time remaining
    const seconds = Math.floor((total / 1000) % 60); // Calculate seconds
    const minutes = Math.floor((total / 1000 / 60) % 60); // Calculate minutes
    return { total, minutes, seconds }; // Return time remaining
  };

  // Function to start the timer
  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e); // Get remaining time
    if (total >= 0) {
      // Format and set the timer display
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  // Function to clear and reset the timer
  const clearTimer = (e) => {
    setTimer("01:00"); // Reset timer to 1 minute
    if (Ref.current) clearInterval(Ref.current); // Clear existing interval
    const id = setInterval(() => {
      startTimer(e); // Start the timer
    }, 1000); // Update every second
    Ref.current = id; // Store interval ID
  };

  // Function to get the deadline for the OTP timer
  const getDeadTime = () => {
    let deadline = new Date(); // Create a new date object
    deadline.setSeconds(deadline.getSeconds() + 60); // Set deadline to 60 seconds from now
    return deadline; // Return the deadline
  };

  // Function to resend the OTP
  const resendOtp = () => {
    setShowTimer(true); // Show the timer
    clearTimer(getDeadTime()); // Clear and reset the timer
    sendOtp(); // Send a new OTP
  };

  // Function to send the OTP to the user's email
  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/verify", {
        email,
      }); // Send OTP request
      if (response.status === 200) {
        // If successful, show success message
        dispatch(
          openSnackbar({
            message: "OTP sent Successfully",
            severity: "success",
          })
        );
        setDisabled(true); // Disable the submit button
        setOtp(""); // Clear OTP input
        setOtpError(""); // Clear any existing error messages
        setOtpLoading(false); // Reset loading state
        setOtpSent(true); // Mark OTP as sent
      } else {
        // If not successful, show error message
        dispatch(
          openSnackbar({
            message: response.status,
            severity: "error",
          })
        );
        setOtp(""); // Clear OTP input
        setOtpError(""); // Clear any existing error messages
        setOtpLoading(false); // Reset loading state
      }
    } catch (err) {
      // Handle any errors during the OTP request
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
    }
  };

  // Function to validate the entered OTP
  const validateOtp = async () => {
    setOtpLoading(true); // Set loading state to true
    setDisabled(true); // Disable the submit button
    try {
      const response = await axios.put("http://localhost:3001/user/verify", {
        email: email,
        registerOtp: otp, // Send the OTP for validation
      });

      if (response.status === 200) {
        const token = response.data.token; // Get the token from the response

        dispatch(loginSuccess({ token })); // Dispatch login success action
        localStorage.setItem("token", token); // Store token in local storage

        const decoded = jwtDecode(response.data.token); // Decode the token
        setEmailRecoil(decoded.email); // Set email in Recoil state
        setIsAdminRecoil(!!decoded.admin_id); // Set admin status in Recoil state
        setUserIdRecoil(decoded.admin_id || decoded.user_id); // Set user ID in Recoil state
        localStorage.setItem("userName", response.data.name); // Store user name in local storage
        localStorage.setItem("userEmail", decoded.email); // Store user email in local storage
        localStorage.setItem("userJoindate", response.data.joined_at); // Store user join date in local storage
        //set localstorage item userId for admin or user as per recieved
        localStorage.setItem("userId", decoded.admin_id || decoded.user_id);

        setOtpVerified(true); // Mark OTP as verified
        setOtp(""); // Clear OTP input
        setOtpError(""); // Clear any existing error messages
        setDisabled(false); // Enable the submit button
        dispatch(
          openSnackbar({
            message: "OTP verified successfully!", // Show success message
            severity: "success",
          })
        );
        setTimeout(() => {
          if (!decoded.admin_id) {
            navigate("/dashboard/user"); // Navigate to user dashboard if not admin
          }
        }, 100);
      } else {
        setOtpLoading(false); // Reset loading state
        setDisabled(false); // Enable the submit button
        setOtpError(response.data.message); // Set error message
        dispatch(
          openSnackbar({
            message: response.data.message, // Show error message
            severity: "error",
          })
        );
      }
    } catch (err) {
      // Handle errors during OTP validation
      dispatch(
        openSnackbar({
          message: "Enter a valid otp", // Show error message
          severity: "error",
        })
      );
      setOtpError("Enter a valid otp"); // Set error message
    } finally {
      // Ensure loading state is reset in all cases
      setOtpLoading(false); // Reset loading state
      setDisabled(false); // Enable the submit button
    }
  };

  // Initial effect to send OTP and start the timer
  useEffect(() => {
    sendOtp(); // Send OTP on component mount
    clearTimer(getDeadTime()); // Start the timer
  }, []);

  // Effect to manage timer visibility
  useEffect(() => {
    if (timer === "00:00") {
      setShowTimer(false); // Hide timer when it reaches zero
    } else {
      setShowTimer(true); // Show timer if time is remaining
    }
  }, [timer]);

  // Effect to enable/disable submit button based on OTP length
  useEffect(() => {
    if (otp.length === 6) {
      setDisabled(false); // Enable button if OTP is 6 characters
    } else {
      setDisabled(true); // Disable button otherwise
    }
  }, [otp]);

  return (
    <div>
      <div className="text-[22px] font-medium text-[color:var(--text-color)] my-4 mx-[22px]">
        VERIFY OTP
      </div>
      <div className="text-[14px] font-medium text-[color:var(--soft2-color)] mx-[26px]">
        A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:
      </div>{" "}
      <span className="text-[12px] text-[color:var(--primary-color)] mx-[26px]">
        {email}
      </span>
      {!otpSent ? (
        <div className="p-3 mb-5 text-center flex flex-col items-center gap-[14px] justify-center">
          Sending OTP
          <CircularProgress color="inherit" size={20} />{" "}
        </div>
      ) : (
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus={true}
            inputStyle={{
              fontSize: "22px",
              width: "38px",
              height: "38px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              textAlign: "center",
              margin: "6px 4px",
              backgroundColor: "transparent",
              color: "white",
            }}
            containerStyle={{ 
              padding: "8px 2px", 
              justifyContent: "center" 
            }}
            renderInput={(props) => <input {...props} />}
          />
          <div 
            className={`text-red-500 text-[12px] mx-[26px] my-2 ${otpError ? 'block' : 'hidden'}`}
          >
            <b>{otpError}</b>
          </div>
          <div
            className={`
              h-[44px] 
              rounded-[12px] 
              border 
              border-[color:var(--soft2-color)] 
              text-[color:var(--soft2-color)] 
              mx-[20px] 
              my-[3px] 
              text-[14px] 
              flex 
              justify-center 
              items-center 
              font-medium 
              px-[14px]
              mt-3 
              mb-3
              cursor-pointer
              ${!disabled 
                ? 'bg-[color:var(--item-hover-color)] text-[color:var(--soft2-color)]' 
                : 'bg-[color:var(--primary-color)] text-white'
              }
            `}
            onClick={validateOtp}
          >
            {otpLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </div>
          {showTimer ? (
            <div className="text-[color:var(--soft2-color)] text-[12px] mx-[26px] my-2 block">
              Resend in <b>{timer}</b>
            </div>
          ) : (
            <div 
              className="
                text-[color:var(--primary-color)] 
                text-[14px] 
                mx-[26px] 
                my-2 
                block 
                cursor-pointer
              "
              onClick={resendOtp}
            >
              <b>Resend</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OTP; // Export the OTP component