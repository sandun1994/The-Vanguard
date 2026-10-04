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
      {/* DESKTOP HEADER (Single sleek horizontal bar for screens > 868px) */}
      <div className="header-desktop-bar">
        {/* Left: Brand Logo & Tagline */}
        <div
          className="header-left-brand"
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
            <span style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {siteName}
            </span>
            <span className="gradient-text" style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px', lineHeight: 1 }}>
              {siteTagline}
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="header-search-center">
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search AI, Quantum, CRISPR, Robotics..."
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

        {/* Right: Actions in a clean, perfectly aligned flex row */}
        <div className="header-actions-right">
          {/* Submit Story CTA */}
          <button
            onClick={onOpenSubmitModal}
            className="btn-secondary"
            style={{
              fontSize: '0.82rem',
              padding: '0.52rem 0.95rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={15} color="#6366f1" />
            <span>Submit Story</span>
          </button>

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
                  padding: '0.45rem 0.85rem',
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
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
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

      {/* MOBILE HEADER (Two clean rows for screens <= 868px) */}
      <div className="header-mobile-container">
        {/* Mobile Row 1: Brand on left, Action buttons on right */}
        <div className="header-mobile-top">
          {/* Logo & Brand */}
          <div
            className="header-left-brand"
            onClick={() => onSelectCategory('All')}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              flexShrink: 0
            }}>
              <Sparkles size={16} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {siteName}
              </span>
              <span className="gradient-text" style={{ fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1px', lineHeight: 1 }}>
                {siteTagline}
              </span>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => onToggleViewMode(viewMode === VIEW_MODES.CARDS ? VIEW_MODES.FARK_LIST : VIEW_MODES.CARDS)}
              className="theme-toggle-btn"
              style={{ padding: '0.4rem', borderRadius: '8px' }}
              title="Toggle View Mode"
            >
              {viewMode === VIEW_MODES.CARDS ? <LayoutGrid size={15} color="#6366f1" /> : <List size={15} color="#6366f1" />}
            </button>

            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              style={{ padding: '0.4rem', borderRadius: '8px' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            </button>

            <button
              onClick={onOpenAdmin}
              className="btn-primary"
              style={{
                padding: '0.4rem 0.65rem',
                fontSize: '0.78rem',
                background: isAdminLoggedIn ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              {isAdminLoggedIn ? <ShieldCheck size={13} /> : <LogIn size={13} />}
              <span>{isAdminLoggedIn ? 'Admin' : 'Login'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Row 2: Full-width search bar + Submit icon/btn */}
        <div className="header-mobile-search-row">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search AI, Quantum, CRISPR..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.45rem 1.8rem 0.45rem 2rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '8px',
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
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="btn-secondary"
            style={{
              padding: '0.45rem 0.65rem',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <PlusCircle size={13} color="#6366f1" />
            <span>Submit</span>
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
