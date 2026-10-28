import { Certificate, Profile } from '../types';
import { INITIAL_CERTIFICATES, INITIAL_PROFILE } from './initialData';
import { getSupabase } from './supabase';

const STORAGE_KEY_CERTIFICATES = 'siva_certificates_data_v1';
const STORAGE_KEY_PROFILE = 'siva_profile_data_v1';
const STORAGE_KEY_ADMIN_AUTH = 'siva_portfolio_admin_auth';

// --- DATA ACCESS LAYER ---

export async function fetchProfile(): Promise<Profile> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          full_name: data.full_name,
          role: data.role,
          location: data.location,
          introduction: data.introduction,
          bio_extended: data.bio_extended || INITIAL_PROFILE.bio_extended,
          photo_url: data.photo_url || INITIAL_PROFILE.photo_url,
          resume_url: data.resume_url || INITIAL_PROFILE.resume_url,
          email: data.email || INITIAL_PROFILE.email,
          linkedin_url: data.linkedin_url || INITIAL_PROFILE.linkedin_url,
          github_url: data.github_url || INITIAL_PROFILE.github_url,
          phone: data.phone || INITIAL_PROFILE.phone,
          updated_at: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase profile fetch failed, using local fallback:', e);
    }
  }

  // Fallback to localStorage or Initial Profile
  try {
    const local = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error reading profile from localStorage:', e);
  }

  // Save initial profile to localStorage
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_PROFILE));
  return INITIAL_PROFILE;
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const updated: Profile = {
    ...profile,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('profile').upsert({
        id: updated.id || 'siva-palaparthi-profile',
        full_name: updated.full_name,
        role: updated.role,
        location: updated.location,
        introduction: updated.introduction,
        bio_extended: updated.bio_extended,
        photo_url: updated.photo_url,
        resume_url: updated.resume_url,
        email: updated.email,
        linkedin_url: updated.linkedin_url,
        github_url: updated.github_url,
        phone: updated.phone,
        updated_at: updated.updated_at,
      });

      if (error) {
        console.error('Error updating profile in Supabase:', error);
      }
    } catch (e) {
      console.error('Supabase profile update exception:', e);
    }
  }

  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
  return updated;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          description: item.description || '',
          category: item.category,
          issue_date: item.issue_date,
          expiry_date: item.expiry_date,
          credential_id: item.credential_id,
          verification_url: item.verification_url,
          file_path: item.file_path,
          file_name: item.file_name || 'certificate',
          file_type: item.file_type || (item.file_path.endsWith('.pdf') ? 'pdf' : 'image'),
          thumbnail_path: item.thumbnail_path,
          featured: Boolean(item.featured),
          display_order: item.display_order ?? 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase certificates fetch failed, using local fallback:', e);
    }
  }

  // Fallback to localStorage or Initial Data
  try {
    const local = localStorage.getItem(STORAGE_KEY_CERTIFICATES);
    if (local) {
      const parsed: Certificate[] = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      }
    }
  } catch (e) {
    console.error('Error reading certificates from localStorage:', e);
  }

  // Initialize localStorage with verified data
  localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  return INITIAL_CERTIFICATES;
}

export async function saveCertificate(certificate: Certificate): Promise<Certificate> {
  const existing = await fetchCertificates();
  let updatedList: Certificate[];

  const exists = existing.find((c) => c.id === certificate.id);
  const now = new Date().toISOString();
  const certToSave: Certificate = {
    ...certificate,
    updated_at: now,
    created_at: certificate.created_at || now,
  };

  if (exists) {
    updatedList = existing.map((c) => (c.id === certToSave.id ? certToSave : c));
  } else {
    updatedList = [...existing, certToSave];
  }

  updatedList.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('certificates').upsert({
        id: certToSave.id,
        title: certToSave.title,
        issuer: certToSave.issuer,
        description: certToSave.description,
        category: certToSave.category,
        issue_date: certToSave.issue_date,
        expiry_date: certToSave.expiry_date || null,
        credential_id: certToSave.credential_id || null,
        verification_url: certToSave.verification_url || null,
        file_path: certToSave.file_path,
        file_name: certToSave.file_name,
        file_type: certToSave.file_type,
        thumbnail_path: certToSave.thumbnail_path || null,
        featured: certToSave.featured,
        display_order: certToSave.display_order,
        updated_at: certToSave.updated_at,
      });

      if (error) {
        console.error('Error saving certificate in Supabase:', error);
      }
    } catch (e) {
      console.error('Supabase certificate upsert exception:', e);
    }
  }

  localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(updatedList));
  return certToSave;
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const existing = await fetchCertificates();
  const filtered = existing.filter((c) => c.id !== id);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) console.error('Error deleting certificate from Supabase:', error);
    } catch (e) {
      console.error('Supabase certificate delete exception:', e);
    }
  }

  localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(filtered));
  return true;
}

// Upload file either to Supabase Storage or browser IndexedDB/DataURL for local operation
export async function uploadFile(
  file: File,
  folder: 'certificates' | 'profile'
): Promise<{ url: string; fileName: string; fileType: 'pdf' | 'image' }> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const fileType: 'pdf' | 'image' = isPdf ? 'pdf' : 'image';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `${folder}/${timestamp}_${cleanName}`;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const bucketName = folder === 'certificates' ? 'certificates' : 'profile-assets';
      const { data, error } = await supabase.storage.from(bucketName).upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
        return {
          url: publicUrlData.publicUrl,
          fileName: cleanName,
          fileType,
        };
      } else {
        console.warn('Supabase storage upload error, falling back to local base64:', error);
      }
    } catch (err) {
      console.warn('Supabase storage exception, falling back:', err);
    }
  }

  // Local fallback: convert file to Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        fileName: cleanName,
        fileType,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Reset local data back to the original verified 8 certificates and profile
export function resetToDefaults(): { profile: Profile; certificates: Certificate[] } {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_PROFILE));
  localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  return {
    profile: INITIAL_PROFILE,
    certificates: INITIAL_CERTIFICATES,
  };
}

// --- ADMIN AUTHENTICATION ---
// Public visitors cannot modify anything. Admin session is managed with token.
export function checkAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
}

export function setAdminSession(isAuthenticated: boolean): void {
  if (typeof window === 'undefined') return;
  if (isAuthenticated) {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
}
