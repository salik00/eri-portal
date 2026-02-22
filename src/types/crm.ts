export type LeadStatus = 'new' | 'contacted' | 'consultation' | 'hot' | 'docs' | 'converted' | 'lost';

export interface Profile {
    id: string;
    full_name: string;
    role: 'superadmin' | 'manager' | 'counselor' | 'student';
    department?: string;
    created_at: string;
}

export interface Lead {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    status: LeadStatus;
    source?: string;
    country?: string;
    budget?: string;
    message?: string;
    assigned_to?: string; // UUID of Profile
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: string;
    lead_id?: string;
    student_id_format: string;
    full_name: string;
    passport_number?: string;
    dob?: string;
    assigned_counselor?: string; // UUID of Profile
    preferred_country?: string;
    profile_id?: string; // Links to Auth Profile
    created_at: string;
}

export interface University {
    id: string;
    name: string;
    country: string;
    ranking?: number;
    tuition_min?: number;
    tuition_max?: number;
    popular_courses?: string[];
    scholarship_available: boolean;
    created_at: string;
}

export interface Visa {
    id: string;
    student_id: string;
    visa_type: string;
    submission_date?: string;
    decision_date?: string;
    status: 'pending' | 'granted' | 'refused' | 'deferred';
    lodgment_center?: string;
    tracking_number?: string;
    created_at: string;
}

export interface FinanceRecord {
    id: string;
    student_id: string;
    transaction_type: 'service_fee' | 'tuition_deposit' | 'expense';
    amount: number;
    currency: string;
    status: string;
    description?: string;
    transaction_date: string;
    created_at: string;
}

export interface CRMDocument {
    id: string;
    student_id: string;
    name: string;
    type: string;
    url: string;
    size?: string;
    status: 'pending' | 'verified' | 'rejected';
    uploaded_at: string;
}
