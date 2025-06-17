// Import the Signup form component
import Signup from "../components/Signup";

// Import hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// This component acts as a wrapper for the Signup form and handles post-signup behavior
const SignupPage = () => {
  // useNavigate hook from React Router to navigate the user programmatically
  const navigate = useNavigate();

  // Callback function passed to the Signup component
  // This will be triggered when signup is successful
  const handleSignupSuccess = () => {
    // After successful signup, navigate user to the dashboard
    navigate("/dashboard");
  };

  // Render the Signup component and pass the success callback as a prop
  return <Signup onSignup={handleSignupSuccess} />;
};

// Export the SignupPage component for use in routing
export default SignupPage;
