# 🔐 Login Instructions - QUICK START

## ✅ Backend Server Status
- **Running:** Yes (Port 5000)
- **Database:** Connected
- **Test Users:** Created ✅
- **Access Codes:** Active ✅

---

## 👤 USE THESE EXACT CREDENTIALS

### **Option 1: Manager Account (RECOMMENDED)**
```
Email:    manager@test.com
Password: password123
```
**Access:** Full dashboard, all features

### **Option 2: Field Officer**
```
Email:    officer@test.com
Password: password123
```
**Access:** Farmer management, harvests

### **Option 3: Farmer**
```
Email:    farmer@test.com
Password: password123
```
**Access:** Personal profile, harvest submission

---

## 🚀 HOW TO LOGIN (Step-by-Step)

### **Step 1: Open Your Browser**
Go to: `http://localhost:5173`

### **Step 2: Click "Login" Tab**
You should see the login form

### **Step 3: Enter Credentials**
```
Email:    manager@test.com
Password: password123
```
**IMPORTANT:** Type exactly as shown (all lowercase)

### **Step 4: Click Login Button**
You should be redirected to the Manager Dashboard

---

## ❓ If Login Fails (401 Error)

### **Check 1: Verify You're Using Exact Credentials**
- Email: `manager@test.com` (NOT Manager@test.com)
- Password: `password123` (NOT Password123)
- Case sensitive!

### **Check 2: Clear Browser Cache**
- Press `Ctrl + Shift + Delete`
- Clear cache and cookies
- Refresh page

### **Check 3: Check Browser Console**
- Press `F12` to open DevTools
- Look for specific error message
- Share with me if you see different errors

---

## 🔑 For Registration (New Users)

### **Step 1: Click "Register" Tab**

### **Step 2: Fill in Your Details**
```
Name:         Your Name
Email:        your@email.com
Password:     yourpassword
```

### **Step 3: Select Role**
Choose one:
- Field Officer
- Finance Manager
- Manager

### **Step 4: Enter Access Code**

| Role | Access Code | Valid |
|------|-------------|-------|
| Field Officer | `FIELD2024` | ✅ Active |
| Finance Manager | `FINANCE2024` | ✅ Active |
| Manager | `admin123` | ✅ Always |

### **Step 5: Click Register**
Account will be created and you'll be logged in automatically

---

## 📊 What Happens After Login

### **Manager Dashboard Shows:**
1. ✅ Square cards with real data
2. ✅ Sidebar menu (Field Officer, Financial Manager, etc.)
3. ✅ Click menu items → Cards change dynamically
4. ✅ Logout button in top-right
5. ✅ Access codes section at bottom
6. ✅ Charts with real metrics

### **Dynamic Features:**
- Click "Field Officer" → See farmer statistics
- Click "Financial Manager" → See payment data
- Click "Reports" → See reports overview
- Click "Approvals" → See approval stats

---

## 🔄 If You Still Get Errors

### **401 Unauthorized (Login)**
**Cause:** Wrong credentials or user doesn't exist

**Solutions:**
1. Double-check email: `manager@test.com`
2. Double-check password: `password123`
3. Try copy-pasting credentials
4. Check for extra spaces

### **403 Forbidden (Registration)**
**Cause:** Invalid or used access code

**Solutions:**
1. Use fresh code: `FIELD2024` or `FINANCE2024`
2. Check you entered it correctly (all caps)
3. If code was used, check manager dashboard for new code

---

## 💾 Database Contents Confirmed

```
✅ Users Collection:
   - manager@test.com (manager)
   - officer@test.com (field_officer)
   - farmer@test.com (farmer)

✅ Access Codes Collection:
   - FIELD2024 (field_officer) - active
   - FINANCE2024 (finance) - active
```

---

## 🎯 Quick Test Commands

### **Verify Database:**
```bash
cd backend
node -e "const { MongoClient } = require('mongodb'); (async () => { const client = new MongoClient('mongodb://localhost:27017'); await client.connect(); const db = client.db('farmer_management_system'); const users = await db.collection('users').find().toArray(); console.log('Users:', users.map(u => u.email)); await client.close(); })()"
```

### **Check Backend Server:**
```bash
Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
```
Should return: `True`

---

## 📞 If Nothing Works

1. **Screenshot the error** in browser console (F12)
2. **Check these URLs work:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

3. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C in backend terminal)
   # Stop frontend (Ctrl+C in frontend terminal)
   
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend (new terminal)
   cd frontend
   npm run dev
   ```

---

## ✅ Expected Result

After login with `manager@test.com` / `password123`:

```
✓ URL changes to: http://localhost:5173
✓ See: Manager Dashboard Modern
✓ Top bar: Search, Bell, Logout button, Profile icon
✓ Left sidebar: Profile, Field Officer, Financial Manager, etc.
✓ Main area: 4 small cards showing metrics
✓ Below: Large square cards (click sidebar to see them change)
✓ Charts: Level, Top Products, Customer Fulfillment, Earnings
✓ Bottom: Access Codes section with generate buttons
```

---

## 🎉 SUCCESS INDICATORS

You'll know it worked when you see:
- ✅ No more 401 or 403 errors
- ✅ Dashboard loads with your name
- ✅ Sidebar menu visible
- ✅ Square cards show numbers
- ✅ Logout button in top-right corner

---

**JUST TRY THIS:**
1. Go to `http://localhost:5173`
2. Type: `manager@test.com`
3. Type: `password123`
4. Click Login
5. Should work! 🎉

