# Siva Palaparthi — Professional Certificate Portfolio

A full-stack, responsive, and secure **Certificate Portfolio Website** designed for software developer job applications, Japanese recruiter evaluations, and technical interviews.

Live demo & portfolio ready to deploy to **Vercel** with **Supabase PostgreSQL & Storage** backend.

---

## 🌟 Highlights & Features

- **8 Verified Credentials Included**:
  1. **Advanced Automation Anywhere** — *Certified Advanced Automation Professional* (ID: `AAADVC2024A360 - 185430406`)
  2. **Japanese NAT-TEST N5** — *5Q Qualification Certificate* (ID: `26070048250181`, Score: `109/180`)
  3. **Microsoft Azure AZ-900** — *Azure Fundamentals* (ID: `wnC2J-48EN`)
  4. **Azure AI Engineer Associate** — *Microsoft Certified AI Associate* (ID: `5B6E8FB1E131CE88`, Cert: `FB4C7F-1D9515`)
  5. **Cambridge Linguaskill** — *English Test Report (CEFR B1, Reading 180+ C1)* (Candidate: `2300032952`)
  6. **ServiceNow** — *Certified Implementation Specialist – Data Foundations (CMDB and CSDM)*
  7. **SCRUMstudy** — *Scrum Fundamentals Certified (SFC™)* (ID: `1151133`)
  8. **EduSkills / AICTE / Google for Developers** — *AI-ML Virtual Internship* (Grade A, ID: `bf8ced1bab9c497b186677a70c50e2af`)
- **Interactive In-Browser Viewer**: Preview PDF files and high-resolution certificates directly in modal viewers with zero third-party tracking.
- **Original File Downloads**: Direct download of authentic certificate PDFs and images with clean descriptive filenames.
- **Search & Category Filters**: Instant live filtering across Cloud Computing, AI, Automation, Japanese Language, English Language, ITSM, Agile, and Internships.
- **Protected Administrator Control Center**:
  - Secure passcode/auth protection (`siva2026`).
  - Add new certificates whenever you earn new credentials.
  - Upload PDF / PNG / JPG / JPEG files (up to 15MB).
  - Edit metadata (titles, issuers, dates, IDs, verification links, categories).
  - Delete certificates with safety confirmation.
  - Upload and update profile photo & resume PDF without editing source code.
  - Live Supabase connection tester and 1-click cloud sync.
- **Resilient Dual-Mode Architecture**: Works 100% out-of-the-box in local persistent mode, and connects seamlessly to Supabase PostgreSQL and Storage when credentials are provided.
- **Recruiter & SEO Ready**: OpenGraph metadata, Twitter Cards, fast load times, shareable link copier, responsive across mobile, tablet, and desktop.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to view the live portfolio.

### 4. Admin Access
Click the **Admin Access** button in the header or footer, and enter the administrator passcode:
```text
siva2026
```

---

## 🗄️ Supabase Backend Setup

To connect your own cloud PostgreSQL database and file storage on Supabase:

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose an organization, project name (e.g. `siva-certificate-portfolio`), and database password.
3. Select your preferred region (e.g., `South Asia (Mumbai)`).

### Step 2: Run the SQL Migration
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy and paste the entire contents of [`supabase_schema.sql`](./supabase_schema.sql).
4. Click **Run**. This will:
   - Create the `profile` table with Row-Level Security (RLS).
   - Create the `certificates` table with RLS.
   - Configure public read policies and admin write policies.
   - Create public Storage buckets (`certificates` and `profile-assets`).
   - Seed all 8 verified credentials and profile information.

### Step 3: Connect Frontend to Supabase
You can connect in either of two ways:

#### Option A: Through the Web UI (No build needed)
1. In your portfolio website, open the **Admin Control Center** (`siva2026`).
2. Go to the **Supabase & Storage** tab.
3. Paste your **Project URL** and **Anon Key** (found in Supabase *Project Settings* -> *API*).
4. Click **Save & Test Connection**.
5. Click **Sync Local Data to Supabase**.

#### Option B: Using `.env` file
1. Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Re-run `npm run dev` or rebuild.

---

## 🌐 Deployment to Vercel

### Deploy via Vercel Dashboard (Recommended)
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial certificate portfolio commit"
   git branch -M main
   git remote add origin https://github.com/siva20004/certificate-portal.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import your `certificate-portal` repository.
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
6. Click **Deploy**. Your portfolio will be live in seconds!

### Custom Domain Setup
1. In Vercel, navigate to your project -> **Settings** -> **Domains**.
2. Enter your custom domain (e.g. `sivapalaparthi.dev` or `certificates.sivapalaparthi.com`).
3. Add the displayed DNS records (CNAME or A record) at your domain registrar.
4. Vercel automatically issues an SSL certificate within a few minutes.

---

## 🔒 Security & Row Level Security (RLS)

- **Read Access**: Public visitors have unrestricted access to read verified certificate metadata and view public certificate files.
- **Write / Admin Operations**: Only authenticated admins can insert, update, or delete profile and certificate records.
- **Zero Exposed Secrets**: No database service-role secrets or administrative private keys are included in client code.

---

## 📄 License & Ownership
Created for **Siva Palaparthi**. All certificates and credentials presented are the property of the named candidate.
