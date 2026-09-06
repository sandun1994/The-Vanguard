import React, { useState, useEffect } from 'react';
import {
  getArticles,
  saveArticle,
  deleteArticle,
  updateArticleStatus,
  getSettings,
  saveSettings,
  getMetrics,
  getAuthStatus,
  setAuthStatus,
  toggleUpvote,
  toggleBookmark,
  addComment,
  recordPageView
} from './services/storage';
import { ARTICLE_STATUS, VIEW_MODES } from './types/blog';

import { BlogHeader } from './components/blog/BlogHeader';
import { HeroArticle } from './components/blog/HeroArticle';
import { ArticleGrid } from './components/blog/ArticleGrid';
import { FarkCompactFeed } from './components/blog/FarkCompactFeed';
import { SidebarWidgets } from './components/blog/SidebarWidgets';
import { ArticleDetailModal } from './components/blog/ArticleDetailModal';
import { CommentsDrawer } from './components/blog/CommentsDrawer';
import { SubmitLinkModal } from './components/blog/SubmitLinkModal';
import { LegalPagesModal } from './components/common/LegalPagesModal';
import { AuthorProfileModal } from './components/common/AuthorProfileModal';
import { AdSlot } from './components/common/AdSlot';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export function App() {
  // Global State
  const [articles, setArticles] = useState([]);
  const [settings, setSettingsState] = useState({});
  const [metrics, setMetricsState] = useState({});
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('novum_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Feed View Mode ('cards' | 'fark_list')
  const [feedViewMode, setFeedViewMode] = useState(() => {
    try {
      return localStorage.getItem('novum_feed_view') || VIEW_MODES.CARDS;
    } catch (e) {
      return VIEW_MODES.CARDS;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('novum_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Dynamic Site Document Title
  useEffect(() => {
    document.title = `${settings.siteName || 'THE VANGUARD'} ${settings.siteTagline || 'JOURNAL OF DISCOVERY'} | Daily Tech & Science Intelligence`;
  }, [settings.siteName, settings.siteTagline]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleFeedView = (mode) => {
    setFeedViewMode(mode);
    try {
      localStorage.setItem('novum_feed_view', mode);
    } catch (e) {
      console.error(e);
    }
  };

  // View Navigation & Modals State
  const [viewMode, setViewMode] = useState('blog'); // 'blog' | 'admin'
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [commentingArticle, setCommentingArticle] = useState(null);
  const [legalModalTab, setLegalModalTab] = useState(null); // null | 'privacy' | 'terms' | 'about' | 'contact'
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('Sandun Hewawasam');

  const handleOpenAuthorModal = (authorName = 'Sandun Hewawasam') => {
    setSelectedAuthor(authorName);
    setIsAuthorModalOpen(true);
  };

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data from localStorage & record pageview
  useEffect(() => {
    setArticles(getArticles());
    setSettingsState(getSettings());
    setMetricsState(getMetrics());
    setIsAdminLoggedIn(getAuthStatus());
    recordPageView();
  }, []);

  // Filtered published articles for public live blog
  const publishedArticles = articles.filter(a => {
    // Only published posts appear on live blog frontend
    if (a.status !== ARTICLE_STATUS.PUBLISHED) return false;

    // Bookmarks Filter
    if (selectedCategory === 'Bookmarks 🔖' && !a.isBookmarked) return false;

    // Category filter
    if (selectedCategory !== 'All' && selectedCategory !== 'Bookmarks 🔖' && a.category !== selectedCategory) return false;

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = a.title.toLowerCase().includes(q);
      const summaryMatch = a.summary.toLowerCase().includes(q);
      const tagMatch = a.tags && a.tags.some(t => t.toLowerCase().includes(q));
      const pubMatch = a.publisher && a.publisher.name.toLowerCase().includes(q);
      return titleMatch || summaryMatch || tagMatch || pubMatch;
    }

    return true;
  });

  const featuredArticle = publishedArticles[0];
  const gridArticles = publishedArticles.slice(1);

  // Aggregator Interaction Handlers
  const handleToggleUpvote = (id) => {
    const updated = toggleUpvote(id);
    setArticles(updated);
  };

  const handleToggleBookmark = (id) => {
    const updated = toggleBookmark(id);
    setArticles(updated);
  };

  const handleAddComment = (id, commentText, author) => {
    const updated = addComment(id, commentText, author);
    setArticles(updated);
    // Keep commenting modal updated with new comment
    const updatedArt = updated.find(a => a.id === id);
    if (updatedArt) setCommentingArticle(updatedArt);
  };

  const handleOpenArticle = (art) => {
    if (art && art.id) {
      recordPageView(art.id);
      setArticles(getArticles());
    }
    setSelectedArticle(art);
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setViewMode('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setAuthStatus(true);
    setIsAdminLoggedIn(true);
    setIsAdminModalOpen(false);
    setViewMode('admin');
  };

  const handleAdminLogout = () => {
    setAuthStatus(false);
    setIsAdminLoggedIn(false);
    setViewMode('blog');
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = updateArticleStatus(id, newStatus);
    setArticles(updated);
    setMetricsState(getMetrics());
  };

  const handleSaveArticle = (article) => {
    const updated = saveArticle(article);
    setArticles(updated);
    setMetricsState(getMetrics());
  };

  const handleDeleteArticle = (id) => {
    const updated = deleteArticle(id);
    setArticles(updated);
    setMetricsState(getMetrics());
  };

  const handleSaveSettings = (newSettings) => {
    saveSettings(newSettings);
    setSettingsState(newSettings);
  };

  const handleArticleCreated = (newArticle) => {
    setArticles(getArticles());
    setMetricsState(getMetrics());
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease' }}>
      {/* If Admin view is active, render AdminDashboard */}
      {viewMode === 'admin' ? (
        <AdminDashboard
          articles={articles}
          settings={settings}
          metrics={metrics}
          theme={theme}
          onToggleTheme={toggleTheme}
          onUpdateStatus={handleUpdateStatus}
          onSaveArticle={handleSaveArticle}
          onDeleteArticle={handleDeleteArticle}
          onSaveSettings={handleSaveSettings}
          onArticleCreated={handleArticleCreated}
          onOpenArticle={handleOpenArticle}
          onLogout={handleAdminLogout}
          onBackToBlog={() => setViewMode('blog')}
        />
      ) : (
        /* Otherwise render Live Public Blog */
        <>
          <BlogHeader
            siteName={settings.siteName}
            siteTagline={settings.siteTagline}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAdmin={handleOpenAdmin}
            isAdminLoggedIn={isAdminLoggedIn}
            theme={theme}
            onToggleTheme={toggleTheme}
            viewMode={feedViewMode}
            onToggleViewMode={handleToggleFeedView}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          />

          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem' }}>
            {/* Split layout: Main Feed on Left, Daily.dev Sidebar Widgets on Right */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 340px',
              gap: '2rem',
              marginTop: '1.5rem',
              alignItems: 'start'
            }} className="aggregator-layout">
              {/* Left Column: Feed Content */}
              <div>
                {/* Hero Featured Article (Cards mode only) */}
                {feedViewMode === VIEW_MODES.CARDS && featuredArticle && selectedCategory === 'All' && !searchQuery.trim() && (
                  <HeroArticle
                    article={featuredArticle}
                    onSelectArticle={handleOpenArticle}
                    onOpenAuthorModal={handleOpenAuthorModal}
                  />
                )}

                {/* Render Feed based on View Mode */}
                {feedViewMode === VIEW_MODES.FARK_LIST ? (
                  <FarkCompactFeed
                    articles={publishedArticles}
                    onSelectArticle={handleOpenArticle}
                    onToggleUpvote={handleToggleUpvote}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenComments={(art) => setCommentingArticle(art)}
                    onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  />
                ) : (
                  <ArticleGrid
                    articles={gridArticles.length > 0 && selectedCategory === 'All' && !searchQuery.trim() ? gridArticles : publishedArticles}
                    onSelectArticle={handleOpenArticle}
                    onToggleUpvote={handleToggleUpvote}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenComments={(art) => setCommentingArticle(art)}
                    onOpenAuthorModal={handleOpenAuthorModal}
                  />
                )}
              </div>

              {/* Right Column: Daily.dev Sidebar Widgets & Ad Unit */}
              <div style={{ position: 'sticky', top: '120px' }}>
                <SidebarWidgets
                  articles={publishedArticles}
                  onSelectArticle={handleOpenArticle}
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onSelectCategory={setSelectedCategory}
                />

                {/* Google AdSense Sidebar Banner Unit */}
                <AdSlot type="sidebar" adSlot="5432167890" className="mt-4" />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>
                {settings.siteName || 'TECH PULSE'} {settings.siteTagline || 'NEWS HUB'} • DAILY EDITORIAL & RESEARCH JOURNAL
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Verified Scientific & Technology Newsroom Network • High-Depth Research Synthesis
              </div>

              {/* Mandatory Legal & E-E-A-T Compliance Footer Links */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', margin: '0.5rem 0' }}>
                <button
                  onClick={() => setLegalModalTab('privacy')}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Privacy Policy
                </button>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <button
                  onClick={() => setLegalModalTab('terms')}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Terms of Service
                </button>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <button
                  onClick={() => setLegalModalTab('about')}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  About Us & AI Transparency Policy
                </button>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <button
                  onClick={() => setLegalModalTab('contact')}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Contact Editorial Desk
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                © 2026 Novum Intelligence. All research citations verified against primary domain repositories. Designed for Google AdSense & Google News E-E-A-T Compliance.
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Legal & E-E-A-T Compliance Hub Modal */}
      <LegalPagesModal
        isOpen={Boolean(legalModalTab)}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />

      {/* Admin Login Modal Gate */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Submit Link Modal */}
      <SubmitLinkModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onArticleCreated={handleArticleCreated}
        onOpenArticle={handleOpenArticle}
      />

      {/* Community Comments Drawer */}
      <CommentsDrawer
        article={commentingArticle}
        onClose={() => setCommentingArticle(null)}
        onAddComment={handleAddComment}
      />

      {/* Full Article Reader View */}
      <ArticleDetailModal
        article={selectedArticle}
        allArticles={publishedArticles}
        onClose={() => setSelectedArticle(null)}
        onSelectArticle={handleOpenArticle}
        onOpenAuthorModal={handleOpenAuthorModal}
      />

      {/* Sandun Hewawasam Author Profile & Bio Modal */}
      <AuthorProfileModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        authorName={selectedAuthor}
        articles={publishedArticles}
        onSelectArticle={handleOpenArticle}
      />
    </div>
  );
}

export default App;
