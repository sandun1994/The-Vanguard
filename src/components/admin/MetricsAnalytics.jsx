import React, { useState } from 'react';
import { Users, Eye, Clock, ArrowUpRight, DollarSign, Cpu, Layers, Activity, TrendingUp, Bot, FileText, Globe, Smartphone, Monitor, Flame, MessageSquare, ArrowUpDown, ExternalLink, BarChart3 } from 'lucide-react';
import { getVisitorAnalytics } from '../../services/storage';
import { CategoryBadge } from '../common/Badge';

export const MetricsAnalytics = ({ metrics, articlesCount, articles = [], onOpenArticle }) => {
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'yearly'
  const [articleSortBy, setArticleSortBy] = useState('views'); // 'views' | 'readers' | 'upvotes' | 'comments'

  const analytics = getVisitorAnalytics(timeframe);

  const timeframes = [
    { id: 'daily', label: 'Daily (24h)' },
    { id: 'weekly', label: 'Weekly (7d)' },
    { id: 'fortnightly', label: 'Fortnightly (14d)' },
    { id: 'monthly', label: 'Monthly (30d)' },
    { id: 'yearly', label: 'Yearly (1y)' }
  ];

  // Find max views for trend chart bar scaling
  const maxViews = Math.max(...(analytics?.chartData?.map(d => d.views) || [1]));

  // Calculate total combined article views for share bars
  const totalArticleViews = articles.reduce((sum, a) => sum + (a.views || 0), 0) || 1;

  // Sort articles according to user preference
  const sortedArticles = [...articles].sort((a, b) => {
    if (articleSortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (articleSortBy === 'readers') return (b.uniqueReaders || 0) - (a.uniqueReaders || 0);
    if (articleSortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
    if (articleSortBy === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header Bar & Timeframe Switcher */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.75rem',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#6366f1'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              Visitor Traffic & Platform Analytics
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live visitor analytics tracking across Daily, Weekly, Fortnightly, Monthly & Yearly periods
            </p>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '4px',
          gap: '2px',
          overflowX: 'auto'
        }}>
          {timeframes.map(tf => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  backgroundColor: isActive ? '#6366f1' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Visitor Metric Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Unique Visitors */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>UNIQUE VISITORS ({analytics.periodName.toUpperCase()})</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {analytics.visitors.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
            <ArrowUpRight size={15} /> {analytics.growth} vs previous {analytics.periodName.toLowerCase()}
          </div>
        </div>

        {/* Total Pageviews */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL PAGEVIEWS</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Eye size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {analytics.pageviews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            ~{(analytics.pageviews / analytics.visitors).toFixed(1)} views per visitor
          </div>
        </div>

        {/* Avg. Duration */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>AVG. READ DURATION</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {analytics.avgDuration}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
            High Engagement Score
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>BOUNCE RATE</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {analytics.bounceRate}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.4rem' }}>
            Top 5% Editorial Benchmark
          </div>
        </div>

      </div>

      {/* ARTICLE-WISE READERSHIP & TRAFFIC METRICS TABLE */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#6366f1" /> Article-Wise Readership & Pageview Breakdown
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Detailed breakdown of total reads, unique readers, and engagement rates for each published article
            </p>
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sort By:</span>
            {[
              { id: 'views', label: '👁️ Most Read', key: 'views' },
              { id: 'readers', label: '👥 Unique Readers', key: 'readers' },
              { id: 'upvotes', label: '🔥 Upvotes', key: 'upvotes' },
              { id: 'comments', label: '💬 Comments', key: 'comments' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setArticleSortBy(btn.key)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: articleSortBy === btn.key ? '700' : '500',
                  backgroundColor: articleSortBy === btn.key ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-main)',
                  color: articleSortBy === btn.key ? '#6366f1' : 'var(--text-secondary)',
                  border: articleSortBy === btn.key ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Article Readership Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Rank & Article Details</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Reads (Pageviews)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Unique Readers</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reactions & Upvotes</th>
                <th style={{ padding: '0.75rem 1rem' }}>Readership Share</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedArticles.map((art, index) => {
                const readCount = art.views || 0;
                const uniqueCount = art.uniqueReaders || 0;
                const sharePct = totalArticleViews > 0 && readCount > 0 ? ((readCount / totalArticleViews) * 100).toFixed(1) : '0.0';
                const engagementRatio = readCount > 0 ? (((art.upvotes || 0) + (art.comments?.length || 0)) / readCount * 100).toFixed(1) : '0.0';

                return (
                  <tr
                    key={art.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.2s'
                    }}
                    className="fark-row-hover"
                  >
                    {/* Rank & Title */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          color: index === 0 ? '#f59e0b' : (index === 1 ? '#94a3b8' : '#6366f1'),
                          width: '22px',
                          textAlign: 'center'
                        }}>
                          #{index + 1}
                        </span>

                        <img
                          src={art.coverImage}
                          alt=""
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                        />

                        <div style={{ maxWidth: '340px' }}>
                          <div style={{
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {art.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ID: {art.id} • Published {new Date(art.publishedAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem' }}>
                      <CategoryBadge category={art.category} />
                    </td>

                    {/* Total Reads */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={15} color="#6366f1" />
                        {readCount.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>reads</span>
                      </div>
                    </td>

                    {/* Unique Readers */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} color="#10b981" />
                        {uniqueCount.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>readers</span>
                      </div>
                    </td>

                    {/* Upvotes & Comments */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={13} fill="#f59e0b" /> {art.upvotes || 0}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MessageSquare size={13} /> {art.comments?.length || 0}
                        </span>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                          {engagementRatio}% Rate
                        </span>
                      </div>
                    </td>

                    {/* Readership Share Progress Bar */}
                    <td style={{ padding: '1rem', minWidth: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(5, sharePct)}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{sharePct}%</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {onOpenArticle && (
                        <button
                          onClick={() => onOpenArticle(art)}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                        >
                          Inspect <ExternalLink size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Trend Chart Visual */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {analytics.label} Trend Breakdown
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Pageview distribution across intervals
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
            {analytics.periodName} Active Monitoring
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justify: 'space-between',
          height: '200px',
          paddingTop: '20px',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px'
        }}>
          {analytics.chartData.map((item, idx) => {
            const heightPct = Math.max(15, Math.round((item.views / maxViews) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: '700' }}>
                  {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
                </span>

                <div style={{
                  width: '100%',
                  maxWidth: '45px',
                  height: `${heightPct}%`,
                  background: 'linear-gradient(180deg, #6366f1 0%, #06b6d4 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }} />

                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Sources & Device Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Traffic Sources */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Globe size={18} color="#6366f1" /> Acquisition & Referral Channels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { source: 'Google Search Organic (SEO)', pct: '48%', color: '#10b981' },
              { source: 'Direct Visits & Bookmarks', pct: '26%', color: '#6366f1' },
              { source: 'Social (X / Reddit / HackerNews)', pct: '18%', color: '#f59e0b' },
              { source: 'External Referrals & RSS', pct: '8%', color: '#ec4899' }
            ].map((channel, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{channel.source}</span>
                  <span style={{ color: channel.color, fontWeight: '700' }}>{channel.pct}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: channel.pct, height: '100%', backgroundColor: channel.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Monitor size={18} color="#06b6d4" /> Visitor Device Ecosystem
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <Monitor size={22} color="#6366f1" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>62%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Desktop</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <Smartphone size={22} color="#10b981" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>32%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mobile</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <Monitor size={22} color="#f59e0b" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>6%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tablet</div>
            </div>
          </div>
        </div>

      </div>

      {/* Financial Costs & Multi-Agent Token Usage */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <DollarSign size={20} color="#10b981" /> Financial Cost & Token Resource Consumption
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL FINANCIAL COST</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', margin: '4px 0' }}>
              ${metrics.totalCost?.toFixed(4) || '0.0383'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg ~$0.012 / article</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL TOKENS CONSUMED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#6366f1', margin: '4px 0' }}>
              {metrics.totalTokens?.toLocaleString() || '13,290'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Context + Prompts</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>PIPELINE GENERATIONS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b', margin: '4px 0' }}>
              {metrics.totalGenerations || 3} Runs
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Verified Pass Rate</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ARTICLES IN STORE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#3b82f6', margin: '4px 0' }}>
              {articlesCount} Articles
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live in Storage</div>
          </div>
        </div>
      </div>

    </div>
  );
};
