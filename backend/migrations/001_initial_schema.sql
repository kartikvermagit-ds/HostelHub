-- ====================================================================
-- HostelHub Database Schema & Row-Level Security (RLS) Migration
-- Version: 1.0.0
-- Database: PostgreSQL (Supabase)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'MODERATOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type_enum AS ENUM (
        'NOTES',
        'PYQ',
        'IMPORTANT_QUESTIONS',
        'VIDEO',
        'IMAGE',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE announcement_priority_enum AS ENUM (
        'NORMAL',
        'IMPORTANT',
        'URGENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 4. Tables Definition
-- ====================================================================

-- 4.1 Profiles Table (Linked with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    branch TEXT,
    year INT CHECK (year BETWEEN 1 AND 5),
    hostel TEXT,
    room_number TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for profiles.updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.2 Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.3 Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    unit INT CHECK (unit >= 1 AND unit <= 10),
    resource_type resource_type_enum NOT NULL DEFAULT 'NOTES',
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL,
    thumbnail_url TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    download_count INT NOT NULL DEFAULT 0,
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for resources.updated_at
DROP TRIGGER IF EXISTS tr_resources_updated_at ON public.resources;
CREATE TRIGGER tr_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.4 Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.5 Resource Tags Junction Table
CREATE TABLE IF NOT EXISTS public.resource_tags (
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, tag_id)
);

-- 4.6 Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_resource_bookmark UNIQUE (user_id, resource_id)
);

-- 4.7 Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for comments.updated_at
DROP TRIGGER IF EXISTS tr_comments_updated_at ON public.comments;
CREATE TRIGGER tr_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.8 Class Tests (CTs) Table
CREATE TABLE IF NOT EXISTS public.cts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    exam_date TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.9 CT Resources Junction Table
CREATE TABLE IF NOT EXISTS public.ct_resources (
    ct_id UUID NOT NULL REFERENCES public.cts(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    topic_name TEXT,
    PRIMARY KEY (ct_id, resource_id)
);

-- 4.10 Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    priority announcement_priority_enum NOT NULL DEFAULT 'NORMAL',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for announcements.updated_at
DROP TRIGGER IF EXISTS tr_announcements_updated_at ON public.announcements;
CREATE TRIGGER tr_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 5. Performance Indexes
-- ====================================================================

-- Resources Indexes
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON public.resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON public.resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_download_count ON public.resources(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_view_count ON public.resources(view_count DESC);

-- Full Text Search Index on Resources
CREATE INDEX IF NOT EXISTS idx_resources_fts ON public.resources 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Bookmarks Indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_resource_id ON public.bookmarks(resource_id);

-- Comments Indexes
CREATE INDEX IF NOT EXISTS idx_comments_resource_id ON public.comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- CTs Indexes
CREATE INDEX IF NOT EXISTS idx_cts_subject_id ON public.cts(subject_id);
CREATE INDEX IF NOT EXISTS idx_cts_exam_date ON public.cts(exam_date ASC);

-- Announcements Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

-- ====================================================================
-- 6. Row Level Security (RLS) Policies
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ct_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 6.1 Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- 6.2 Subjects Policies
CREATE POLICY "Subjects are viewable by everyone" 
    ON public.subjects FOR SELECT USING (true);

-- 6.3 Resources Policies
CREATE POLICY "Resources are viewable by everyone" 
    ON public.resources FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload resources" 
    ON public.resources FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = resources.uploaded_by 
            AND profiles.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own resources or Admin" 
    ON public.resources FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = resources.uploaded_by 
            AND (profiles.auth_user_id = auth.uid() OR profiles.role = 'ADMIN')
        )
    );

CREATE POLICY "Users can delete own resources or Admin" 
    ON public.resources FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = resources.uploaded_by 
            AND (profiles.auth_user_id = auth.uid() OR profiles.role IN ('ADMIN', 'MODERATOR'))
        )
    );

-- 6.4 Bookmarks Policies
CREATE POLICY "Users can view their own bookmarks" 
    ON public.bookmarks FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = bookmarks.user_id 
            AND profiles.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create bookmarks" 
    ON public.bookmarks FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = bookmarks.user_id 
            AND profiles.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own bookmarks" 
    ON public.bookmarks FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = bookmarks.user_id 
            AND profiles.auth_user_id = auth.uid()
        )
    );

-- 6.5 Comments Policies
CREATE POLICY "Comments are viewable by everyone" 
    ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post comments" 
    ON public.comments FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = comments.user_id 
            AND profiles.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own comments" 
    ON public.comments FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = comments.user_id 
            AND profiles.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own comments or Moderator/Admin" 
    ON public.comments FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = comments.user_id 
            AND (profiles.auth_user_id = auth.uid() OR profiles.role IN ('ADMIN', 'MODERATOR'))
        )
    );

-- 6.6 CTs & Announcements Policies
CREATE POLICY "CTs viewable by everyone" 
    ON public.cts FOR SELECT USING (true);

CREATE POLICY "CT resources viewable by everyone" 
    ON public.ct_resources FOR SELECT USING (true);

CREATE POLICY "Published announcements viewable by everyone" 
    ON public.announcements FOR SELECT USING (is_published = true);

-- ====================================================================
-- 7. Seed Initial Master Data
-- ====================================================================

-- 7.1 Seed Core Engineering Subjects
INSERT INTO public.subjects (name, code, description) VALUES
    ('Computer Organization & Architecture', 'COA', 'Hardware architecture, ALU, pipelining, cache memory and instruction sets.'),
    ('Data Structures & Algorithms', 'DSA', 'Linear and non-linear data structures, trees, graphs, sorting and searching algorithms.'),
    ('Database Management Systems', 'DBMS', 'Relational data models, SQL queries, normalization, ACID properties and transactions.'),
    ('Operating Systems', 'OS', 'Process scheduling, concurrency, deadlocks, memory management and file systems.'),
    ('Applied Mathematics IV', 'MATH4', 'Fourier transforms, Laplace transforms, partial differential equations and statistics.'),
    ('Applied Physics II', 'PHY2', 'Electrodynamics, quantum mechanics, lasers, fiber optics and wave mechanics.'),
    ('Computer Networks', 'CN', 'OSI layers, TCP/IP protocol suite, routing algorithms and network security.')
ON CONFLICT (code) DO NOTHING;

-- 7.2 Seed Default Search Tags
INSERT INTO public.tags (name) VALUES
    ('CT1'), ('CT2'), ('Unit1'), ('Unit2'), ('Unit3'), ('Unit4'),
    ('PYQ'), ('Midterm'), ('EndSem'), ('Important'), ('Cheatsheet'), ('Lab')
ON CONFLICT (name) DO NOTHING;
