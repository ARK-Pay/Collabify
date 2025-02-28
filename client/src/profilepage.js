// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import ProfilePhoto from "../components/ProfilePhoto";

const ProfilePage = () => {
  // State to store the URL of the user's profile photo
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  useEffect(() => {
    // Function to fetch user profile data from the API
    const fetchUserProfile = async () => {
      const response = await fetch("/api/user-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
        },
      });
      const data = await response.json();
      // Set profile photo URL from response, fallback to empty string if none exists
      setProfilePhotoUrl(data.profilePhotoUrl || "");
    };

    // Call the fetch function when component mounts
    fetchUserProfile();
  }, []); // Empty dependency array means this runs once on mount

  // Callback handler for successful photo uploads
  const handleUploadSuccess = (newPhotoUrl) => {
    setProfilePhotoUrl(newPhotoUrl);
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <ProfilePhoto
        currentPhotoUrl={profilePhotoUrl}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default ProfilePage;
