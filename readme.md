# 📚 Book Tracker – Full Stack MERN+PostgreSQL App

A full-featured web app where users can log in, write reviews for books, update or delete them, and view others' reviews. Built using PostgreSQL, Express.js, React, and Node.js.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Styling & UX](#-styling--ux)
- [Security](#-security)
- [To-Do / Future Improvements](#-to-do--future-improvements)
- [License](#-license)

---

## 🚀 Overview

**Book Tracker** allows users to:

- Sign up and log in securely with JSON Web Tokens (JWT)
- Add, view, edit, or delete reviews for books
- Track the status of books: `Reading`, `Completed`, or `Dropped`
- View other users' reviews by entering their username
- Fully responsive UI with a smooth experience

---

## ✨ Features

### ✅ Core Functionalities
- User authentication with JWT
- CRUD operations for book reviews
- Status tracking per book
- Token-based protected routes
- Personal and public dashboards

### 🔍 User Dashboard
- Shows logged-in user’s added books
- Each card displays:
  - Title
  - Author
  - Status
  - Review
  - Relative timestamp (e.g., “2 days ago”)

### 🌐 Public View
- Input any username to view that user’s dashboard and reviews

---

## 🧰 Tech Stack

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | React.js (with Vite), CSS (custom), React Router DOM |
| **Backend**  | Express.js, Node.js |
| **Database** | PostgreSQL |
| **Other**    | JWT, bcrypt, dotenv, React Hot Toast, dayjs |

---

## 🧱 Project Structure

book-tracker/
├── client/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── AddReviewPage.jsx
│ │ │ └── UserDashboard.jsx
│ │ ├── components/
│ │ │ └── ProtectedRoute.jsx
│ │ ├── styles/
│ │ │ ├── navbar.css
│ │ │ ├── dashboard.css
│ │ │ └── form.css
│ │ ├── assets/
│ │ │ └── Logo.svg
│ │ └── main.jsx
│ └── index.html
│
├── server/
│ ├── routes/
│ │ ├── books.js
│ │ └── users.js
│ ├── middleware/
│ │ └── auth.js
│ ├── db/
│ │ └── index.js
│ └── server.js
│
└── README.md


---

## 🗃️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Books Table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  review TEXT NOT NULL,
  status TEXT CHECK(status IN ('Reading', 'Completed', 'Dropped')),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

⚙️ Installation

1. Clone the Repo

git clone https://github.com/Soham20030/book-tracker.git
cd book-tracker


2. Set Up the Backend

cd server
npm install

Create a .env file and add:

PORT=5000
JWT_SECRET=your_jwt_secret
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432

Start the server:

node server.js

3. Set Up the Frontend

cd client
npm install
npm run dev

Visit: http://localhost:5173

📡 API Endpoints

🔐 Auth Routes

Route	              Method	Description
/api/users/signup	  POST	    Register a new user
/api/users/login	  POST	    Log in a user and return JWT

📘 Book Routes

Route	                      Method	  Description
/api/books	                  POST	  Add new book (Auth required)
/api/books/:id	              GET	    Get a single book
/api/books/:id	              PUT	    Update a book
/api/books/user/:username     GET	    Get all books by user


Headers:
Authorization: Bearer <your_token>


🔐 Authentication Flow

    On login, server returns a JWT.

    Token is saved in localStorage.

    Protected routes (e.g., Add Review) check for token via ProtectedRoute.jsx.

    Token is sent in headers for all backend calls.

🎨 Styling & UX

    Custom responsive CSS using the Poppins font.

    Gradient buttons with hover/active animations.

    Form layouts, dashboard grids, and styled review cards.

    Toast notifications via react-hot-toast.

🔒 Security

    Passwords are hashed using bcrypt.

    JWT secret is stored in .env.

    All sensitive routes are protected with middleware.

🧠 To-Do / Future Improvements

    ✅ Add dark mode toggle

    📸 Add image uploads for books

    🌟 Rating system (1–5 stars)

    🔍 Filter books by status or title

    🧾 Sort by date or alphabetical

    👤 Add user profiles with avatars and bios

📄 License

MIT License.
Feel free to use, fork, and contribute.
✨ Credits

    Fonts: Google Fonts – Poppins

    UI inspiration: Letterboxd



