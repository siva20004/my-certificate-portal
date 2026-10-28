import React, { useState, useEffect, useCallback } from 'react';
import { Certificate, Profile } from './types';
import {
  fetchProfile,
  fetchCertificates,
  checkAdminSession,
  setAdminSession,
} from './lib/dataService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CertificatesSection } from './components/CertificatesSection';
import { CertificateModal } from './components/CertificateModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { Toast, ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast notification dispatcher
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [profData, certsData] = await Promise.all([
        fetchProfile(),
        fetchCertificates(),
      ]);
      setProfile(profData);
      setCertificates(certsData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      showToast('Error loading certificate data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
    setIsAdmin(checkAdminSession());
  }, [loadData]);

  // Share handler
  const handleShare = () => {
    const shareData = {
      title: `${profile?.full_name || 'Siva Palaparthi'} — Certificate Portfolio`,
      text: 'View verified cloud, AI, automation, and language certifications of Siva Palaparthi.',
      url: window.location.href,
    };

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Portfolio link copied to clipboard!', 'success');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Portfolio link copied to clipboard!', 'success');
    }
  };

  // Clean Download Handler (Original files, proper filenames)
  const handleDownloadCertificate = (cert: Certificate) => {
    showToast(`Downloading original: ${cert.file_name}`, 'info');

    // Trigger download
    const link = document.createElement('a');
    link.href = cert.file_path;
    link.download = cert.file_name || `${cert.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${cert.file_type}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminSession(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminSession(false);
    showToast('Logged out of Administrator Mode', 'info');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-700 animate-pulse mb-4 flex items-center justify-center text-white shadow-xl">
          <span className="font-bold text-lg">SP</span>
        </div>
        <div className="text-sm font-bold text-slate-800">Loading Certificate Portfolio...</div>
        <div className="text-xs text-slate-500 mt-1">Siva Palaparthi — Verified Credentials</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        profile={profile}
        isAdmin={isAdmin}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onShare={handleShare}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          profile={profile}
          onCopyLink={handleShare}
          certificateCount={certificates.length}
        />

        {/* Certificates Showcase Section */}
        <CertificatesSection
          certificates={certificates}
          onViewCertificate={(cert) => setSelectedCertificate(cert)}
          onDownloadCertificate={handleDownloadCertificate}
        />

        {/* Professional Background & Education */}
        <AboutSection profile={profile} />

        {/* Direct Contact & Verification */}
        <ContactSection profile={profile} />
      </main>

      {/* Professional Footer */}
      <Footer
        profile={profile}
        isAdmin={isAdmin}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        onDownload={handleDownloadCertificate}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        isAdmin={isAdmin}
        onClose={() => setAdminModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        certificates={certificates}
        profile={profile}
        onRefreshData={loadData}
        showToast={showToast}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
