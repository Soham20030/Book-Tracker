import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate("/dashboard");
  };

  return <Signup onSignup={handleSignupSuccess} />
};

export default SignupPage;