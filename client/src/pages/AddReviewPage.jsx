// React hooks for state, routing, and lifecycle
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Styling and assets
import "../styles/AddReviewPage.css";
import Logo from "../assets/Logo.svg";
import toast from 'react-hot-toast';

const AddReviewPage = () => {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 200;
  const navigate = useNavigate();         // For navigating to different pages
  const { id } = useParams();             // If an ID is present, we’re editing an existing book

  // Initial form state
  const [form, setForm] = useState({
    title: "",
    author: "",
    review: "",
    status: "Reading", // Default status
  });

  // Logs user out by clearing localStorage and redirecting to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Redirects to the UserDashboard for the searched username
  const handleSearch = (e) => {
    e.preventDefault();
    const usernameInput = e.target.elements.username.value.trim();
    if (usernameInput) {
      navigate(`/user/${usernameInput}`);
    }
  };

  // Handles form input changes
const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "review") {
    setCharCount(value.length);
  }
  setForm((prev) => ({ ...prev, [name]: value }));
};
  // Handles form submission — creates or updates a review depending on if ID exists
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        id
          ? `http://localhost:5000/api/books/${id}`  // Update existing book
          : "http://localhost:5000/api/books",       // Create new book
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(id ? "Book updated!" : "Book added!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Failed to submit book.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during book submission.");
    }
  };

  // If editing (i.e., `id` exists), fetch the current book data to prefill the form
  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/api/books/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          if (res.ok) {
            setForm({
              title: data.title,
              author: data.author,
              review: data.review,
              status: data.status,
            });
          } else {
            toast.error(data.error || "Failed to fetch book details.");
          }
        } catch (error) {
          console.error("Fetch book error:", error);
        }
      }
    };

    fetchBook();
  }, [id]);

  return (
    <>
      {/* Top navigation bar with logo, search bar, and logout */}
      <nav className="navbar">
        <div className="logo">
          <img src={Logo} alt="Logo" className="main-logo" />
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input type="text" name="username" placeholder="Search.." />
          </form>
        </div>

        <div className="buttons">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      {/* Main form to add or update a review */}
      <div className="page-container">
        <div className="main-form">
          <h2>{id ? "Edit Book Review" : "Add a Book Review"}</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="Book Title">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            /><br />

            <label htmlFor="Author">Author</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
            /><br />

            <label htmlFor="Review">Review</label>
            <textarea
              name="review"
              placeholder="Write your review here..."
              value={form.review}
              onChange={handleChange}
              maxLength={maxChars}
              required
            />
            <p>{charCount} / {maxChars} characters</p>
            <br />

            {/* Radio buttons to choose the reading status */}
            <div className="status-options">
              <label>Status:</label><br />
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Reading"
                  checked={form.status === "Reading"}
                  onChange={handleChange}
                />
                Reading
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Completed"
                  checked={form.status === "Completed"}
                  onChange={handleChange}
                />
                Completed
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Dropped"
                  checked={form.status === "Dropped"}
                  onChange={handleChange}
                />
                Dropped
              </label>
            </div>

            <br /><br />
            {/* Submit button changes text based on whether we're editing or creating */}
            <button type="submit" className="submit-btn">
              {id ? "Update Book" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddReviewPage;
