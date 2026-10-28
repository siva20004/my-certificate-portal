import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Maximize2,
  Calendar,
  Shield,
  Building2,
  Check,
  Copy,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  onDownload: (cert: Certificate) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  onDownload,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset load error state when certificate changes
  useEffect(() => {
    setLoadError(false);
  }, [certificate]);

  if (!certificate) return null;

  const handleCopyId = () => {
    if (certificate.credential_id) {
      navigator.clipboard.writeText(certificate.credential_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const isPdf =
    certificate.file_type === 'pdf' ||
    certificate.file_path.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1">
                {certificate.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {certificate.issuer}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-700 font-semibold">{certificate.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open in new tab */}
            <a
              href={certificate.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors hidden sm:inline-flex"
              title="Open file directly in new browser tab"
            >
              <Maximize2 className="w-4 h-4" />
            </a>

            {/* Download button */}
            <button
              onClick={() => onDownload(certificate)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-all"
              title="Download original certificate"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Original</span>
              <span className="sm:hidden">Download</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-900/95 flex items-center justify-center min-h-[350px] max-h-[60vh] p-2 sm:p-4">
          {loadError ? (
            <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-xl">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Certificate File Unavailable</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                The embedded preview could not be displayed directly. You can still download the original certificate or view the credential verification page.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => onDownload(certificate)}
                  className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Download File
                </button>
                {certificate.verification_url && (
                  <a
                    href={certificate.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg"
                  >
                    Verify Credential
                  </a>
                )}
              </div>
            </div>
          ) : isPdf ? (
            <iframe
              src={`${certificate.file_path}#toolbar=1&navpanes=0`}
              title={certificate.title}
              className="w-full h-full min-h-[500px] rounded-lg shadow-lg bg-white border-0"
              onError={() => setLoadError(true)}
            />
          ) : (
            <img
              src={certificate.file_path}
              alt={certificate.title}
              className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-2xl"
              onError={() => setLoadError(true)}
            />
          )}
        </div>

        {/* Modal Footer / Metadata Bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            {certificate.description && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {certificate.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
              {certificate.issue_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issued: <strong className="text-slate-700 font-semibold">{certificate.issue_date}</strong></span>
                </div>
              )}
              {certificate.expiry_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expires: <strong className="text-slate-700 font-semibold">{certificate.expiry_date}</strong></span>
                </div>
              )}
              {certificate.credential_id && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>ID: <strong className="font-mono text-slate-800">{certificate.credential_id}</strong></span>
                  <button
                    onClick={handleCopyId}
                    className="ml-1 p-0.5 text-slate-400 hover:text-blue-700 rounded"
                    title="Copy Credential ID"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {certificate.verification_url && (
            <a
              href={certificate.verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
            >
              <span>Verify at Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
