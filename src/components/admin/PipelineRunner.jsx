import React, { useState } from 'react';
import { runAgentPipeline } from '../../services/agentPipeline';
import { Play, Sparkles, CheckCircle2, Clock, Terminal, Bot, Zap, ShieldCheck, ArrowRight, Flame, Compass, PenTool, Palette, Check, Loader2 } from 'lucide-react';

export const PipelineRunner = ({ topics = [], onArticleCreated, onOpenArticle, initialTrend = null, onOpenTrendsRadar = null }) => {
  const getTopicLabel = (t) => (typeof t === 'string' ? t : t?.query || '');
  const [selectedTopic, setSelectedTopic] = useState(() => {
    if (initialTrend?.keyword) return initialTrend.keyword;
    if (Array.isArray(topics) && topics.length > 0) {
      return getTopicLabel(topics[0]);
    }
    return 'Latest AI agent architecture breakthroughs 2026';
  });
  const [customQuery, setCustomQuery] = useState(initialTrend?.keyword || '');
  const [activeTrend, setActiveTrend] = useState(initialTrend);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastGeneratedArticle, setLastGeneratedArticle] = useState(null);

  const activeQuery = customQuery.trim() ? customQuery : selectedTopic;

  const handleStartPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    const trendNote = activeTrend ? ` [Google Trend Spike: ${activeTrend.velocity}]` : '';
    setLogs([`[00:00.00] Initializing multi-agent orchestrator for query: "${activeQuery}"${trendNote}`]);
    setLastGeneratedArticle(null);

    try {
      const generatedArticle = await runAgentPipeline(
        activeQuery,
        (stepInfo) => {
          setCurrentStep(stepInfo.step);
          setStepData(stepInfo);
          setLogs(prev => [
            ...prev,
            `[+0.8s] Step ${stepInfo.step}/5: [${stepInfo.agent}] - ${stepInfo.name}`,
            ...stepInfo.log.split('\n').map(line => `  ↳ ${line}`)
          ]);
        },
        activeTrend
      );

      setLogs(prev => [...prev, `[COMPLETE] Article generated successfully with ID ${generatedArticle.id}! Initial status: ${generatedArticle.status}`]);
      setLastGeneratedArticle(generatedArticle);
      onArticleCreated(generatedArticle);
    } catch (e) {
      setLogs(prev => [...prev, `[ERROR] Pipeline execution failed: ${e.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }}>
      {/* Top Configuration Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        {/* Workflow Clarification Banner */}
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.83rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.18)',
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            flexShrink: 0
          }}>✍️</div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Manual On-Demand Generation Mode:</strong> Use this tab to manually craft a single article for any custom topic or keyword. For <strong>100% automated hands-free auto-publishing</strong> from Google Trends, enable <strong>Autonomous Mode</strong> in the top header banner!
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Sparkles size={20} color="#6366f1" /> On-Demand Article Generator & Custom Topic Pipeline
          </h3>
          {onOpenTrendsRadar && (
            <button
              type="button"
              onClick={onOpenTrendsRadar}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Flame size={14} /> Open Google Trend Radar
            </button>
          )}
        </div>

        {activeTrend && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#ef4444', color: 'white', fontWeight: '800' }}>
                  🔥 GOOGLE TREND BREAKOUT
                </span>
                <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: '700' }}>
                  {activeTrend.velocity} ({activeTrend.searchVolume})
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Targeting: <strong>{activeTrend.keyword}</strong> • {activeTrend.subQueries?.length || 4} Long-tail subqueries & {activeTrend.targetQuestions?.length || 3} PAA questions ready
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setActiveTrend(null); setCustomQuery(''); }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear Trend Context
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Select Configured Topic String
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setCustomQuery(''); }}
              disabled={isRunning}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.65rem',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {topics.map((t, idx) => {
                const label = getTopicLabel(t);
                return (
                  <option key={t?.id || idx} value={label}>{label}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Or Enter Custom Search Query
            </label>
            <input
              type="text"
              placeholder="e.g. Breakthroughs in room-temperature fusion..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              disabled={isRunning}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.65rem',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={15} color="#10b981" /> Pipeline mode: <strong>4 Agents (Web Scraping ➔ Researcher ➔ Writer ➔ SEO)</strong>
          </div>
          <button
            onClick={handleStartPipeline}
            disabled={isRunning}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              opacity: isRunning ? 0.6 : 1,
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? (
              <>
                <Zap size={18} className="pulse-dot" /> Executing Pipeline...
              </>
            ) : (
              <>
                <Play size={18} /> Launch Multi-Agent Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stepper */}
      {(isRunning || currentStep > 0) && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#6366f1" /> Live Multi-Agent Pipeline Execution
            </h4>
            <span style={{ fontSize: '0.78rem', color: isRunning ? '#6366f1' : '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {isRunning ? <Loader2 size={13} className="spin-animation" /> : <Check size={13} />}
              {isRunning ? `Active: Step ${currentStep} of 5` : 'Pipeline Run Completed'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
            {[
              {
                num: 1,
                title: 'Discovery',
                agent: 'Web Scraper',
                icon: Compass,
                color: '#06b6d4',
                gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)'
              },
              {
                num: 2,
                title: 'Fact Check',
                agent: 'Researcher',
                icon: ShieldCheck,
                color: '#6366f1',
                gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)'
              },
              {
                num: 3,
                title: 'Writer',
                agent: 'LLM Synthesizer',
                icon: PenTool,
                color: '#a855f7',
                gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)'
              },
              {
                num: 4,
                title: 'SEO Agent',
                agent: 'Metadata Tag',
                icon: Sparkles,
                color: '#f59e0b',
                gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.15) 100%)'
              },
              {
                num: 5,
                title: 'Cover Art',
                agent: 'Image Gen',
                icon: Palette,
                color: '#10b981',
                gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)'
              }
            ].map(stage => {
              const IconComponent = stage.icon;
              const isCompleted = currentStep > stage.num || (currentStep === 5 && !isRunning);
              const isCurrent = currentStep === stage.num && isRunning;

              return (
                <div
                  key={stage.num}
                  style={{
                    backgroundColor: isCurrent
                      ? 'rgba(99, 102, 241, 0.15)'
                      : isCompleted
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrent
                      ? '1.5px solid #6366f1'
                      : isCompleted
                        ? '1.5px solid rgba(16, 185, 129, 0.4)'
                        : '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '1.15rem 0.85rem',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isCurrent ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Distinct Agent Icon Badge with Micro-Indicator */}
                  <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '13px',
                      background: isCompleted
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)'
                        : isCurrent
                          ? stage.gradient
                          : 'rgba(255, 255, 255, 0.05)',
                      border: isCompleted
                        ? '1.5px solid #10b981'
                        : isCurrent
                          ? `1.5px solid ${stage.color}`
                          : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? '#10b981' : isCurrent ? stage.color : 'var(--text-muted)',
                      boxShadow: isCompleted
                        ? '0 4px 14px rgba(16, 185, 129, 0.25)'
                        : isCurrent
                          ? `0 4px 16px ${stage.color}40`
                          : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <IconComponent size={21} />
                    </div>

                    {/* Micro status pin badge on top right corner */}
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      border: '2px solid var(--bg-main)',
                      boxShadow: isCompleted ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none'
                    }}>
                      {isCompleted ? (
                        <Check size={10} strokeWidth={3.5} />
                      ) : isCurrent ? (
                        <Loader2 size={10} className="spin-animation" />
                      ) : (
                        stage.num
                      )}
                    </div>
                  </div>

                  {/* Stage Title */}
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                    {stage.title}
                  </div>

                  {/* Agent Role Subtitle */}
                  <div style={{ fontSize: '0.72rem', color: isCompleted ? '#10b981' : isCurrent ? stage.color : 'var(--text-muted)', fontWeight: '600', marginBottom: '0.65rem' }}>
                    {stage.agent}
                  </div>

                  {/* Status Pill Tag */}
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: isCompleted
                      ? 'rgba(16, 185, 129, 0.16)'
                      : isCurrent
                        ? 'rgba(99, 102, 241, 0.18)'
                        : 'rgba(255, 255, 255, 0.04)',
                    color: isCompleted
                      ? '#10b981'
                      : isCurrent
                        ? '#818cf8'
                        : 'var(--text-muted)',
                    border: isCompleted
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : isCurrent
                        ? '1px solid rgba(99, 102, 241, 0.3)'
                        : '1px solid transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    {isCompleted ? '✓ Completed' : isCurrent ? '⚡ In Progress' : `Step ${stage.num} of 5`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Terminal Log Console */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <Terminal size={14} color="#6366f1" /> Agent Orchestration Event Stream Log:
            </div>
            <div style={{
              backgroundColor: '#070b14',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '10px',
              padding: '1rem',
              maxHeight: '220px',
              overflowY: 'auto',
              fontFamily: 'Fira Code, monospace',
              fontSize: '0.78rem',
              lineHeight: 1.6,
              color: '#818cf8'
            }}>
              {logs.map((logLine, idx) => (
                <div key={idx} style={{ color: logLine.includes('[COMPLETE]') ? '#34d399' : logLine.includes('[ERROR]') ? '#f87171' : '#a5b4fc' }}>
                  {logLine}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated Result Preview Card */}
      {lastGeneratedArticle && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Generation Output Ready
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Execution Time: {lastGeneratedArticle.metrics.executionTimeSeconds}s • Cost: ${lastGeneratedArticle.metrics.cost}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={lastGeneratedArticle.coverImage}
              alt=""
              style={{ width: '120px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {lastGeneratedArticle.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                {lastGeneratedArticle.summary}
              </p>
            </div>
            <button
              onClick={() => onOpenArticle(lastGeneratedArticle)}
              className="btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              Inspect & Read Draft <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
