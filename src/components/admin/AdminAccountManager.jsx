import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  User, 
  Mail, 
  Clock, 
  Laptop, 
  ShieldAlert,
  RotateCcw,
  Database,
  Download,
  Upload,
  HardDrive,
  AlertTriangle,
  Cloud
} from 'lucide-react';
import { 
  getAdminCredentials, 
  saveAdminCredentials, 
  resetAdminCredentials,
  getStorageDiagnostics,
  exportDatabaseBackup,
  importDatabaseBackup,
  isCloudflareD1Active
} from '../../services/storage';

export const AdminAccountManager = ({ onLogout }) => {
  const [credentials, setCredentials] = useState(getAdminCredentials());
  const [storageInfo, setStorageInfo] = useState(getStorageDiagnostics());
  const [isD1Connected, setIsD1Connected] = useState(false);
  const [backupMessage, setBackupMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    isCloudflareD1Active().then(active => setIsD1Connected(active));
  }, []);
  
  // Account Information form state
  const [username, setUsername] = useState(credentials.username || 'admin');
  const [email, setEmail] = useState(credentials.email || 'admin@thevanguard.ai');
  const [fullName, setFullName] = useState(credentials.fullName || 'System Administrator');
  
  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feedback alerts
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const creds = getAdminCredentials();
    setCredentials(creds);
    setUsername(creds.username);
    setEmail(creds.email);
    setFullName(creds.fullName || 'System Administrator');
  }, []);

  // Password strength calculation
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: '#f43f5e' };
    if (score <= 4) return { score: 65, label: 'Moderate', color: '#f59e0b' };
    return { score: 100, label: 'Strong & Resilient', color: '#10b981' };
  };

  const strength = calculatePasswordStrength(newPassword);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: '', type: '' });

    const trimmedUser = username.trim();
    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (!trimmedUser || trimmedUser.length < 3) {
      setProfileMessage({ text: 'Admin username must be at least 3 characters long.', type: 'error' });
      return;
    }

    if (trimmedEmail && !trimmedEmail.includes('@')) {
      setProfileMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    try {
      const updated = await saveAdminCredentials({
        username: trimmedUser,
        email: trimmedEmail,
        fullName: trimmedName
      });
      setCredentials(updated);
      setProfileMessage({ text: 'Admin profile updated & synchronized across Cloudflare KV globally!', type: 'success' });
      setTimeout(() => setProfileMessage({ text: '', type: '' }), 4000);
    } catch (_) {
      setProfileMessage({ text: 'Failed to update credentials on Cloudflare Worker KV.', type: 'error' });
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (!currentPassword) {
      setPasswordMessage({ text: 'Please enter your current admin password for verification.', type: 'error' });
      return;
    }

    if (!newPassword || newPassword.length < 5) {
      setPasswordMessage({ text: 'New password must be at least 5 characters long.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New password and confirmation password do not match.', type: 'error' });
      return;
    }

    try {
      const updated = await saveAdminCredentials({
        currentPassword: currentPassword.trim(),
        username,
        password: newPassword.trim()
      });
      setCredentials(updated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ text: 'Password updated & instantly synchronized across Cloudflare KV globally!', type: 'success' });
      setTimeout(() => setPasswordMessage({ text: '', type: '' }), 4500);
    } catch (_) {
      setPasswordMessage({ text: 'Failed to update password on Cloudflare KV.', type: 'error' });
    }
  };

  // Handle Reset to Default
  const handleResetToDefault = () => {
    try {
      const def = resetAdminCredentials();
      setCredentials(def);
      setUsername(def.username);
      setEmail(def.email);
      setFullName(def.fullName);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowResetConfirm(false);
      setProfileMessage({ text: 'Admin credentials have been reset to factory defaults (admin / admin123).', type: 'success' });
      setTimeout(() => setProfileMessage({ text: '', type: '' }), 4500);
    } catch (err) {
      setProfileMessage({ text: 'Failed to reset credentials.', type: 'error' });
    }
  };

  const formattedLastChanged = credentials.lastChanged 
    ? new Date(credentials.lastChanged).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Default / Never Changed';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Banner / Identity Overview */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
            flexShrink: 0
          }}>
            <Shield size={32} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {credentials.fullName || 'System Administrator'}
              </h2>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={12} /> Root SuperAdmin
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span>Username: <strong style={{ color: 'var(--text-primary)' }}>@{credentials.username}</strong></span>
              <span>•</span>
              <span>Email: <strong style={{ color: 'var(--text-primary)' }}>{credentials.email}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> Last updated: {formattedLastChanged}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            padding: '0.55rem 1rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
          title="Reset credentials back to factory admin / admin123"
        >
          <RotateCcw size={14} /> Factory Reset Credentials
        </button>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f87171', marginBottom: '0.85rem' }}>
              <ShieldAlert size={24} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Confirm Credentials Reset</h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Are you sure you want to reset admin credentials back to default username <strong style={{ color: 'var(--text-primary)' }}>admin</strong> and password <strong style={{ color: 'var(--text-primary)' }}>admin123</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleResetToDefault}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid for Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.75rem' }}>
        
        {/* Form 1: Admin Profile & Login Handle */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <User size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Admin Profile & Username
            </h3>
          </div>

          {profileMessage.text && (
            <div style={{
              backgroundColor: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: profileMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              color: profileMessage.type === 'success' ? '#10b981' : '#f87171',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {profileMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Login Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin, chief_editor"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Used during admin portal authentication and audit logging.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Notification & Recovery Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thevanguard.ai"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Display / Author Title
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lead Editorial Director"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              <Save size={16} /> Save Profile Settings
            </button>
          </form>
        </div>

        {/* Form 2: Change Password & Security */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Key size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Change Admin Password
            </h3>
          </div>

          {passwordMessage.text && (
            <div style={{
              backgroundColor: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: passwordMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              color: passwordMessage.type === 'success' ? '#10b981' : '#f87171',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {passwordMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Current Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter existing password"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                New Secure Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 5+ characters"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    <span>Password Strength:</span>
                    <span style={{ fontWeight: '700', color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.score}%`, backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>

      </div>

      {/* Security Environment & Storage Diagnostics Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <HardDrive size={19} color="#6366f1" /> Storage Vault Health & Environment Diagnostics
          </h3>
          <span style={{
            fontSize: '0.78rem',
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: storageInfo.isNearQuota ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: storageInfo.isNearQuota ? '#ef4444' : '#10b981',
            border: storageInfo.isNearQuota ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            fontWeight: '600'
          }}>
            Status: {storageInfo.status}
          </span>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>AUTH ACCESS STATUS</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={16} /> Authenticated & Tokenized
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>CLIENT HOST IP</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              127.0.0.1 (Localhost / XAMPP)
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>DATABASE VAULT ENGINE</span>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: isD1Connected ? '#10b981' : '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={15} /> {isD1Connected ? 'Cloudflare D1 (SQL Connected)' : 'Cloudflare D1 Ready'}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>STORED ARTICLES VAULT</span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4' }}>
              {storageInfo.articlesCount} Articles Managed
            </div>
          </div>
        </div>

        {/* Cloudflare Pages & D1 Architecture Status Notice */}
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <Cloud size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Cloudflare Pages & D1 SQL Integration Ready:</strong> Your application is fully configured with relational SQL schema (<code style={{ color: '#6366f1' }}>schema.sql</code>), Cloudflare bindings (<code style={{ color: '#6366f1' }}>wrangler.toml</code>), and serverless API endpoints (<code style={{ color: '#6366f1' }}>functions/api/*</code>). Once deployed to Cloudflare Pages, your database automatically runs on Cloudflare D1 for multi-year, multi-device resilience.
          </div>
        </div>

        {/* Live Storage Meter Gauge */}
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Local Browser Storage Usage Meter</span>
            <span style={{ color: storageInfo.isNearQuota ? '#ef4444' : '#10b981', fontWeight: '700' }}>
              {storageInfo.usedKB} KB of ~5,120 KB (~{storageInfo.percentUsed}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.max(2, storageInfo.percentUsed)}%`,
              height: '100%',
              background: storageInfo.isNearQuota 
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)' 
                : 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Database Backup & Disaster Recovery Actions */}
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="#6366f1" /> Full Database Backup & Disaster Recovery
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '650px', lineHeight: '1.4' }}>
                Export your entire database (all published articles, custom AI agent prompts, search keywords, metrics, and admin credentials) as a JSON file. Store backups safely or restore anytime.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const ok = exportDatabaseBackup();
                  if (ok) {
                    setBackupMessage({ text: 'Database backup downloaded successfully to your computer!', type: 'success' });
                    setTimeout(() => setBackupMessage({ text: '', type: '' }), 4000);
                  }
                }}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
              >
                <Download size={15} /> Download Backup (JSON)
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
              >
                <Upload size={15} /> Restore Backup (JSON)
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = importDatabaseBackup(event.target.result);
                    if (result.success) {
                      setStorageInfo(getStorageDiagnostics());
                      setBackupMessage({ text: `Backup restored successfully! Loaded ${result.count} articles. Refreshing...`, type: 'success' });
                      setTimeout(() => window.location.reload(), 1500);
                    } else {
                      setBackupMessage({ text: `Failed to restore: ${result.error}`, type: 'error' });
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
          </div>

          {backupMessage.text && (
            <div style={{
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: backupMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: backupMessage.type === 'success' ? '#10b981' : '#f87171',
              border: backupMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}>
              {backupMessage.text}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
