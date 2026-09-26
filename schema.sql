-- ====================================================================
-- THE VANGUARD JOURNAL - CLOUDFLARE D1 / MYSQL RELATIONAL SQL SCHEMA
-- ====================================================================

-- 1. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published', -- 'pending_review', 'approved', 'published', 'archived'
  author TEXT NOT NULL DEFAULT 'Sandun Hewawasam',
  read_time TEXT DEFAULT '8 min read',
  published_at TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT, -- JSON array of tags: ["AI", "Quantum", ...]
  citations TEXT, -- JSON array of citations / research sources
  key_takeaways TEXT, -- JSON array of key takeaways
  fark_badge TEXT DEFAULT '[RESEARCH]',
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  unique_readers INTEGER DEFAULT 0,
  is_bookmarked INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0.0,
  publisher_name TEXT DEFAULT 'The Vanguard Journal',
  publisher_domain TEXT DEFAULT 'thevanguard.ai',
  publisher_icon TEXT DEFAULT '⚡',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for lightning-fast queries across millions of articles
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);

-- 2. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  avatar TEXT DEFAULT '💬',
  created_at TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments (article_id);

-- 3. Governance & Newsroom Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON stringified settings payload
  updated_at TEXT NOT NULL
);

-- 4. Admin Security Credentials Table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  last_changed TEXT
);

-- 5. Platform Metrics & Token Counter Table
CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_generated INTEGER DEFAULT 0,
  total_published INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd REAL DEFAULT 0.0,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL
);

-- 6. Autonomous Google Keyword Radar & Pipeline Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency_hours INTEGER DEFAULT 6,
  active INTEGER DEFAULT 1,
  last_scanned TEXT,
  created_at TEXT NOT NULL
);

-- Seed Initial Admin Credentials (default: admin / admin123)
INSERT OR IGNORE INTO admin_credentials (id, username, password_hash, email, full_name, last_changed)
VALUES (1, 'admin', 'admin123', 'admin@thevanguard.ai', 'System Administrator', datetime('now'));

-- Seed Initial Metrics
INSERT OR IGNORE INTO metrics (id, total_generated, total_published, total_tokens, total_cost_usd, total_views, unique_visitors, updated_at)
VALUES (1, 28, 28, 98450, 0.285, 14250, 8920, datetime('now'));
