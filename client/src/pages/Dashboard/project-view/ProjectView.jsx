import React, { useState } from 'react';
import Hero from './components/Hero';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authenticationState } from '../../../store/atoms/authVerifierSelector';
import { sidebarSelection } from '../../../store/atoms/adminDashboardAtoms';
import ChatModal from './components/ChatModal';
import ReportModal from './components/ReportModal';

// New Video Call Button Component
const VideoCallButton = () => {
  return (
    <button 
      onClick={() => window.location.href = "/video-call"} 
      className="bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      📹 Video Call
    </button>
  );
};

const ProjectView = () => {
  let selectedSidebar = useRecoilValue(sidebarSelection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useRecoilValue(authenticationState);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  setTimeout(() => {
    if (!auth.isValid || auth.isAdmin) {
      return <Navigate to="/" />;
    }
  }, 100);

  return (
    <>
      <Hero />

      {/* Buttons Section (Video Call, Chat, Report) */}
      <div className="absolute top-10 right-40 z-10 flex gap-4">
        <VideoCallButton />  {/* New Video Call Button */}
        <ChatModal /> 
        <ReportModal />
      </div>
    </>
  );
};

export default ProjectView;
