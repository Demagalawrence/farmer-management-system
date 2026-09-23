# 🔑 Access Codes - Quick Reference Guide

## 🚨 CONFIDENTIAL - FOR ADMINISTRATORS ONLY

This document contains the secure access codes for creating privileged accounts in the Farmer Management System.

---

## 📋 Current Access Codes

### **Field Officer Registration**
```
Code: FO2024SECURE
```
**Who needs this:** Personnel responsible for monitoring farmers and field operations

### **Finance Manager Registration**
```
Code: FIN2024SECURE
```
**Who needs this:** Personnel handling payments and financial operations

### **Manager Registration**
```
Code: MGR2024SECURE
```
**Who needs this:** System administrators and senior management

### **Farmer Registration**
```
Code: NOT REQUIRED
```
**Note:** Farmers can register freely without any access code

---

## 🎯 How to Use Access Codes

### **Step-by-Step Registration Process**

1. **Go to Registration Page**
   - Navigate to the system login page
   - Click "Create account" or "Register"

2. **Fill Basic Information**
   - Enter your full name
   - Enter your email address

3. **Select Account Type**
   - Choose your role from dropdown
   - Options: Farmer, Field Officer, Finance Manager, Manager

4. **Enter Access Code** (For Privileged Roles Only)
   - ⚠️ A yellow warning box will appear
   - Enter the appropriate access code for your role
   - The code field is password-protected

5. **Complete Registration**
   - Enter your password (min 8 characters with uppercase, lowercase, number)
   - Confirm your password
   - Click "Create account"

---

## 🔐 Security Guidelines

### **DO:**
✅ Share codes only with authorized personnel
✅ Communicate codes through secure channels (in-person, encrypted messages)
✅ Change codes if compromised
✅ Keep this document secure
✅ Verify the identity of the person requesting a code
✅ Log who receives which codes

### **DON'T:**
❌ Share codes in group chats or public channels
❌ Write codes on sticky notes
❌ Email codes in plain text
❌ Share your personal access code with others
❌ Use the same code for multiple roles
❌ Post codes on social media or public forums

---

## 🔄 How to Change Access Codes

### **For System Administrators:**

1. **Navigate to Backend Folder**
   ```bash
   cd backend
   ```

2. **Open Environment File**
   ```bash
   # Edit .env file
   notepad .env  # Windows
   nano .env     # Linux/Mac
   ```

3. **Update the Codes**
   ```bash
   # Change these lines to new codes
   FIELD_OFFICER_CODE=YourNewCode123!
   FINANCE_CODE=NewFinanceCode456!
   MANAGER_CODE=NewManagerCode789!
   ```

4. **Restart Backend Server**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   npm run dev
   ```

5. **Distribute New Codes**
   - Inform all authorized personnel
   - Update this document
   - Securely communicate new codes

---

## 📊 Code Distribution Log

### Recommended Format:
```
| Date       | Code Type      | Issued To        | Issued By      |
|------------|----------------|------------------|----------------|
| 2024-11-06 | Field Officer  | John Doe         | Admin Name     |
| 2024-11-06 | Finance        | Jane Smith       | Admin Name     |
| 2024-11-06 | Manager        | Bob Johnson      | Admin Name     |
```

**Keep a log to track who has access codes!**

---

## 🚨 Emergency Procedures

### **If Access Code is Compromised:**

1. **Immediate Action**
   - Change the compromised code in `.env` file
   - Restart backend server
   - Notify all authorized personnel of the new code

2. **Investigation**
   - Review backend logs for suspicious registration attempts
   - Check who had access to the compromised code
   - Document the incident

3. **Prevention**
   - Remind all personnel of security guidelines
   - Consider changing all codes as a precaution
   - Update distribution logs

---

## 📱 Quick Access Code Verification

### **Test if Code Works:**

1. Go to registration page
2. Select the role (Field Officer/Finance/Manager)
3. Enter the access code
4. Try to register
5. ✅ Success = Code is valid
6. ❌ Error = Code needs updating

---

## 🔒 Password Recommendations for Access Codes

### **Suggested Format:**
```
[RolePrefix][Year][RandomWord][Number][Symbol]

Examples:
- FO2024Secure!123
- FIN2024Protected@456
- MGR2024Admin#789
```

### **Requirements:**
- Minimum 12 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters
- Not easily guessable
- Unique for each role

---

## 📞 Contact Information

### **For Access Code Requests:**
```
Contact: System Administrator
Email: admin@fmis.com
Phone: [Your Contact]
```

### **For Security Issues:**
```
Report immediately to:
Email: security@fmis.com
Phone: [Emergency Contact]
```

---

## ✅ Verification Checklist

Before issuing an access code, verify:

- [ ] Person's identity confirmed
- [ ] Role assignment approved by management
- [ ] Person understands security guidelines
- [ ] Code distribution logged
- [ ] Person confirmed code works
- [ ] Person knows not to share the code

---

## 🎯 Role Responsibilities

### **Field Officer**
- Monitor farmer activities
- Register new farmers
- Record harvest data
- Support farmers in the field

### **Finance Manager**
- Process payments
- Approve financial requests
- Manage payment records
- Generate financial reports

### **Manager**
- Full system access
- User management
- System configuration
- View all reports and analytics

### **Farmer**
- View own farm data
- Record harvest information
- Track payments
- Communicate with field officers

---

## 📝 Code Change Schedule

### **Recommended Timeline:**
```
✅ Change codes every 3 months
✅ Change immediately if compromised
✅ Change when personnel leave
✅ Change after security audit
```

### **Next Scheduled Change:**
```
Current Codes Set: November 6, 2024
Next Change Due: February 6, 2025
```

---

## 🎉 Summary

**Current Status:**
- ✅ Access codes active and secure
- ✅ Role-based access control implemented
- ✅ Farmers can register freely
- ✅ Privileged roles protected

**Remember:**
- Guard these codes carefully
- Share only with authorized personnel
- Change regularly for security
- Log all code distributions

---

## 🔐 SECURITY NOTICE

**⚠️ CONFIDENTIAL DOCUMENT**

This document contains sensitive security information. Do not share, distribute, or publish this document publicly. Keep it in a secure location accessible only to system administrators.

**Last Updated:** November 6, 2024
**Document Owner:** System Administrator
**Classification:** CONFIDENTIAL

---

**Your system is now secure! Only authorized personnel can create privileged accounts.** 🔒✅
