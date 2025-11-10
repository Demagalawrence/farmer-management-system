# Test Report Notification Creation

## Quick Database Check

Run these queries in MongoDB Compass to check notifications:

### 1. Check all notifications
```javascript
db.notifications.find().sort({ created_at: -1 })
```

### 2. Check only report notifications (the ones we create)
```javascript
db.notifications.find({ 
  report_id: { $exists: true } 
}).sort({ created_at: -1 })
```

### 3. Check notifications created today
```javascript
db.notifications.find({
  created_at: { $gte: new Date('2025-11-09') }
}).sort({ created_at: -1 })
```

### 4. Check notifications for specific user
```javascript
// Replace with actual user ID from your logs
db.notifications.find({
  recipient_id: ObjectId('690b29d4a91e21ee2cb5e4f3')
})
```

---

## Two Notification Types in Your Database

I noticed you have TWO types of notifications:

### Type 1: Payment Notifications (old system)
```json
{
  "type": "payment_processed",
  "payment_id": "...",
  "farmer_id": "...",
  "audience": "manager",  // ← uses "audience"
  "amount": 500
}
```

### Type 2: Report Notifications (new system we built)
```json
{
  "report_id": "...",
  "recipient_id": "...",  // ← uses "recipient_id"
  "recipient_role": "manager",
  "title": "New Financial Report Available",
  "message": "..."
}
```

Both are in the same `notifications` collection!

---

## Testing Steps

### Step 1: Clear old test data (optional)
```javascript
// Delete only report notifications if you want clean slate
db.notifications.deleteMany({ report_id: { $exists: true } })
```

### Step 2: Generate Report

1. Login as Financial Manager
2. Click "Reports" button
3. **CRITICAL: Check the recipient checkboxes!** ✅
4. Click "Generate & Distribute"

### Step 3: Check if notification was created

Run this immediately after generating:
```javascript
db.notifications.find({ 
  report_id: { $exists: true } 
}).sort({ created_at: -1 }).limit(5)
```

**Expected result:**
```json
{
  "_id": ObjectId("..."),
  "report_id": ObjectId("..."),
  "recipient_id": ObjectId("690b29d4a91e21ee2cb5e4f3"),  // Manager's ID
  "recipient_role": "manager",
  "title": "New Financial Report Available",
  "message": "January 2025 Report is now available...",
  "read": false,
  "created_at": ISODate("2025-11-09T...")
}
```

### Step 4: Verify IDs Match

The `recipient_id` in the notification should match the user ID you see in logs:
```
Fetching notifications for user 690b29d4a91e21ee2cb5e4f3 (manager)
```

---

## If No Notifications Are Created

Check backend console for one of these messages:

### Message 1: "No recipients provided"
```
No recipients provided or recipients array is empty
```
**Problem:** You didn't check any recipient checkboxes
**Solution:** Make sure to check at least one checkbox

### Message 2: Recipients shown but no creation message
```
Distributing report XXX to 2 recipients
Recipients: [...]
// But NO "[NotificationService] Creating..." message
```
**Problem:** The code isn't reaching the notification creation
**Solution:** Check if `action` parameter is 'distribute' or 'both'

### Message 3: Error during creation
```
[NotificationService] Creating 2 notifications
ERROR: ...
```
**Problem:** Database error or permission issue
**Solution:** Check MongoDB connection and user permissions

---

## Quick Manual Test

You can manually insert a test notification to verify the system works:

```javascript
db.notifications.insertOne({
  report_id: ObjectId(),
  recipient_id: ObjectId("690b29d4a91e21ee2cb5e4f3"),  // Your manager ID
  recipient_role: "manager",
  title: "TEST: Manual Notification",
  message: "This is a test notification created manually",
  read: false,
  created_at: new Date()
})
```

Then refresh the Manager portal and check if the bell icon shows a badge!

---

## Current Status Check

Based on your logs, here's what we know:

✅ Manager logs in successfully (ID: 690b29d4a91e21ee2cb5e4f3)  
✅ Field Officer logs in successfully (ID: 690a4dfadf06978f702e394c)  
✅ NotificationService is querying correctly  
❌ No notifications found for these users  
❓ Unknown if report was generated with recipients selected  

**Next step:** Generate a report with recipients checked and show me the backend logs!
