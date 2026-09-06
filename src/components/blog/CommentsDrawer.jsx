import React, { useState } from 'react';
import { X, Send, MessageSquare, Bot, User } from 'lucide-react';

export const CommentsDrawer = ({ article, onClose, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('DevCommunityMember');

  if (!article) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(article.id, commentText.trim(), authorName.trim() || 'DevUser');
      setCommentText('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(3, 7, 18, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        border: '1px solid var(--border-glow)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        overflow: 'hidden'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: 'rgba(99, 102, 241, 0.05)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={18} color="#6366f1" /> Community Discussion
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {article.comments?.length || 0} Comments on "{article.title}"
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!article.comments || article.comments.length === 0) ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No comments yet. Be the first developer to start the discussion!
            </div>
          ) : (
            article.comments.map(c => (
              <div key={c.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>{c.avatar || '💬'}</span> {c.author}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Your Handle / Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={{
                width: '140px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}
            />
            <input
              type="text"
              placeholder="Add your thoughts or research analysis..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              <Send size={14} /> Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
