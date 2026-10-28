import React, { useState } from 'react';
import { Award, Share2, Shield, Menu, X, Check } from 'lucide-react';
import { Profile } from '../types';

interface HeaderProps {
  profile: Profile;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isAdmin,
  onOpenAdmin,
  onShare,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:shadow-blue-900/20 transition-all">
              <Award className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {profile.full_name}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Portfolio
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Verified Credentials & Qualifications
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100/70 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleShareClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              title="Copy public link to share"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Mode Login'}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{isAdmin ? 'Admin Mode (Active)' : 'Admin Access'}</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleShareClick}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Share Portfolio"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>{isAdmin ? 'Manage Portfolio (Admin)' : 'Admin Sign-in'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
