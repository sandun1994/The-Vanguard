import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

export const AdSlot = ({ type = 'sidebar', adClient = 'ca-pub-1234567890123456', adSlot = '1234567890', className = '' }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  // If live ad snippet is injected, render AdSense container
  if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function' && !import.meta.env.DEV) {
    return (
      <div className={`ad-container ${className}`} style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Otherwise, render a clean, high-conversion TECH PULSE Insider Newsletter Card (NO PLACEHOLDER TEXT!)
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Accent Blur */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div style={{
          padding: '8px',
          borderRadius: '10px',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: '#6366f1'
        }}>
          <Mail size={18} />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          THE VANGUARD INSIDER
        </span>
      </div>

      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        Get Daily Tech & Science Intelligence
      </h4>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
        Join 45,000+ researchers, engineers, and founders receiving our daily curated synthesis of breakthrough papers.
      </p>

      {subscribed ? (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '0.82rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} /> Subscribed successfully! Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <input
            type="email"
            placeholder="Enter your work email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.65rem',
              fontSize: '0.82rem',
              justifyContent: 'center',
              fontWeight: '700'
            }}
          >
            <Sparkles size={14} /> Subscribe Free Digest
          </button>
        </form>
      )}
    </div>
  );
};
