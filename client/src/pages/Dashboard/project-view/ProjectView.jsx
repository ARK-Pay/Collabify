import React, { useState } from 'react';
import Hero from './components/Hero';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authenticationState } from '../../../store/atoms/authVerifierSelector';
import { sidebarSelection } from '../../../store/atoms/adminDashboardAtoms';
import ChatModal from './components/ChatModal';
import ReportModal from './components/ReportModal';
import CodeEditor from './components/CodeEditor';


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
  const [showCodeEditor, setShowCodeEditor] = useState(false);

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
        <button 
          onClick={() => window.open('/code-editor')}
          className="p-2 bg-[rgb(23,37,84)] text-white rounded hover:bg-[rgb(16,28,65)]"
        >
          Code Editor
        </button>
      </div>

      {/* Add Code Editor Modal */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Code Editor</h2>
              <button 
                onClick={() => setShowCodeEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CodeEditor />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectView;
