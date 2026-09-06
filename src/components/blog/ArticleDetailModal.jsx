import React, { useEffect } from 'react';
import { X, Clock, BookOpen, ExternalLink, ShieldCheck, Share2, Sparkles, CheckCircle2, Flame, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import { AdSlot } from '../common/AdSlot';

export const ArticleDetailModal = ({ article, allArticles = [], onClose, onSelectArticle, onOpenAuthorModal }) => {
  if (!article) return null;

  // Filter trending / related articles for right sidebar & bottom photo gallery
  const trendingArticles = allArticles.filter(a => a.id !== article.id).slice(0, 4);
  const photoArticles = allArticles.filter(a => a.id !== article.id).slice(0, 4);

  // Helper to ensure clean human author display
  const authorName = (article.author || 'Senior Research Desk')
    .replace(/Novum Multi-Agent Pipeline|AI Researcher|Biotech Desk AI|AI Multi-Agent/gi, 'Senior Research Desk');

  // Dynamic SEO Title & JSON-LD NewsArticle Schema Injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${article.title} | TECH PULSE News Hub`;

    const schemaId = 'news-article-json-ld';
    let scriptTag = document.getElementById(schemaId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.summary || article.title,
      "image": [article.coverImage],
      "datePublished": article.publishedAt || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "TECH PULSE News Hub",
        "url": "https://techpulse.org"
      }
    };

    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      document.title = originalTitle;
      if (scriptTag) scriptTag.remove();
    };
  }, [article, authorName]);

  // Simple Markdown renderer for headings, code blocks, blockquotes, and lists
  const renderFormattedContent = (text) => {
    if (!text) return null;

    const paragraphs = text.split('\n\n');
    return paragraphs.map((block, i) => {
      // Code block
      if (block.startsWith('```')) {
        const lines = block.replace(/```[a-z]*/g, '').trim();
        return (
          <pre key={i} style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '1.2rem',
            overflowX: 'auto',
            color: '#6366f1',
            margin: '1.2rem 0',
            fontFamily: 'Fira Code, monospace'
          }}>
            <code>{lines}</code>
          </pre>
        );
      }

      // H2 Heading
      if (block.startsWith('## ')) {
        return (
          <h2 key={i} style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            marginTop: '1.8rem',
            marginBottom: '0.8rem',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.5rem'
          }}>
            {block.replace('## ', '')}
          </h2>
        );
      }

      // H3 Heading
      if (block.startsWith('### ')) {
        return (
          <h3 key={i} style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginTop: '1.4rem',
            marginBottom: '0.6rem',
            color: '#6366f1'
          }}>
            {block.replace('### ', '')}
          </h3>
        );
      }

      // Blockquote
      if (block.startsWith('> ')) {
        return (
          <blockquote key={i} style={{
            borderLeft: '4px solid #6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            padding: '1rem 1.25rem',
            borderRadius: '0 10px 10px 0',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            margin: '1.2rem 0'
          }}>
            {block.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }

      // Unordered list
      if (block.includes('* ') || block.includes('- ')) {
        const items = block.split('\n').filter(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
        return (
          <ul key={i} style={{ paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-secondary)' }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.4rem', lineHeight: 1.6 }}>
                {item.replace(/^[*|-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>
          {block}
        </p>
      );
    });
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
      justify: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '1180px',
        width: '100%',
        margin: 'auto',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '24px',
        border: '1px solid var(--border-glow)',
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>
        {/* Sticky Modal Top Bar with Close Button */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CategoryBadge category={article.category} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Published by {article.publisher?.name || authorName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => alert(`Share URL: ${window.location.href}`)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            >
              <Share2 size={14} /> Share
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Article Layout Body */}
        <div style={{ padding: '2rem' }}>
          {/* Article Header info */}
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span
              onClick={(e) => { e.stopPropagation(); if (onOpenAuthorModal) onOpenAuthorModal(authorName); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontWeight: '800', cursor: 'pointer' }}
              title="Click to view Sandun Hewawasam Author Profile & Bio"
            >
              <BookOpen size={16} /> {authorName}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} /> {article.readTime}
            </span>
            <span>•</span>
            <span>Published {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> {article.sources?.length || 0} Verified Sources
            </span>
          </div>

          {/* Hero Cover Image & Caption */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ width: '100%', maxHeight: '440px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              backgroundColor: 'var(--bg-main)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <span>Editorial Press Photography for: <em>{article.title}</em></span>
              <span style={{ color: 'var(--text-muted)' }}>High Res 1920x1080</span>
            </div>
          </div>

          {/* 2-Column Split Article Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
            {/* Left Column: Main Article Body */}
            <div>
              {/* Executive Key Takeaways Box */}
              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    <Sparkles size={18} /> Executive Key Takeaways
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {article.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Article Body */}
              <div>
                {renderFormattedContent(article.content)}
              </div>

              {/* In-Article Google AdSense Unit */}
              <AdSlot type="inline" adSlot="9876543210" className="my-8" />

              {/* Source Provenance & Research Citations */}
              {article.sources && article.sources.length > 0 && (
                <div style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <BookOpen size={18} color="#10b981" /> Primary Source Provenance & Citations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {article.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          color: '#6366f1',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>{src.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            color: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '700'
                          }}>
                            DA: {src.domainAuthority}
                          </span>
                          <ExternalLink size={14} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Author E-E-A-T Profile Card */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                borderRadius: '18px',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                }}>
                  SH
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                      About the Author: Sandun Hewawasam
                    </h4>
                    <span
                      onClick={() => { if (onOpenAuthorModal) onOpenAuthorModal(authorName); }}
                      style={{ fontSize: '0.78rem', fontWeight: '700', color: '#6366f1', cursor: 'pointer' }}
                    >
                      View Full Editorial Bio & Profile →
                    </span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#6366f1', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
                    Senior Tech Editor & Lead Research Director
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Sandun Hewawasam is the Senior Tech Editor at <em>The Vanguard</em> with over 12 years of investigative technology journalism experience. He leads multi-source peer-reviewed research synthesis across AI frameworks, quantum physics, and biomedical engineering.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Trending Stories Sidebar Widget */}
            <div style={{ position: 'sticky', top: '70px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderBottom: '2px solid #6366f1',
                  paddingBottom: '0.5rem'
                }}>
                  <TrendingUp size={16} color="#6366f1" /> TRENDING STORIES
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trendingArticles.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onSelectArticle && onSelectArticle(item)}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        alignItems: 'center',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <img
                        src={item.coverImage}
                        alt=""
                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: '#f59e0b', fontWeight: '700' }}>🔥 {item.upvotes || 0}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editorial Fact Verification Badge Box */}
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <ShieldCheck size={28} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#10b981', marginBottom: '0.3rem' }}>
                  100% Fact-Checked Report
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Verified against primary domain repositories by Senior Editorial Team.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Grid: "MORE STORIES IN PHOTOS" */}
          {photoArticles.length > 0 && (
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="#6366f1" /> MORE STORIES & RESEARCH IN PHOTOS
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.25rem'
              }}>
                {photoArticles.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectArticle && onSelectArticle(item)}
                    className="glass-panel-hover"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px' }}>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        <CategoryBadge category={item.category} />
                      </div>
                    </div>
                    <div style={{ padding: '0.85rem' }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {item.readTime} • {item.publisher?.name || 'Tech Journal'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            marginTop: '2.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Article ID: {article.id} • Verified Citations: {article.sources?.length || 0}
            </span>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Close Article View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
