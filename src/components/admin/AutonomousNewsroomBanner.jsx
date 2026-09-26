import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Clock,
  Check,
  Loader2,
  Play,
  ExternalLink,
  ArrowRight,
  Shield,
  Sparkles,
  Settings
} from 'lucide-react';
import {
  getAutonomousEngineState,
  subscribeAutonomousEngine,
  executeAutonomousNewsroomCycle
} from '../../services/autonomousEngine';

export const AutonomousNewsroomBanner = ({
  governanceMode,
  settings,
  onSaveSettings,
  onOpenArticle,
  onGoToSettings
}) => {
  const [engineState, setEngineState] = useState(getAutonomousEngineState());
  const [isExecutingNow, setIsExecutingNow] = useState(false);
  const [timeRemainingStr, setTimeRemainingStr] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeAutonomousEngine((state) => {
      setEngineState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  // Countdown timer calculation
  useEffect(() => {
    if (governanceMode !== 'autonomous') {
      setTimeRemainingStr('Engine Paused (Manual Mode)');
      return;
    }

    const interval = setInterval(() => {
      if (!engineState.nextRunAt) {
        setTimeRemainingStr('Scheduled');
        return;
      }
      const diffMs = engineState.nextRunAt - Date.now();
      if (diffMs <= 0) {
        setTimeRemainingStr('Scanning Now...');
      } else {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        setTimeRemainingStr(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engineState.nextRunAt, governanceMode]);

  const handleInstantTrigger = async () => {
    setIsExecutingNow(true);
    try {
      await executeAutonomousNewsroomCycle();
    } catch (e) {
      console.error('Instant cycle failed', e);
    } finally {
      setIsExecutingNow(false);
    }
  };

  const isAutonomous = governanceMode === 'autonomous';

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem 1.75rem',
      borderRadius: '16px',
      marginBottom: '1.75rem',
      background: isAutonomous
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(31, 41, 55, 0.5) 100%)',
      border: isAutonomous ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.3)',
      boxShadow: isAutonomous ? '0 8px 30px rgba(16, 185, 129, 0.12)' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        {/* Left Section: Status & Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '13px',
            background: isAutonomous
              ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isAutonomous ? '0 4px 18px rgba(16, 185, 129, 0.4)' : '0 4px 18px rgba(245, 158, 11, 0.3)',
            flexShrink: 0
          }}>
            {engineState.isRunning || isExecutingNow ? (
              <Loader2 size={24} color="white" className="spin-animation" />
            ) : isAutonomous ? (
              <Zap size={24} color="white" />
            ) : (
              <Shield size={24} color="white" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: isAutonomous ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isAutonomous ? '#10b981' : '#f59e0b',
                border: isAutonomous ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {isAutonomous ? 'Autonomous Publishing Active' : 'Manual Review Mode'}
              </span>

              {isAutonomous && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Next Google Trend Auto-Scan: <strong style={{ color: '#38bdf8' }}>{timeRemainingStr}</strong>
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {isAutonomous ? (
                engineState.isRunning || isExecutingNow ? (
                  <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={14} className="spin-animation" /> Autonomous Newsroom Active: Scanning Google Trends, synthesizing & publishing article...
                  </span>
                ) : (
                  <span>
                    Continuously scans Google keyword breakout spikes & automatically writes and publishes articles without human intervention.
                    {engineState.lastPublishedArticle && (
                      <span style={{ display: 'block', marginTop: '0.2rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        Last Auto-Published: <strong style={{ color: 'var(--text-primary)' }}>{engineState.lastPublishedArticle.title}</strong>{' '}
                        <span style={{ color: '#f87171', fontWeight: '700' }}>({engineState.lastPublishedArticle.velocity})</span>
                      </span>
                    )}
                  </span>
                )
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>
                  Auto-publishing is paused. Newly generated articles are routed to the <strong>Content Queue</strong> for manual review first.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {isAutonomous ? (
            <button
              onClick={handleInstantTrigger}
              disabled={engineState.isRunning || isExecutingNow}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                opacity: engineState.isRunning || isExecutingNow ? 0.6 : 1,
                cursor: engineState.isRunning || isExecutingNow ? 'not-allowed' : 'pointer'
              }}
              title="Immediately scans the highest-velocity unpublished Google keyword trend, writes the article through the 5-stage pipeline, and publishes it right now!"
            >
              {engineState.isRunning || isExecutingNow ? (
                <>
                  <Loader2 size={16} className="spin-animation" /> Running Auto-Publish Cycle...
                </>
              ) : (
                <>
                  <Zap size={16} /> Run Instant Auto-Cycle Now
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onSaveSettings({ ...settings, governanceMode: 'autonomous' })}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <Zap size={16} /> Enable Autonomous Mode
            </button>
          )}

          {onGoToSettings && (
            <button
              onClick={onGoToSettings}
              className="btn-secondary"
              style={{ padding: '0.65rem 0.95rem', fontSize: '0.82rem' }}
              title="Configure Autonomous Publishing Frequency & Keywords"
            >
              <Settings size={15} /> Configure
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
