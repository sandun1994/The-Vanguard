import React, { useState } from 'react';
import { runAgentPipeline } from '../../services/agentPipeline';
import { Play, Sparkles, CheckCircle2, Clock, Terminal, Bot, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const PipelineRunner = ({ topics, onArticleCreated, onOpenArticle }) => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0] || 'Latest AI agent architecture breakthroughs 2026');
  const [customQuery, setCustomQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastGeneratedArticle, setLastGeneratedArticle] = useState(null);

  const activeQuery = customQuery.trim() ? customQuery : selectedTopic;

  const handleStartPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setLogs([`[00:00.00] Initializing multi-agent orchestrator for query: "${activeQuery}"`]);
    setLastGeneratedArticle(null);

    try {
      const generatedArticle = await runAgentPipeline(activeQuery, (stepInfo) => {
        setCurrentStep(stepInfo.step);
        setStepData(stepInfo);
        setLogs(prev => [
          ...prev,
          `[+0.8s] Step ${stepInfo.step}/5: [${stepInfo.agent}] - ${stepInfo.name}`,
          ...stepInfo.log.split('\n').map(line => `  ↳ ${line}`)
        ]);
      });

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
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="#6366f1" /> Autonomous Multi-Agent Discovery & Generation Trigger
        </h3>

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
              {topics.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
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
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Live Multi-Agent Stage Progress
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {[
              { num: 1, title: 'Discovery', agent: 'Web Scraper' },
              { num: 2, title: 'Fact Check', agent: 'Researcher' },
              { num: 3, title: 'Writer', agent: 'LLM Synthesizer' },
              { num: 4, title: 'SEO Agent', agent: 'Metadata Tag' },
              { num: 5, title: 'Cover Art', agent: 'Image Gen' }
            ].map(stage => {
              const isCompleted = currentStep > stage.num || (currentStep === 5 && !isRunning);
              const isCurrent = currentStep === stage.num && isRunning;

              return (
                <div
                  key={stage.num}
                  style={{
                    backgroundColor: isCompleted
                      ? 'rgba(16, 185, 129, 0.15)'
                      : isCurrent
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'var(--bg-main)',
                    border: isCompleted
                      ? '1.5px solid #10b981'
                      : isCurrent
                      ? '1.5px solid #6366f1'
                      : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#6366f1' : 'rgba(99, 102, 241, 0.2)',
                    color: isCompleted || isCurrent ? 'white' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : stage.num}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isCompleted ? '#059669' : 'var(--text-secondary)', fontWeight: '600' }}>
                    {stage.agent}
                  </div>
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
