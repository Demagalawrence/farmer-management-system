# Contributing to Farmer Management System

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Docker (optional)

### Using Docker
```bash
docker compose up --build
```

### Manual Setup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/          # Express.js + MongoDB API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── middleware/     # Auth, validation
│   └── __tests__/         # Backend tests
├── frontend/         # React + TypeScript SPA
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API clients
│   │   └── utils/         # Helper functions
└── docker-compose.yml
```

## Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Run tests: `cd backend && npm test`
5. Commit with a clear message
6. Push and create a Pull Request

## Commit Messages

Follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `ci:` CI/CD changes
- `refactor:` code refactoring
- `test:` adding tests

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Keep functions small and focused

## Pull Request Guidelines

- Describe what your changes do
- Reference any related issues
- Ensure CI passes
- Keep PRs focused on one change

## Reporting Issues

Use GitHub Issues with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
