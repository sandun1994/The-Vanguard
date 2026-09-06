import React from 'react';
import { Clock, ArrowRight, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';

export const HeroArticle = ({ article, onSelectArticle, onOpenAuthorModal }) => {
  if (!article) return null;

  return (
    <div
      onClick={() => onSelectArticle(article)}
      className="glass-panel glass-panel-hover"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border-glow)',
        backgroundColor: 'var(--bg-card)',
        margin: '2rem 0'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center'
      }}>
        {/* Left Column: Image */}
        <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
          <img
            src={article.coverImage}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent)'
          }} />
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <CategoryBadge category={article.category} />
            <span style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={13} /> Verified Sources ({article.sources?.length || 0})
            </span>
          </div>
        </div>

        {/* Right Column: Details */}
        <div style={{ padding: '2.2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span
              onClick={(e) => { e.stopPropagation(); if (onOpenAuthorModal) onOpenAuthorModal(article.author); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}
              title="Click to view Sandun Hewawasam Author Profile & Bio"
            >
              <BookOpen size={15} /> {article.author || 'Sandun Hewawasam, Senior Tech Editor'}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {article.readTime}
            </span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.25, color: 'var(--text-primary)' }}>
            {article.title}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {article.summary}
          </p>

          {/* Key Takeaway Snippet */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderLeft: '3px solid var(--color-accent-indigo)',
              padding: '0.75rem 1rem',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.85rem',
              color: 'var(--text-primary)'
            }}>
              <strong style={{ color: '#6366f1', display: 'block', marginBottom: '4px' }}>Executive Summary Insight:</strong>
              {article.keyTakeaways[0]}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginTop: '0.5rem' }}>
            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
              Read Research Report <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
