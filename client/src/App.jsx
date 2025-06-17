// Import core routing components from react-router-dom
// BrowserRouter handles the routing context using the browser's address bar
// Routes is a wrapper for all defined <Route>s
import { Routes, Route } from "react-router-dom";
// Import individual pages used in the application
import SignupPage from "./pages/SignupPage";        // Signup form page
import LoginPage from "./pages/LoginPage";          // Login form page
import Dashboard from "./pages/Dashboard";          // Main dashboard visible after login
import AddReviewPage from "./pages/AddReviewPage";  // Form to add or edit a book review
import UserDashboard from "./pages/UserDashboard";  // View other users' book reviews

// ProtectedRoute is a custom component that checks if the user is authenticated
// It redirects unauthenticated users to the login page
import ProtectedRoute from "./components/ProtectedRoute";

// Import toast notification system from react-hot-toast
// Toasts are temporary pop-up messages to indicate success or failure
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    // Router wraps the entire application and enables routing
    <>
      {/* Toast notification container setup
          Appears in the top-center of the page
          We configure font size, padding, and max width for visual consistency */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '18px',         // Larger text for better readability
            padding: '16px 24px',     // Sufficient spacing around the message
            maxWidth: '500px',        // Prevent long messages from stretching too much
          },
        }}
      />

      {/* Defining all possible routes in the application */}
      <Routes>
        {/* Public Routes: Accessible by anyone without authentication */}
        
        {/* Signup page for new users to register */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Signup page for new users to register to the root "/" */}
        <Route path="/" element={<SignupPage />} />

        {/* Login page for existing users to authenticate */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes: Only accessible if user is logged in (has a valid token) */}

        {/* Dashboard: Main logged-in homepage with book review feed */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Add a new book review (no ID = new book) */}
        <Route
          path="/add-review"
          element={
            <ProtectedRoute>
              <AddReviewPage />
            </ProtectedRoute>
          }
        />

        {/* Edit an existing book review (identified by ID in the URL) */}
        <Route
          path="/add-review/:id"
          element={
            <ProtectedRoute>
              <AddReviewPage />
            </ProtectedRoute>
          }
        />

        {/* View a specific user's review dashboard (publicly visible by username) */}
        <Route path="/user/:username" element={<UserDashboard />} />
      </Routes>
    </>
  );
}

// Export the App component as the default export of this file
// This is the root component mounted in index.jsx
export default App;
