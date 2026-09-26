// Cloudflare Pages Function: /api/settings
// Persists Governance & Agent Prompts settings to Cloudflare D1

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const row = await db.prepare("SELECT value FROM settings WHERE key = 'site_settings'").first();
    if (row && row.value) {
      return jsonResponse(JSON.parse(row.value));
    }
    return jsonResponse({});
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const settings = await context.request.json();
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES ('site_settings', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(JSON.stringify(settings), now).run();

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}
