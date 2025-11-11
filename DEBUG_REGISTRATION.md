# 🐛 Debug Registration Error

## ✅ Quick Test - Try This Right Now:

### **Test 1: Check if Backend is Running**

Open a new terminal and run:
```bash
curl http://localhost:5000/api/auth/register -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Test123\",\"role\":\"manager\",\"accessCode\":\"admin123\"}"
```

**Expected:** Should return JSON with success or error message
**If it fails:** Backend is not running or not accessible

---

### **Test 2: Use This EXACT Registration**

1. Go to: `http://localhost:3000`
2. Click "Register" (switch to registration page)
3. Fill form EXACTLY:

```
Name:              Test Manager
Email:             manager1@test.com
Password:          Test1234
Confirm Password:  Test1234
Role:              Manager (select from dropdown)
Access Code:       admin123
```

4. **Before clicking Register:**
   - Press F12 (open DevTools)
   - Click "Console" tab
   - Click "Network" tab
   - Keep DevTools open

5. Click "Register" button

6. **Look at Console tab:**
   - Any red errors?
   - What's the error message?

7. **Look at Network tab:**
   - Click on "register" request
   - Click "Response" tab
   - What does it say?

---

## 📋 Common Errors and Solutions:

### **Error: "Access code is required for this role"**
```
❌ Problem: Access Code field is empty
✅ Solution: Make sure you entered the code
```

### **Error: "Invalid admin secret"**
```
❌ Problem: Wrong code for manager (typo or spaces)
✅ Solution: Use exactly "admin123" (no spaces)
```

### **Error: "Invalid or expired access code"**
```
❌ Problem: Wrong code for Field Officer/Finance
✅ Solution: Use exactly "INITIAL_FO_2024" or "INITIAL_FIN_2024"
```

### **Error: "All fields are required"**
```
❌ Problem: Missing name, email, password, or role
✅ Solution: Fill all fields
```

### **Error: "Invalid role specified"**
```
❌ Problem: Role value is wrong
✅ Solution: Make sure dropdown shows Manager, Field Officer, or Finance Manager
```

---

## 🔍 Check What's Being Sent:

In DevTools Network tab, click on the "register" request, then "Payload":

**Should look like:**
```json
{
  "name": "Test Manager",
  "email": "manager1@test.com",
  "password": "Test1234",
  "role": "manager",
  "accessCode": "admin123"
}
```

**Check:**
- ✅ All fields present
- ✅ role is lowercase ("manager", not "Manager")
- ✅ accessCode is present (not empty)

---

## 🎯 Role Mapping

| Dropdown Shows | Backend Expects |
|----------------|-----------------|
| Manager | `manager` |
| Field Officer | `field_officer` |
| Finance Manager | `finance` |

---

## 🔧 Reset and Try Again:

If nothing works:

1. **Stop both servers** (Ctrl+C in both terminals)

2. **Clear browser data:**
   - Press F12
   - Right-click refresh button
   - Click "Empty Cache and Hard Reload"

3. **Restart backend:**
```bash
cd backend
npm run dev
```

4. **Restart frontend:**
```bash
cd frontend  
npm run dev
```

5. **Try registration again**

---

## 🆘 Send Me This Info:

If still failing, check these and tell me:

1. **What error message shows on the page?**
   - (the red text that appears)

2. **What shows in Network tab Response?**
   - (the JSON error message)

3. **What role are you trying to register?**
   - Manager / Field Officer / Finance Manager

4. **What access code are you using?**
   - (copy-paste what you entered)

5. **Backend terminal output?**
   - (any error messages when you click Register)

---

## ✅ Working Example Screenshot:

**Browser DevTools - Network Tab - Payload:**
```
name: "Test Manager"
email: "manager1@test.com"
password: "Test1234"  
role: "manager"
accessCode: "admin123"
```

**Backend Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbG..."
}
```

**Backend Response (Error):**
```json
{
  "success": false,
  "message": "Invalid admin secret. Manager accounts require the admin secret to create."
}
```

The error message tells you exactly what's wrong!

---

## 💡 Most Likely Issues:

1. **Typo in access code** (95% of cases)
2. **Extra space** before or after code
3. **Wrong capitalization** (Admin123 vs admin123)
4. **Wrong role selected** (using FO code for Manager)
5. **Backend not running** on port 5000

---

**Try the exact test above and tell me what error message you see!** 🔍
