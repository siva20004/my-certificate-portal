-- ====================================================================
-- SIVA PALAPARTHI CERTIFICATE PORTFOLIO — SUPABASE PRODUCTION SCHEMA
-- ====================================================================
-- This script configures:
-- 1. `profile` table with public read, admin-only write RLS
-- 2. `certificates` table with public read, admin-only write RLS
-- 3. Storage buckets (`certificates` and `profile-assets`) with secure RLS policies
-- 4. Initial seed data matching Siva Palaparthi's verified credentials
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'siva-palaparthi-profile',
    full_name TEXT NOT NULL DEFAULT 'Siva Palaparthi',
    role TEXT NOT NULL DEFAULT 'Computer Science Student | Aspiring Software Developer',
    location TEXT NOT NULL DEFAULT 'Andhra Pradesh, India',
    introduction TEXT NOT NULL,
    bio_extended TEXT,
    photo_url TEXT,
    resume_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    verification_url TEXT,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image')),
    thumbnail_path TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 5. Profile RLS Policies:
-- Public visitors have READ-ONLY access
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profile FOR SELECT 
USING (true);

-- Authenticated admins can update profile
CREATE POLICY "Admins can update profile" 
ON public.profile FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admins can insert profile" 
ON public.profile FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 6. Certificates RLS Policies:
-- Public visitors can view all certificates
CREATE POLICY "Certificates are viewable by everyone" 
ON public.certificates FOR SELECT 
USING (true);

-- Only authenticated admins can insert, update, or delete
CREATE POLICY "Admins can insert certificates" 
ON public.certificates FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update certificates" 
ON public.certificates FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admins can delete certificates" 
ON public.certificates FOR DELETE 
TO authenticated 
USING (true);

-- 7. Storage Setup (Buckets)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('certificates', 'certificates', true),
  ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'certificates' bucket:
CREATE POLICY "Public visitors can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated admins can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "Authenticated admins can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated admins can delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- Storage Policies for 'profile-assets' bucket:
CREATE POLICY "Public visitors can view profile assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-assets');

CREATE POLICY "Authenticated admins can upload profile assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-assets');

CREATE POLICY "Authenticated admins can update profile assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-assets');

-- 8. Seed Initial Profile Data
INSERT INTO public.profile (
  id,
  full_name,
  role,
  location,
  introduction,
  bio_extended,
  photo_url,
  resume_url,
  email,
  linkedin_url,
  github_url,
  phone
) VALUES (
  'siva-palaparthi-profile',
  'Siva Palaparthi',
  'Computer Science Student | Aspiring Software Developer',
  'Andhra Pradesh, India',
  'I am a Computer Science student interested in software development, cloud computing, automation, AI, and continuous learning. This portfolio showcases my certifications, technical skills, and professional development.',
  'Pursuing B.Tech in Computer Science Engineering (Specialization in Data Engineering for AI) at KL University (CGPA 8.59/10). Passionate about building robust scalable software systems, cloud infrastructure on Azure, cognitive AI workflows, intelligent robotic process automation, and preparing for global IT engineering opportunities including Japanese technology firms.',
  '/profile/siva-palaparthi-photo.png',
  '/profile/siva-palaparthi-resume.pdf',
  'palaparthisiva907@gmail.com',
  'https://www.linkedin.com/in/siva-palaparthi-5927b8302',
  'https://github.com/siva20004',
  '+91 7386500752'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  location = EXCLUDED.location,
  introduction = EXCLUDED.introduction;

-- 9. Seed 8 Real Certificates
INSERT INTO public.certificates (
  id, title, issuer, category, issue_date, credential_id, verification_url, 
  file_path, file_name, file_type, thumbnail_path, featured, display_order, description
) VALUES
(
  'cert-1',
  'Certified Advanced Automation Professional',
  'Automation Anywhere',
  'Automation',
  '2026-06-16',
  'AAADVC2024A360 - 185430406',
  'https://www.automationanywhere.com/',
  '/certificates/siva-palaparthi-advanced-automation-anywhere.pdf',
  'siva-palaparthi-advanced-automation-anywhere.pdf',
  'pdf',
  '/certificates/siva-palaparthi-advanced-automation-anywhere.jpg',
  true,
  1,
  'Advanced professional credential validating expertise in enterprise robotic process automation (RPA), end-to-end bot lifecycle design, workflow orchestration, and cognitive automation with Automation Anywhere.'
),
(
  'cert-2',
  'Japanese Language NAT-TEST 5Q (N5 Equivalent) Certificate',
  'Japanese Language NAT-TEST Steering Committee (Senmon Kyouiku Publishing)',
  'Japanese Language',
  '2026-07-24',
  '26070048250181',
  'https://www.nat-test.com/',
  '/certificates/siva-palaparthi-japanese-nat-test-n5.pdf',
  'siva-palaparthi-japanese-nat-test-n5.pdf',
  'pdf',
  '/certificates/siva-palaparthi-japanese-nat-test-n5.jpg',
  true,
  2,
  'Official Japanese language certification at CEFR A1 / JLPT N5 equivalent level, demonstrating competence in Japanese vocabulary, kanji recognition, grammar structures, reading comprehension, and listening.'
),
(
  'cert-3',
  'Microsoft Certified: Azure Fundamentals (AZ-900)',
  'Microsoft',
  'Cloud Computing',
  '2025-09-19',
  'wnC2J-48EN',
  'https://www.credly.com/badges/513bb09e-bfa6-4094-bea7-32a396500cc4/public_url',
  '/certificates/siva-palaparthi-az-900-azure-fundamentals.pdf',
  'siva-palaparthi-az-900-azure-fundamentals.pdf',
  'pdf',
  '/certificates/siva-palaparthi-az-900-azure-fundamentals.jpg',
  true,
  3,
  'Core cloud architecture certification validating deep knowledge of Microsoft Azure cloud concepts, computing, storage, networking, security, compliance, governance, and SLA pricing models.'
),
(
  'cert-4',
  'Microsoft Certified: Azure AI Engineer Associate',
  'Microsoft Learn',
  'Artificial Intelligence',
  '2026-06-25',
  '5B6E8FB1E131CE88 (Cert: FB4C7F-1D9515)',
  'https://learn.microsoft.com/en-us/users/palaparthisiva-0890/credentials/certification/azure-ai-engineer',
  '/certificates/siva-palaparthi-azure-ai-engineer-associate.pdf',
  'siva-palaparthi-azure-ai-engineer-associate.pdf',
  'pdf',
  NULL,
  true,
  4,
  'Professional associate-level certification demonstrating practical expertise in building and deploying AI solutions using Azure Cognitive Services, Azure OpenAI models, Computer Vision, and Natural Language Processing pipelines.'
),
(
  'cert-5',
  'Linguaskill General English Report (CEFR B1)',
  'Cambridge English (Cambridge University Press & Assessment)',
  'English Language',
  '2024-05-20',
  'IA143C4-C-3F-318-120-031 (Candidate: 2300032952)',
  'https://results.linguaskill.com',
  '/certificates/siva-palaparthi-cambridge-linguaskill.pdf',
  'siva-palaparthi-cambridge-linguaskill.pdf',
  'pdf',
  NULL,
  false,
  5,
  'Standardized international Cambridge English language assessment with an overall score of 154 (CEFR B1), highlighted by C1 Proficient performance in Reading Comprehension (180+) and effective professional communication.'
),
(
  'cert-6',
  'Certified Implementation Specialist – Data Foundations (CMDB and CSDM)',
  'ServiceNow',
  'IT Service Management',
  '2026-07-02',
  'CIS-DF (CMDB and CSDM)',
  'https://www.servicenow.com/',
  '/certificates/siva-palaparthi-servicenow-cis-df.pdf',
  'siva-palaparthi-servicenow-cis-df.pdf',
  'pdf',
  NULL,
  false,
  6,
  'Enterprise platform certification validating technical implementation standards for Configuration Management Database (CMDB) structure and Common Service Data Model (CSDM) architectural frameworks in ServiceNow.'
),
(
  'cert-7',
  'Scrum Fundamentals Certified (SFC™)',
  'SCRUMstudy (VMedu, Inc.)',
  'Agile and Scrum',
  '2026-03-14',
  '1151133',
  'https://c46e136a583f7e334124-ac22991740ab4ff17e21daf2ed577041.ssl.cf1.rackcdn.com/Certificate/ScrumFundamentalsCertified-PalaparthiSiva-1151133.pdf',
  '/certificates/siva-palaparthi-scrum-fundamentals-certified.pdf',
  'siva-palaparthi-scrum-fundamentals-certified.pdf',
  'pdf',
  '/certificates/siva-palaparthi-scrum-fundamentals-certified.jpg',
  false,
  7,
  'Professional credential certifying knowledge of Agile development lifecycle, Scrum framework ceremonies, backlog estimation, sprint dynamics, and team delivery practices.'
),
(
  'cert-8',
  'AI-ML Virtual Internship Certificate',
  'EduSkills / AICTE / Google for Developers / India Edu Program',
  'Internship and Training',
  '2025-09-30',
  'bf8ced1bab9c497b186677a70c50e2af (Student ID: STU6631c6d00b8d61714538192)',
  'https://internship.aicte-india.org/',
  '/certificates/siva-palaparthi-eduskills-google-ai-ml-internship.pdf',
  'siva-palaparthi-eduskills-google-ai-ml-internship.pdf',
  'pdf',
  NULL,
  true,
  8,
  'Completed intensive 10-week technical virtual internship in Artificial Intelligence and Machine Learning supported by Google for Developers and AICTE at KL University, achieving Grade A distinction.'
)
ON CONFLICT (id) DO NOTHING;
