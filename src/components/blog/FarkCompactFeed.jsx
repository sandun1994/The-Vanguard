import React from 'react';
import { MessageSquare, Flame, Bookmark, ExternalLink, BookOpen, Calendar, PlusCircle, Sparkles } from 'lucide-react';

export const FarkCompactFeed = ({
  articles,
  onSelectArticle,
  onToggleUpvote,
  onToggleBookmark,
  onOpenComments,
  onOpenSubmitModal
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Stories Found in This View</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Try selecting a different filter or submit a new link/topic trigger.
        </p>
      </div>
    );
  }

  // Group articles by dateGroup
  const grouped = articles.reduce((acc, art) => {
    const group = art.dateGroup || 'Recent Stories';
    if (!acc[group]) acc[group] = [];
    acc[group].push(art);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Fark-style "Submit a Link »" Center Banner */}
      <div style={{
        textAlign: 'center',
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#6366f1' }}>
          Submit a Link »
        </span>
        <button
          onClick={onOpenSubmitModal}
          className="btn-primary"
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}
        >
          <PlusCircle size={14} /> Submit Query
        </button>
      </div>

      {Object.entries(grouped).map(([dateGroup, items]) => (
        <div key={dateGroup} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {/* Timeline Date Banner Header (Fark style) */}
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6366f1',
            fontWeight: '800',
            fontSize: '0.9rem'
          }}>
            <Calendar size={16} />
            <span>{dateGroup}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {items.length} Stories Aggregated
            </span>
          </div>

          {/* Fark Compact Item Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((article, idx) => (
              <div
                key={article.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.9rem 1.25rem',
                  borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s',
                  flexWrap: 'wrap'
                }}
                className="fark-row-hover"
              >
                {/* Publisher Logo / Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }} title={article.publisher?.name || 'Publisher'}>
                  {article.publisher?.icon || '🌐'}
                </div>

                {/* Fark Tag Badge (e.g., [BREAKTHROUGH], [QUANTUM]) */}
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {article.farkBadge || '[NEWS]'}
                </span>

                {/* Main Headline & Excerpt Link */}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div
                    onClick={() => onSelectArticle(article)}
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      lineHeight: 1.35,
                      textDecoration: 'none'
                    }}
                  >
                    "{article.title}"
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {article.summary}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: '600', color: '#6366f1' }}>{article.publisher?.name || 'Tech Journal'}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>
                </div>

                {/* Action Buttons: Upvote, Bookmark, Comments */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: 'auto' }}>
                  {/* Upvote Pill */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleUpvote(article.id); }}
                    style={{
                      backgroundColor: article.isUpvoted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: article.isUpvoted ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                      color: article.isUpvoted ? '#f59e0b' : 'var(--text-secondary)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Flame size={14} fill={article.isUpvoted ? '#f59e0b' : 'none'} />
                    {article.upvotes || 0}
                  </button>

                  {/* Comments Trigger */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenComments(article); }}
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      color: '#6366f1',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageSquare size={13} />
                    {article.comments?.length || 0}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id); }}
                    style={{
                      backgroundColor: article.isBookmarked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: article.isBookmarked ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                      color: article.isBookmarked ? '#6366f1' : 'var(--text-muted)',
                      padding: '5px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}
                    title={article.isBookmarked ? 'Remove Bookmark' : 'Save to Reading List'}
                  >
                    <Bookmark size={14} fill={article.isBookmarked ? '#6366f1' : 'none'} />
                  </button>

                  {/* Read Article Trigger */}
                  <button
                    onClick={() => onSelectArticle(article)}
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#6366f1',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Read <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
