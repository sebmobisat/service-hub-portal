-- Service Hub Portal - Supabase Cleanup Script
-- Remove unnecessary tables that duplicate PostgreSQL data
-- Run this in your Supabase SQL Editor to clean up

-- Check what tables exist first
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Remove unnecessary tables that duplicate PostgreSQL data
-- (Only run these if the tables exist and you want to remove them)

-- Remove dealers table if it exists (we reference dealer.id from PostgreSQL)
DROP TABLE IF EXISTS dealers CASCADE;

-- Remove vehicles table if it exists (we reference vehicle.id from PostgreSQL)  
DROP TABLE IF EXISTS vehicles CASCADE;

-- Remove certificates table if it exists (we reference certificate data from PostgreSQL)
DROP TABLE IF EXISTS certificates CASCADE;

-- Remove any other duplicate tables that might exist
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS positions CASCADE;

-- Verify the cleanup - should only show our vehicle groups tables
SELECT '=== TABLES AFTER CLEANUP ===' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables after cleanup:
-- 1. vehicle_groups (stores group definitions)
-- 2. vehicle_group_members (junction table for vehicle-group relationships)
-- 3. group_categories (system categories)

SELECT '=== CLEANUP COMPLETED ===' as status;
SELECT 'Only vehicle groups tables remain - no duplicate data!' as info; 