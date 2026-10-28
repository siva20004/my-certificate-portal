import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Download,
  Languages,
  Bot,
  Cloud,
} from 'lucide-react';
import { Profile } from '../types';

interface HeroProps {
  profile: Profile;
  onCopyLink: () => void;
  certificateCount: number;
}

export const Hero: React.FC<HeroProps> = ({ profile, onCopyLink, certificateCount }) => {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-slate-50/80 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Photo & Identity Column (Prominent) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl opacity-20 blur-md group-hover:opacity-35 transition duration-500" />
              
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-2xl">
                {!imgError && profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
                    <div className="w-24 h-24 rounded-full bg-blue-800/40 border-2 border-blue-400 flex items-center justify-center text-3xl font-bold mb-3 shadow-inner">
                      {profile.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="text-base font-semibold">{profile.full_name}</span>
                    <span className="text-xs text-blue-300 mt-1">Profile Photo Placeholder</span>
                  </div>
                )}
                
                {/* Floating Verified Badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Verified Profile</span>
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Software Engineering Roles & Japanese IT Opportunities</span>
            </div>
          </div>

          {/* Bio & Actions Column */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start text-center sm:text-left">
            
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/60 text-blue-900 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Professional Credentials Showcase</span>
            </div>

            {/* Name & Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {profile.full_name}
            </h1>
            
            <p className="mt-2 text-lg sm:text-xl font-semibold text-blue-800">
              {profile.role}
            </p>

            {/* Location */}
            <div className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{profile.location}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span>B.Tech CSE, KL University (CGPA 8.59)</span>
            </div>

            {/* Introduction paragraph */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {profile.introduction}
            </p>

            {/* Credential highlights badges */}
            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Microsoft Azure & AI Certified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm">
                <Languages className="w-3.5 h-3.5 text-rose-600" />
                <span>Japanese NAT-TEST 5Q (N5)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm">
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>Advanced Automation Anywhere</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{certificateCount} Verified Qualifications</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
              {/* View Certificates button */}
              <a
                href="#certificates"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-lg shadow-blue-700/25 transition-all group"
              >
                <span>View My Certificates</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Download Resume button (Only displayed if resume_url exists) */}
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  download="siva-palaparthi-resume.pdf"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all"
                  title="Download Siva Palaparthi's Official Resume"
                >
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Download Resume</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              {/* Copy Portfolio Link button */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                title="Copy shareable portfolio URL to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Portfolio Link</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
