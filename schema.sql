-- ERI CRM Master Schema v1.0
-- Please run this entire script in your Supabase SQL Editor.

-- 1. Profiles (Staff & Counselors)
-- Automatically links to Supabase Auth users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'counselor', -- 'superadmin', 'manager', 'counselor'
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'ERI User'), 
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Leads (Pipeline Kanban)
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'consultation', 'hot', 'docs', 'converted', 'lost'
    source TEXT,
    country TEXT,
    budget TEXT,
    message TEXT,
    assigned_to UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view leads" ON public.leads FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR 
        assigned_to = auth.uid()
    );
CREATE POLICY "Counselors can insert leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update leads" ON public.leads FOR UPDATE TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR 
        assigned_to = auth.uid()
    );


-- 3. Students (360 Profile - Converted Leads)
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id),
    student_id_format TEXT UNIQUE, -- e.g. ERI-2026-001
    full_name TEXT NOT NULL,
    passport_number TEXT,
    dob DATE,
    assigned_counselor UUID REFERENCES public.profiles(id),
    preferred_country TEXT,
    profile_id UUID REFERENCES public.profiles(id), -- Link to Auth Profile for Portal Access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view student profiles" ON public.students FOR SELECT TO authenticated 
    USING (
        profile_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR 
        assigned_counselor = auth.uid()
    );
CREATE POLICY "Staff can insert students" ON public.students FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager', 'counselor'))
);
CREATE POLICY "Staff can update students" ON public.students FOR UPDATE TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR 
        assigned_counselor = auth.uid()
    );


-- 4. Universities Global Database
CREATE TABLE public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    ranking INTEGER,
    tuition_min NUMERIC,
    tuition_max NUMERIC,
    popular_courses TEXT[],
    scholarship_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Universities
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Viewable by all authenticated" ON public.universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editable by admin" ON public.universities FOR ALL TO authenticated USING (true);


-- 5. Visa Tracking
CREATE TABLE public.visas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    visa_type TEXT NOT NULL DEFAULT 'student',
    submission_date DATE,
    decision_date DATE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'granted', 'refused', 'deferred'
    lodgment_center TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view visas" ON public.visas FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR
        EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND assigned_counselor = auth.uid())
    );
CREATE POLICY "Staff can manage visas" ON public.visas FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager', 'counselor')));


-- 6. Finance & Transactions
CREATE TABLE public.finance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    transaction_type TEXT NOT NULL, -- 'service_fee', 'tuition_deposit', 'expense'
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'NPR',
    status TEXT DEFAULT 'completed',
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.finance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view finance entries" ON public.finance FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')) OR
        EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND assigned_counselor = auth.uid())
    );
CREATE POLICY "Staff can manage finance" ON public.finance FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager', 'counselor')));

-- 7. Document Management (Student Uploads)
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'passport', 'transcript', 'ielts', etc.
    url TEXT NOT NULL, -- Path in Supabase Storage
    size TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own documents" ON public.documents 
    FOR SELECT USING (
        auth.uid() IN (
            SELECT profile_id FROM public.students WHERE id = student_id
        ) OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager', 'counselor'))
    );

CREATE POLICY "Students can upload documents" ON public.documents 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.students WHERE profile_id = auth.uid() AND id = student_id)
    );

-- 8. ERI Portal Settings & Configuration
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'global', -- Single row for global settings
    agency_name TEXT DEFAULT 'Enlightened Research Institute',
    contact_email TEXT DEFAULT 'info@enlightened.com.np',
    office_address TEXT DEFAULT 'Putalisadak-28, Kathmandu, Nepal',
    service_fee_npr NUMERIC DEFAULT 50000,
    express_fee_npr NUMERIC DEFAULT 15000,
    portal_enabled BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Settings Data
INSERT INTO public.settings (id, agency_name, contact_email, office_address)
VALUES ('global', 'Enlightened Research Institute', 'info@enlightened.com.np', 'Putalisadak-28, Kathmandu, Nepal')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.settings FOR UPDATE TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superadmin', 'manager')));

-- End of Schema v1.3
