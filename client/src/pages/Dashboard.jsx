// React hooks for state and navigation
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Styles and assets
import "../styles/Dashboard.css";
import Logo from "../assets/Logo.svg";

// Day.js for formatting time
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store list of books reviewed by the user
  const [books, setBooks] = useState([]);

  // Logout function: clear local storage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Navigate to the Add Review page
  const handleAddReview = () => {
    navigate("/add-review");
  };

  // Handle user search by username and navigate to that user’s page
  const handleSearch = (e) => {
    e.preventDefault();
    const usernameInput = e.target.elements.username.value.trim();
    if (usernameInput) {
      navigate(`/user/${usernameInput}`);
    }
  };

  // Fetch user's books when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://book-tracker-backend-k37q.onrender.com/api/books", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Authenticated request
          },
        });

        const data = await res.json();
        if (res.ok) {
          setBooks(data); // ✅ Set books for display
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks(); // Trigger book fetching on mount
  }, []);

  // Navigate to edit form for the selected book
  const handleEdit = (bookId) => {
    navigate(`/add-review/${bookId}`);
  };

  // Delete the book with the given ID from the server and update the UI
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://book-tracker-backend-k37q.onrender.com/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Remove the deleted book from state so UI updates immediately
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } else {
        alert(data.error || "Failed to delete book.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error while deleting.");
    }
  };

  return (
    <>
      <div>
        {/* Top Navbar */}
        <nav className="navbar">
          <div className="logo">
            <img src={Logo} alt="Logo" className="main-logo" />
          </div>

          {/* Search bar for viewing other users' reviews */}
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input type="text" name="username" placeholder="Search.." />
            </form>
          </div>

          {/* Logout and Add Review buttons */}
          <div className="buttons">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <button onClick={handleAddReview} className="add-review">
              Add Review
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-bod">
          {/* If no books reviewed, prompt to add one */}
          {books.length === 0 ? (
            <button onClick={handleAddReview} className="review-button">
              Add a Review
            </button>
          ) : (
            <div className="dashboard-content">
              <h2 className="dashboard-username">Books reviewed by you</h2>
              
              {/* List of books */}
              <div className="book-cards">
                {books.map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="card-header">
                      <h3 className="card-title">{book.title}</h3>
                      <span className="card-time">
                        {dayjs(book.created_at).fromNow()} {/* e.g., "2 hours ago" */}
                      </span>
                    </div>

                    <p className="card-author">
                      <strong>Author:</strong> {book.author}
                    </p>

                    <div className="card-review">
                      <p>{book.review}</p>
                    </div>

                    <p className="card-status">
                      <strong>Status:</strong> {book.status}
                    </p>

                    {/* Edit/Delete buttons */}
                    <div className="card-buttons">
                      <button onClick={() => handleEdit(book.id)}>Edit</button>
                      <button onClick={() => handleDelete(book.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
