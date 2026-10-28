import React, { useState } from 'react';
import {
  Calendar,
  ExternalLink,
  Download,
  Eye,
  Check,
  Copy,
  Sparkles,
  FileText,
  Shield,
  Building2,
} from 'lucide-react';
import { Certificate, CertificateCategory } from '../types';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onDownload,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (certificate.credential_id) {
      navigator.clipboard.writeText(certificate.credential_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Category styling
  const getCategoryBadgeClass = (category: CertificateCategory) => {
    switch (category) {
      case 'Cloud Computing':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Artificial Intelligence':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Automation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Japanese Language':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'English Language':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IT Service Management':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Agile and Scrum':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Internship and Training':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Formatted date string
  const formattedDate = certificate.issue_date
    ? new Date(certificate.issue_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Banner / Preview Container */}
      <div 
        onClick={() => onView(certificate)}
        className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer border-b border-slate-100 flex items-center justify-center"
      >
        {certificate.thumbnail_path && !imgError ? (
          <img
            src={certificate.thumbnail_path}
            alt={certificate.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* PDF / Document Mockup Placeholder */
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-blue-300" />
            </div>
            <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
              {certificate.file_type.toUpperCase()} Credential
            </span>
            <span className="text-xs text-blue-300 line-clamp-1 max-w-[200px] mt-1 font-medium">
              {certificate.issuer}
            </span>
          </div>
        )}

        {/* Floating View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg backdrop-blur-sm">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Click to Preview</span>
          </span>
        </div>

        {/* Featured Star Badge */}
        {certificate.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/95 text-white text-xs font-bold shadow-md backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
            <span>Featured</span>
          </div>
        )}

        {/* File Type Badge */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[11px] font-mono uppercase tracking-wider backdrop-blur-sm">
          {certificate.file_type}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Category & Organization */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(
              certificate.category
            )}`}
          >
            {certificate.category}
          </span>
          
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate max-w-[150px]">
            <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
            <span className="truncate">{certificate.issuer}</span>
          </div>
        </div>

        {/* Certificate Title */}
        <h3
          onClick={() => onView(certificate)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer"
          title={certificate.title}
        >
          {certificate.title}
        </h3>

        {/* Description (Optional) */}
        {certificate.description && (
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {certificate.description}
          </p>
        )}

        {/* Details Pill Row (ID & Date) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
          {/* Issue Date */}
          {formattedDate && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Issued:</span>
              </span>
              <span className="font-semibold text-slate-700">{formattedDate}</span>
            </div>
          )}

          {/* Credential ID */}
          {certificate.credential_id && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Credential ID:</span>
              </span>
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                title="Click to copy credential ID"
              >
                <span className="truncate max-w-[130px]">{certificate.credential_id}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-blue-500" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          {/* View Certificate Button */}
          <button
            onClick={() => onView(certificate)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            title="Open certificate viewer modal"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View</span>
          </button>

          {/* Download Original Certificate Button */}
          <button
            onClick={() => onDownload(certificate)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-colors"
            title={`Download original ${certificate.file_name}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

        {/* External Verification Link (if available) */}
        {certificate.verification_url && (
          <div className="mt-2 text-center">
            <a
              href={certificate.verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span>Verify at Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
