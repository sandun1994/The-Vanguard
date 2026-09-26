import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_ARTICLES } from '../src/data/seedArticles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.resolve(rootDir, 'data');
const dbFilePath = path.resolve(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Add the 3 auto-published articles that were created during the live runs
const initialArticles = [
  {
    id: 'post-044891',
    title: 'DeepSeek-V3 Multi-Token Prediction Architecture',
    slug: 'deepseek-v3-multi-token-prediction-architecture',
    summary: 'An architectural exploration of Multi-Token Prediction (MTP) in DeepSeek-V3, evaluating speculative decoding speeds and training efficiency gains across dense reasoning benchmarks.',
    category: 'Artificial Intelligence',
    status: 'published',
    author: 'Autonomous AI Newsroom Agent',
    readTime: '6 min read',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    tags: ['DeepSeek-V3', 'Multi-Token Prediction', 'LLM Architecture', 'Inference Optimization'],
    farkBadge: '[AUTONOMOUS]',
    upvotes: 4,
    views: 18,
    uniqueReaders: 14,
    isBookmarked: false,
    tokenCount: 3793,
    costUsd: 0.0114,
    publisher: { name: 'Google Trends Radar', domain: 'trends.google.com', icon: '⚡' },
    content: '## Executive Summary & Core Thesis\n\nDeepSeek-V3 represents a substantial departure from traditional next-token prediction paradigms by integrating multi-token speculative decoding pathways into the foundation training loop.\n\n### Architectural Synthesis\n\nBy executing parallel multi-token prediction heads, speculative verification latency is amortized, yielding up to a 2.4x throughput elevation on high-context inference clusters.'
  },
  {
    id: 'post-091071',
    title: 'Autonomous Multi-Agent AI Frameworks 2026',
    slug: 'autonomous-multi-agent-ai-frameworks-2026',
    summary: 'A deep-dive investigation into hierarchical agent topology orchestrations, deterministic sandbox verifications, and emergent collaborative problem-solving across large software repositories.',
    category: 'Robotics & Hardware',
    status: 'published',
    author: 'Autonomous AI Newsroom Agent',
    readTime: '7 min read',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    tags: ['Multi-Agent', 'Agent Topology', 'Robotics', 'Autonomous Systems'],
    farkBadge: '[AUTONOMOUS]',
    upvotes: 6,
    views: 24,
    uniqueReaders: 19,
    isBookmarked: false,
    tokenCount: 3472,
    costUsd: 0.0104,
    publisher: { name: 'Google Trends Radar', domain: 'trends.google.com', icon: '⚡' },
    content: '## Executive Summary & Core Thesis\n\nMulti-agent autonomous systems in 2026 have shifted from conversational chains to role-isolated deterministic state machines with verifiable execution outputs.'
  },
  {
    id: 'post-412942',
    title: 'Silicon photonics',
    slug: 'silicon-photonics',
    summary: 'Breakthrough co-packaged optics and silicon photonic interconnects shatter electronic bus thermal barriers in next-generation AI datacenter clusters.',
    category: 'Artificial Intelligence',
    status: 'published',
    author: 'Autonomous AI Newsroom Agent',
    readTime: '8 min read',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    tags: ['Silicon Photonics', 'Hardware Acceleration', 'Optical Computing', 'Interconnects'],
    farkBadge: '[AUTONOMOUS]',
    upvotes: 3,
    views: 15,
    uniqueReaders: 11,
    isBookmarked: false,
    tokenCount: 5020,
    costUsd: 0.0151,
    publisher: { name: 'Google Trends Radar', domain: 'trends.google.com', icon: '⚡' },
    content: '## Executive Summary & Core Thesis\n\nAs copper interconnects approach fundamental thermodynamic limits at sub-picosecond signal propagation, silicon photonics emerges as the critical hardware bridge for multi-terabit chiplet interconnects.'
  },
  ...SEED_ARTICLES
];

const dbData = {
  articles: initialArticles,
  settings: {
    siteName: 'THE VANGUARD',
    siteTagline: 'JOURNAL OF DISCOVERY',
    governanceMode: 'autonomous',
    autonomousFrequencyMinutes: 30,
    minReadTimeMinutes: 5,
    requirePeerReviewSources: true
  },
  credentials: {
    username: 'admin',
    password: 'admin123',
    email: 'admin@thevanguard.ai',
    fullName: 'System Administrator',
    lastChanged: null
  },
  metrics: {
    totalGenerated: initialArticles.length,
    totalPublished: initialArticles.length,
    totalTokens: 108735,
    totalCostUsd: 0.322,
    totalViews: 14297,
    uniqueVisitors: 8940
  }
};

fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf8');
console.log(`[Init DB] Successfully created ${dbFilePath} with ${initialArticles.length} shared articles.`);
