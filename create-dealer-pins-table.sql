-- Create dealer_pins table for secure PIN storage
-- This table stores temporary PINs with expiration and attempt tracking

CREATE TABLE IF NOT EXISTS dealer_pins (
    id SERIAL PRIMARY KEY,
    dealer_id INTEGER NOT NULL UNIQUE,
    pin VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_dealer_pins_dealer_id ON dealer_pins(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_pins_expires_at ON dealer_pins(expires_at);

-- Add foreign key constraint if dealer table exists
-- ALTER TABLE dealer_pins ADD CONSTRAINT fk_dealer_pins_dealer_id 
--     FOREIGN KEY (dealer_id) REFERENCES dealer(id) ON DELETE CASCADE;

-- Create a function to clean up expired PINs
CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS void AS $$
BEGIN
    DELETE FROM dealer_pins WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired PINs (optional)
-- This would need to be set up with pg_cron extension
-- SELECT cron.schedule('cleanup-expired-pins', '*/15 * * * *', 'SELECT cleanup_expired_pins();');

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON dealer_pins TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE dealer_pins_id_seq TO your_app_user; 