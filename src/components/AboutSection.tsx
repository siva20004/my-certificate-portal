import React from 'react';
import {
  GraduationCap,
  Code2,
  Languages,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Profile } from '../types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Background & Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Siva Palaparthi
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Aspiring Software Developer combining formal Computer Science training with industry-recognized cloud, AI, and automation certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Bio Card */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Professional Summary</span>
            </h3>

            <p className="text-slate-700 leading-relaxed text-base">
              {profile.introduction}
            </p>

            {profile.bio_extended && (
              <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                {profile.bio_extended}
              </p>
            )}

            {/* Key Strengths Checklist */}
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-700">
                  Microsoft Azure Architecture & AI Pipelines
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-700">
                  Enterprise RPA & Automation Anywhere 360
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-700">
                  ServiceNow Data Foundations (CMDB / CSDM)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-700">
                  Agile Scrum Sprint Planning & Execution
                </span>
              </div>
            </div>
          </div>

          {/* Education & Language Qualifications */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Education Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="w-full">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Education</span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    B.Tech in Computer Science & Engineering
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Specialization in <strong>Data Engineering for AI</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    KL University • 2023 – 2027
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      B.Tech CGPA: 8.7 / 10.0
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                      Inter (NRI): 61.2%
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                      SSC (Bhashyam): 97%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Proficiency Box (Crucial for Japanese and Global Recruiters) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-rose-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  International Language Qualifications
                </h4>
              </div>

              <div className="space-y-3">
                {/* Japanese NAT-TEST */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Japanese Language</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">
                        NAT-TEST 5Q (N5 Equivalent)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Score: 109/180 (Pass) • Senmon Kyouiku Publishing
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Certified</span>
                </div>

                {/* Cambridge Linguaskill */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">English Language</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">
                        CEFR B1 (Reading 180+ C1)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Cambridge English • Overall Score: 154
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Certified</span>
                </div>
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Technical Skillset</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Python',
                  'Java',
                  'C',
                  'JavaScript',
                  'React.js',
                  'Node.js',
                  'Express.js',
                  'SQL / MySQL',
                  'Microsoft Azure',
                  'Azure AI Services',
                  'Automation Anywhere',
                  'ServiceNow CMDB',
                  'Agile / Scrum',
                  'Git & GitHub',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
