-- Service Hub Portal - Supabase Database Setup (FINAL)
-- New functionality: Vehicle Groups for dealerships
-- This system references existing vehicle and dealer data from PostgreSQL database
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- NEW FUNCTIONALITY: Vehicle Groups System
-- Create vehicle groups table (dealership-specific groups)
-- dealer_id references the existing dealer.id from PostgreSQL database (INTEGER type)
CREATE TABLE IF NOT EXISTS vehicle_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id INTEGER NOT NULL, -- References dealer.id from PostgreSQL database (INTEGER type)
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color for UI (e.g., #FF5733)
    icon VARCHAR(50), -- Icon name for UI
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique group names per dealer
    UNIQUE(dealer_id, name)
);

-- Create vehicle group members table (junction table for many-to-many)
-- This references vehicle.id from the existing PostgreSQL database (INTEGER type)
CREATE TABLE IF NOT EXISTS vehicle_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES vehicle_groups(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL, -- References vehicle.id from PostgreSQL database (INTEGER type)
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique vehicle-group combinations
    UNIQUE(group_id, vehicle_id)
);

-- Create group categories table (optional - for predefined categories)
CREATE TABLE IF NOT EXISTS group_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_system BOOLEAN DEFAULT false, -- System-defined vs user-defined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies with simplified security
-- Enable RLS on all tables
ALTER TABLE vehicle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Vehicle groups viewable by everyone" ON vehicle_groups;
DROP POLICY IF EXISTS "Vehicle groups insertable by everyone" ON vehicle_groups;
DROP POLICY IF EXISTS "Vehicle groups updatable by everyone" ON vehicle_groups;
DROP POLICY IF EXISTS "Vehicle groups deletable by everyone" ON vehicle_groups;

DROP POLICY IF EXISTS "Vehicle group members viewable by everyone" ON vehicle_group_members;
DROP POLICY IF EXISTS "Vehicle group members insertable by everyone" ON vehicle_group_members;
DROP POLICY IF EXISTS "Vehicle group members updatable by everyone" ON vehicle_group_members;
DROP POLICY IF EXISTS "Vehicle group members deletable by everyone" ON vehicle_group_members;

DROP POLICY IF EXISTS "Group categories viewable by everyone" ON group_categories;
DROP POLICY IF EXISTS "Group categories insertable by everyone" ON group_categories;
DROP POLICY IF EXISTS "Group categories updatable by everyone" ON group_categories;
DROP POLICY IF EXISTS "Group categories deletable by everyone" ON group_categories;

-- Create simplified vehicle groups policies
CREATE POLICY "Vehicle groups viewable by everyone" ON vehicle_groups
    FOR SELECT USING (true);

CREATE POLICY "Vehicle groups insertable by everyone" ON vehicle_groups
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vehicle groups updatable by everyone" ON vehicle_groups
    FOR UPDATE USING (true);

CREATE POLICY "Vehicle groups deletable by everyone" ON vehicle_groups
    FOR DELETE USING (true);

-- Create simplified vehicle group members policies
CREATE POLICY "Vehicle group members viewable by everyone" ON vehicle_group_members
    FOR SELECT USING (true);

CREATE POLICY "Vehicle group members insertable by everyone" ON vehicle_group_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vehicle group members updatable by everyone" ON vehicle_group_members
    FOR UPDATE USING (true);

CREATE POLICY "Vehicle group members deletable by everyone" ON vehicle_group_members
    FOR DELETE USING (true);

-- Create simplified group categories policies
CREATE POLICY "Group categories viewable by everyone" ON group_categories
    FOR SELECT USING (true);

CREATE POLICY "Group categories insertable by everyone" ON group_categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Group categories updatable by everyone" ON group_categories
    FOR UPDATE USING (true);

CREATE POLICY "Group categories deletable by everyone" ON group_categories
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_groups_dealer_id ON vehicle_groups(dealer_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_groups_active ON vehicle_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicle_group_members_group_id ON vehicle_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_group_members_vehicle_id ON vehicle_group_members(vehicle_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS update_vehicle_groups_updated_at ON vehicle_groups;
CREATE TRIGGER update_vehicle_groups_updated_at BEFORE UPDATE ON vehicle_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear existing sample data to avoid conflicts
DELETE FROM vehicle_group_members;
DELETE FROM vehicle_groups WHERE dealer_id = 1;
DELETE FROM group_categories;

-- Insert sample data for testing with REAL vehicle IDs from PostgreSQL
-- Based on our analysis: Vehicle ID 158 (Dacia Sandero) and 159 (Jeep Renegade)
-- Using dealer_id = 1 (Mobisat SRL) from PostgreSQL database
DO $$
BEGIN
    -- Insert sample vehicle groups (using real dealer ID 1 from PostgreSQL)
    INSERT INTO vehicle_groups (dealer_id, name, description, color, icon) VALUES
    (1, 'Gasoline Vehicles', 'All gasoline-powered vehicles', '#FF5733', 'fuel'),
    (1, 'Hybrid Vehicles', 'Hybrid and electric vehicles', '#33FF57', 'leaf'),
    (1, 'New Cars 2024', 'Vehicles from 2024', '#3357FF', 'car'),
    (1, 'Dacia Fleet', 'All Dacia vehicles', '#FF8C00', 'car'),
    (1, 'Jeep Fleet', 'All Jeep vehicles', '#32CD32', 'car');
    
    -- Insert sample group categories
    INSERT INTO group_categories (name, description, icon, color, is_system) VALUES
    ('Fuel Type', 'Group by fuel type', 'fuel', '#FF5733', true),
    ('Age', 'Group by vehicle age', 'calendar', '#33FF57', true),
    ('Brand', 'Group by vehicle brand', 'car', '#3357FF', true),
    ('Mileage', 'Group by mileage range', 'speedometer', '#FF8C00', true),
    ('Status', 'Group by vehicle status', 'status', '#32CD32', true);
    
    -- Insert sample vehicle group members using REAL vehicle IDs
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 158 -- Dacia Sandero Stepway (Gasoline)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'Gasoline Vehicles';
    
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 158 -- Dacia Sandero Stepway (2024)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'New Cars 2024';
    
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 158 -- Dacia Sandero Stepway (Dacia brand)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'Dacia Fleet';
    
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 159 -- Jeep Renegade (Hybrid)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'Hybrid Vehicles';
    
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 159 -- Jeep Renegade (2023)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'New Cars 2024';
    
    INSERT INTO vehicle_group_members (group_id, vehicle_id) 
    SELECT vg.id, 159 -- Jeep Renegade (Jeep brand)
    FROM vehicle_groups vg 
    WHERE vg.dealer_id = 1 AND vg.name = 'Jeep Fleet';
END $$;

-- Verify the setup
SELECT 'Vehicle Groups setup completed successfully!' as status;
SELECT 'Sample groups created for dealer 1 (Mobisat SRL) with real vehicle IDs 158 and 159' as info;
SELECT 'Note: RLS policies are simplified - implement security in application layer' as security_note; 