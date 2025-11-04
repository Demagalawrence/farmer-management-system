-- Farmer Management Information System (FMIS) - Database Schema
-- File: database/schema.sql

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'field_officer', 'finance', 'manager')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Farmers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE Fields (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES Farmers(id),
    location TEXT NOT NULL,
    size_hectares DECIMAL(5,2) NOT NULL,
    crop_stage VARCHAR(20) DEFAULT 'planting' CHECK (crop_stage IN ('planting', 'growing', 'mature', 'harvest_ready')),
    last_inspection_date DATE,
    health_status VARCHAR(20) DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'needs_attention', 'critical')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Harvests (
    id SERIAL PRIMARY KEY,
    field_id INTEGER NOT NULL REFERENCES Fields(id),
    farmer_id INTEGER NOT NULL REFERENCES Farmers(id),
    harvest_date DATE DEFAULT CURRENT_DATE,
    quantity_tons DECIMAL(6,2) NOT NULL,
    quality_grade CHAR(1) CHECK (quality_grade IN ('A', 'B', 'C'))
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES Farmers(id),
    harvest_id INTEGER UNIQUE REFERENCES Harvests(id), -- One payment per harvest
    amount DECIMAL(10,2) NOT NULL,
    rate_per_ton DECIMAL(6,2) NOT NULL,
    status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    processed_by INTEGER REFERENCES Users(id), -- Finance user
    payment_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('harvest_summary', 'payment_report', 'performance')),
    generated_by INTEGER NOT NULL REFERENCES Users(id),
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    data JSONB NOT NULL, -- Structured report data
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fields_farmer_id ON Fields(farmer_id);
CREATE INDEX idx_harvests_farmer_id ON Harvests(farmer_id);
CREATE INDEX idx_harvests_date ON Harvests(harvest_date);
CREATE INDEX idx_payments_status ON Payments(status);
CREATE INDEX idx_users_role ON Users(role);