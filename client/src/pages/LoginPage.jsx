// Import the Login form component
import Login from "../components/Login";

// Import hook from React Router for navigation
import { useNavigate } from "react-router-dom";

// The LoginPage component acts as a wrapper for the Login form
// and handles what happens after a successful login
const LoginPage = () => {
  // useNavigate allows you to redirect the user programmatically
  const navigate = useNavigate();

  // Callback function that gets triggered when login is successful
  const handleLoginSuccess = () => {
    // Navigate the user to the dashboard after successful login
    navigate("/dashboard");
  };

  // Render the Login component and pass the success handler as a prop
  return <Login onLogin={handleLoginSuccess} />;
};

// Export the LoginPage component so it can be used in your router
export default LoginPage;
