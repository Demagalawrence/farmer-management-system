# Farmer Management System - API Health Check

This module provides health check endpoints for monitoring the API status.

## Endpoints

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system info

## Response Format

```json
{
  "status": "healthy",
  "timestamp": "2026-08-25T22:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```
