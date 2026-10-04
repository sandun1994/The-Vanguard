import React, { useState } from 'react';
import { Shield, Layers, Play, Settings, Activity, LogOut, ArrowLeft, Bot, FileText, CheckCircle2, Zap, Sun, Moon, KeyRound, UserCheck, Flame } from 'lucide-react';
import { ContentQueueManager } from './ContentQueueManager';
import { PipelineRunner } from './PipelineRunner';
import { AgentSettings } from './AgentSettings';
import { MetricsAnalytics } from './MetricsAnalytics';
import { AdminAccountManager } from './AdminAccountManager';
import { TrendKeywordRadar } from './TrendKeywordRadar';
import { AutonomousNewsroomBanner } from './AutonomousNewsroomBanner';
import { ARTICLE_STATUS } from '../../types/blog';

export const AdminDashboard = ({
  articles,
  settings,
  metrics,
  theme,
  onToggleTheme,
  onUpdateStatus,
  onSaveArticle,
  onDeleteArticle,
  onSaveSettings,
  onArticleCreated,
  onOpenArticle,
  onLogout,
  onBackToBlog
}) => {
  const [activeView, setActiveView] = useState('queue'); // 'queue' | 'trends' | 'runner' | 'settings' | 'metrics' | 'account'
  const [selectedTrendForPipeline, setSelectedTrendForPipeline] = useState(null);

  const pendingCount = articles.filter(a => a.status === ARTICLE_STATUS.PENDING_REVIEW).length;
  const publishedCount = articles.filter(a => a.status === ARTICLE_STATUS.PUBLISHED).length;

  const handleTriggerPipelineFromTrend = (trend) => {
    setSelectedTrendForPipeline(trend);
    setActiveView('runner');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease' }}>
      {/* Top Navigation Shell Header - Full Width */}
      <header style={{
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        width: '100%'
      }}>
        <div className="admin-header-main" style={{
          width: '100%',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxSizing: 'border-box'
        }}>
          {/* Left Brand & Back to Blog */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBackToBlog}
              style={{
                backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ArrowLeft size={14} /> Live Blog
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={18} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  ADMIN <span className="gradient-text">CONTROL BOARD</span>
                </h1>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Platform Governance & Agent Pipeline
                </span>
              </div>
            </div>
          </div>

          {/* Right Corner Group - Autonomous Badge, Theme Switcher, Logout */}
          <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: settings.governanceMode === 'autonomous' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: settings.governanceMode === 'autonomous' ? '#10b981' : '#f59e0b',
              border: settings.governanceMode === 'autonomous' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}>
              <Zap size={12} /> {settings.governanceMode === 'autonomous' ? 'Autonomous Mode' : 'Manual Review'}
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              style={{ padding: '0.45rem', borderRadius: '8px' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
            </button>

            {/* Admin Account & Security Shortcut */}
            <button
              onClick={() => setActiveView('account')}
              style={{
                backgroundColor: activeView === 'account' ? 'rgba(99, 102, 241, 0.18)' : (theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'),
                border: activeView === 'account' ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                color: activeView === 'account' ? '#6366f1' : 'var(--text-secondary)',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
              title="Admin Credentials & Security"
            >
              <KeyRound size={14} /> Password
            </button>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* View Tabs - Full Width with Horizontal Touch Scroll */}
        <div className="admin-tabs-bar no-scrollbar" style={{
          width: '100%',
          padding: '0 1.25rem',
          display: 'flex',
          gap: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'queue', label: 'Content Queue', icon: Layers, count: pendingCount ? `${pendingCount} Pending` : null },
            { id: 'trends', label: 'Google Keyword Radar', icon: Flame, isBreakout: true },
            { id: 'runner', label: 'Article Writer', icon: Play },
            { id: 'settings', label: 'Governance & Settings', icon: Settings },
            { id: 'metrics', label: 'Visitor Analytics', icon: Activity },
            { id: 'account', label: 'Security & Backup', icon: KeyRound }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  padding: '0.75rem 0',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#6366f1' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={15} color={isActive ? '#6366f1' : 'var(--text-muted)'} />
                {tab.label}
                {tab.count && (
                  <span style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    fontWeight: '700'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="main-content-padding" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.75rem 1.25rem' }}>
        <AutonomousNewsroomBanner
          governanceMode={settings.governanceMode}
          settings={settings}
          onSaveSettings={onSaveSettings}
          onOpenArticle={onOpenArticle}
          onGoToSettings={() => {
            setActiveView('settings');
            setTimeout(() => {
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }, 60);
          }}
        />
        {activeView === 'queue' && (
          <ContentQueueManager
            articles={articles}
            onUpdateStatus={onUpdateStatus}
            onSaveArticle={onSaveArticle}
            onDeleteArticle={onDeleteArticle}
            onOpenArticle={onOpenArticle}
            onTriggerPipeline={() => setActiveView('runner')}
          />
        )}

        {activeView === 'trends' && (
          <TrendKeywordRadar
            onTriggerPipelineWithTrend={handleTriggerPipelineFromTrend}
          />
        )}

        {activeView === 'runner' && (
          <PipelineRunner
            topics={settings.topics}
            onArticleCreated={onArticleCreated}
            onOpenArticle={onOpenArticle}
            initialTrend={selectedTrendForPipeline}
            onOpenTrendsRadar={() => setActiveView('trends')}
          />
        )}

        {activeView === 'settings' && (
          <AgentSettings
            settings={settings}
            onSaveSettings={onSaveSettings}
          />
        )}

        {activeView === 'metrics' && (
          <MetricsAnalytics
            metrics={metrics}
            articlesCount={articles.length}
            articles={articles}
            onOpenArticle={onOpenArticle}
          />
        )}

        {activeView === 'account' && (
          <AdminAccountManager onLogout={onLogout} />
        )}
      </main>
    </div>
  );
};
