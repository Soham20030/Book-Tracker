import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Assets and styles
import "../styles/Login.css";
import Logo from "../assets/Logo.svg";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  // Local state for email and password
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Handles input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful!");
        localStorage.setItem("token", data.token); // Store JWT
        localStorage.setItem("username", data.username);
        onLogin?.(); // Optional callback to inform parent
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error during login");
    }
  };

  return (
    <>
      {/* Navigation bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={Logo} alt="Logo" className="main-logo" />
        </div>
        <button
          className="signup-button"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </nav>

      {/* Login form */}
      <section className="Log">
        <div className="login-component">
          <h2 className="login-header">Login</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <br />

            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
