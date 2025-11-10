# Report Generation & Notification Testing Guide

## Overview
The system allows Financial Managers to generate PDF reports and distribute them to Managers and Field Officers via notifications.

## Complete Flow

### Step 1: Generate Report (as Financial Manager)
1. **Login as Financial Manager**
   - Use credentials with role: 'finance'

2. **Click "Reports" button** in the top navigation bar
   - Purple gradient nav bar → "Reports" button

3. **Report Distribution Modal Opens**
   - Select date range (defaults to current month)
   - Enter report title (optional)
   - **Select recipients:**
     - ✅ Check managers you want to notify
     - ✅ Check field officers you want to notify
     - 💡 You can select all or specific users

4. **Choose Action:**
   - **"Download Only"** - Generate PDF and download to your computer
   - **"Distribute Only"** - Generate PDF and send notifications (no download)
   - **"Generate & Distribute"** - Do both!

5. **Click Generate Button**
   - System generates PDF report
   - Creates notifications for selected recipients
   - Success message appears

---

### Step 2: View Notification (as Manager or Field Officer)

1. **Login as Manager or Field Officer**
   - Use account that was selected as recipient

2. **Check Notification Bell** 🔔
   - Top right of navigation bar
   - **Red badge** shows unread count
   - Badge will show "1" or more

3. **Click Notification Bell**
   - Dropdown slides in from right
   - See notification: "New Financial Report Available"
   - Message shows report title and date period

4. **Click on the Notification**
   - Notification automatically marks as read
   - **PDF opens in new browser tab**
   - You can view, download, or print the PDF

---

## Technical Details

### Backend Endpoints

**Generate Report:**
```
POST /api/formal-reports/generate-formal-report
Authorization: Bearer <token>
Body: {
  "start_date": "2025-01-01",
  "end_date": "2025-01-31",
  "title": "January 2025 Financial Report",
  "recipients": [
    { "user_id": "...", "name": "...", "role": "manager" }
  ],
  "action": "both" // "download" | "distribute" | "both"
}
```

**Get Recipients:**
```
GET /api/formal-reports/recipients
Authorization: Bearer <token>
```

**View PDF:**
```
GET /api/formal-reports/view/:reportId?token=<jwt>
```

### Frontend Components

**Financial Manager:**
- `TopNavigationBar` - Reports button
- `ReportDistributionModal` - Form to generate and distribute
- `NotificationBell` - View received notifications

**Manager & Field Officer:**
- Navigation bar with gradient (purple-pink)
- `NotificationBell` - Receive and view report notifications
- `UserProfileDropdown` - User menu

---

## Features

### Notification System
✅ Real-time badge updates  
✅ Auto-refresh every 30 seconds  
✅ Mark as read on click  
✅ Mark all as read option  
✅ Delete notifications  
✅ Professional slide-in animation  

### Report Features
✅ PDF generation with Puppeteer  
✅ Stored in `backend/storage/reports/`  
✅ Secure viewing with JWT token  
✅ Opens in new tab  
✅ Professional formatting  
✅ Revenue, payment, budget data  

### Security
✅ JWT authentication required  
✅ Token in URL for new tab viewing  
✅ Role-based access control  
✅ Only selected recipients get notifications  

---

## Testing Checklist

### As Financial Manager:
- [ ] Click "Reports" button in nav bar
- [ ] Modal opens successfully
- [ ] See list of available recipients (managers & field officers)
- [ ] Select recipients
- [ ] Choose date range
- [ ] Click "Generate & Distribute"
- [ ] Success message appears
- [ ] Can download PDF (if selected)

### As Manager:
- [ ] See notification badge (red circle with count)
- [ ] Click notification bell
- [ ] Dropdown slides in from right
- [ ] See "New Financial Report Available" notification
- [ ] Click notification
- [ ] PDF opens in new browser tab
- [ ] Can view/download/print PDF
- [ ] Notification marked as read (badge count decreases)

### As Field Officer:
- [ ] Same as Manager testing above

---

## Troubleshooting

### "No recipients available"
- Ensure you have users with roles 'manager' or 'field_officer' in database
- Check backend console for errors

### "PDF fails to open"
- Check browser allows popups from localhost
- Verify token is valid (check browser console)
- Check backend logs for PDF generation errors

### "Notifications not appearing"
- Wait 30 seconds for auto-refresh
- Or refresh the page manually
- Check that user was selected as recipient
- Verify backend created notification (check DB or logs)

### "Report generation fails"
- Check backend has write access to `backend/storage/reports/`
- Verify Puppeteer is installed: `npm install puppeteer`
- Check backend console logs for errors

---

## Database Schema

**Notifications Collection:**
```javascript
{
  "_id": ObjectId,
  "report_id": String,
  "recipient_id": String,
  "recipient_role": "manager" | "field_officer",
  "title": "New Financial Report Available",
  "message": "Q4 2025 Financial Report is now available...",
  "read": false,
  "created_at": Date
}
```

**Reports Collection:**
```javascript
{
  "_id": ObjectId,
  "title": String,
  "report_type": "formal",
  "status": "completed",
  "file_path": String,
  "file_size": Number,
  "generated_by": ObjectId,
  "data": { summary, period },
  "created_at": Date
}
```

---

## Success Indicators

✅ **Backend:** Console logs "Report generated successfully"  
✅ **Backend:** Console logs "Distributing report to X recipients"  
✅ **Frontend:** Success message in modal  
✅ **Notification:** Red badge appears for recipients  
✅ **PDF:** Opens in new tab when notification clicked  
✅ **Badge:** Count decreases when notification marked as read  

---

## Next Steps

After testing, you can:
1. Customize PDF template in `backend/src/templates/reportTemplate.ts`
2. Add more recipient filtering options
3. Schedule automatic report generation
4. Add email notifications alongside in-app notifications
5. Create report archive/history view
