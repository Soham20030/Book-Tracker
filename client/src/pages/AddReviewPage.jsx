// Import React hooks for managing component state and side effects
import { useState, useEffect } from "react";
// Import React Router hooks for navigation and URL parameter extraction
import { useNavigate, useParams } from "react-router-dom";

// Import the CSS styles specific to this AddReviewPage component
import "../styles/AddReviewPage.css";
// Import the logo image asset
import Logo from "../assets/Logo.svg";
// Import toast notification library for user feedback
import toast from 'react-hot-toast';

// Define the AddReviewPage functional component
const AddReviewPage = () => {
  // State to track the character count in the review textarea
  const [charCount, setCharCount] = useState(0);
  // Define the maximum allowed characters for the review
  const maxChars = 200;
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Extract the 'id' parameter from the URL (used for editing existing books)
  const { id } = useParams();

  // State to manage the form data with initial values
  const [form, setForm] = useState({
    title: "",           // Book title input
    author: "",          // Book author input
    review: "",          // Book review textarea
    status: "Reading",   // Default reading status
  });

  // Function to handle user logout
  const handleLogout = () => {
    // Remove authentication token from browser's local storage
    localStorage.removeItem("token");
    // Remove stored username from browser's local storage
    localStorage.removeItem("username");
    // Navigate user back to the login page
    navigate("/login");
  };

  // Function to handle user search functionality
  const handleSearch = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Get the username input value and remove whitespace
    const usernameInput = e.target.elements.username.value.trim();
    // If a username was entered, navigate to that user's profile page
    if (usernameInput) {
      navigate(`/user/${usernameInput}`);
    }
  };

  // Function to handle changes in form input fields
  const handleChange = (e) => {
    // Destructure the name and value from the input element
    const { name, value } = e.target;
    // If the review field is being changed, update the character count
    if (name === "review") {
      setCharCount(value.length);
    }
    // Update the form state with the new value, preserving other fields
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission (create or update book review)
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem("token");

      // Make API request to either update existing book or create new one
      const res = await fetch(
        // If id exists, update existing book; otherwise create new book
        id
          ? `http://localhost:5000/api/books/${id}`  // Update existing book endpoint
          : "http://localhost:5000/api/books",       // Create new book endpoint
        {
          // Use PUT method for updates, POST for creation
          method: id ? "PUT" : "POST",
          // Set request headers
          headers: {
            "Content-Type": "application/json",    // Specify JSON content type
            Authorization: `Bearer ${token}`,      // Include authentication token
          },
          // Convert form data to JSON string for request body
          body: JSON.stringify(form),
        }
      );

      // Parse the JSON response from the server
      const data = await res.json();

      // Check if the request was successful
      if (res.ok) {
        // Show success message based on whether updating or creating
        toast.success(id ? "Book updated!" : "Book added!");
        // Navigate back to the dashboard after successful submission
        navigate("/dashboard");
      } else {
        // Show error message if request failed
        toast.error(data.error || "Failed to submit book.");
      }
    } catch (error) {
      // Log any network or other errors to the console
      console.error(error);
      // Show generic error message to user
      toast.error("Server error during book submission.");
    }
  };

  // useEffect hook to fetch existing book data when editing (id exists)
  useEffect(() => {
    // Define async function to fetch book data
    const fetchBook = async () => {
      // Only fetch if we have an id (editing mode)
      if (id) {
        try {
          // Get authentication token from local storage
          const token = localStorage.getItem("token");
          // Make API request to fetch existing book data
          const res = await fetch(`http://localhost:5000/api/books/${id}`, {
            headers: {
              // Include authentication token in request headers
              Authorization: `Bearer ${token}`,
            },
          });

          // Parse the JSON response
          const data = await res.json();
          // Check if the request was successful
          if (res.ok) {
            // Update form state with fetched book data
            setForm({
              title: data.title,     // Set book title
              author: data.author,   // Set book author
              review: data.review,   // Set book review
              status: data.status,   // Set reading status
            });
          } else {
            // Show error message if fetch failed
            toast.error(data.error || "Failed to fetch book details.");
          }
        } catch (error) {
          // Log fetch errors to console
          console.error("Fetch book error:", error);
        }
      }
    };

    // Call the fetch function
    fetchBook();
  }, [id]); // Re-run effect when id changes

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
          {/* Form for searching users */}
          <form onSubmit={handleSearch}>
            {/* Username search input field */}
            <input type="text" name="username" placeholder="Search.." />
          </form>
        </div>

        {/* Navigation buttons section */}
        <div className="buttons">
          {/* Logout button */}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      {/* Main content container */}
      <div className="page-container">
        {/* Form container */}
        <div className="main-form">
          {/* Dynamic heading based on whether editing or creating */}
          <h2>{id ? "Edit Book Review" : "Add a Book Review"}</h2>
          {/* Book review form */}
          <form onSubmit={handleSubmit}>
            {/* Book title input field */}
            <label htmlFor="Book Title">Title</label>
            <input
              type="text"              // Text input type
              name="title"             // Field name for form handling
              value={form.title}       // Controlled input value
              onChange={handleChange}  // Handle input changes
              required                 // Mark field as required
            /><br />

            {/* Book author input field */}
            <label htmlFor="Author">Author</label>
            <input
              type="text"              // Text input type
              name="author"            // Field name for form handling
              value={form.author}      // Controlled input value
              onChange={handleChange}  // Handle input changes
              required                 // Mark field as required
            /><br />

            {/* Book review textarea */}
            <label htmlFor="Review">Review</label>
            <textarea
              name="review"                    // Field name for form handling
              placeholder="Write your review here..." // Placeholder text
              value={form.review}              // Controlled textarea value
              onChange={handleChange}          // Handle input changes
              maxLength={maxChars}             // Limit maximum characters
              required                         // Mark field as required
            />
            {/* Character count display */}
            <p>{charCount} / {maxChars} characters</p>
            <br />

            {/* Reading status radio button group */}
            <div className="status-options">
              {/* Status section label */}
              <label>Status:</label><br />
              {/* Reading status radio button */}
              <label>
                <input
                  type="radio"                        // Radio button input type
                  name="status"                       // Field name for form handling
                  value="Reading"                     // Value for this option
                  checked={form.status === "Reading"} // Check if this option is selected
                  onChange={handleChange}             // Handle input changes
                />
                Reading
              </label>
              {/* Completed status radio button */}
              <label>
                <input
                  type="radio"                          // Radio button input type
                  name="status"                         // Field name for form handling
                  value="Completed"                     // Value for this option
                  checked={form.status === "Completed"} // Check if this option is selected
                  onChange={handleChange}               // Handle input changes
                />
                Completed
              </label>
              {/* Dropped status radio button */}
              <label>
                <input
                  type="radio"                        // Radio button input type
                  name="status"                       // Field name for form handling
                  value="Dropped"                     // Value for this option
                  checked={form.status === "Dropped"} // Check if this option is selected
                  onChange={handleChange}             // Handle input changes
                />
                Dropped
              </label>
            </div>

            <br /><br />
            {/* Submit button with dynamic text based on editing/creating mode */}
            <button type="submit" className="submit-btn">
              {id ? "Update Book" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

// Export the component as the default export
export default AddReviewPage;