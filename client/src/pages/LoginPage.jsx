
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {

    navigate("/dashboard");
  };

  return <Login onLogin={handleLoginSuccess}/>
};

export default LoginPage;