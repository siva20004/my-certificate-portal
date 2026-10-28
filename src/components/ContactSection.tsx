import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
  FileText,
  Send,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Profile } from '../types';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || 'Job Opportunity / Portfolio Inquiry'
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 text-xs font-bold mb-3">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Connect & Inquire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Get in Touch
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Interested in discussing software engineering opportunities, internships, or reviewing full credentials? Feel free to reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6">
              Contact Channels
            </h3>

            <div className="space-y-4">
              {/* Email */}
              {profile.email && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Email Address</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* LinkedIn */}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">LinkedIn Profile</span>
                      <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        linkedin.com/in/siva-palaparthi
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              )}

              {/* GitHub */}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-slate-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 text-slate-300 flex items-center justify-center shrink-0">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">GitHub Profile</span>
                      <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        github.com/siva20004
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              )}

              {/* Phone */}
              {profile.phone && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Phone</span>
                    <span className="text-sm font-semibold text-white">{profile.phone}</span>
                  </div>
                </div>
              )}

              {/* Location */}
              {profile.location && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Location</span>
                    <span className="text-sm font-semibold text-white">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Resume button */}
            {profile.resume_url && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <a
                  href={profile.resume_url}
                  download="siva-palaparthi-resume.pdf"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Download Full Resume (PDF)</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Direct Message Box */}
          <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-2">
              Send a Quick Message
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Recruiters and hiring managers can compose a message below to launch your default email client with Siva Palaparthi's address prefilled.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject / Position
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Software Engineer Role / Technical Interview Invitation"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi Siva, I reviewed your certificate portfolio and would like to connect regarding..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Open in Email Client to Send</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
