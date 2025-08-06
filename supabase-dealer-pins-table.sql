-- Create dealer_pins table in Supabase for secure PIN storage
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql

-- Create dealer_pins table for secure PIN storage
CREATE TABLE IF NOT EXISTS dealer_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id INTEGER NOT NULL UNIQUE,
    pin VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_dealer_pins_dealer_id ON dealer_pins(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_pins_expires_at ON dealer_pins(expires_at);

-- Create a function to clean up expired PINs
CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS void AS $$
BEGIN
    DELETE FROM dealer_pins WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for dealer_pins table
DROP TRIGGER IF EXISTS update_dealer_pins_updated_at ON dealer_pins;
CREATE TRIGGER update_dealer_pins_updated_at 
BEFORE UPDATE ON dealer_pins 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE dealer_pins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dealer_pins
CREATE POLICY "Dealer pins are viewable by authenticated users" ON dealer_pins FOR SELECT USING (true);
CREATE POLICY "Dealer pins can be inserted by authenticated users" ON dealer_pins FOR INSERT WITH CHECK (true);
CREATE POLICY "Dealer pins can be updated by authenticated users" ON dealer_pins FOR UPDATE USING (true);
CREATE POLICY "Dealer pins can be deleted by authenticated users" ON dealer_pins FOR DELETE USING (true);

-- Grant permissions to authenticated users
GRANT ALL ON dealer_pins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 