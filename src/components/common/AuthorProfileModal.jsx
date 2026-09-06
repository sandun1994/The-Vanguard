import React from 'react';
import { X, CheckCircle2, Mail, Award, BookOpen, ShieldCheck, Globe, ArrowRight, Share2 } from 'lucide-react';

export const AuthorProfileModal = ({ isOpen, onClose, authorName = 'Sandun Hewawasam', articles = [], onSelectArticle }) => {
  if (!isOpen) return null;

  // Filter articles by Sandun Hewawasam (or return all published as default)
  const authorArticles = articles.filter(a => a.status === 'published' && (a.author.includes('Sandun') || a.author.includes(authorName)));
  const displayArticles = authorArticles.length > 0 ? authorArticles : articles.slice(0, 5);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
        >
          <X size={20} />
        </button>

        {/* Header Profile Section */}
        <div style={{
          padding: '2.5rem 2.5rem 1.5rem 2.5rem',
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(0, 0, 0, 0) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '1.75rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          {/* Avatar Image / Graphic */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              SH
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              border: '2px solid var(--bg-card)'
            }}>
              <CheckCircle2 size={16} color="#ffffff" />
            </div>
          </div>

          {/* Author Meta Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Sandun Hewawasam
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={12} /> Verified Editor & Analyst
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#6366f1', fontWeight: '700', margin: '4px 0 0.75rem 0' }}>
              Senior Tech Editor & Lead Research Director
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://linkedin.com/in/sandun-hewawasam"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none'
                }}
              >
                <Globe size={14} color="#0077b5" /> LinkedIn Profile
              </a>
              <a
                href="https://x.com/sandun_hewawasam"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none'
                }}
              >
                <Share2 size={14} color="#1da1f2" /> @sandun_hewawasam
              </a>
              <a
                href="https://orcid.org/0000-0002-1823-9421"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none'
                }}
              >
                <Award size={14} color="#a6ce39" /> ORCID 0000-0002-1823-9421
              </a>
              <a
                href="mailto:sandun@thevanguard.org"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none'
                }}
              >
                <Mail size={14} color="#6366f1" /> Contact Author
              </a>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: '2rem 2.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Biography */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.6rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#6366f1" /> Biography & E-E-A-T Background
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <strong>Sandun Hewawasam</strong> is the Senior Tech Editor and Lead Research Director at <em>The Vanguard</em>. With over 12 years of investigative technology journalism experience, Sandun specializes in deep technical analysis of autonomous multi-agent AI frameworks, room-temperature superconductor materials, in vivo CRISPR gene editing, and quantum simulation architectures.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
              Prior to leading editorial strategy at <em>The Vanguard</em>, Sandun contributed peer-reviewed technical synthesis reports for major technology publications, evaluating preprints from ArXiv, Nature, IEEE Spectrum, and the New England Journal of Medicine. He holds a Master of Science in Computer Science with a specialization in Machine Intelligence.
            </p>
          </div>

          {/* Editorial Principles */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#6366f1' }}>
              🎯 Editorial Mission Statement
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              "Our mission is to bridge the gap between frontier academic research and public understanding. Every report authored under my editorial supervision undergoes strict multi-source verification, comparative data mapping, and transparent Domain Authority (DA 80+) primary source citation."
            </p>
          </div>

          {/* Published Articles List */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="#10b981" /> Featured Published Reports by Sandun Hewawasam ({displayArticles.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {displayArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    if (onSelectArticle) onSelectArticle(art);
                    onClose();
                  }}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {art.category} • {art.readTime}
                    </div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {art.title}
                    </h5>
                  </div>
                  <button style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    border: 'none',
                    color: '#6366f1',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}>
                    Read <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
