import React, { useState } from 'react';
import { Save, Bot, Key, Settings, Plus, Trash2, Shield, Check, Sparkles, Globe } from 'lucide-react';
import { DEFAULT_GOVERNANCE_MODE } from '../../types/blog';

export const AgentSettings = ({ settings, onSaveSettings }) => {
  const [siteName, setSiteName] = useState(settings.siteName || 'NOVUM');
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline || 'AI JOURNAL');
  const [prompts, setPrompts] = useState(settings.prompts || {});
  const [topics, setTopics] = useState(settings.topics || []);
  const [governanceMode, setGovernanceMode] = useState(settings.governanceMode || DEFAULT_GOVERNANCE_MODE);
  const [apiKeys, setApiKeys] = useState(settings.apiKeys || {});
  const [newTopic, setNewTopic] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      siteName: siteName.trim() || 'NOVUM',
      siteTagline: siteTagline.trim() || 'AI JOURNAL',
      governanceMode,
      prompts,
      topics,
      apiKeys
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }}>
      {/* Save Toast notification */}
      {savedSuccess && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} /> Website Branding, Settings & Agent Prompts Updated Successfully!
        </div>
      )}

      {/* Website Branding & Site Name Settings Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Globe size={20} color="#6366f1" /> Website Branding & Site Name Configuration
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Main Brand / Site Name
            </label>
            <input
              type="text"
              placeholder="e.g. NOVUM, TECH FARK, DAILY TECH..."
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Gradient Tagline / Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. AI JOURNAL, AGGREGATOR, INTELLIGENCE..."
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Governance & Autonomous Mode Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Shield size={20} color="#6366f1" /> System Governance & Autonomous Mode
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => setGovernanceMode('manual_review')}
            style={{
              backgroundColor: governanceMode === 'manual_review' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-main)',
              border: governanceMode === 'manual_review' ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              🛡️ Manual Review First Mode (Recommended)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Newly generated articles are assigned <strong style={{ color: '#d97706' }}>pending_review</strong> status. Requires human review before appearing on the public blog.
            </p>
          </div>

          <div
            onClick={() => setGovernanceMode('autonomous')}
            style={{
              backgroundColor: governanceMode === 'autonomous' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-main)',
              border: governanceMode === 'autonomous' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.4rem' }}>
              ⚡ 100% Autonomous Publishing Mode
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Agent runs publish articles directly to the live blog frontend with <strong style={{ color: '#10b981' }}>published</strong> status. Fully automated newsroom execution.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Agent System Prompts */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Bot size={20} color="#6366f1" /> Agent System Instructions & Role Prompts
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.4rem' }}>
              1. Researcher Agent Prompt
            </label>
            <textarea
              rows={4}
              value={prompts.researcher || ''}
              onChange={(e) => setPrompts({ ...prompts, researcher: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.4rem' }}>
              2. Writer Agent Prompt
            </label>
            <textarea
              rows={4}
              value={prompts.writer || ''}
              onChange={(e) => setPrompts({ ...prompts, writer: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.4rem' }}>
              3. SEO Specialist Prompt
            </label>
            <textarea
              rows={4}
              value={prompts.seo || ''}
              onChange={(e) => setPrompts({ ...prompts, seo: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.4rem' }}>
              4. Image Generator Prompt
            </label>
            <textarea
              rows={4}
              value={prompts.imageGen || ''}
              onChange={(e) => setPrompts({ ...prompts, imageGen: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      {/* Discovery Topics Manager */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Settings size={20} color="#10b981" /> Scheduled Topic Queries
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Add new research query string..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            style={{ flex: 1, backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          />
          <button type="button" onClick={handleAddTopic} className="btn-secondary" style={{ padding: '0.65rem 1rem' }}>
            <Plus size={16} /> Add Query
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {topics.map((t, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t}</span>
              <button type="button" onClick={() => handleRemoveTopic(idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Credentials */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Key size={20} color="#f59e0b" /> External Service API Keys (Optional)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Tavily / Serper API Key</label>
            <input
              type="password"
              placeholder="tvly-••••••••"
              value={apiKeys.tavily || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, tavily: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Perplexity API Key</label>
            <input
              type="password"
              placeholder="pplx-••••••••"
              value={apiKeys.perplexity || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, perplexity: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>OpenAI / Claude Key</label>
            <input
              type="password"
              placeholder="sk-••••••••"
              value={apiKeys.openai || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
          <Save size={18} /> Save All Agent Configurations
        </button>
      </div>
    </form>
  );
};
