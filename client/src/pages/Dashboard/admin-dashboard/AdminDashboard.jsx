import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authenticationState } from '../../../store/atoms/authVerifierSelector';

/**
 * AdminDashboard component that manages the admin interface.
 * It checks for user authentication and authorization before rendering.
 */
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useRecoilValue(authenticationState);
  const token = localStorage.getItem("token");
  
  // Redirects to the home page if no token is found
  if (!token) {
    return <Navigate to="/" />;
  }
  
  setTimeout(() => {
    // Redirects to the home page if the authentication is invalid
    if (!auth.isValid) {
      return <Navigate to="/" />;
    }
    
    // Redirects to the home page if the user is not an admin
    if (auth.isAdmin) {
      return <Navigate to="/" />;
    }
  }, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-56">
        <Hero sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
};

export default AdminDashboard;