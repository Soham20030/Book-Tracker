// Hooks and libraries
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // For "x minutes ago" formatting

// Styles and assets
import "../styles/userDashboard.css";
import Logo from "../assets/Logo.svg";

// Enable dayjs to use relative time formatting
dayjs.extend(relativeTime);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Username from the route (e.g., /user/:username)
  const [books, setBooks] = useState([]); // Store the user's books
  const [error, setError] = useState(""); // Error handling

  // Logs user out and redirects to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handles search for another user
  const handleSearch = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value.trim();
    if (username) {
      navigate(`/user/${username}`);
    }
  };

  // Fetch user's books on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If not authenticated, redirect
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await fetch(`https://book-tracker-backend-k37q.onrender.com/api/books/user/${username}`);
        const data = await res.json();

        if (res.ok) {
          setBooks(data);
        } else {
          setError(data.error || "Failed to fetch books");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching books");
      }
    };

    fetchBooks();
  }, [username, navigate]);

  return (
    <>
      {/* Navigation bar with logo, search bar, and logout */}
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
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Main dashboard */}
      <div className="user-dashboard">
        <h2 className="user-heading">{username}'s Book Reviews</h2>

        <div className="user-book-cards">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="user-book-card">
                <div className="card-header">
                  <h3 className="card-title">{book.title}</h3>
                  <span className="card-time">
                    <strong>{dayjs(book.created_at).fromNow()}</strong>
                  </span>
                </div>

                <p className="card-author">
                  by <strong>{book.author}</strong>
                </p>

                <div className="card-review">
                  <p>{book.review}</p>
                </div>

                <div className="card-status">
                  <strong>Status:</strong> {book.status}
                </div>
              </div>
            ))
          ) : (
            <p style={{ marginTop: "20px", fontSize: "18px" }}>
              {error || "No books reviewed yet."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
