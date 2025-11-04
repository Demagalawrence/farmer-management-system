# Quick Start Guide - Security Features

## 🚀 Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set your JWT secret
# IMPORTANT: Use a strong random key in production
```

### 3. Start Development Server
```bash
npm run dev
```

## 🔑 Authentication Flow

### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "farmer"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Using the Token
```bash
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **farmer** | View own data, update own fields |
| **field_officer** | Manage farmers, fields, harvests |
| **finance** | Manage payments, view reports |
| **manager** | Full access to all resources |

## 📝 Validation Rules

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- Example: `SecurePass123`

### Phone Number
- Format: 10-15 digits
- Example: `1234567890`

### Email
- Valid email format
- Example: `user@example.com`

## ✅ Testing

### Run Tests
```bash
# All tests with coverage
npm test

# Watch mode
npm run test:watch
```

### Test Coverage
Coverage reports available in `coverage/` directory after running tests.

## 💾 Database Backup

### Manual Backup
```bash
npm run backup
```

### Automatic Backups
Set in `.env`:
```
ENABLE_AUTO_BACKUP=true
```
Runs daily at 2 AM.

### Backup Location
`backups/backup-YYYY-MM-DDTHH-mm-ss.json`

## 📊 Logging

### Log Files
- Application logs: `logs/application-YYYY-MM-DD.log`
- Error logs: `logs/error-YYYY-MM-DD.log`

### View Latest Logs
```bash
# Windows
type logs\application-2025-10-31.log

# Linux/Mac
tail -f logs/application-$(date +%Y-%m-%d).log
```

### Log Levels
```
error → warn → info → http → debug
```

Set in `.env`:
```
LOG_LEVEL=debug
```

## 🔧 Common Tasks

### Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Create a Farmer
```bash
POST /api/farmers
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "507f1f77bcf86cd799439011",
  "phone": "1234567890",
  "address": "123 Farm Road",
  "farm_size": 50.5,
  "status": "active"
}
```

### Create a Field
```bash
POST /api/fields
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmer_id": "507f1f77bcf86cd799439011",
  "field_name": "North Field",
  "crop_type": "Wheat",
  "area": 10.5,
  "planting_date": "2025-10-01T00:00:00.000Z",
  "expected_harvest_date": "2026-01-15T00:00:00.000Z",
  "health_status": "good",
  "crop_stage": "planted"
}
```

## 🚨 Error Handling

### Common Error Codes
- `400` - Validation Error (check request format)
- `401` - Authentication Error (login/token expired)
- `403` - Authorization Error (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Server Error (check logs)

### Error Response Format
```json
{
  "success": false,
  "message": "Error description here"
}
```

## 🔒 Security Checklist

Before deployment:
- [ ] Change `JWT_SECRET` to strong random key
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB with authentication
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Review log retention policies
- [ ] Test backup/restore process
- [ ] Set up monitoring

## 🐛 Troubleshooting

### "Invalid token" error
→ Token expired or invalid. User needs to login again.

### "Validation failed" error
→ Check request body matches validation schema.

### "Access denied" error
→ User role doesn't have permission for this action.

### "MongoDB connection failed"
→ Ensure MongoDB is running and connection string is correct.

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (auth required)
- `POST /api/auth/change-password` - Change password (auth required)

### Farmers (requires auth)
- `GET /api/farmers` - List all farmers
- `GET /api/farmers/:id` - Get farmer by ID
- `POST /api/farmers` - Create farmer (field_officer, manager)
- `PUT /api/farmers/:id` - Update farmer (field_officer, manager)
- `DELETE /api/farmers/:id` - Delete farmer (manager only)

### Fields (requires auth)
- `GET /api/fields` - List all fields
- `GET /api/fields/:id` - Get field by ID
- `POST /api/fields` - Create field
- `PUT /api/fields/:id` - Update field
- `DELETE /api/fields/:id` - Delete field (field_officer, manager)

### Harvests (requires auth)
- `GET /api/harvests` - List all harvests
- `GET /api/harvests/:id` - Get harvest by ID
- `POST /api/harvests` - Create harvest (field_officer, manager)
- `PUT /api/harvests/:id` - Update harvest (field_officer, manager)
- `DELETE /api/harvests/:id` - Delete harvest (manager only)

### Payments (requires auth)
- `GET /api/payments` - List all payments (finance, manager)
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment (finance, manager)
- `PUT /api/payments/:id` - Update payment (finance, manager)
- `DELETE /api/payments/:id` - Delete payment (manager only)

### Reports (requires auth)
- `GET /api/reports` - List all reports (manager, finance, field_officer)
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create report (manager, finance, field_officer)

## 💡 Tips

1. **Store the JWT token** securely in the frontend (localStorage or httpOnly cookie)
2. **Include token in all requests** after login
3. **Handle 401 errors** by redirecting to login
4. **Use strong passwords** that meet requirements
5. **Regular backups** - test restore process periodically
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated** for security patches

## 🔗 Additional Resources

- Full documentation: `IMPROVEMENTS.md`
- API testing: Use Postman or Thunder Client
- Frontend integration: Update API service to include Authorization header

---

**Need Help?** Check the logs in `logs/` directory or review `IMPROVEMENTS.md` for detailed documentation.
