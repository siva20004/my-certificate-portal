import React, { useState, useMemo } from 'react';
import {
  Search,
  Award,
  Layers,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Certificate, CertificateCategory } from '../types';
import { CertificateCard } from './CertificateCard';

interface CertificatesSectionProps {
  certificates: Certificate[];
  onViewCertificate: (cert: Certificate) => void;
  onDownloadCertificate: (cert: Certificate) => void;
}

const CATEGORIES: CertificateCategory[] = [
  'All Certificates',
  'Cloud Computing',
  'Artificial Intelligence',
  'Automation',
  'Japanese Language',
  'English Language',
  'IT Service Management',
  'Agile and Scrum',
  'Internship and Training',
];

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  onViewCertificate,
  onDownloadCertificate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>('All Certificates');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'newest' | 'issuer'>('order');

  // Filter & Search logic
  const filteredCertificates = useMemo(() => {
    return certificates
      .filter((cert) => {
        // Category filter
        if (selectedCategory !== 'All Certificates' && cert.category !== selectedCategory) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = cert.title.toLowerCase().includes(q);
          const matchesIssuer = cert.issuer.toLowerCase().includes(q);
          const matchesId = cert.credential_id?.toLowerCase().includes(q);
          const matchesDesc = cert.description?.toLowerCase().includes(q);
          const matchesCategory = cert.category.toLowerCase().includes(q);
          return matchesTitle || matchesIssuer || matchesId || matchesDesc || matchesCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime();
        }
        if (sortBy === 'issuer') {
          return a.issuer.localeCompare(b.issuer);
        }
        // Default: display_order
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      });
  }, [certificates, selectedCategory, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Certificates': certificates.length };
    certificates.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [certificates]);

  return (
    <section id="certificates" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified Professional Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Certifications & Qualifications
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            All credentials below are fully verified. Preview certificates directly in your browser or download the original PDF / image documents for interview verification.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by certificate title, issuer, credential ID..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="order">Featured / Recommended Order</option>
              <option value="newest">Most Recent Issue Date</option>
              <option value="issuer">Issuing Organization (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;
            if (category !== 'All Certificates' && count === 0) return null;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredCertificates.length}</strong> of{' '}
              <strong className="text-slate-900 font-bold">{certificates.length}</strong> credentials
            </span>
          </div>

          {(selectedCategory !== 'All Certificates' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All Certificates');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={onViewCertificate}
                onDownload={onDownloadCertificate}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No certificates found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Certificates');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-colors"
            >
              View All Certificates
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
