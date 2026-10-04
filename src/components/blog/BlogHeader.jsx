import React from 'react';
import { Sparkles, Shield, ShieldCheck, Search, Sun, Moon, LayoutGrid, List, PlusCircle, LogIn, LogOut, X } from 'lucide-react';
import { CATEGORIES, VIEW_MODES } from '../../types/blog';

export const BlogHeader = ({
  siteName = 'THE VANGUARD',
  siteTagline = 'JOURNAL OF DISCOVERY',
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogout,
  theme,
  onToggleTheme,
  viewMode,
  onToggleViewMode,
  onOpenSubmitModal
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      width: '100%'
    }}>
      {/* Main Header Container */}
      <div className="header-nav-container">
        {/* Top Row on Mobile / Left Section on Desktop */}
        <div className="header-top-row">
          {/* Logo & Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => onSelectCategory('All')}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              flexShrink: 0
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {siteName}
              </h1>
              <span className="gradient-text" style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px', lineHeight: 1 }}>
                {siteTagline}
              </span>
            </div>
          </div>

          {/* Quick Actions (Right corner on desktop, and top-right on mobile) */}
          <div className="header-actions-group">
            {/* View Mode Switcher */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9px',
              padding: '2px',
              flexShrink: 0
            }}>
              <button
                onClick={() => onToggleViewMode(VIEW_MODES.CARDS)}
                style={{
                  padding: '5px 8px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === VIEW_MODES.CARDS ? '#6366f1' : 'transparent',
                  color: viewMode === VIEW_MODES.CARDS ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Cards View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => onToggleViewMode(VIEW_MODES.FARK_LIST)}
                style={{
                  padding: '5px 8px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === VIEW_MODES.FARK_LIST ? '#6366f1' : 'transparent',
                  color: viewMode === VIEW_MODES.FARK_LIST ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Compact List View"
              >
                <List size={15} />
              </button>
            </div>

            {/* Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              style={{ padding: '0.45rem', borderRadius: '8px' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
            </button>

            {/* Admin Auth Button */}
            {isAdminLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={onOpenAdmin}
                  className="btn-primary"
                  title="Return to Admin Dashboard"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Logout Admin"
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e',
                      padding: '0.45rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="btn-primary"
                title="Admin Login"
                style={{
                  padding: '0.45rem 0.8rem',
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Submit Story Row */}
        <div className="header-search-wrapper">
          {/* Search Input Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search AI, Quantum, CRISPR..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.55rem 2rem 0.55rem 2.2rem',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Submit Story CTA */}
          <button
            onClick={onOpenSubmitModal}
            className="btn-secondary"
            style={{
              fontSize: '0.8rem',
              padding: '0.52rem 0.85rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <PlusCircle size={14} color="#6366f1" />
            <span>Submit Story</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar with Smooth Touch Scrolling */}
      <div
        className="no-scrollbar"
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 1rem 0.65rem 1rem',
          display: 'flex',
          gap: '0.45rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#6366f1' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </header>
  );
};
