import React, { useState } from 'react';
import { ARTICLE_STATUS, CATEGORIES } from '../../types/blog';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Check, Edit, Trash2, Eye, Play, ArrowUpRight, RefreshCw, X, Save } from 'lucide-react';

export const ContentQueueManager = ({
  articles,
  onUpdateStatus,
  onSaveArticle,
  onDeleteArticle,
  onOpenArticle,
  onTriggerPipeline
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [editingArticle, setEditingArticle] = useState(null);

  const filteredArticles = articles.filter(a => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const countByStatus = {
    all: articles.length,
    [ARTICLE_STATUS.PENDING_REVIEW]: articles.filter(a => a.status === ARTICLE_STATUS.PENDING_REVIEW).length,
    [ARTICLE_STATUS.APPROVED]: articles.filter(a => a.status === ARTICLE_STATUS.APPROVED).length,
    [ARTICLE_STATUS.PUBLISHED]: articles.filter(a => a.status === ARTICLE_STATUS.PUBLISHED).length,
    [ARTICLE_STATUS.ARCHIVED]: articles.filter(a => a.status === ARTICLE_STATUS.ARCHIVED).length
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingArticle) {
      onSaveArticle(editingArticle);
      setEditingArticle(null);
    }
  };

  return (
    <div>
      {/* Queue Tabs Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'All Articles' },
            { id: ARTICLE_STATUS.PENDING_REVIEW, label: 'Pending Review' },
            { id: ARTICLE_STATUS.APPROVED, label: 'Approved' },
            { id: ARTICLE_STATUS.PUBLISHED, label: 'Published' },
            { id: ARTICLE_STATUS.ARCHIVED, label: 'Archived' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeTab === tab.id ? '600' : '500',
                backgroundColor: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-main)',
                color: activeTab === tab.id ? '#6366f1' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.label}
              <span style={{
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: activeTab === tab.id ? 'rgba(99, 102, 241, 0.4)' : 'rgba(120, 120, 120, 0.15)',
                color: activeTab === tab.id ? '#6366f1' : 'var(--text-primary)'
              }}>
                {countByStatus[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onTriggerPipeline}
          className="btn-primary"
          style={{ fontSize: '0.82rem' }}
        >
          <Play size={15} /> Trigger Agent Discovery Run
        </button>
      </div>

      {/* Queue Table Container */}
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.85rem 1.25rem' }}>Article Details</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Reads (Views)</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Metrics (Tokens / Cost)</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Date</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No articles found in this queue state.
                </td>
              </tr>
            ) : (
              filteredArticles.map(article => (
                <tr key={article.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.25rem', maxWidth: '320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={article.coverImage}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {article.id} • {article.sources?.length || 0} Sources
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <CategoryBadge category={article.category} />
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <StatusBadge status={article.status} />
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: '700', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} color="#6366f1" /> {(article.views || 0).toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>reads</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {(article.uniqueReaders || 0).toLocaleString()} readers
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    <div>{article.metrics?.tokensUsed || '3,420'} tokens</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>${article.metrics?.cost?.toFixed(4) || '0.0102'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* Status Change Toggles */}
                      {article.status === ARTICLE_STATUS.PENDING_REVIEW && (
                        <button
                          title="Publish Immediately"
                          onClick={() => onUpdateStatus(article.id, ARTICLE_STATUS.PUBLISHED)}
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#10b981',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Check size={13} /> Publish
                        </button>
                      )}

                      {article.status === ARTICLE_STATUS.APPROVED && (
                        <button
                          title="Publish Approved Post"
                          onClick={() => onUpdateStatus(article.id, ARTICLE_STATUS.PUBLISHED)}
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#10b981',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          Publish
                        </button>
                      )}

                      {article.status === ARTICLE_STATUS.PUBLISHED && (
                        <button
                          title="Unpublish to Archive"
                          onClick={() => onUpdateStatus(article.id, ARTICLE_STATUS.ARCHIVED)}
                          style={{
                            backgroundColor: 'rgba(107, 114, 128, 0.15)',
                            border: '1px solid rgba(107, 114, 128, 0.3)',
                            color: 'var(--text-muted)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Archive
                        </button>
                      )}

                      {/* Edit Modal Button */}
                      <button
                        title="Edit Article Details"
                        onClick={() => setEditingArticle(article)}
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={14} />
                      </button>

                      {/* Preview Button */}
                      <button
                        title="Preview Article"
                        onClick={() => onOpenArticle(article)}
                        style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#6366f1',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={14} />
                      </button>

                      {/* Delete Button */}
                      <button
                        title="Delete Article"
                        onClick={() => onDeleteArticle(article.id)}
                        style={{
                          backgroundColor: 'rgba(244, 63, 94, 0.15)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#f87171',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Article Modal */}
      {editingArticle && (
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
          justify: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '680px',
            width: '100%',
            margin: 'auto',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            color: 'var(--text-primary)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Edit Article Content & Governance State
              </h3>
              <button onClick={() => setEditingArticle(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Title</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)' }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Status</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value })}
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)' }}
                  >
                    <option value={ARTICLE_STATUS.PENDING_REVIEW}>Pending Review</option>
                    <option value={ARTICLE_STATUS.APPROVED}>Approved</option>
                    <option value={ARTICLE_STATUS.PUBLISHED}>Published</option>
                    <option value={ARTICLE_STATUS.ARCHIVED}>Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Summary</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Article Content (Markdown)</label>
                <textarea
                  rows={6}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingArticle(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
