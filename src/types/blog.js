import { SEED_ARTICLES } from '../data/seedArticles';

export const ARTICLE_STATUS = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const CATEGORIES = [
  'All',
  'Bookmarks 🔖',
  'Artificial Intelligence',
  'Quantum Computing',
  'Biotech & Health',
  'Space Exploration',
  'Robotics & Hardware'
];

export const VIEW_MODES = {
  CARDS: 'cards',
  FARK_LIST: 'fark_list'
};

export const DEFAULT_GOVERNANCE_MODE = 'autonomous'; // 'autonomous' | 'manual_review'

export const INITIAL_TOPICS = [
  { id: 't1', query: 'Autonomous Multi-Agent AI Frameworks 2026', category: 'Artificial Intelligence', active: true, frequencyHours: 6 },
  { id: 't2', query: 'Room-Temperature Superconductivity High Pressure Hydrides', category: 'Quantum Computing', active: true, frequencyHours: 12 },
  { id: 't3', query: 'In Vivo Base Editing CRISPR 5.0 Clinical Trials', category: 'Biotech & Health', active: true, frequencyHours: 24 },
  { id: 't4', query: 'JWST Exoplanet Biosignatures K2-18b MIRI Spectroscopy', category: 'Space Exploration', active: true, frequencyHours: 12 },
  { id: 't5', query: 'Humanoid Bipedal Robots Automotive Assembly Precision', category: 'Robotics & Hardware', active: true, frequencyHours: 12 }
];

export const INITIAL_PROMPTS = {
  discovery: `You are an Autonomous Tech News Agent & Research Analyst specializing in discovering breaking papers, preprints, and technological breakthroughs. Formulate search parameters and synthesis notes.`,
  writer: `You are a Principal Tech Journalist & E-E-A-T Editorial Director. Synthesize primary technical sources into an exhaustive, 1,000 to 1,500+ word, highly-structured technical article.

Structure:
1. Executive Summary & Core Thesis
2. Multi-Source Comparative Analysis (Markdown table contrasting 3-4 primary studies/technologies)
3. Deep Architectural & Methodological Breakdown (with code blocks or equations where applicable)
4. Contextual Timeline & Real-World Industry Deployment Impact
5. Key Takeaways & Data Summary
6. Transparent Citation Box detailing primary sources, domain authority ratings, and reference links.

Ensure an authoritative, objective tone suitable for Google News and Google AdSense E-E-A-T guidelines.`,
  seo: `You are an SEO Specialist & Schema Engineer. Synthesize the article into a target meta title, high-CTR meta description (150-160 chars), semantic slug, target keywords, tags, and JSON-LD schema metadata.`,
  imageGen: `You are a Creative Director for Scientific Visuals. Formulate hyper-detailed 8K prompt concepts for technical cover art matching the paper topic.`
};

export const DEFAULT_ARTICLES = SEED_ARTICLES;
