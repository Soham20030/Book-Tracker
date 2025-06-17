import { Navigate } from "react-router-dom";

// This component protects a route by checking if the user has a valid token
const ProtectedRoute = ({ children }) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  // If no token is found, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, render the protected child components
  return children;

};

export default ProtectedRoute;
