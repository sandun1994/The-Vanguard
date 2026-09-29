import React, { useState, useEffect } from 'react';
import { Shield, Lock, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { verifyAdminCredentials, getAdminCredentials } from '../../services/storage';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentCreds = getAdminCredentials();
      setUsername(currentCreds.username || 'admin');
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await verifyAdminCredentials(username, password);
      if (result.success) {
        onLoginSuccess();
        setError('');
      } else {
        setError(result.message || 'Invalid admin username or password.');
      }
    } catch (err) {
      setError('Serverless authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        margin: 'auto',
        padding: '2.25rem 2rem',
        borderRadius: '20px',
        border: '1px solid var(--border-glow)',
        backgroundColor: '#0f172a',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={16} />
        </button>

        {/* Portal Header Crest */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
            border: '2px solid rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.35)',
            position: 'relative'
          }}>
            <Shield size={28} color="#818cf8" strokeWidth={2.2} />
            <span style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'white', marginBottom: '0.35rem' }}>
            Admin Security Portal
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Enter authorized credentials to access platform governance and agent pipelines.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            color: '#f87171',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.15rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              autoFocus
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem', opacity: isSubmitting ? 0.7 : 1 }}>
            <Lock size={16} /> {isSubmitting ? 'Authenticating via Cloudflare Worker...' : 'Authenticate Admin Session'}
          </button>
        </form>

      </div>
    </div>
  );
};
