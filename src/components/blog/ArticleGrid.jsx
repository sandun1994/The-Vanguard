import React from 'react';
import { Clock, ArrowRight, BookOpen, ShieldCheck, Flame, Bookmark, MessageSquare, Eye } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';

export const ArticleGrid = ({
  articles,
  onSelectArticle,
  onToggleUpvote,
  onToggleBookmark,
  onOpenComments,
  onOpenSubmitModal,
  onOpenAuthorModal
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        margin: '2rem 0'
      }}>
        <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Published Articles Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Try selecting a different category or search term, or trigger a new discovery run from the Admin Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '1.75rem',
      margin: '2rem 0'
    }}>
      {articles.map((article) => (
        <div
          key={article.id}
          className="glass-panel glass-panel-hover"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Card Cover Image */}
          <div
            onClick={() => onSelectArticle(article)}
            style={{ position: 'relative', height: '200px', overflow: 'hidden', cursor: 'pointer' }}
          >
            <img
              src={article.coverImage}
              alt={article.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              display: 'flex',
              gap: '0.4rem'
            }}>
              <CategoryBadge category={article.category} />
              {article.farkBadge && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.25)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(99, 102, 241, 0.4)'
                }}>
                  {article.farkBadge}
                </span>
              )}
            </div>

            {article.sources && article.sources.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                right: '0.75rem',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                backdropFilter: 'blur(6px)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}>
                <ShieldCheck size={12} /> {article.sources.length} Sources
              </div>
            )}
          </div>

          {/* Card Body */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span
                onClick={(e) => { e.stopPropagation(); if (onOpenAuthorModal) onOpenAuthorModal(article.author); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}
                title="Click to view Sandun Hewawasam Author Bio"
              >
                <BookOpen size={13} /> {article.author || 'Sandun Hewawasam, Senior Tech Editor'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> {article.readTime}
              </span>
            </div>

            <h3
              onClick={() => onSelectArticle(article)}
              style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                lineHeight: 1.35,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {article.title}
            </h3>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1
            }}>
              {article.summary}
            </p>

            {/* Aggregator Action Bar (Upvotes, Comments, Bookmark) */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.85rem',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                <button
                  onClick={(e) => { e.stopPropagation(); onOpenComments(article); }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '4px 9px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={13} />
                  {article.comments?.length || 0}
                </button>

                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: '600'
                }}>
                  <Eye size={13} color="#6366f1" />
                  {(article.views || 0).toLocaleString()}
                </span>

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
              </div>

              <div
                onClick={() => onSelectArticle(article)}
                style={{
                  color: '#6366f1',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span>Read</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
