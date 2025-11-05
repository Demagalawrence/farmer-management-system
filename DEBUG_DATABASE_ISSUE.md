# Database Issue Debugging Guide

## Issue Summary
- ✅ MongoDB is connected
- ✅ User registration works (data in `users` collection)
- ❌ Farmer registration fails (no data in `farmers` collection)
- ❌ Location data not saved

## Root Cause Found

### Problem 1: Validation Schema Missing `coordinates` Field
The backend validation was stripping out the `coordinates` field because it wasn't in the schema.

**Fixed:** Added `coordinates` to both `createFarmer` and `updateFarmer` validation schemas.

### Problem 2: Possible Validation Errors Not Shown
The frontend might be failing validation but not showing the error to users.

---

## Immediate Steps to Fix

### 1. Restart Backend Server

**IMPORTANT:** The validation changes require a backend restart!

```powershell
# Stop the backend (Ctrl+C in the terminal)
# Then restart:
cd c:\Users\DELL\Desktop\farmer-management-system\backend
npm run dev
```

**Look for this message:**
```
Connected to MongoDB successfully
Server running on port 5000
```

### 2. Test Farmer Registration (Browser Console)

Open browser DevTools (F12) → Console tab, paste and run:

```javascript
// Test 1: Register a simple farmer
fetch('http://localhost:5000/api/farmers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    name: "Test Farmer",
    email: "test@farm.ug",
    phone: "256700123456",
    address: "Kampala District, Uganda",
    farm_size: 25.5,
    status: "active"
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ SUCCESS:', d);
  if (d.success) {
    alert('Farmer created! Check MongoDB Compass');
  } else {
    alert('❌ Failed: ' + d.message);
  }
})
.catch(e => console.error('❌ ERROR:', e));
```

### 3. Test Farmer with Coordinates

```javascript
// Test 2: Register farmer with location
fetch('http://localhost:5000/api/farmers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    name: "Kampala Farm",
    email: "kampala@farm.ug",
    phone: "256700999888",
    address: "Kampala Central, Uganda",
    farm_size: 50.0,
    coordinates: {
      lat: 0.3476,
      lng: 32.5825
    },
    status: "active"
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ RESPONSE:', d);
  if (d.success && d.data) {
    console.log('Farmer ID:', d.data.external_id);
    console.log('Coordinates saved:', d.data.coordinates);
    alert(`Success! Farmer #${d.data.external_id} created with location`);
  }
})
.catch(e => console.error('❌ ERROR:', e));
```

### 4. Verify in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `fmis`
4. Click on `farmers` collection
5. You should now see the test farmers!

---

## Common Validation Errors

### Phone Number Format
**❌ Wrong:**
- `+256 700 123456` (spaces)
- `0700123456` (starts with 0)
- `256-700-123456` (dashes)

**✅ Correct:**
- `256700123456` (10-15 digits only)
- `1234567890`

### Address Length
**❌ Wrong:**
- `""` (empty)
- `"Kampala"` (less than 5 characters)

**✅ Correct:**
- `"Kampala District"` (at least 5 characters)
- `"123 Farm Road, Mukono"`

### Coordinates Format
**❌ Wrong:**
```json
{
  "coordinates": {
    "latitude": 0.3476,
    "longitude": 32.5825
  }
}
```

**✅ Correct:**
```json
{
  "coordinates": {
    "lat": 0.3476,
    "lng": 32.5825
  }
}
```

---

## Frontend Error Checking

### Check Browser Network Tab

1. Open DevTools (F12) → **Network** tab
2. Click "Register Farmer" in the UI
3. Look for request: `POST /api/farmers`
4. Click on it to see details:
   - **Request Headers:** Should have `Authorization: Bearer ...`
   - **Request Payload:** Should have all farmer data
   - **Response:** Look for error messages

### Common Issues

#### Issue: 401 Unauthorized
**Cause:** Not logged in or token expired  
**Fix:** Login again

#### Issue: 400 Bad Request
**Cause:** Validation error  
**Fix:** Check response body for specific error message

```javascript
// Check validation errors
fetch('http://localhost:5000/api/farmers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ /* your data */ })
})
.then(async r => {
  const data = await r.json();
  if (!r.ok) {
    console.error('Validation Error:', data.message);
    alert('Error: ' + data.message);
  }
  return data;
});
```

#### Issue: 500 Internal Server Error
**Cause:** Backend crash or database issue  
**Fix:** Check backend console for error stack trace

---

## Debug the UI Registration Form

### Check Form Data Before Submit

Add this to `FieldOfficerDashboardExact.tsx` in `handleRegisterFarmer`:

```typescript
const handleRegisterFarmer = async (e: React.FormEvent) => {
  e.preventDefault();
  setRegisterError('');
  setRegisterSuccess('');

  // DEBUG: Log the data being sent
  console.log('📤 Sending farmer data:', {
    name: registerForm.name,
    email: registerForm.email,
    phone: registerForm.phone,
    address: registerForm.address,
    farm_size: parseFloat(registerForm.farm_size),
    status: 'active'
  });

  try {
    // ... rest of the code
```

### Check Form Data in AddLocationModal

Add this to `AddLocationModal.tsx` in `handleSubmit`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // DEBUG: Log location data
  console.log('📍 Location data:', {
    name: locationForm.farmName,
    coordinates: {
      lat: parseFloat(locationForm.latitude),
      lng: parseFloat(locationForm.longitude)
    }
  });

  // ... rest of the code
```

---

## Backend Logging

### Check Backend Logs

The backend logs are in:
```
backend/logs/application-YYYY-MM-DD.log
backend/logs/error-YYYY-MM-DD.log
```

### View Real-Time Logs

In the backend terminal, you should see:
```
POST /api/farmers - 201 Created (if success)
POST /api/farmers - 400 Bad Request (if validation error)
POST /api/farmers - 401 Unauthorized (if not logged in)
```

### Enable Debug Mode

Add this to `backend/.env`:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

---

## Test Database Connection

### Test MongoDB is Working

Open MongoDB Compass and run this query in the `farmers` collection:

**Insert Test Document Manually:**
```json
{
  "external_id": 999,
  "name": "Manual Test Farmer",
  "email": "manual@test.com",
  "phone": "256700000000",
  "address": "Test Address, Uganda",
  "farm_size": 100,
  "coordinates": {
    "lat": 0.3476,
    "lng": 32.5825
  },
  "status": "active",
  "registration_date": {"$date": "2025-11-04T20:00:00.000Z"},
  "fields": []
}
```

**Steps:**
1. Click `ADD DATA` → `Insert Document`
2. Paste the JSON above
3. Click `Insert`
4. Refresh the frontend dashboard
5. The farmer should appear with count = 1

If this works, the problem is in the API/frontend flow.

---

## Expected Results After Fix

### 1. In MongoDB Compass (`farmers` collection)

You should see documents like:

```json
{
  "_id": ObjectId("674..."),
  "external_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "256700123456",
  "address": "Kampala District",
  "farm_size": 50.5,
  "coordinates": {
    "lat": 0.3476,
    "lng": 32.5825
  },
  "status": "active",
  "registration_date": ISODate("2025-11-04T..."),
  "fields": []
}
```

### 2. In Dashboard

- **Total Farmers:** Shows actual count (1, 2, 3...)
- **Map:** Shows markers at farm locations
- **Dropdown:** Lists farm names

### 3. In Browser Console

```
✅ SUCCESS: {success: true, data: {external_id: 1, name: "...", ...}}
```

---

## Still Not Working?

### Checklist

- [ ] Backend restarted after validation changes
- [ ] MongoDB is running (check Compass connection)
- [ ] User is logged in (check localStorage for token)
- [ ] Browser console shows no errors
- [ ] Backend console shows "Connected to MongoDB successfully"
- [ ] Network tab shows `POST /api/farmers` with status 201
- [ ] Phone number is 10-15 digits with no spaces/dashes
- [ ] Address is at least 5 characters

### Get More Help

Run these diagnostic commands in browser console:

```javascript
// Check auth token
console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');

// Check user info
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Test API connection
fetch('http://localhost:5000/api/farmers', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(d => console.log('Current farmers:', d))
.catch(e => console.error('API Error:', e));
```

### Send Debug Info

If still having issues, check:
1. Backend terminal output (any errors?)
2. Browser console errors
3. Network tab → POST /api/farmers → Response tab
4. MongoDB Compass → `fmis` database → collections list

---

## Summary of Fixes Applied

✅ **Added `coordinates` field to validation schema** - Now location data won't be stripped out  
✅ **Added validation for lat/lng** - Ensures coordinates are valid GPS values  
✅ **Updated both create and update schemas** - Supports adding coordinates during creation or updating existing farmers  

**Next Step:** Restart backend and test!
