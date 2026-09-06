import React, { useState } from 'react';
import { X, Sparkles, Zap, Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import { runAgentPipeline } from '../../services/agentPipeline';

export const SubmitLinkModal = ({ isOpen, onClose, onArticleCreated, onOpenArticle }) => {
  const [topicInput, setTopicInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepInfo, setStepInfo] = useState(null);
  const [createdArticle, setCreatedArticle] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsProcessing(true);
    setCreatedArticle(null);

    try {
      const generatedArticle = await runAgentPipeline(topicInput.trim(), (info) => {
        setStepInfo(info);
      });

      setCreatedArticle(generatedArticle);
      onArticleCreated(generatedArticle);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      backgroundColor: 'rgba(3, 7, 18, 0.8)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        margin: 'auto',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid var(--border-glow)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={26} color="white" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
            Fark-Style Submit Link & Topic
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Enter a tech topic string or article URL to trigger our 4-stage AI Agent pipeline.
          </p>
        </div>

        {!createdArticle ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Topic Query or Target News URL
              </label>
              <input
                type="text"
                placeholder="e.g. Breakthroughs in room-temperature fusion 2026..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {isProcessing && stepInfo && (
              <div style={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.3rem' }}>
                  ⚡ Step {stepInfo.step}/5: {stepInfo.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {stepInfo.agent} is processing facts & domain authority...
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || !topicInput.trim()}
              className="btn-primary"
              style={{
                width: '100%',
                justify: 'center',
                padding: '0.75rem',
                fontSize: '0.9rem',
                opacity: (isProcessing || !topicInput.trim()) ? 0.6 : 1
              }}
            >
              {isProcessing ? (
                <>
                  <Zap size={16} className="pulse-dot" /> AI Processing...
                </>
              ) : (
                <>
                  <Zap size={16} /> Submit for AI Discovery
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Output State */
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={22} /> Story Generated Successfully!
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              "{createdArticle.title}" has been fact-checked and added to the timeline feed.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenArticle(createdArticle);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Inspect Article Draft <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
