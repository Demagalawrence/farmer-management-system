pm # Farmer Management System - Backend API

This is the backend API for the Farmer Management System, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fmis
DB_NAME=fmis

# Server Configuration
PORT=5000

# JWT Configuration (if needed)
JWT_SECRET=your_jwt_secret_here
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Farmers

- `POST /api/farmers` - Create a new farmer
- `GET /api/farmers/:id` - Get farmer by ID
- `GET /api/farmers/user/:userId` - Get farmer by user ID
- `GET /api/farmers` - Get all farmers
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer
- `POST /api/farmers/:id/fields` - Add field to farmer

### Fields

- `POST /api/fields` - Create a new field
- `GET /api/fields/:id` - Get field by ID
- `GET /api/fields/farmer/:farmerId` - Get fields by farmer ID
- `GET /api/fields` - Get all fields
- `PUT /api/fields/:id` - Update field
- `DELETE /api/fields/:id` - Delete field

### Harvests

- `POST /api/harvests` - Create a new harvest
- `GET /api/harvests/:id` - Get harvest by ID
- `GET /api/harvests/farmer/:farmerId` - Get harvests by farmer ID
- `GET /api/harvests/field/:fieldId` - Get harvests by field ID
- `GET /api/harvests` - Get all harvests
- `PUT /api/harvests/:id` - Update harvest
- `DELETE /api/harvests/:id` - Delete harvest

### Payments

- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/farmer/:farmerId` - Get payments by farmer ID
- `GET /api/payments/status/:status` - Get payments by status
- `GET /api/payments` - Get all payments
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Reports

- `POST /api/reports` - Create a new report
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/type/:type` - Get reports by type
- `GET /api/reports/user/:userId` - Get reports by user ID
- `GET /api/reports` - Get all reports
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

## Database Schema

See [mongodb-schema.md](../database/mongodb-schema.md) for detailed information about the MongoDB collections and their relationships.