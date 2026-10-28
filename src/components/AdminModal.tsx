import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Edit,
  Trash2,
  Upload,
  User,
  Database,
  Check,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Certificate, CertificateCategory, Profile } from '../types';
import {
  uploadFile,
  saveCertificate,
  deleteCertificate,
  updateProfile,
  resetToDefaults,
} from '../lib/dataService';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  getSupabase,
} from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
  certificates: Certificate[];
  profile: Profile;
  onRefreshData: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const CATEGORIES: CertificateCategory[] = [
  'Cloud Computing',
  'Artificial Intelligence',
  'Automation',
  'Japanese Language',
  'English Language',
  'IT Service Management',
  'Agile and Scrum',
  'Internship and Training',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  onLoginSuccess,
  onLogout,
  certificates,
  profile,
  onRefreshData,
  showToast,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'profile' | 'backend'>('manage');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Editing Certificate state
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<{
    title: string;
    issuer: string;
    description: string;
    category: CertificateCategory;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    verification_url: string;
    file_path: string;
    file_name: string;
    file_type: 'pdf' | 'image';
    thumbnail_path: string;
    featured: boolean;
    display_order: number;
  }>({
    title: '',
    issuer: '',
    description: '',
    category: 'Cloud Computing',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    verification_url: '',
    file_path: '',
    file_name: '',
    file_type: 'pdf',
    thumbnail_path: '',
    featured: false,
    display_order: 1,
  });

  // File upload state for certificates
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Delete confirmation modal state
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  // Supabase settings state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'not-configured' | 'testing'>('not-configured');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseAnonKey(creds.anonKey);
    setSupabaseStatus(creds.isConfigured ? 'connected' : 'not-configured');
  }, [isOpen]);

  if (!isOpen) return null;

  // Authentication Check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Default admin passcode configured for Siva Palaparthi
    // In production, this can connect directly to Supabase Auth signInWithPassword
    const validPasscodes = ['siva2026', 'admin2026', 'Palaparthi@2026'];

    if (validPasscodes.includes(passwordInput.trim())) {
      onLoginSuccess();
      setPasswordInput('');
      showToast('Authenticated successfully as Administrator', 'success');
    } else {
      setLoginError('Invalid Administrator Passcode. Please check and try again.');
    }
  };

  // Certificate file picker
  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      showToast('File size must be under 15MB', 'error');
      return;
    }

    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      showToast('Only PDF, PNG, JPG, and JPEG files are supported', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(40);

    try {
      const res = await uploadFile(file, 'certificates');
      setUploadProgress(100);

      setCertForm((prev) => ({
        ...prev,
        file_path: res.url,
        file_name: res.fileName,
        file_type: res.fileType,
        thumbnail_path: res.fileType === 'image' ? res.url : prev.thumbnail_path,
      }));

      showToast(`File "${file.name}" uploaded successfully`, 'success');
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  // Profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG)', 'error');
      return;
    }

    try {
      const res = await uploadFile(file, 'profile');
      setProfileForm((prev) => ({ ...prev, photo_url: res.url }));
      showToast('Profile photo uploaded. Remember to click "Save Profile Changes"', 'success');
    } catch (err: any) {
      showToast(`Photo upload failed: ${err.message}`, 'error');
    }
  };

  // Resume PDF upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Resume must be a PDF document', 'error');
      return;
    }

    try {
      const res = await uploadFile(file, 'profile');
      setProfileForm((prev) => ({ ...prev, resume_url: res.url }));
      showToast('Resume PDF uploaded successfully', 'success');
    } catch (err: any) {
      showToast(`Resume upload failed: ${err.message}`, 'error');
    }
  };

  // Save Certificate
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certForm.title.trim()) {
      showToast('Certificate title is required', 'error');
      return;
    }
    if (!certForm.issuer.trim()) {
      showToast('Issuing organization is required', 'error');
      return;
    }
    if (!certForm.file_path.trim()) {
      showToast('Please upload a certificate document (PDF or Image)', 'error');
      return;
    }

    const certId = editingCertId || `cert-${Date.now()}`;
    const certToSave: Certificate = {
      id: certId,
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      description: certForm.description.trim(),
      category: certForm.category,
      issue_date: certForm.issue_date,
      expiry_date: certForm.expiry_date || null,
      credential_id: certForm.credential_id.trim() || null,
      verification_url: certForm.verification_url.trim() || null,
      file_path: certForm.file_path,
      file_name: certForm.file_name || `${certForm.title.toLowerCase().replace(/\s+/g, '-')}.${certForm.file_type}`,
      file_type: certForm.file_type,
      thumbnail_path: certForm.thumbnail_path || null,
      featured: certForm.featured,
      display_order: Number(certForm.display_order) || certificates.length + 1,
    };

    try {
      await saveCertificate(certToSave);
      await onRefreshData();
      showToast(
        editingCertId ? 'Certificate updated successfully' : 'New certificate added successfully',
        'success'
      );
      // Reset form and go back to manage tab
      setEditingCertId(null);
      setCertForm({
        title: '',
        issuer: '',
        description: '',
        category: 'Cloud Computing',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        verification_url: '',
        file_path: '',
        file_name: '',
        file_type: 'pdf',
        thumbnail_path: '',
        featured: false,
        display_order: certificates.length + 1,
      });
      setActiveTab('manage');
    } catch (err: any) {
      showToast(`Failed to save certificate: ${err.message}`, 'error');
    }
  };

  // Edit existing certificate
  const handleStartEditCert = (cert: Certificate) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title,
      issuer: cert.issuer,
      description: cert.description || '',
      category: cert.category,
      issue_date: cert.issue_date || '',
      expiry_date: cert.expiry_date || '',
      credential_id: cert.credential_id || '',
      verification_url: cert.verification_url || '',
      file_path: cert.file_path,
      file_name: cert.file_name,
      file_type: cert.file_type,
      thumbnail_path: cert.thumbnail_path || '',
      featured: cert.featured,
      display_order: cert.display_order,
    });
    setActiveTab('add');
  };

  // Delete Certificate confirmation
  const handleConfirmDelete = async () => {
    if (!certToDelete) return;
    try {
      await deleteCertificate(certToDelete.id);
      await onRefreshData();
      showToast(`Certificate "${certToDelete.title}" deleted`, 'success');
      setCertToDelete(null);
    } catch (err: any) {
      showToast(`Deletion failed: ${err.message}`, 'error');
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile(profileForm);
      await onRefreshData();
      showToast('Profile information updated successfully', 'success');
    } catch (err: any) {
      showToast(`Failed to save profile: ${err.message}`, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Supabase credentials save & test
  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    const client = getSupabase();
    if (!client) {
      setSupabaseStatus('not-configured');
      showToast('Supabase credentials removed or invalid', 'info');
      return;
    }

    setSupabaseStatus('testing');
    try {
      const { error } = await client.from('certificates').select('id', { count: 'exact', head: true });
      if (error) throw error;
      setSupabaseStatus('connected');
      showToast('Connected to Supabase PostgreSQL database successfully!', 'success');
      await onRefreshData();
    } catch (err: any) {
      setSupabaseStatus('not-configured');
      showToast(`Supabase connection failed: ${err.message}`, 'error');
    }
  };

  // Sync local data to Supabase
  const handleSyncToSupabase = async () => {
    const client = getSupabase();
    if (!client) {
      showToast('Please configure a valid Supabase URL & Anon Key first', 'error');
      return;
    }

    setIsSyncing(true);
    try {
      // Upsert profile
      await client.from('profile').upsert({
        id: profile.id,
        full_name: profile.full_name,
        role: profile.role,
        location: profile.location,
        introduction: profile.introduction,
        bio_extended: profile.bio_extended,
        photo_url: profile.photo_url,
        resume_url: profile.resume_url,
        email: profile.email,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        phone: profile.phone,
        updated_at: new Date().toISOString(),
      });

      // Upsert certificates
      for (const cert of certificates) {
        await client.from('certificates').upsert({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          description: cert.description,
          category: cert.category,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date || null,
          credential_id: cert.credential_id || null,
          verification_url: cert.verification_url || null,
          file_path: cert.file_path,
          file_name: cert.file_name,
          file_type: cert.file_type,
          thumbnail_path: cert.thumbnail_path || null,
          featured: cert.featured,
          display_order: cert.display_order,
          updated_at: new Date().toISOString(),
        });
      }

      showToast(`Successfully synced ${certificates.length} certificates and profile to Supabase!`, 'success');
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset to default verified certificates
  const handleResetDefaults = () => {
    if (confirm('Reset portfolio to initial verified 8 certificates and profile? Any local modifications will be overwritten.')) {
      resetToDefaults();
      onRefreshData();
      showToast('Portfolio reset to verified default credentials', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              {isAdmin ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Administrator Control Center</span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Session
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Manage certificates, profile details, file storage, and Supabase database'
                  : 'Protected access for Siva Palaparthi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800/60 transition-colors"
                title="Log out from administrator mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAdmin ? (
          /* Admin Login Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-700 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Administrator Authentication
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Public visitors can view and download certificates. Enter your administrator passcode to add, edit, or delete credentials.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  autoFocus
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                Unlock Admin Mode
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-6">
              Default passcode configured: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">siva2026</code>
            </p>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Navigation */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Certificates ({certificates.length})</span>
              </button>

              <button
                onClick={() => {
                  setEditingCertId(null);
                  setActiveTab('add');
                }}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'add'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingCertId ? 'Edit Certificate' : 'Add New Certificate'}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Photo</span>
              </button>

              <button
                onClick={() => setActiveTab('backend')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'backend'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Supabase & Storage</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* TAB 1: MANAGE CERTIFICATES */}
              {activeTab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Manage Certificates</h3>
                      <p className="text-xs text-slate-500">Edit credential details, reorder, or delete entries.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCertId(null);
                        setActiveTab('add');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Certificate</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                    {certificates.map((cert, idx) => (
                      <div
                        key={cert.id}
                        className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>

                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {cert.thumbnail_path ? (
                              <img src={cert.thumbnail_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileText className="w-6 h-6 text-slate-400" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {cert.title}
                              </h4>
                              {cert.featured && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>{cert.issuer}</span>
                              <span>•</span>
                              <span className="font-medium text-blue-700">{cert.category}</span>
                              {cert.credential_id && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] text-slate-600">ID: {cert.credential_id}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleStartEditCert(cert)}
                            className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Certificate"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setCertToDelete(cert)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD / EDIT CERTIFICATE */}
              {activeTab === 'add' && (
                <form onSubmit={handleSaveCertificate} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {editingCertId ? 'Edit Certificate' : 'Add New Certificate'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload the original certificate file (PDF or Image) and fill in verified credential details.
                      </p>
                    </div>

                    {editingCertId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCertId(null);
                          setActiveTab('manage');
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Original Certificate Document (PDF, PNG, JPG, JPEG) *
                    </label>

                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 relative">
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/jpg"
                        onChange={handleCertFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />

                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                          {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          ) : (
                            <Upload className="w-6 h-6" />
                          )}
                        </div>

                        {certForm.file_path ? (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-center">
                              <Check className="w-4 h-4" />
                              <span>File Ready: {certForm.file_name}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Click or drop another file to replace
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-800">
                              Choose file or drag & drop here
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1">
                              PDF or high-resolution images up to 15MB
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {uploadProgress !== null && (
                      <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Form fields grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Certificate Title *
                      </label>
                      <input
                        type="text"
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        placeholder="e.g. Microsoft Certified: Azure Fundamentals (AZ-900)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>

                    {/* Issuer */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Issuing Organization *
                      </label>
                      <input
                        type="text"
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        placeholder="e.g. Microsoft, Cambridge English, Automation Anywhere"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={certForm.category}
                        onChange={(e) => setCertForm({ ...certForm, category: e.target.value as CertificateCategory })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Credential ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Credential ID / Registration Number
                      </label>
                      <input
                        type="text"
                        value={certForm.credential_id}
                        onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                        placeholder="e.g. wnC2J-48EN, 26070048250181"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>

                    {/* Issue Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={certForm.issue_date}
                        onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Verification URL */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Verification URL (Credly, Microsoft Learn, etc.)
                      </label>
                      <input
                        type="url"
                        value={certForm.verification_url}
                        onChange={(e) => setCertForm({ ...certForm, verification_url: e.target.value })}
                        placeholder="https://www.credly.com/badges/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description / Competencies Validated
                      </label>
                      <textarea
                        rows={2}
                        value={certForm.description}
                        onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                        placeholder="Short summary of skills, scores, or competencies validated by this credential..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Featured & Display Order */}
                    <div className="flex items-center gap-6 md:col-span-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={certForm.featured}
                          onChange={(e) => setCertForm({ ...certForm, featured: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Mark as Featured Credential
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">Display Order:</span>
                        <input
                          type="number"
                          value={certForm.display_order}
                          onChange={(e) => setCertForm({ ...certForm, display_order: Number(e.target.value) })}
                          className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-xs"
                          min={1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                    >
                      {editingCertId ? 'Update Certificate' : 'Publish Certificate'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PROFILE & PHOTO */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Profile Information</h3>
                    <p className="text-xs text-slate-500">
                      Update your personal details, professional photograph, and resume without changing code.
                    </p>
                  </div>

                  {/* Photo & Resume Upload Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    {/* Photo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Professional Photograph
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow shrink-0">
                          {profileForm.photo_url ? (
                            <img src={profileForm.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
                          )}
                        </div>
                        <div>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>Upload Real Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="block text-[11px] text-slate-400 mt-1">PNG, JPG, or JPEG</span>
                        </div>
                      </div>
                    </div>

                    {/* Resume */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Official Resume (PDF)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>Replace Resume PDF</span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleResumeUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="block text-[11px] text-slate-400 mt-1">
                            {profileForm.resume_url ? 'Resume PDF attached' : 'No resume attached'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Role / Headline</label>
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={profileForm.linkedin_url || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={profileForm.github_url || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Short Introduction</label>
                      <textarea
                        rows={3}
                        value={profileForm.introduction}
                        onChange={(e) => setProfileForm({ ...profileForm, introduction: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Extended Bio / Academic Summary</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio_extended || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, bio_extended: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: BACKEND & SUPABASE SETTINGS */}
              {activeTab === 'backend' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Supabase Cloud Database & Storage</h3>
                    <p className="text-xs text-slate-500">
                      Configure your Supabase PostgreSQL database and Storage bucket for cloud persistence and multi-device access.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      supabaseStatus === 'connected'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5" />
                      <div>
                        <span className="text-xs font-bold block">
                          {supabaseStatus === 'connected'
                            ? 'Connected to Supabase PostgreSQL'
                            : 'Operating in Local Storage Fallback Mode'}
                        </span>
                        <span className="text-[11px] opacity-80">
                          {supabaseStatus === 'connected'
                            ? 'Changes sync directly with your live Supabase cloud database.'
                            : 'All features work 100% locally. Enter Supabase credentials below to connect cloud DB.'}
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/70">
                      {supabaseStatus}
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="url"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Supabase Anon Key
                      </label>
                      <input
                        type="password"
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        Save & Test Connection
                      </button>

                      {supabaseStatus === 'connected' && (
                        <button
                          type="button"
                          onClick={handleSyncToSupabase}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Local Data to Supabase'}</span>
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Reset Section */}
                  <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Reset & Recovery
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Restore the verified 8 certificates and profile to their original state.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      Reset to Default Verified Credentials
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {certToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 text-center">
              Delete Certificate?
            </h4>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong>"{certToDelete.title}"</strong>? Visitors will no longer be able to view or download this credential.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setCertToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
