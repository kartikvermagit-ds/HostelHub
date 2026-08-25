-- ==========================================================
-- Migration 003: Dynamic 3D Hostel, Floors & Rooms Schema
-- ==========================================================

-- 1. HOSTELS TABLE
CREATE TABLE IF NOT EXISTS hostels (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(150),
    tagline VARCHAR(255),
    description TEXT,
    hostel_type VARCHAR(30) DEFAULT 'boys', -- 'boys', 'girls', 'co-ed'
    accent_color VARCHAR(30) DEFAULT '#00685f',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FLOORS TABLE
CREATE TABLE IF NOT EXISTS floors (
    id VARCHAR(64) PRIMARY KEY,
    hostel_id VARCHAR(64) NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_floors_hostel ON floors(hostel_id);

-- 3. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(64) PRIMARY KEY,
    hostel_id VARCHAR(64) NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    floor_id VARCHAR(64) NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    room_number VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'available', -- 'available', 'occupied', 'maintenance', 'reserved'
    room_type VARCHAR(30) DEFAULT 'Single', -- 'Single', 'Double', 'Triple'
    capacity INTEGER DEFAULT 1,
    branch VARCHAR(100),
    year VARCHAR(50),
    description TEXT,
    shared_notes_count INTEGER DEFAULT 0,
    active_study_group VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_hostel ON rooms(hostel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- 4. ROOM OCCUPANTS (STUDENT MAPPING)
CREATE TABLE IF NOT EXISTS room_occupants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(64) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50),
    branch VARCHAR(100),
    avatar_url TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_occupants_room ON room_occupants(room_id);

-- 5. ROOM FACILITIES
CREATE TABLE IF NOT EXISTS room_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(64) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    facility_name VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_facilities_room ON room_facilities(room_id);

-- 6. ROOM RESOURCES (LINK TO HOSTELHUB RESOURCES)
CREATE TABLE IF NOT EXISTS room_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(64) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'PDF',
    size VARCHAR(50),
    file_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_room_resources ON room_resources(room_id);
