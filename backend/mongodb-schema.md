# MongoDB Schema Design for Farmer Management System

This document outlines the MongoDB collection design based on the existing SQL schema.

## Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // Unique
  role: String, // Enum: 'farmer', 'field_officer', 'finance', 'manager'
  password_hash: String,
  created_at: Date
}
```

### 2. Farmers Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // Reference to Users collection
  name: String,
  contact: String,
  address: String,
  registration_date: Date,
  status: String, // Enum: 'active', 'inactive'
  // Embedded field information for better performance
  fields: [
    {
      field_id: ObjectId,
      location: String,
      size_hectares: Number,
      crop_stage: String, // Enum: 'planting', 'growing', 'mature', 'harvest_ready'
      last_inspection_date: Date,
      health_status: String // Enum: 'healthy', 'needs_attention', 'critical'
    }
  ]
}
```

### 3. Fields Collection
```javascript
{
  _id: ObjectId,
  farmer_id: ObjectId, // Reference to Farmers collection
  location: String,
  size_hectares: Number,
  crop_stage: String, // Enum: 'planting', 'growing', 'mature', 'harvest_ready'
  last_inspection_date: Date,
  health_status: String, // Enum: 'healthy', 'needs_attention', 'critical'
  created_at: Date
}
```

### 4. Harvests Collection
```javascript
{
  _id: ObjectId,
  field_id: ObjectId, // Reference to Fields collection
  farmer_id: ObjectId, // Reference to Farmers collection
  harvest_date: Date,
  quantity_tons: Number,
  quality_grade: String // Enum: 'A', 'B', 'C'
}
```

### 5. Payments Collection
```javascript
{
  _id: ObjectId,
  farmer_id: ObjectId, // Reference to Farmers collection
  harvest_id: ObjectId, // Reference to Harvests collection (Unique)
  amount: Number,
  rate_per_ton: Number,
  status: String, // Enum: 'pending', 'approved', 'paid', 'rejected'
  processed_by: ObjectId, // Reference to Users collection (Finance user)
  payment_date: Date,
  created_at: Date
}
```

### 6. Reports Collection
```javascript
{
  _id: ObjectId,
  type: String, // Enum: 'harvest_summary', 'payment_report', 'performance'
  generated_by: ObjectId, // Reference to Users collection
  date_range_start: Date,
  date_range_end: Date,
  data: Object, // Flexible structure for report data
  created_at: Date
}
```

## Indexes

```javascript
// Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Farmers collection indexes
db.farmers.createIndex({ "user_id": 1 })
db.farmers.createIndex({ "status": 1 })

// Fields collection indexes
db.fields.createIndex({ "farmer_id": 1 })
db.fields.createIndex({ "health_status": 1 })
db.fields.createIndex({ "crop_stage": 1 })

// Harvests collection indexes
db.harvests.createIndex({ "farmer_id": 1 })
db.harvests.createIndex({ "field_id": 1 })
db.harvests.createIndex({ "harvest_date": 1 })

// Payments collection indexes
db.payments.createIndex({ "farmer_id": 1 })
db.payments.createIndex({ "status": 1 })
db.payments.createIndex({ "harvest_id": 1 }, { unique: true })

// Reports collection indexes
db.reports.createIndex({ "type": 1 })
db.reports.createIndex({ "generated_by": 1 })
```