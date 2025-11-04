# Farmer Management System

A comprehensive system for managing farmers, fields, harvests, payments, and reports with a React frontend and MongoDB backend.

## Project Structure

```
.
├── backend/                 # Node.js + Express backend with MongoDB
│   ├── src/                 # Source code
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.ts        # Main server file
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend documentation
├── database/                # Database schema files
│   ├── schema.sql           # Original SQL schema
│   └── mongodb-schema.md    # MongoDB schema design
├── design/                  # Design documents
│   └── dashboards.md        # Dashboard wireframes
└── frontend/                # React + TypeScript frontend
    ├── src/                 # Source code
    │   ├── services/        # API service clients
    │   ├── App.tsx          # Main application component
    │   └── main.tsx         # Entry point
    ├── package.json         # Frontend dependencies
    └── README.md            # Frontend documentation
```

## Technology Stack

### Frontend
- React 18+
- TypeScript
- Vite
- Axios for HTTP requests

### Backend
- Node.js
- Express.js
- MongoDB with official MongoDB driver
- TypeScript

### Database
- MongoDB

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- npm or yarn

### Installation

1. Clone the repository

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Configuration

1. Configure MongoDB connection in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fmis
   DB_NAME=fmis
   PORT=5000
   ```

2. Make sure MongoDB is running on your system

### Running the Application

#### Start the Backend Server
```bash
cd backend
npm run dev
```

The backend server will start on port 5000 by default.

#### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend development server will start on port 5173 by default.

### Building for Production

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Database Schema

See [database/mongodb-schema.md](database/mongodb-schema.md) for detailed information about the MongoDB collections and their relationships.

## License

This project is licensed under the MIT License.