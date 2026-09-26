// Cloudflare Pages Function: /api/seed
// Populates Cloudflare D1 with initial seed articles if empty

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const { articles } = await context.request.json();
    if (!Array.isArray(articles) || articles.length === 0) {
      return jsonResponse({ error: 'No articles provided in payload' }, 400);
    }

    let inserted = 0;
    const now = new Date().toISOString();

    for (const article of articles) {
      const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await db.prepare(`
        INSERT OR IGNORE INTO articles (
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
      `).bind(
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
      inserted++;
    }

    return jsonResponse({ success: true, seeded: inserted });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}
