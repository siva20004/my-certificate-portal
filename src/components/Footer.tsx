import React from 'react';
import { Award, ArrowUp, Shield, ExternalLink } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, isAdmin, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                {profile.full_name}
              </span>
              <p className="text-xs text-slate-500">
                Official Professional Certificate Portfolio
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-blue-400 transition-colors"
              >
                Email
              </a>
            )}
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                download="siva-palaparthi-resume.pdf"
                className="hover:text-blue-400 transition-colors"
              >
                Resume PDF
              </a>
            )}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {profile.full_name}. All rights reserved. Designed for professional recruitment and credential verification.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Console (Authenticated)' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
