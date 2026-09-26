// Cloudflare Pages Function: /api/articles
// Connects directly to Cloudflare D1 Relational SQL Database

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

// GET /api/articles?category=All&status=published&page=1&limit=20&search=...
export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) {
    return jsonResponse({ error: 'Cloudflare D1 database binding (DB) is missing in wrangler.toml or dashboard' }, 500);
  }

  const url = new URL(context.request.url);
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  try {
    let whereClauses = [];
    let params = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (category && category !== 'All' && category !== 'Bookmarks 🔖') {
      whereClauses.push('category = ?');
      params.push(category);
    }

    if (category === 'Bookmarks 🔖') {
      whereClauses.push('is_bookmarked = 1');
    }

    if (search && search.trim()) {
      whereClauses.push('(title LIKE ? OR summary LIKE ? OR tags LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching articles for pagination
    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereSql}`;
    const countResult = await db.prepare(countQuery).bind(...params).first();
    const total = countResult ? countResult.total : 0;

    // Fetch paginated articles
    const selectQuery = `
      SELECT * FROM articles 
      ${whereSql} 
      ORDER BY published_at DESC 
      LIMIT ? OFFSET ?
    `;
    const paginatedParams = [...params, limit, offset];
    const { results } = await db.prepare(selectQuery).bind(...paginatedParams).all();

    // Fetch comments for these articles
    const articleIds = results.map(r => r.id);
    let commentsMap = {};
    if (articleIds.length > 0) {
      const placeholders = articleIds.map(() => '?').join(',');
      const commentsQuery = `SELECT * FROM comments WHERE article_id IN (${placeholders}) ORDER BY created_at ASC`;
      const { results: comments } = await db.prepare(commentsQuery).bind(...articleIds).all();
      comments.forEach(c => {
        if (!commentsMap[c.article_id]) commentsMap[c.article_id] = [];
        commentsMap[c.article_id].push({
          id: c.id,
          author: c.author,
          text: c.text,
          avatar: c.avatar,
          createdAt: c.created_at
        });
      });
    }

    // Format articles for client frontend
    const articles = results.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      content: row.content,
      category: row.category,
      status: row.status,
      author: row.author,
      readTime: row.read_time,
      publishedAt: row.published_at,
      coverImage: row.cover_image,
      tags: row.tags ? JSON.parse(row.tags) : [],
      citations: row.citations ? JSON.parse(row.citations) : [],
      keyTakeaways: row.key_takeaways ? JSON.parse(row.key_takeaways) : [],
      farkBadge: row.fark_badge,
      upvotes: row.upvotes || 0,
      views: row.views || 0,
      uniqueReaders: row.unique_readers || 0,
      isBookmarked: Boolean(row.is_bookmarked),
      tokenCount: row.token_count || 0,
      costUsd: row.cost_usd || 0.0,
      publisher: {
        name: row.publisher_name || 'The Vanguard Journal',
        domain: row.publisher_domain || 'thevanguard.ai',
        icon: row.publisher_icon || '⚡'
      },
      comments: commentsMap[row.id] || []
    }));

    return jsonResponse({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// POST /api/articles (Create or Update Article)
export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) {
    return jsonResponse({ error: 'Cloudflare D1 database binding missing' }, 500);
  }

  try {
    const article = await context.request.json();
    if (!article.id || !article.title) {
      return jsonResponse({ error: 'Article ID and title are required' }, 400);
    }

    const now = new Date().toISOString();
    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const query = `
      INSERT INTO articles (
        id, title, slug, summary, content, category, status, author, read_time,
        published_at, cover_image, tags, citations, key_takeaways, fark_badge,
        upvotes, views, unique_readers, is_bookmarked, token_count, cost_usd,
        publisher_name, publisher_domain, publisher_icon, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        slug = excluded.slug,
        summary = excluded.summary,
        content = excluded.content,
        category = excluded.category,
        status = excluded.status,
        author = excluded.author,
        read_time = excluded.read_time,
        cover_image = excluded.cover_image,
        tags = excluded.tags,
        citations = excluded.citations,
        key_takeaways = excluded.key_takeaways,
        fark_badge = excluded.fark_badge,
        upvotes = excluded.upvotes,
        views = excluded.views,
        unique_readers = excluded.unique_readers,
        is_bookmarked = excluded.is_bookmarked,
        token_count = excluded.token_count,
        cost_usd = excluded.cost_usd,
        updated_at = excluded.updated_at
    `;

    await db.prepare(query).bind(
      article.id,
      article.title,
      slug,
      article.summary || '',
      article.content || '',
      article.category || 'Artificial Intelligence',
      article.status || 'published',
      article.author || 'Sandun Hewawasam',
      article.readTime || '8 min read',
      article.publishedAt || now,
      article.coverImage || '',
      JSON.stringify(article.tags || []),
      JSON.stringify(article.citations || []),
      JSON.stringify(article.keyTakeaways || []),
      article.farkBadge || '[BREAKTHROUGH]',
      article.upvotes || 0,
      article.views || 0,
      article.uniqueReaders || 0,
      article.isBookmarked ? 1 : 0,
      article.tokenCount || 3420,
      article.costUsd || 0.0102,
      article.publisher?.name || 'The Vanguard Journal',
      article.publisher?.domain || 'thevanguard.ai',
      article.publisher?.icon || '⚡',
      now,
      now
    ).run();

    // If comments exist, insert any new comments
    if (Array.isArray(article.comments) && article.comments.length > 0) {
      for (const c of article.comments) {
        if (c.id && c.text) {
          await db.prepare(`
            INSERT OR IGNORE INTO comments (id, article_id, author, text, avatar, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(c.id, article.id, c.author || 'Reader', c.text, c.avatar || '💬', c.createdAt || now).run();
        }
      }
    }

    return jsonResponse({ success: true, id: article.id });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// PATCH /api/articles (status update, upvote, bookmark, add comment)
export async function onRequestPatch(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const body = await context.request.json();
    const { action, id, status, comment } = body;

    if (!id) return jsonResponse({ error: 'Article ID is required' }, 400);

    if (action === 'status' && status) {
      await db.prepare('UPDATE articles SET status = ?, updated_at = ? WHERE id = ?')
        .bind(status, new Date().toISOString(), id).run();
      return jsonResponse({ success: true, id, status });
    }

    if (action === 'upvote') {
      await db.prepare('UPDATE articles SET upvotes = upvotes + 1 WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true, id });
    }

    if (action === 'bookmark') {
      await db.prepare('UPDATE articles SET is_bookmarked = CASE WHEN is_bookmarked = 1 THEN 0 ELSE 1 END WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true, id });
    }

    if (action === 'pageview') {
      await db.prepare('UPDATE articles SET views = views + 1, unique_readers = unique_readers + 1 WHERE id = ?').bind(id).run();
      await db.prepare('UPDATE metrics SET total_views = total_views + 1, updated_at = datetime("now") WHERE id = 1').run();
      return jsonResponse({ success: true, id });
    }

    if (action === 'comment' && comment) {
      const commentId = comment.id || `c-${Date.now()}`;
      await db.prepare(`
        INSERT INTO comments (id, article_id, author, text, avatar, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(commentId, id, comment.author || 'Reader', comment.text, comment.avatar || '💬', new Date().toISOString()).run();
      return jsonResponse({ success: true, commentId });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// DELETE /api/articles?id=post-123
export async function onRequestDelete(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return jsonResponse({ error: 'Article ID required' }, 400);

  try {
    await db.prepare('DELETE FROM comments WHERE article_id = ?').bind(id).run();
    await db.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
    return jsonResponse({ success: true, id });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}
