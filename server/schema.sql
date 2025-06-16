 --Create users table

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

--Create books table

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);