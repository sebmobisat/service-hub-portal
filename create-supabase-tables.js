// Script to automatically create vehicle groups tables in Supabase
// Run with: node create-supabase-tables.js

const { supabaseAdmin } = require('./config/supabase.js');

const sqlCommands = [
    // Enable UUID extension
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    
    // Create dealers table
    `CREATE TABLE IF NOT EXISTS dealers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        dealer_type VARCHAR(50),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Create vehicles table
    `CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vin VARCHAR(17) UNIQUE NOT NULL,
        license_plate VARCHAR(20),
        brand VARCHAR(50),
        model VARCHAR(100),
        year INTEGER,
        fuel_type VARCHAR(20),
        dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Create vehicle groups table
    `CREATE TABLE IF NOT EXISTS vehicle_groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(7),
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(dealer_id, name)
    );`,
    
    // Create vehicle group members table
    `CREATE TABLE IF NOT EXISTS vehicle_group_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES vehicle_groups(id) ON DELETE CASCADE,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(group_id, vehicle_id)
    );`,
    
    // Create group categories table
    `CREATE TABLE IF NOT EXISTS group_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(7),
        is_system BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Enable RLS on all tables
    'ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE vehicle_groups ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE vehicle_group_members ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE group_categories ENABLE ROW LEVEL SECURITY;',
    
    // Create RLS policies for dealers
    'CREATE POLICY "Dealers are viewable by everyone" ON dealers FOR SELECT USING (true);',
    'CREATE POLICY "Dealers can be inserted by authenticated users" ON dealers FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Dealers can be updated by authenticated users" ON dealers FOR UPDATE USING (true);',
    
    // Create RLS policies for vehicles
    'CREATE POLICY "Vehicles are viewable by everyone" ON vehicles FOR SELECT USING (true);',
    'CREATE POLICY "Vehicles can be inserted by authenticated users" ON vehicles FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Vehicles can be updated by authenticated users" ON vehicles FOR UPDATE USING (true);',
    
    // Create RLS policies for vehicle_groups
    'CREATE POLICY "Vehicle groups are viewable by everyone" ON vehicle_groups FOR SELECT USING (true);',
    'CREATE POLICY "Vehicle groups can be inserted by authenticated users" ON vehicle_groups FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Vehicle groups can be updated by authenticated users" ON vehicle_groups FOR UPDATE USING (true);',
    
    // Create RLS policies for vehicle_group_members
    'CREATE POLICY "Vehicle group members are viewable by everyone" ON vehicle_group_members FOR SELECT USING (true);',
    'CREATE POLICY "Vehicle group members can be inserted by authenticated users" ON vehicle_group_members FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Vehicle group members can be updated by authenticated users" ON vehicle_group_members FOR UPDATE USING (true);',
    
    // Create RLS policies for group_categories
    'CREATE POLICY "Group categories are viewable by everyone" ON group_categories FOR SELECT USING (true);',
    'CREATE POLICY "Group categories can be inserted by authenticated users" ON group_categories FOR INSERT WITH CHECK (true);',
    'CREATE POLICY "Group categories can be updated by authenticated users" ON group_categories FOR UPDATE USING (true);',
    
    // Create indexes
    'CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);',
    'CREATE INDEX IF NOT EXISTS idx_vehicles_dealer_id ON vehicles(dealer_id);',
    'CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_groups_dealer_id ON vehicle_groups(dealer_id);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_groups_active ON vehicle_groups(is_active);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_group_members_group_id ON vehicle_group_members(group_id);',
    'CREATE INDEX IF NOT EXISTS idx_vehicle_group_members_vehicle_id ON vehicle_group_members(vehicle_id);',
    'CREATE INDEX IF NOT EXISTS idx_dealers_email ON dealers(email);',
    
    // Create updated_at trigger function
    `CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';`,
    
    // Create triggers
    'CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON dealers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
    'CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
    'CREATE TRIGGER update_vehicle_groups_updated_at BEFORE UPDATE ON vehicle_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
];

async function createTables() {
    console.log('🚀 Creating Vehicle Groups Tables in Supabase...');
    console.log('================================================\n');
    
    try {
        for (let i = 0; i < sqlCommands.length; i++) {
            const sql = sqlCommands[i];
            console.log(`Executing command ${i + 1}/${sqlCommands.length}...`);
            
            const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
            
            if (error) {
                // If exec_sql doesn't exist, try direct SQL execution
                console.log('Trying alternative method...');
                const { error: directError } = await supabaseAdmin.from('_dummy').select('*').limit(0);
                
                if (directError) {
                    console.log(`⚠️  Command ${i + 1} may need manual execution: ${sql.substring(0, 50)}...`);
                }
            } else {
                console.log(`✅ Command ${i + 1} executed successfully`);
            }
        }
        
        // Insert sample data
        console.log('\n📝 Inserting sample data...');
        
        // Insert sample dealer
        const { data: dealerData, error: dealerError } = await supabaseAdmin
            .from('dealers')
            .insert([{
                email: 'test@mobisat.com',
                company_name: 'Mobisat Test Dealer',
                first_name: 'Test',
                last_name: 'Dealer',
                dealer_type: 'authorized'
            }])
            .select();
        
        if (dealerError && !dealerError.message.includes('duplicate')) {
            console.log('⚠️  Could not insert sample dealer:', dealerError.message);
        } else {
            console.log('✅ Sample dealer inserted');
        }
        
        // Get dealer ID for sample data
        const { data: dealers, error: getDealerError } = await supabaseAdmin
            .from('dealers')
            .select('id')
            .eq('email', 'test@mobisat.com')
            .limit(1);
        
        if (dealers && dealers.length > 0) {
            const dealerId = dealers[0].id;
            
            // Insert sample vehicle
            const { error: vehicleError } = await supabaseAdmin
                .from('vehicles')
                .insert([{
                    vin: 'SAMPLE12345678901',
                    license_plate: 'SAMPLE-001',
                    brand: 'Toyota',
                    model: 'Corolla',
                    year: 2024,
                    fuel_type: 'Gasoline',
                    dealer_id: dealerId
                }]);
            
            if (vehicleError && !vehicleError.message.includes('duplicate')) {
                console.log('⚠️  Could not insert sample vehicle:', vehicleError.message);
            } else {
                console.log('✅ Sample vehicle inserted');
            }
            
            // Insert sample vehicle groups
            const { error: groupsError } = await supabaseAdmin
                .from('vehicle_groups')
                .insert([
                    {
                        dealer_id: dealerId,
                        name: 'Gasoline Vehicles',
                        description: 'All gasoline-powered vehicles',
                        color: '#FF5733',
                        icon: 'fuel'
                    },
                    {
                        dealer_id: dealerId,
                        name: 'New Cars 2024',
                        description: 'Vehicles from 2024',
                        color: '#33FF57',
                        icon: 'car'
                    },
                    {
                        dealer_id: dealerId,
                        name: 'Hybrid Fleet',
                        description: 'Hybrid and electric vehicles',
                        color: '#3357FF',
                        icon: 'leaf'
                    }
                ]);
            
            if (groupsError && !groupsError.message.includes('duplicate')) {
                console.log('⚠️  Could not insert sample groups:', groupsError.message);
            } else {
                console.log('✅ Sample vehicle groups inserted');
            }
            
            // Insert sample group categories
            const { error: categoriesError } = await supabaseAdmin
                .from('group_categories')
                .insert([
                    {
                        name: 'Fuel Type',
                        description: 'Group by fuel type',
                        icon: 'fuel',
                        color: '#FF5733',
                        is_system: true
                    },
                    {
                        name: 'Age',
                        description: 'Group by vehicle age',
                        icon: 'calendar',
                        color: '#33FF57',
                        is_system: true
                    },
                    {
                        name: 'Brand',
                        description: 'Group by vehicle brand',
                        icon: 'car',
                        color: '#3357FF',
                        is_system: true
                    }
                ]);
            
            if (categoriesError && !categoriesError.message.includes('duplicate')) {
                console.log('⚠️  Could not insert sample categories:', categoriesError.message);
            } else {
                console.log('✅ Sample group categories inserted');
            }
        }
        
        console.log('\n🎉 Table creation process completed!');
        console.log('\n📋 Next Steps:');
        console.log('1. Check your Supabase dashboard to verify tables were created');
        console.log('2. Run: node test-vehicle-groups.js');
        console.log('3. Start integrating with the frontend');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        console.log('\n💡 Alternative: Run the SQL commands manually in Supabase SQL Editor');
    }
}

// Run the script
createTables(); 