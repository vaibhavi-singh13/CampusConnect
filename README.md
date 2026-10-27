# CampusConnect

A college community platform built with React + Vite, Axios, Node.js, Express, MongoDB, and Mongoose.

## Features included
- Student registration/login with JWT authentication and hashed passwords
- Editable student profile (bio, college, branch, year, skills, interests)
- Community feed with category filters and search
- Create, edit, delete posts (authors only)
- Like/unlike posts with duplicate-like prevention
- Add/view/edit/delete comments (authors only)
- Academic resource library with search/category filtering and owner-only edit/delete
- Student discovery by name, skills, interests, branch, and year
- Responsive interface, loading/error/empty states
- Pagination for posts and resources
- API health endpoint and basic security middleware

This is an educational starter project. Review security, privacy, file storage, and deployment settings before production use.

## Requirements
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## Environment
Backend `.env`:
- `PORT`: API port (default 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret
- `CLIENT_URL`: frontend origin (default http://localhost:5173)
- `NODE_ENV`: development or production

Frontend `.env` (optional):
- `VITE_API_URL`: API base URL (default http://localhost:5000/api)

## Notes
- Create an account through the Register page. No default admin account is created.
- The app stores resource URLs/links and metadata; it does not upload files to a storage provider.
- JWT is sent in the Authorization header and kept in localStorage for this learning project. For production, consider HTTP-only secure cookies and a stronger deployment review.
- API routes and data models are documented in `backend/README.md`.


## Recent improvements
- Dark/light mode toggle in the signed-in app header (preference is saved in the browser).
- Larger text across key student-directory and chat controls.
- Student-to-student direct messaging from the Find Students cards. Messages are stored in MongoDB and refreshed automatically while the chat is open.
