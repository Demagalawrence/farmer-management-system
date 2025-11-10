# Debugging Notification Issues

## What I've Added

I've added extensive logging throughout the notification system to help debug the issue. The logs will show up in your **backend console**.

---

## How to Test & Debug

### Step 1: Restart Backend
```bash
cd backend
npm run dev
```

Watch the console for log messages.

---

### Step 2: Generate Report as Financial Manager

1. Login as Financial Manager
2. Click "Reports" button
3. In the modal:
   - Select date range
   - **CHECK at least one recipient** (Manager or Field Officer)
   - Click "Generate & Distribute"

---

### Step 3: Check Backend Logs

Look for these log messages in the backend console:

**When generating report:**
```
Distributing report [ID] to X recipients
Recipients: [JSON array with user_id, name, role]
Creating notifications: [JSON array]
[NotificationService] Creating X notifications
[NotificationService] Input notifications: [details]
[NotificationService] Successfully inserted X notifications
```

**Important things to check:**
- ✅ Is `recipients` array populated?
- ✅ Do recipients have valid `user_id` values?
- ✅ Are notifications being created successfully?

---

### Step 4: Login as Manager/Field Officer

1. Logout from Financial Manager
2. Login as Manager or Field Officer (must be one of the selected recipients)

---

### Step 5: Check Backend Logs for Notification Fetching

Look for these messages when the Manager/Field Officer portal loads:

```
Fetching notifications for user [ID] ([role])
[NotificationService] Finding notifications for recipient: [ID]
[NotificationService] Found X notifications for recipient [ID]
```

**Important things to check:**
- ✅ Is the user ID correct?
- ✅ Does it match the recipient_id in the created notifications?
- ✅ Are notifications being found?

---

## Common Issues & Solutions

### Issue 1: "No recipients provided"

**Symptoms:**
```
No recipients provided or recipients array is empty
```

**Solution:**
- Make sure you're **checking the checkboxes** for recipients in the modal
- The checkboxes must be checked before clicking "Generate & Distribute"

---

### Issue 2: User ID Mismatch

**Symptoms:**
```
[NotificationService] Creating notifications with recipient_id: 123abc
[NotificationService] Finding notifications for recipient: 456def
```
The IDs don't match!

**Solution:**
- The recipient user_id from the modal must match the logged-in user's ID
- Check that you're logging in with the same account that was selected as recipient

**To verify:**
1. In backend logs, note the `recipient_id` when notification is created
2. When logging in as that user, note the user ID in "Fetching notifications for user [ID]"
3. They should match exactly

---

### Issue 3: Notifications Created but Not Fetched

**Symptoms:**
```
[NotificationService] Successfully inserted 2 notifications
...later...
[NotificationService] Found 0 notifications for recipient
```

**Possible causes:**
- User ID format mismatch (string vs ObjectId)
- Database query not finding the records

**Solution:**
Check the logged user IDs:
- When creating: Look at normalized notifications in logs
- When fetching: Look at the queried recipient_id
- They should be identical

---

### Issue 4: Route Not Found

**Symptoms:**
Frontend shows 404 error for `/api/notifications`

**Solution:**
Make sure notification routes are registered in your backend's main app file.

**Check `backend/src/app.ts` or `backend/src/index.ts`:**
```typescript
import notificationRoutes from './routes/notifications';
app.use('/api/notifications', notificationRoutes);
```

---

## Quick Diagnostic Commands

### Check if notifications were created in database:

```javascript
// In MongoDB shell or Compass
db.notifications.find().pretty()
```

### Check users collection to verify IDs:

```javascript
// In MongoDB shell or Compass
db.users.find({ role: { $in: ['manager', 'field_officer'] } }).pretty()
```

---

## What to Send Me

If it's still not working, send me:

1. **Backend console output** from when you:
   - Generate the report
   - Login as manager/field officer

2. **Screenshot** of the Recipients section in the modal showing:
   - Which recipients are listed
   - Which checkboxes are checked

3. **Database query results:**
   ```javascript
   // Check notifications
   db.notifications.find().pretty()
   
   // Check users
   db.users.find({ role: { $in: ['manager', 'field_officer'] } }).pretty()
   ```

---

## Expected Successful Flow

When everything works, you should see:

```
# When generating report:
Distributing report 673456... to 2 recipients
Recipients: [{"user_id":"abc123","name":"John Manager","role":"manager"},...]
[NotificationService] Creating 2 notifications
[NotificationService] Successfully inserted 2 notifications

# When manager/field officer logs in:
Fetching notifications for user abc123 (manager)
[NotificationService] Finding notifications for recipient: abc123
[NotificationService] Found 1 notifications for recipient abc123
```

Then the bell icon should show a red badge with "1"! 🔔
