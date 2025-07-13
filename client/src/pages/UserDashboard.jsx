// Import React Router hooks for URL parameter extraction and navigation
import { useParams, useNavigate } from "react-router-dom";
// Import React hooks for managing component state and side effects
import { useEffect, useState } from "react";
// Import dayjs library for date manipulation and formatting
import dayjs from "dayjs";
// Import dayjs plugin for relative time formatting (e.g., "2 hours ago")
import relativeTime from "dayjs/plugin/relativeTime";

// Import the CSS styles specific to this UserDashboard component
import "../styles/userDashboard.css";
// Import the logo image asset
import Logo from "../assets/Logo.svg";

// Enable dayjs to use the relative time formatting plugin
dayjs.extend(relativeTime);

// Define the UserDashboard functional component
const UserDashboard = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Extract the 'username' parameter from the URL (e.g., /user/:username)
  const { username } = useParams();
  // State to store the array of books for the specified user
  const [books, setBooks] = useState([]);
  // State to store any error messages that occur during data fetching
  const [error, setError] = useState("");

  // Function to handle user logout
  const handleLogout = () => {
    // Remove authentication token from browser's local storage
    localStorage.removeItem("token");
    // Navigate user back to the login page
    navigate("/login");
  };

  // Function to handle search for another user
  const handleSearch = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Get the username input value and remove whitespace
    const username = e.target.elements.username.value.trim();
    // If a username was entered, navigate to that user's profile page
    if (username) {
      navigate(`/user/${username}`);
    }
  };

  // useEffect hook to fetch user's books when component mounts or username changes
  useEffect(() => {
    // Get the authentication token from local storage
    const token = localStorage.getItem("token");
    // If user is not authenticated, redirect to login page
    if (!token) {
      navigate("/login");
      // Exit early from the effect
      return;
    }

    // Define async function to fetch books for the specified user
    const fetchBooks = async () => {
      try {
        // Make API request to fetch books for the specified username
        const res = await fetch(`http://localhost:5000/api/books/user/${username}`);
        // Parse the JSON response from the server
        const data = await res.json();
        // Check if the request was successful
        if (res.ok) {
          // Update the books state with the fetched data
          setBooks(data);
        } else {
          // Set error message if request failed
          setError(data.error || "Failed to fetch books");
        }
      } catch (err) {
        // Log any network or other errors to the console
        console.error(err);
        // Set generic error message for user
        setError("Server error while fetching books");
      }
    };

    // Call the fetch function
    fetchBooks();
  }, [username, navigate]); // Re-run effect when username or navigate changes

  // Render the component JSX
  return (
    <>
      {/* Navigation bar section */}
      <nav className="navbar">
        {/* Logo section */}
        <div className="logo">
          {/* Display the logo image */}
          <img src={Logo} alt="Logo" className="main-logo" />
        </div>

        {/* Search functionality section */}
        <div className="search-container">
          {/* Form for searching other users */}
          <form onSubmit={handleSearch}>
            {/* Username search input field */}
            <input type="text" name="username" placeholder="Search.." />
          </form>
        </div>

        {/* Navigation buttons section */}
        <div className="buttons">
          {/* Logout button */}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Main dashboard content */}
      <div className="user-dashboard">
        {/* Dashboard heading with dynamic username */}
        <h2 className="user-heading">{username}'s Book Reviews</h2>
        {/* Container for book cards */}
        <div className="user-book-cards">
          {/* Conditional rendering: show books if they exist, otherwise show message */}
          {books.length > 0 ? (
            // Map over books array to render each book card
            books.map((book) => (
              // Individual book card container with unique key
              <div key={book.id} className="user-book-card">
                {/* Card header with title and timestamp */}
                <div className="card-header">
                  {/* Book title */}
                  <h3 className="card-title">{book.title}</h3>
                  {/* Timestamp showing when the review was created */}
                  <span className="card-time">
                    {/* Format the creation date to relative time (e.g., "2 hours ago") */}
                    <strong>{dayjs(book.created_at).fromNow()}</strong>
                  </span>
                </div>
                {/* Book author information */}
                <p className="card-author">
                  by <strong>{book.author}</strong>
                </p>
                {/* Book review text */}
                <div className="card-review">
                  <p>{book.review}</p>
                </div>
                {/* Reading status display */}
                <div className="card-status">
                  <strong>Status:</strong> {book.status}
                </div>
              </div>
            ))
          ) : (
            // Show message when no books are found or there's an error
            <p style={{ marginTop: "20px", fontSize: "18px" }}>
              {/* Display error message if exists, otherwise show default message */}
              {error || "No books reviewed yet."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

// Export the component as the default export
export default UserDashboard;