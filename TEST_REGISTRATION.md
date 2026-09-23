# 🧪 Test Registration - Step by Step

## ⚠️ Common Registration Errors

### **Error 400: Bad Request**

This usually happens when:
1. ❌ Access code field is empty
2. ❌ Role is not selected
3. ❌ Required fields are missing
4. ❌ Wrong access code format (extra spaces, wrong case)

---

## ✅ Exact Steps to Register

### **Step 1: Open Registration Page**
```
http://localhost:3000/register
OR
http://localhost:3000 → Click "Register" link
```

---

### **Step 2: Fill Form EXACTLY as shown**

#### **For Manager Account:**

```
Full Name:          Test Manager
Email:              manager@test.com
Password:           Test1234
Confirm Password:   Test1234
Role:               Manager
Access Code:        admin123
```

⚠️ **Important:**
- Access code is `admin123` (all lowercase, no spaces)
- Make sure "Manager" is selected from dropdown
- All fields must be filled

---

#### **For Field Officer Account:**

```
Full Name:          Test Officer
Email:              officer@test.com
Password:           Test1234
Confirm Password:   Test1234
Role:               Field Officer
Access Code:        INITIAL_FO_2024
```

⚠️ **Important:**
- Access code is `INITIAL_FO_2024` (all caps, with underscores)
- Copy-paste to avoid typos
- Make sure "Field Officer" is selected

---

#### **For Finance Manager Account:**

```
Full Name:          Test Finance
Email:              finance@test.com
Password:           Test1234
Confirm Password:   Test1234
Role:               Finance Manager
Access Code:        INITIAL_FIN_2024
```

⚠️ **Important:**
- Access code is `INITIAL_FIN_2024` (all caps, with underscores)
- Copy-paste to avoid typos
- Make sure "Finance Manager" is selected

---

## 🔍 Debug Checklist

Before clicking "Register", verify:

- [ ] All fields are filled (no empty fields)
- [ ] Email format is correct (contains @)
- [ ] Password is at least 6 characters
- [ ] Password and Confirm Password match
- [ ] Role is selected from dropdown
- [ ] Access code is entered correctly (check for spaces)
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000

---

## 🎯 Test with Browser Console

### **Check What's Being Sent:**

1. Open browser (Chrome/Edge)
2. Press F12 (open DevTools)
3. Go to "Network" tab
4. Click "Register" button
5. Click on the "register" request
6. Look at "Payload" or "Request" tab
7. See what data is being sent

**Expected Payload:**
```json
{
  "name": "Test Manager",
  "email": "manager@test.com",
  "password": "Test1234",
  "role": "manager",
  "accessCode": "admin123"
}
```

---

## 🐛 Common Mistakes

### **1. Extra Spaces in Access Code**
```
❌ "admin123 " (has trailing space)
❌ " admin123" (has leading space)
✅ "admin123" (correct)
```

### **2. Wrong Case**
```
❌ "Admin123" (wrong case)
❌ "ADMIN123" (wrong case)
✅ "admin123" (correct)
```

### **3. Role Mismatch**
```
❌ Role: "Manager" but Code: "INITIAL_FO_2024"
✅ Role: "Manager" with Code: "admin123"
```

### **4. Using Old/Expired Code**
```
❌ Code already used by someone else
✅ Use fresh code from seed script
```

---

## 🔧 Quick Fix

If registration still doesn't work, try this:

### **Option 1: Test with Curl**

```bash
# Test Manager Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Manager\",\"email\":\"manager@test.com\",\"password\":\"Test1234\",\"role\":\"manager\",\"accessCode\":\"admin123\"}"
```

### **Option 2: Check Backend Response**

Look at the backend terminal window. When you try to register, you should see:
- Request received
- Validation errors (if any)
- Success or failure message

---

## 📋 Role Values Reference

**Frontend Role Label → Backend Role Value**

| What You See | What Gets Sent | Access Code |
|--------------|----------------|-------------|
| Manager | `manager` | `admin123` |
| Field Officer | `field_officer` | `INITIAL_FO_2024` |
| Finance Manager | `finance` | `INITIAL_FIN_2024` |

---

## 🎯 Copy-Paste Values

**Manager:**
```
admin123
```

**Field Officer:**
```
INITIAL_FO_2024
```

**Finance Manager:**
```
INITIAL_FIN_2024
```

---

## ✅ Success Indicators

When registration works:
- ✅ Page redirects to dashboard
- ✅ You're automatically logged in
- ✅ Dashboard shows your role
- ✅ No error messages

When registration fails:
- ❌ Error message appears
- ❌ Form stays on same page
- ❌ Red text shows error

---

## 🆘 Still Getting 400 Error?

### **Check Backend Terminal:**

You should see output like:
```
POST /api/auth/register 400 - - 123 ms
```

Or error messages like:
```
ValidationError: Access code is required for this role
```

### **Check Frontend Console (F12):**

Look for:
```
POST http://localhost:5000/api/auth/register 400 (Bad Request)
```

Click on it to see response:
```json
{
  "success": false,
  "message": "Error message here"
}
```

This will tell you exactly what's wrong!

---

## 💡 Pro Tips

1. **Copy-paste access codes** - Don't type manually
2. **Check for spaces** - Trim whitespace
3. **Match role and code** - Manager → admin123, etc.
4. **One at a time** - Test one account first
5. **Check both terminals** - Frontend AND backend

---

**Most Common Issue:** Access code has extra spaces or wrong capitalization!

**Quick Test:** Try manager account first with `admin123` ✅
