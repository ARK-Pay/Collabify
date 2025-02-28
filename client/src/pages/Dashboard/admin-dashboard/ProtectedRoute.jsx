import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authenticationState } from '../../../store/atoms/authVerifierSelector';
import CircularProgress from "@mui/material/CircularProgress";

/**
 * AuthChecker component checks the authentication state 
 * and determines if the user is valid or an admin.
 * If not, it redirects to the home page.
 */
const AuthChecker = ({ children }) => {
  const auth = useRecoilValue(authenticationState);

  setTimeout(() => {
    if (!auth.isValid) {
        return <Navigate to="/" />;
      }
    
      if (auth.isAdmin) {
        return <Navigate to="/" />;
      }
      return children;
  }, 100);
  

};

const ProtectedRoute = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress />
      </div>
    }>
      <AuthChecker>{children}</AuthChecker>
    </Suspense>
  );
};

export default ProtectedRoute;