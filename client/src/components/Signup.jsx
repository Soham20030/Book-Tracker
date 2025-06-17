// Import required React hooks and tools
import { useState } from "react"; // useState to manage form data
import '../styles/Signup.css'; // Import custom CSS for styling
import Logo from "../assets/Logo.svg"; // Logo image to be used in the navbar
import { useNavigate } from "react-router-dom"; // For navigating programmatically
import toast from 'react-hot-toast'; // For showing user-friendly popup messages

// Signup component — receives a prop `onSignup` that is called on successful signup
const Signup = ({ onSignup }) => {
  const navigate = useNavigate(); // Used to redirect users (e.g., to login or dashboard)

  // Form state to hold user input data
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle input field changes and update form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Dynamically update field
  };

  // Debug log to confirm the component has loaded
  console.log("Signup Component loaded");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit

    try {
      // Send a POST request to the backend signup endpoint
      const res = await fetch("https://book-tracker-backend-k37q.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Send the form data as JSON
      });

      const data = await res.json(); // Parse the JSON response

      if (res.ok) {
        // If signup is successful:
        toast.success("Signup Successful!");

        // Save token and username in localStorage for session persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        // Call the callback function to redirect user (usually to /dashboard)
        onSignup?.();
      } else {
        // If signup failed due to user error (e.g., already exists)
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      // If there's a network/server error
      console.error(error);
      toast.error("Server error during Signup");
    }
  };

  // Render the signup form
  return (
    <>
      {/* Top navigation bar with logo and a Login button */}
      <nav className="navbar">
        <div className="logo">
          <img src={Logo} alt="Logo-image" className="main-logo" />
        </div>
        <div className="button-div">
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      {/* Main signup form area */}
      <section className="sign">
        <div className="signup-component">
          <h2 className="signup-header">Signup</h2>
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <br />

            {/* Email Input */}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <br />

            {/* Password Input */}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <br />

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

// Export the Signup component so it can be used in other parts of the app
export default Signup;
