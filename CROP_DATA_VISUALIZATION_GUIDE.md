# 📊 Crop Data Visualization - Complete Guide

## 🔄 Data Flow: From Field Visits → Dashboard Graphs

```
Field Officer Visit
         ↓
Records in "Record Crop Data" Modal
         ↓
Saves to Database (monitoring_visits collection)
         ↓
Dashboard queries and aggregates data
         ↓
Graph displays real-time crop trends ✅
```

---

## 🗄️ Database Collections

### **1. Crop Cycles** (Main tracking)

```javascript
// Collection: crop_cycles
{
  _id: "cycle_maize_john_2025a",
  farmer_id: "john_id",
  farmer_name: "John Doe",
  
  // Crop info
  crop_type: "maize",
  variety: "Hybrid DK-777",
  
  // Dates
  planting_date: "2025-06-01",
  expected_harvest_date: "2025-10-01",
  actual_harvest_date: null,
  
  // Area
  field_id: "field_north_plot",
  total_area: 5.5,  // hectares
  
  // Status tracking
  status: "growing",  // planting → growing → harvesting → completed
  current_growth_stage: "vegetative",
  
  // Health (updated from latest visit)
  current_health_score: 85,
  current_health_status: "good",
  
  // Payment tracking
  advance_paid: true,
  advance_amount: 360000,
  final_paid: false,
  
  // Counts
  total_visits: 4,
  
  // Timestamps
  created_at: "2025-06-01T10:00:00Z",
  updated_at: "2025-07-27T14:30:00Z",
  created_by: "field_officer_id"
}
```

### **2. Monitoring Visits** (Time-series data for graphs)

```javascript
// Collection: monitoring_visits
{
  _id: "visit_001",
  
  // Links
  crop_cycle_id: "cycle_maize_john_2025a",
  farmer_id: "john_id",
  field_id: "field_north_plot",
  
  // Visit info
  visit_date: "2025-06-15",
  visit_number: 1,
  days_after_planting: 14,
  
  // HEALTH METRICS (for graph!)
  health_score: 75,  // 0-100 scale
  health_status: "good",  // excellent/good/fair/poor/critical
  
  // GROWTH METRICS (for graph!)
  growth_stage: "vegetative",
  plant_height_cm: 45,
  leaf_color: "dark_green",
  
  // ENVIRONMENTAL (for graph!)
  soil_moisture: "adequate",  // dry/low/adequate/good/high/waterlogged
  soil_moisture_score: 60,  // Converted to 0-100
  weather_condition: "sunny",
  temperature_c: 28,
  
  // PEST & DISEASE
  pest_present: false,
  pest_type: null,
  pest_severity: null,
  pest_details: "",
  disease_present: false,
  disease_type: null,
  
  // WEED STATUS
  weed_pressure: "low",  // low/medium/high
  weeding_done: false,
  
  // INPUTS APPLIED
  fertilizer_applied: false,
  pesticide_applied: false,
  irrigation_done: false,
  
  // OBSERVATIONS
  notes: "Crop looking healthy, good germination rate",
  recommendations: "Apply top dressing fertilizer in 2 weeks",
  photos: ["url1.jpg", "url2.jpg"],
  
  // METADATA
  recorded_by: "field_officer_id",
  recorded_by_name: "James Omondi",
  created_at: "2025-06-15T09:30:00Z"
}
```

---

## 📈 How Data Populates the Graph

### **Step 1: Field Officer Records Multiple Visits**

```javascript
// Visit 1 - June 15
{
  visit_date: "2025-06-15",
  health_score: 75,
  plant_height_cm: 45,
  soil_moisture_score: 60,
  pest_present: false
}

// Visit 2 - June 29
{
  visit_date: "2025-06-29",
  health_score: 85,  // Improved!
  plant_height_cm: 62,
  soil_moisture_score: 65,
  pest_present: false
}

// Visit 3 - July 13
{
  visit_date: "2025-07-13",
  health_score: 65,  // Dropped (aphids)
  plant_height_cm: 78,
  soil_moisture_score: 55,
  pest_present: true
}

// Visit 4 - July 27
{
  visit_date: "2025-07-27",
  health_score: 80,  // Recovering
  plant_height_cm: 95,
  soil_moisture_score: 70,
  pest_present: false
}
```

### **Step 2: Dashboard Queries Data**

```javascript
// API call
GET /api/monitoring-visits?crop_cycle_id=cycle_001

// Returns array of all visits for that crop
const visits = [visit1, visit2, visit3, visit4];
```

### **Step 3: Transform for Graph**

```javascript
const graphData = visits.map(visit => ({
  date: formatDate(visit.visit_date),  // "Jun 15"
  health: visit.health_score,          // 75
  height: visit.plant_height_cm,       // 45
  moisture: visit.soil_moisture_score, // 60
}));

// Result:
[
  { date: "Jun 15", health: 75, height: 45, moisture: 60 },
  { date: "Jun 29", health: 85, height: 62, moisture: 65 },
  { date: "Jul 13", health: 65, height: 78, moisture: 55 },
  { date: "Jul 27", health: 80, height: 95, moisture: 70 }
]
```

### **Step 4: Graph Displays**

```
     ┌────────────────────────────────────┐
  100│                                    │
     │                    ●               │ Health Score
   80│              ●          ●          │
     │        ●                           │
   60│  ●                                 │
     │                                    │
     └────────────────────────────────────┘
       Jun 15  Jun 29  Jul 13  Jul 27
```

---

## 🎯 Multiple Crops on Same Graph

### **If you have 3 active crops:**

```javascript
// Maize crop
const maizeVisits = [
  { date: "Jun 15", health: 75 },
  { date: "Jun 29", health: 85 },
  { date: "Jul 13", health: 65 },
];

// Rice crop  
const riceVisits = [
  { date: "Jun 20", health: 70 },
  { date: "Jul 04", health: 90 },
  { date: "Jul 18", health: 85 },
];

// Coffee crop
const coffeeVisits = [
  { date: "Jun 10", health: 80 },
  { date: "Jun 24", health: 75 },
  { date: "Jul 08", health: 82 },
];

// Merge all on same timeline
const graphData = [
  { date: "Jun 10", coffee: 80 },
  { date: "Jun 15", maize: 75 },
  { date: "Jun 20", rice: 70 },
  { date: "Jun 24", coffee: 75 },
  { date: "Jun 29", maize: 85 },
  { date: "Jul 04", rice: 90 },
  { date: "Jul 08", coffee: 82 },
  { date: "Jul 13", maize: 65 },
  { date: "Jul 18", rice: 85 },
];
```

**Graph shows 3 colored lines:**
- 🟢 Green line = Maize
- 🔵 Blue line = Rice
- 🟠 Orange line = Coffee

---

## 📊 Top Stats (Area by Health)

### **Calculation Logic:**

```javascript
// Get all active crop cycles
const activeCrops = [
  { crop: "maize", area: 5.5, latest_health_score: 85 },
  { crop: "rice", area: 3.2, latest_health_score: 90 },
  { crop: "coffee", area: 2.1, latest_health_score: 65 },
  { crop: "beans", area: 4.0, latest_health_score: 75 },
];

// Categorize by health score
const stats = {
  excellent: 0,  // 90-100
  good: 0,       // 75-89
  fair: 0,       // 60-74
  poor: 0,       // 40-59
  critical: 0    // 0-39
};

activeCrops.forEach(crop => {
  const score = crop.latest_health_score;
  const area = crop.area;
  
  if (score >= 90) stats.excellent += area;
  else if (score >= 75) stats.good += area;
  else if (score >= 60) stats.fair += area;
  else if (score >= 40) stats.poor += area;
  else stats.critical += area;
});

// Result:
// Excellent: 3.2 acres (rice)
// Good: 9.5 acres (maize + beans)
// Fair: 2.1 acres (coffee)
// Poor: 0 acres
// Critical: 0 acres
```

---

## 🎨 Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│  📊 Crop Growth Monitoring                           │
│                                                      │
│  [Crop Moisture ▼]  [Select Crop ▼]                │
│                                                      │
│  3.2 Acres    9.5 Acres    2.1 Acres    0 Acres     │
│  Excellent    Good         Fair        Poor          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │                                              │   │
│  │     Graph with multiple crop lines           │   │
│  │     (Maize, Rice, Coffee)                   │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Recent Activity:                                    │
│  • Maize (John): Health dropped to 65% (aphids)     │
│  • Rice (Mary): Excellent growth, 90% health        │
│  • Coffee (Peter): Needs fertilizer application     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Backend API Endpoints Needed

### **1. Get Active Crop Cycles**

```
GET /api/crop-cycles/active

Response:
[
  {
    _id: "cycle_001",
    farmer_name: "John Doe",
    crop_type: "maize",
    total_area: 5.5,
    current_health_score: 85,
    planting_date: "2025-06-01",
    status: "growing"
  },
  // ... more crops
]
```

### **2. Get Monitoring Visits for a Crop**

```
GET /api/monitoring-visits?crop_cycle_id=cycle_001

Response:
[
  {
    visit_date: "2025-06-15",
    health_score: 75,
    plant_height_cm: 45,
    soil_moisture_score: 60,
    // ... more data
  },
  // ... more visits
]
```

### **3. Get All Monitoring Visits (for multi-crop graph)**

```
GET /api/monitoring-visits?status=active&limit=100

Response:
[
  {
    crop_cycle_id: "cycle_001",
    crop_type: "maize",
    visit_date: "2025-06-15",
    health_score: 75,
    // ...
  },
  {
    crop_cycle_id: "cycle_002",
    crop_type: "rice",
    visit_date: "2025-06-20",
    health_score: 70,
    // ...
  },
  // ... all visits across all crops
]
```

### **4. Get Dashboard Summary Stats**

```
GET /api/crop-cycles/stats

Response:
{
  total_active_crops: 15,
  total_area: 45.3,
  total_visits_this_month: 67,
  area_by_health: {
    excellent: 12.5,
    good: 20.3,
    fair: 10.1,
    poor: 2.4,
    critical: 0
  },
  crops_by_type: {
    maize: 8,
    rice: 4,
    coffee: 3
  }
}
```

---

## 📱 How It Works in Practice

### **Scenario: Field Officer visits 3 farms today**

**9:00 AM - Visit John's Maize**
```
Opens "Record Crop Data"
├── Select: Monitoring
├── Health: Good (85%)
├── Height: 62 cm
├── Moisture: Adequate
└── Saves

→ Database adds new monitoring_visits record
→ Dashboard graph updates with new data point ✅
```

**11:00 AM - Visit Mary's Rice**
```
Opens "Record Crop Data"
├── Select: Monitoring
├── Health: Excellent (90%)
├── Height: 55 cm
├── Moisture: High
└── Saves

→ Another visit record created
→ Graph now shows both crops ✅
```

**2:00 PM - Visit Peter's Coffee**
```
Opens "Record Crop Data"
├── Select: Monitoring
├── Health: Fair (65%)
├── Pests: YES (leaf rust)
├── Action: Applied fungicide
└── Saves

→ Third visit recorded
→ Graph shows all 3 crops
→ Alert created for low health score ⚠️
```

**End of day:**
- Dashboard shows 3 new data points
- Graph lines extended
- Health stats updated
- Manager sees daily summary report

---

## 🎯 Key Insights from Graph

### **Trends You Can See:**

1. **Health Decline** → Investigate (pests? disease? weather?)
2. **Growth Stagnation** → Check soil, water, fertilizer
3. **Seasonal Patterns** → Plan future plantings
4. **Crop Comparison** → Which crops perform best?
5. **Farmer Performance** → Who maintains crops well?

### **Actionable Alerts:**

```
IF health_score drops > 15 points between visits:
  → Create alert for manager
  → Notify field officer
  → Schedule urgent follow-up visit

IF pest_present = true:
  → Create treatment recommendation
  → Track treatment effectiveness
  → Follow up in 1 week

IF days_since_last_visit > 14:
  → Remind field officer
  → Crop needs monitoring
```

---

## ✅ Implementation Checklist

### **Frontend:**
- ✅ CropGrowthMonitoring component created
- ✅ Real-time graph with Recharts
- ✅ Multi-crop support
- ✅ Metric switching (health/height/moisture)
- ✅ Area stats calculation
- 🔲 Connect to real API (currently uses mock data)

### **Backend (TODO):**
- 🔲 Create `monitoring_visits` collection
- 🔲 Create `crop_cycles` collection
- 🔲 Build API endpoints
- 🔲 Implement aggregation queries
- 🔲 Add real-time stats calculations

### **Integration:**
- 🔲 Update RecordCropDataModal to save monitoring visits
- 🔲 Link crop cycles to payments
- 🔲 Add photo upload for visits
- 🔲 Create alerts system

---

## 📝 Summary

Your graph will show **REAL crop performance data** collected from field officer visits:

✅ **Each monitoring visit** = New data point on graph
✅ **Multiple visits** = Trend line showing crop progress
✅ **Multiple crops** = Multiple colored lines
✅ **Health scores** = Calculate area stats at top
✅ **Time-series data** = Track changes over weeks/months

**The more visits recorded, the richer the data visualization becomes!** 📊🌾

**Ready to connect the backend and see it in action?** 🚀
