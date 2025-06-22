# MERN Backend Auth API

This is a RESTful API built using Node.js, Express.js, MongoDB with JWT Authentication.

## Features
- User Signup/Login
- JWT Authentication
- Protected Routes
- MongoDB + Mongoose
- Error handling

## Tech Stack
Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

## API Endpoints
| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| POST   | /api/signup   | Register new user    |
| POST   | /api/login    | Login existing user  |
| GET    | /api/profile  | Get user profile     |

## How to Run Locally
```bash
https://github.com/Abhii-Godhaniya/ChatProject-SyncQ.git
cd backend/src
npm install
cp .env.example .env
# Add your MongoDB URI and JWT_SECRET
npm run dev
