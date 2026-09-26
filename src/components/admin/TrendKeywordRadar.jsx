import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  RefreshCw, 
  Check, 
  Compass, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { 
  getTrendingKeywords, 
  analyzeSearchPattern, 
  TREND_TIMEFRAMES, 
  TREND_CATEGORIES 
} from '../../services/trendsService';

export const TrendKeywordRadar = ({ onTriggerPipelineWithTrend }) => {
  const [timeframe, setTimeframe] = useState(TREND_TIMEFRAMES.TODAY);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState(null);
  const [expandedTrendId, setExpandedTrendId] = useState(null);

  const trends = getTrendingKeywords({ timeframe, category: selectedCategory });

  const handleAnalyzeCustom = async (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsAnalyzing(true);
    setAnalyzedResult(null);

    const result = await analyzeSearchPattern(customInput);
    setAnalyzedResult(result);
    setIsAnalyzing(false);
  };

  const getVelocityBadgeStyle = (velocityType) => {
    if (velocityType === 'breakout') {
      return {
        bg: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        color: '#f87171'
      };
    }
    if (velocityType === 'rising') {
      return {
        bg: 'rgba(245, 158, 11, 0.15)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        color: '#fbbf24'
      };
    }
    return {
      bg: 'rgba(6, 182, 212, 0.15)',
      border: '1px solid rgba(6, 182, 212, 0.35)',
      color: '#38bdf8'
    };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      
      {/* Hero Header & Live Signal */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)'
            }}>
              <Flame size={26} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  Google Keyword & Search Pattern Radar
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
                  LIVE SEARCH SIGNALS
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Discovers breakout search spikes, Google autocomplete expansions, and "People Also Ask" intent to fuel autonomous newsroom generation.
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          padding: '0.4rem',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setTimeframe(TREND_TIMEFRAMES.TODAY)}
            style={{
              backgroundColor: timeframe === TREND_TIMEFRAMES.TODAY ? '#ef4444' : 'transparent',
              color: timeframe === TREND_TIMEFRAMES.TODAY ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s'
            }}
          >
            <Flame size={15} /> Today (24h Breakout Spikes)
          </button>

          <button
            onClick={() => setTimeframe(TREND_TIMEFRAMES.WEEK)}
            style={{
              backgroundColor: timeframe === TREND_TIMEFRAMES.WEEK ? '#f59e0b' : 'transparent',
              color: timeframe === TREND_TIMEFRAMES.WEEK ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s'
            }}
          >
            <TrendingUp size={15} /> This Week (Rising Velocity)
          </button>

          <button
            onClick={() => setTimeframe(TREND_TIMEFRAMES.MONTH)}
            style={{
              backgroundColor: timeframe === TREND_TIMEFRAMES.MONTH ? '#06b6d4' : 'transparent',
              color: timeframe === TREND_TIMEFRAMES.MONTH ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={15} /> This Month (High-Volume Pillars)
          </button>
        </div>
      </div>

      {/* Dynamic Search Pattern Identifier Tool */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Search size={18} color="#6366f1" /> Google Autocomplete & Query Pattern Analyzer
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Input any seed keyword or topic to simulate Google's real-time search pattern expansion, long-tail subqueries, and user search intent.
        </p>

        <form onSubmit={handleAnalyzeCustom} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="e.g. quantum annealing, deepseek v3, solid state battery..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            style={{
              flex: '1 1 300px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', opacity: isAnalyzing ? 0.7 : 1 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="spin-animation" /> Analyzing Pattern...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze Search Pattern
              </>
            )}
          </button>
        </form>

        {/* Custom Analyzed Pattern Card */}
        {analyzedResult && (
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '14px',
            padding: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: '700' }}>
                    {analyzedResult.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: '700' }}>
                    {analyzedResult.velocity}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {analyzedResult.keyword}
                </h4>
              </div>

              <button
                onClick={() => onTriggerPipelineWithTrend(analyzedResult)}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #6366f1 100%)',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem'
                }}
              >
                <Zap size={16} /> Write Article From This Pattern
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', fontSize: '0.84rem' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Search size={14} /> High-Velocity Long-Tail Subqueries:
                </span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {analyzedResult.subQueries.map((sq, i) => (
                    <li key={i}><strong style={{ color: 'var(--text-primary)' }}>{sq}</strong></li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <HelpCircle size={14} /> Google "People Also Ask" Questions:
                </span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {analyzedResult.targetQuestions.map((tq, i) => (
                    <li key={i}>{tq}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {TREND_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === cat ? '700' : '500',
              backgroundColor: selectedCategory === cat ? '#6366f1' : 'var(--bg-card)',
              color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Topics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {trends.map((trend) => {
          const badgeStyle = getVelocityBadgeStyle(trend.velocityType);
          const isExpanded = expandedTrendId === trend.id;

          return (
            <div
              key={trend.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                border: isExpanded ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)'
              }}
            >
              <div>
                {/* Badges Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}>
                    {trend.category}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    backgroundColor: badgeStyle.bg,
                    border: badgeStyle.border,
                    color: badgeStyle.color,
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Flame size={12} /> {trend.velocity}
                  </span>
                </div>

                {/* Keyword Title */}
                <h3 style={{
                  fontSize: '1.12rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '0.65rem',
                  lineHeight: '1.4'
                }}>
                  {trend.keyword}
                </h3>

                {/* Intent & Volume stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.15rem' }}>
                  <span>Volume: <strong style={{ color: 'var(--text-secondary)' }}>{trend.searchVolume}</strong></span>
                  <span>•</span>
                  <span>Intent: <strong style={{ color: '#818cf8' }}>{trend.intent}</strong></span>
                </div>

                {/* Expandable Pattern Details Drawer */}
                {isExpanded && (
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-subtle)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '700', color: '#6366f1', display: 'block', marginBottom: '0.3rem' }}>
                        Google Autocomplete Subqueries:
                      </span>
                      {trend.subQueries.map((sq, idx) => (
                        <div key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          ↳ <strong style={{ color: 'var(--text-primary)' }}>{sq}</strong>
                        </div>
                      ))}
                    </div>

                    <div>
                      <span style={{ fontWeight: '700', color: '#10b981', display: 'block', marginBottom: '0.3rem' }}>
                        People Also Ask (PAA) Intent:
                      </span>
                      {trend.targetQuestions.map((tq, idx) => (
                        <div key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          ? {tq}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setExpandedTrendId(isExpanded ? null : trend.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {isExpanded ? 'Hide Search Patterns ▲' : 'View Search Patterns ▼'}
                </button>

                <button
                  onClick={() => onTriggerPipelineWithTrend(trend)}
                  className="btn-primary"
                  style={{
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                  title="Generate, fact-check, and publish an article targeting this trending keyword pattern"
                >
                  <Zap size={14} /> Write From Trend
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
