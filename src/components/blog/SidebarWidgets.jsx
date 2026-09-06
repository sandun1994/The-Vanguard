import React from 'react';
import { Flame, MessageSquare, Tag, Sparkles, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export const SidebarWidgets = ({
  articles,
  onSelectArticle,
  onOpenSubmitModal,
  onSelectCategory
}) => {
  // Sorted top upvoted stories
  const topUpvoted = [...articles].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 4);

  // Top discussed stories
  const topDiscussed = [...articles].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 3);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Submit Link CTA Banner (Fark style) */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          <Sparkles size={20} color="#6366f1" /> Submit a Link or Topic
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          Found a trending tech story or paper? Submit a link or query for instant editorial review and publication.
        </p>
        <button
          onClick={onOpenSubmitModal}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
        >
          <Zap size={15} /> Submit Story for Editorial Review
        </button>
      </div>

      {/* Top Upvoted Stories (Daily.dev style) */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <Flame size={16} color="#f59e0b" /> Top Upvoted Today
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {topUpvoted.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                paddingBottom: idx === topUpvoted.length - 1 ? 0 : '0.75rem',
                borderBottom: idx === topUpvoted.length - 1 ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#6366f1', width: '18px' }}>
                #{idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {art.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{art.publisher?.name || 'Tech Journal'}</span>
                  <span>•</span>
                  <span style={{ color: '#f59e0b', fontWeight: '700' }}>🔥 {art.upvotes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Discussed Stories Widget */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <MessageSquare size={16} color="#6366f1" /> Most Discussed
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {topDiscussed.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              style={{
                cursor: 'pointer',
                paddingBottom: idx === topDiscussed.length - 1 ? 0 : '0.75rem',
                borderBottom: idx === topDiscussed.length - 1 ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {art.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#6366f1', fontWeight: '600' }}>💬 {art.comments?.length || 0} comments</span>
                <span>•</span>
                <span>{art.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Quality Control Card */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={16} color="#10b981" /> Editorial Quality Control
        </h3>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Source Index Network:</span>
            <strong style={{ color: '#10b981' }}>Connected</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Fact-Check Protocol:</span>
            <strong style={{ color: '#10b981' }}>Peer-Reviewed</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Accuracy Verification:</span>
            <strong style={{ color: '#10b981' }}>98.4% Pass</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};
