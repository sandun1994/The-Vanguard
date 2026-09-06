import React, { useState } from 'react';
import { Shield, Layers, Play, Settings, Activity, LogOut, ArrowLeft, Bot, FileText, CheckCircle2, Zap, Sun, Moon } from 'lucide-react';
import { ContentQueueManager } from './ContentQueueManager';
import { PipelineRunner } from './PipelineRunner';
import { AgentSettings } from './AgentSettings';
import { MetricsAnalytics } from './MetricsAnalytics';
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
  const [activeView, setActiveView] = useState('queue'); // 'queue' | 'runner' | 'settings' | 'metrics'

  const pendingCount = articles.filter(a => a.status === ARTICLE_STATUS.PENDING_REVIEW).length;
  const publishedCount = articles.filter(a => a.status === ARTICLE_STATUS.PUBLISHED).length;

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
        <div style={{
          width: '100%',
          padding: '0.85rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Left Brand & Back to Blog */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <button
              onClick={onBackToBlog}
              style={{
                backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ArrowLeft size={15} /> Live Blog View
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  ADMIN <span className="gradient-text">CONTROL BOARD</span>
                </h1>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Platform Governance & Agent Pipeline Management
                </span>
              </div>
            </div>
          </div>

          {/* Right Corner Group - Autonomous Badge, Theme Switcher, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
            <span style={{
              fontSize: '0.78rem',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: settings.governanceMode === 'autonomous' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: settings.governanceMode === 'autonomous' ? '#10b981' : '#f59e0b',
              border: settings.governanceMode === 'autonomous' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Zap size={13} /> {settings.governanceMode === 'autonomous' ? '100% Autonomous Mode' : 'Manual Review First'}
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
            </button>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: '600'
              }}
            >
              <LogOut size={15} /> Logout Session
            </button>
          </div>
        </div>

        {/* View Tabs - Full Width */}
        <div style={{
          width: '100%',
          padding: '0 2rem',
          display: 'flex',
          gap: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'queue', label: 'Content Queue & Articles', icon: Layers, count: pendingCount ? `${pendingCount} Pending` : null },
            { id: 'runner', label: 'Multi-Agent Pipeline Runner', icon: Play },
            { id: 'settings', label: 'Prompts & Governance Settings', icon: Settings },
            { id: 'metrics', label: 'Visitor Analytics & Traffic Metrics', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  padding: '0.9rem 0',
                  fontSize: '0.88rem',
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
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? '#6366f1' : 'var(--text-muted)'} />
                {tab.label}
                {tab.count && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    padding: '2px 8px',
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
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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

        {activeView === 'runner' && (
          <PipelineRunner
            topics={settings.topics}
            onArticleCreated={onArticleCreated}
            onOpenArticle={onOpenArticle}
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
      </main>
    </div>
  );
};
