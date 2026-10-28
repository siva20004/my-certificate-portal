export type CertificateCategory =
  | 'All Certificates'
  | 'Cloud Computing'
  | 'Artificial Intelligence'
  | 'Automation'
  | 'Japanese Language'
  | 'English Language'
  | 'IT Service Management'
  | 'Agile and Scrum'
  | 'Internship and Training';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description: string;
  category: CertificateCategory;
  issue_date: string;
  expiry_date?: string | null;
  credential_id?: string | null;
  verification_url?: string | null;
  file_path: string;
  file_name: string;
  file_type: 'pdf' | 'image';
  thumbnail_path?: string | null;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  location: string;
  introduction: string;
  bio_extended?: string;
  photo_url: string;
  resume_url?: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  phone?: string;
  updated_at?: string;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}
