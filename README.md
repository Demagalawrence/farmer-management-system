# Farmer Management System.

[![CI](https://github.com/KubanjaElijahEldred/farmer-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/KubanjaElijahEldred/farmer-management-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248.svg)](https://www.mongodb.com/)

A comprehensive system for managing farmers, fields, harvests, payments, and reports with a React frontend and MongoDB backend.

## Features

- **Farmer Registration** - Register and manage farmer profiles
- **Field Management** - Track agricultural fields and their details
- **Harvest Tracking** - Record and monitor harvest data
- **Payment Management** - Process and track payments
- **Reporting** - Generate reports and analytics
- **Authentication** - Secure JWT-based authentication

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB 7 |
| Testing | Jest, Supertest |
| DevOps | Docker, GitHub Actions |

## Quick Start

### With Docker (Recommended)

```bash
git clone https://github.com/KubanjaElijahEldred/farmer-management-system.git
cd farmer-management-system
docker compose up --build
```

The app will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:5000

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/KubanjaElijahEldred/farmer-management-system.git
cd farmer-management-system

# Setup backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI
npm install
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/       # Auth, validation
│   │   └── utils/           # Helpers
│   └── __tests__/           # Backend tests
├── frontend/                # React + TypeScript frontend
│   └── src/
│       ├── components/      # UI components
│       ├── contexts/        # React contexts
│       ├── services/        # API clients
│       └── utils/           # Helpers
├── database/                # Schema documentation
├── docker-compose.yml       # Docker orchestration
└── .github/workflows/       # CI/CD pipelines
```

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
