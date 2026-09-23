# ✅ One-Time Access Codes Implementation

## 🔐 Enhanced Security Feature

Access codes now **expire immediately** after being used to create an account, and a **new code is auto-generated** to replace it!

---

## 🎯 How It Works

### **Before (Old System):**
- ❌ One code could be used multiple times
- ❌ Same code worked until expiry date (30 days)
- ❌ Security risk: code sharing allowed unlimited accounts

### **After (New System):**
- ✅ Each code is **one-time use only**
- ✅ Code expires **immediately** after creating an account
- ✅ New code **auto-generated** within seconds
- ✅ High security: no code reuse possible

---

## 🔄 Registration Flow

### **Step 1: User Registers**
```
User enters: email, password, role, access code (e.g., FIELD2024)
```

### **Step 2: System Validates Code**
```
✓ Check if code exists
✓ Check if status = 'active'
✓ Check if not expired by time
```

### **Step 3: Code Marked as Used**
```
Status: active → used
Used at: Current timestamp
Used by: user@email.com
```

### **Step 4: Auto-Generate New Code**
```
Generate random 8-character code (e.g., A7K9M2X5)
Set expiry: 24 hours from now
Status: active
Created by: system_auto
```

### **Step 5: User Account Created**
```
Account created successfully
User can login immediately
Old code cannot be reused
```

---

## 📊 Code Lifecycle

```
┌─────────────┐
│   ACTIVE    │ ← New code created
└──────┬──────┘
       │
       │ User registers with this code
       │
       ▼
┌─────────────┐
│    USED     │ ← Code expires immediately
└──────┬──────┘
       │
       │ System auto-generates new code
       │
       ▼
┌─────────────┐
│   ACTIVE    │ ← New code ready for next user
└─────────────┘
```

---

## 🔑 Code Generation

### **Format:**
- Length: 8 characters
- Characters: A-Z, 0-9 (uppercase letters and numbers)
- Example: `A7K9M2X5`, `F3BT8K1Q`, `M9P2N7D4`

### **Expiry:**
- **Auto-generated codes:** 24 hours
- **Manager-generated codes:** Can be customized
- **Static admin secret:** Never expires

### **Uniqueness:**
- Random generation ensures uniqueness
- Collision probability: Very low (36^8 combinations)

---

## 👨‍💼 Manager Dashboard Integration

### **Viewing Codes:**
Managers can see all access codes in the dashboard:

```
┌─────────────────────────────────────┐
│ Active Access Codes                 │
├─────────────────────────────────────┤
│ Field Officer: A7K9M2X5             │
│ Expires: 23 hours remaining         │
│ Status: Active                      │
├─────────────────────────────────────┤
│ Finance Manager: F3BT8K1Q           │
│ Expires: 18 hours remaining         │
│ Status: Active                      │
└─────────────────────────────────────┘
```

### **Manual Generation:**
Managers can still manually generate codes:
- Custom expiry time (hours)
- Select specific role
- Instant generation
- Displayed once for sharing

---

## 🔍 Database Schema

### **Access Codes Collection:**

```javascript
{
  _id: ObjectId,
  code: "A7K9M2X5",
  role: "field_officer",
  status: "active" | "used" | "expired",
  created_at: ISODate("2024-11-07T14:00:00Z"),
  expires_at: ISODate("2024-11-08T14:00:00Z"),
  created_by: "system_auto" | "manager_email",
  used_count: 0,
  
  // Fields added when used:
  used_at: ISODate("2024-11-07T15:30:00Z"),
  used_by: "newuser@email.com"
}
```

### **Status Values:**
- `active` - Can be used for registration
- `used` - Already used, cannot be reused
- `expired` - Time expired, cannot be used

---

## 🛡️ Security Benefits

### **1. Prevents Code Sharing**
- ❌ Old way: One code shared among many users
- ✅ New way: Each person needs their own code

### **2. Limits Unauthorized Access**
- ❌ Old way: Stolen code works until expiry
- ✅ New way: Code works once, then useless

### **3. Audit Trail**
- Track who used which code
- Know exact time of code usage
- Link code to specific user account

### **4. Automatic Renewal**
- No manual intervention needed
- Always fresh codes available
- Continuous operation

### **5. Time-Limited Access**
- Auto-generated codes expire in 24 hours
- Forces timely registration
- Reduces attack window

---

## 📝 Code Examples

### **Successful Registration:**
```
Request:
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "field_officer",
  "accessCode": "FIELD2024"
}

Backend Actions:
1. ✓ Validate code FIELD2024 (active)
2. ✓ Mark FIELD2024 as used
3. ✓ Generate new code: A7K9M2X5
4. ✓ Create user account
5. ✓ Log: "Auto-generated new field_officer access code: A7K9M2X5"

Response:
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here"
}
```

### **Attempting to Reuse Code:**
```
Request:
POST /api/auth/register
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "field_officer",
  "accessCode": "FIELD2024"  // Already used!
}

Response:
{
  "success": false,
  "message": "Invalid or expired access code. Please request a new code from your administrator."
}

Status: 401 Unauthorized
```

---

## 🔄 Migration from Old Codes

### **Existing Codes:**
The old codes (FIELD2024, FINANCE2024) from the initial setup will work **once**, then:
1. They get marked as 'used'
2. New random codes are auto-generated
3. Manager sees new codes in dashboard

### **No Action Required:**
- System handles migration automatically
- First registration triggers the new system
- Subsequent registrations use auto-generated codes

---

## 📋 Manager Workflow

### **Onboarding New Staff:**

1. **Check Current Code:**
   - Login to manager dashboard
   - Scroll to "Access Codes" section
   - See current active code for each role

2. **Share Code:**
   - Copy the active code
   - Send to new staff member via secure channel
   - Code is valid for 24 hours

3. **Staff Registers:**
   - Staff uses code to register
   - Account created successfully

4. **Automatic Refresh:**
   - Old code marked as used
   - New code appears automatically
   - Ready for next staff member

5. **No Manual Regeneration Needed:**
   - System maintains active codes
   - Always one active code per role
   - Manager can still generate more if needed

---

## ⚙️ Configuration

### **Code Expiry Time:**
Located in `authController.ts`:
```typescript
const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours
```

**To change:**
- Modify the `24` to desired hours
- Example: `48` for 2 days, `1` for 1 hour

### **Code Length:**
```typescript
for (let i = 0; i < 8; i++) // 8-character code
```

**To change:**
- Modify `8` to desired length
- Example: `6` for shorter, `12` for longer

---

## 🎯 Testing

### **Test Scenario 1: First Registration**
```bash
# Register first user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "field_officer",
    "accessCode": "FIELD2024"
  }'

# Expected: Success
# Result: FIELD2024 → used, New code generated
```

### **Test Scenario 2: Reuse Same Code**
```bash
# Try to register with same code
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "another@example.com",
    "password": "password123",
    "role": "field_officer",
    "accessCode": "FIELD2024"
  }'

# Expected: 401 Unauthorized
# Message: "Invalid or expired access code"
```

### **Test Scenario 3: Use New Code**
```bash
# Check manager dashboard for new code (e.g., A7K9M2X5)
# Register with new code
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Third User",
    "email": "third@example.com",
    "password": "password123",
    "role": "field_officer",
    "accessCode": "A7K9M2X5"
  }'

# Expected: Success
# Result: A7K9M2X5 → used, Another new code generated
```

---

## 📊 Logging

### **Server Logs Show:**
```
2024-11-07 14:30:15 info: New user registered: test@example.com
2024-11-07 14:30:15 info: Auto-generated new field_officer access code: A7K9M2X5 after use by test@example.com
2024-11-07 15:45:22 info: New user registered: third@example.com
2024-11-07 15:45:22 info: Auto-generated new field_officer access code: M9P2N7D4 after use by third@example.com
```

---

## ✅ Summary

### **Key Features:**
1. ✅ **One-time use codes** - Cannot be reused
2. ✅ **Automatic generation** - New code created instantly
3. ✅ **24-hour expiry** - Time-limited access
4. ✅ **Audit trail** - Track who used which code
5. ✅ **Zero downtime** - Always active codes available

### **Security Level:**
- 🔒 **High**: Prevents code sharing and reuse
- 🔒 **Traceable**: Full audit trail
- 🔒 **Time-limited**: Reduces attack window
- 🔒 **Automated**: No manual intervention needed

### **User Experience:**
- 😊 **Manager**: Automatic code management
- 😊 **Staff**: Simple one-time code usage
- 😊 **System**: Continuous operation

---

**Implementation Complete!** 🎉  
**Status:** Production Ready ✅  
**Security Level:** Enhanced 🔐

