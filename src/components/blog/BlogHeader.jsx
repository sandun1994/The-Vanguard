import React from 'react';
import { Sparkles, Shield, Search, Sun, Moon, LayoutGrid, List, PlusCircle, LogIn } from 'lucide-react';
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
      {/* Main Header Nav */}
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Left: Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => onSelectCategory('All')}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {siteName}
            </h1>
            <span className="gradient-text" style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px', lineHeight: 1 }}>
              {siteTagline}
            </span>
          </div>
        </div>

        {/* Center: Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '650px', minWidth: '280px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search AI, Quantum, CRISPR articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem 0.6rem 2.5rem',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          {/* Submit Link CTA */}
          <button
            onClick={onOpenSubmitModal}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.55rem 0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <PlusCircle size={15} color="#6366f1" /> Submit Story
          </button>

          {/* View Mode Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '3px',
            flexShrink: 0
          }}>
            <button
              onClick={() => onToggleViewMode(VIEW_MODES.CARDS)}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                backgroundColor: viewMode === VIEW_MODES.CARDS ? '#6366f1' : 'transparent',
                color: viewMode === VIEW_MODES.CARDS ? 'white' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
              title="Daily.dev Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onToggleViewMode(VIEW_MODES.FARK_LIST)}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                backgroundColor: viewMode === VIEW_MODES.FARK_LIST ? '#6366f1' : 'transparent',
                color: viewMode === VIEW_MODES.FARK_LIST ? 'white' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
              title="Fark Compact List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Right: Theme & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button
            onClick={onOpenAdmin}
            className="btn-primary"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
              background: isAdminLoggedIn
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            }}
          >
            {isAdminLoggedIn ? <Shield size={16} /> : <LogIn size={16} />}
            {isAdminLoggedIn ? 'Admin' : 'Login'}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0 1.5rem 0.75rem 1.5rem',
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isActive ? '700' : '500',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#6366f1' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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
