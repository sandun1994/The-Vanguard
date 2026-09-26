// Cloudflare Pages Function: /api/auth
// Validates & Updates Admin credentials in Cloudflare D1

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

// POST /api/auth (Login Verification)
export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const { username, password } = await context.request.json();
    const row = await db.prepare('SELECT * FROM admin_credentials WHERE id = 1').first();

    if (!row) {
      // Default fallback
      if (username === 'admin' && password === 'admin123') {
        return jsonResponse({ success: true, user: { username: 'admin', fullName: 'System Administrator' } });
      }
      return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);
    }

    if (row.username === username.trim() && row.password_hash === password) {
      return jsonResponse({
        success: true,
        user: {
          username: row.username,
          email: row.email,
          fullName: row.full_name,
          lastChanged: row.last_changed
        }
      });
    }

    return jsonResponse({ success: false, error: 'Incorrect username or password' }, 401);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// PUT /api/auth (Update credentials)
export async function onRequestPut(context) {
  const db = context.env.DB;
  if (!db) return jsonResponse({ error: 'D1 binding missing' }, 500);

  try {
    const updates = await context.request.json();
    const current = await db.prepare('SELECT * FROM admin_credentials WHERE id = 1').first() || {
      username: 'admin',
      password_hash: 'admin123',
      email: 'admin@thevanguard.ai',
      full_name: 'System Administrator'
    };

    const newUsername = updates.username || current.username;
    const newPassword = updates.password || current.password_hash;
    const newEmail = updates.email || current.email;
    const newFullName = updates.fullName || current.full_name;
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO admin_credentials (id, username, password_hash, email, full_name, last_changed)
      VALUES (1, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        password_hash = excluded.password_hash,
        email = excluded.email,
        full_name = excluded.full_name,
        last_changed = excluded.last_changed
    `).bind(newUsername, newPassword, newEmail, newFullName, now).run();

    return jsonResponse({
      success: true,
      credentials: {
        username: newUsername,
        email: newEmail,
        fullName: newFullName,
        lastChanged: now
      }
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}
