# FMIS Dashboard Wireframes

This document outlines the structure and key components of the dashboards for each user role.

---

## 1. Field Officer Dashboard

### Key Sections:

- **My Farmers**
  - Total Farmers: [Number]
  - New This Week: [Number]
  - Quick Actions: + Register Farmer

- **Fields Overview**
  - Active Fields: [Number]
  - Needs Attention: [Number] (e.g., health = 'needs_attention' or 'critical')
  - Map View: Interactive field locations

- **Recent Activities**
  - List of last 5 actions:
    - Farmer registration
    - Field update
    - Harvest recorded

- **Pending Tasks**
  - Pending Verifications: [Count]
  - Scheduled Visits: [List with dates]

- **Quick Reports**
  - Crop Health Summary (chart)
  - Input Needs Forecast
  - Harvest Readiness (% of fields ready)

---

## 2. Manager Dashboard

### Key Sections:

- **System Overview**
  - Total Farmers: [Number]
  - Active Fields: [Number]
  - Budget Status: [Used / Allocated] (progress bar)

- **Performance Metrics**
  - Field Officer Completion Rate: [%]
  - Average Time to Verify Reports: [Days]
  - Top Performing Officer: [Name]

- **Pending Approvals**
  - Budget Requests: [Count]
  - Reports to Review: [Count]
  - User Access Changes: [Count]

- **Recent Alerts**
  - High-Priority Issues:
    - Field health emergencies
    - Payment delays
    - Unverified harvests > 7 days

---

## 3. Finance Dashboard

### Key Sections:

- **Financial Overview**
  - Total Budget: [Amount]
  - Spent: [Amount]
  - % Used: [Percentage] (gauge chart)

- **Pending Payments**
  - Count: [Number]
  - Total Amount: [Amount]
  - List: Farmer Name, Tons, Amount, Date

- **Overbudget Categories**
  - [Seeds]: +12%
  - [Fertilizer]: +8%

- **Recent Transactions**
  - Last 5 payments made
  - Filter by date/amount

- **Budget Breakdown**
  - Pie Chart: Seeds, Fertilizer, Labor, Transport, Other

- **Payment Requests**
  - From Field Officers: [Count]
  - Avg. Processing Time: [Hours]
