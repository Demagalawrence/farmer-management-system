# 🔐 Dynamic Access Codes System - Auto-Expiring One-Time Codes

## ✅ IMPLEMENTATION COMPLETE

Your system now has **auto-generating, auto-expiring access codes** similar to authenticator apps! Codes expire immediately after creating an account.

---

## 🎯 How It Works

### **Authenticator-Style System:**
1. Manager generates a new code
2. Code is stored in database as "active"
3. Code is shared with authorized person
4. Person uses code to register
5. **Code automatically expires after first use**
6. Manager generates new code for next registration

---

## 🔑 Key Features

### **✅ Auto-Expiry**
- Codes expire **immediately** after account creation
- Single-use only (one code = one account)
- No reuse possible

### **✅ Dynamic Generation**
- Manager clicks "New" button
- System generates random 8-character code
- Previous codes automatically marked as expired
- New code becomes active instantly

### **✅ Database Tracked**
- All codes stored in `access_codes` collection
- Status: `active`, `used`, or `expired`
- Tracks who used code and when
- Full audit trail

### **✅ Real-Time Updates**
- Dashboard fetches active codes from API
- Shows current status for each role
- Updates immediately after generation

---

## 📊 Access Code Lifecycle

```
┌─────────────────────────────────────────────────────┐
│  1. GENERATE                                        │
│     Manager clicks "New" → Random code created      │
│     Status: active                                  │
│     ├─ Previous codes → expired                     │
│     └─ New code → active                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  2. SHARE                                           │
│     Manager copies code                             │
│     Shares with authorized person                   │
│     Code remains active                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  3. USE                                             │
│     Person enters code during registration          │
│     System validates code (must be active)          │
│     Account created                                 │
│     ├─ Code → used                                  │
│     ├─ used_at → timestamp                          │
│     └─ used_by → user email                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  4. EXPIRED                                         │
│     Code can no longer be used                      │
│     Must generate new code for next registration    │
│     Old code stored for audit trail                 │
└─────────────────────────────────────────────────────┘
```

---

## 🖥️ Manager Dashboard UI

### **Access Codes Card:**

```
┌──────────────────────────────────────┐
│ 🔑 Access Codes                      │
│ Dynamic One-Time Codes               │
├──────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 👥 Field Officer    [📋] [New] │ │
│ │ Status: Active                  │ │
│ │ A1B2C3D4                       │ │
│ │ ⚠️ Expires after first use     │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ 📈 Finance Manager  [📋] [New] │ │
│ │ Status: Active                  │ │
│ │ E5F6G7H8                       │ │
│ │ ⚠️ Expires after first use     │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ 🛡️ Manager          [📋] [New] │ │
│ │ Status: No code                 │ │
│ │ No active code          [gray] │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ⚠️ Auto-Expire: Codes expire        │
│    immediately after account         │
│    creation                          │
└──────────────────────────────────────┘
```

### **UI Elements:**
- **[📋] Copy Button** - Copies code to clipboard
- **[New] Generate Button** - Creates new code
- **Status Indicator** - Shows "Active" or "No code"
- **Code Display** - Cyan for active, gray for no code
- **Warning** - "Expires after first use"

---

## 🔐 Database Schema

### **access_codes Collection:**

```typescript
{
  _id: ObjectId,
  role: 'field_officer' | 'finance' | 'manager',
  code: string,              // Random 8-char code
  status: 'active' | 'expired' | 'used',
  created_at: Date,
  expires_at: Date,          // 24 hours (but expires on first use)
  used_at?: Date,            // When code was used
  used_by?: string,          // Email of user who used it
  created_by?: string        // Manager who generated it
}
```

### **Example Document:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "role": "field_officer",
  "code": "A1B2C3D4",
  "status": "used",
  "created_at": "2024-11-06T18:00:00Z",
  "expires_at": "2024-11-07T18:00:00Z",
  "used_at": "2024-11-06T18:30:00Z",
  "used_by": "newofficer@example.com",
  "created_by": "admin@fmis.com"
}
```

---

## 🚀 API Endpoints

### **1. Generate Access Code**
```http
POST /api/access-codes/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "field_officer"
}

Response:
{
  "success": true,
  "message": "Access code generated successfully",
  "data": {
    "role": "field_officer",
    "code": "A1B2C3D4",
    "expires_at": "2024-11-07T18:00:00Z",
    "status": "active"
  }
}
```

### **2. Get Active Codes**
```http
GET /api/access-codes/active
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "role": "field_officer",
      "code": "A1B2C3D4",
      "status": "active",
      "expires_at": "2024-11-07T18:00:00Z",
      "created_at": "2024-11-06T18:00:00Z",
      "time_remaining": 82800
    }
  ]
}
```

### **3. Registration (Validates & Expires Code)**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "field_officer",
  "accessCode": "A1B2C3D4"
}

→ Validates code
→ Creates account
→ Marks code as "used"
→ Code expires immediately
```

---

## 💡 How to Use

### **For Managers:**

#### **Step 1: Generate New Code**
1. Login to Manager Dashboard
2. Scroll to "Access Codes" card
3. Choose role (Field Officer/Finance/Manager)
4. Click **"New"** button
5. New code appears instantly

#### **Step 2: Share Code**
1. Click **[📋]** copy icon
2. Code copied to clipboard
3. Share via secure channel
4. Inform recipient: "Code expires after first use"

#### **Step 3: Monitor Usage**
- Code shows as "Active" until used
- After use, shows "No code"
- Generate new code for next registration

---

### **For Authorized Personnel:**

#### **Receiving Code:**
1. Receive code from manager
2. Note: Single-use only
3. Use immediately or soon

#### **Using Code:**
1. Go to registration page
2. Select role
3. Enter access code
4. Complete registration
5. **Code expires immediately**

#### **If Code Fails:**
- **Error:** "Invalid or expired access code"
- **Action:** Contact manager for new code
- **Reason:** Code already used or expired

---

## 🔐 Security Benefits

### **1. Single-Use Codes**
- ❌ No code reuse possible
- ✅ Each registration requires new code
- ✅ Stolen codes become useless after first use

### **2. Auto-Expiration**
- ✅ Codes expire immediately after use
- ✅ No lingering active codes
- ✅ Reduces attack window

### **3. Audit Trail**
- ✅ Track who generated each code
- ✅ Track who used each code
- ✅ Track when codes were used
- ✅ Full history in database

### **4. Manager Control**
- ✅ Only managers can generate codes
- ✅ Each code requires explicit generation
- ✅ No static codes in environment files

### **5. Time-Based Fallback**
- ✅ Codes also expire after 24 hours
- ✅ Even if not used, becomes invalid
- ✅ Prevents very old codes from working

---

## 📊 Code Generation Logic

### **Random Code Format:**
```typescript
// 8 characters, hexadecimal, uppercase
crypto.randomBytes(4).toString('hex').toUpperCase()

Examples:
- A1B2C3D4
- F7E8D9C0
- 12AB34CD
```

### **Generation Process:**
```typescript
1. Manager clicks "New"
2. System generates random 8-char code
3. Expire all previous active codes for this role
4. Store new code with status 'active'
5. Return code to manager
6. Display in dashboard
```

---

## 🔄 Code Lifecycle States

### **Active:**
```
Status: active
Color: Cyan
Action: Can be used for registration
Duration: Until first use or 24 hours
```

### **Used:**
```
Status: used
Color: N/A (no longer displayed as active)
Action: Cannot be used
Metadata: used_by, used_at recorded
```

### **Expired:**
```
Status: expired
Color: N/A
Action: Cannot be used
Reason: Time limit exceeded or replaced
```

---

## 📝 Implementation Files

### **Backend:**
1. **`AccessCode.ts`** - Data model
2. **`accessCodeController.ts`** - API logic
3. **`accessCodeRoutes.ts`** - API routes
4. **`authController.ts`** - Updated validation
5. **`server.ts`** - Registered routes

### **Frontend:**
6. **`ManagerDashboardModern.tsx`** - UI and API calls

### **Database:**
7. **`access_codes`** - New MongoDB collection

---

## 🧪 Testing Scenarios

### **Test 1: Generate Code**
```
1. Login as manager
2. Click "New" for Field Officer
3. ✓ New code appears
4. ✓ Previous code (if any) expired
```

### **Test 2: Use Code Successfully**
```
1. Copy active code
2. Go to registration
3. Enter code during registration
4. ✓ Account created
5. ✓ Code marked as "used"
6. ✓ Dashboard shows "No code"
```

### **Test 3: Try to Reuse Code**
```
1. Try to register with used code
2. ✗ Error: "Invalid or expired access code"
3. ✓ Registration blocked
```

### **Test 4: Multiple Role Codes**
```
1. Generate code for each role
2. ✓ Each role has independent code
3. ✓ Using one doesn't affect others
```

### **Test 5: Expired Code**
```
1. Generate code
2. Wait 24 hours
3. Try to use code
4. ✗ Error: "Access code has expired"
```

---

## 🎯 Benefits Over Static Codes

| Feature | Static Codes | Dynamic Codes |
|---------|--------------|---------------|
| **Reusable** | ✓ Yes (security risk) | ✗ No (one-time use) |
| **Expiration** | ✗ Never | ✓ After first use |
| **Tracking** | ✗ No audit trail | ✓ Full history |
| **Manager Control** | ✗ Set once | ✓ Generate on demand |
| **Security** | ⚠️ Medium | ✅ High |
| **Stolen Code Risk** | ⚠️ High (works forever) | ✅ Low (single use) |

---

## 🔧 Configuration

### **Code Expiration Time:**
```typescript
// In accessCodeController.ts
const expiresAt = new Date();
expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

// Change to your preference:
// 12 hours: expiresAt.setHours(expiresAt.getHours() + 12);
// 1 hour: expiresAt.setHours(expiresAt.getHours() + 1);
```

### **Code Length:**
```typescript
// Currently: 8 characters
crypto.randomBytes(4).toString('hex').toUpperCase()

// Change to 12 characters:
crypto.randomBytes(6).toString('hex').toUpperCase()

// Change to 16 characters:
crypto.randomBytes(8).toString('hex').toUpperCase()
```

---

## 📈 Usage Metrics

### **Track in Dashboard (Future Enhancement):**
- Total codes generated today
- Total codes used today
- Average time between generation and use
- Most active role registrations
- Failed code attempts

---

## 🎉 Summary

**What You Have Now:**

✅ **Auto-Generating Codes**
- Manager generates on demand
- Random 8-character codes
- One per role at a time

✅ **Auto-Expiring Codes**
- Expire immediately after use
- Single-use only
- Fallback 24-hour expiration

✅ **Full Audit Trail**
- Who generated code
- Who used code
- When code was used
- Complete history

✅ **Beautiful UI**
- Dynamic code display
- "New" button to generate
- Copy functionality
- Status indicators
- Warning messages

✅ **Enhanced Security**
- No static codes
- No code reuse
- Manager-controlled
- Database tracked

**Your access code system now works like Google Authenticator - dynamic, time-sensitive, and secure!** 🔐✨

---

## 🚀 Next Steps

1. **Test the system:**
   - Generate codes for each role
   - Test registration with codes
   - Verify codes expire after use

2. **Share with team:**
   - Inform managers about new system
   - Train on code generation
   - Emphasize one-time use

3. **Monitor usage:**
   - Check access_codes collection
   - Review audit trail
   - Monitor failed attempts

**Your registration system is now enterprise-grade secure!** 🎯🔒

---

**Last Updated:** November 6, 2024
**System Type:** Dynamic One-Time Access Codes
**Security Level:** Enterprise-Grade
