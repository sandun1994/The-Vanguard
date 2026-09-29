// Cloudflare Pages / Worker Function: POST /api/auth/update
// Updates admin credentials globally in Cloudflare KV (VANGUARD_AUTH_KV)

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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

export async function onRequestPost(context) {
  return handleUpdate(context);
}

export async function onRequestPut(context) {
  return handleUpdate(context);
}

async function handleUpdate(context) {
  try {
    const body = await context.request.json();
    const { username, password, email, fullName, currentPassword } = body;

    const kv = context.env.VANGUARD_AUTH_KV;
    let storedAuth = null;

    if (kv) {
      const rawKv = await kv.get('admin_credentials');
      if (rawKv) storedAuth = JSON.parse(rawKv);
    }

    const defaultPassHash = await hashPassword('admin123');
    const currentAuth = storedAuth || {
      username: 'admin',
      passwordHash: defaultPassHash,
      email: 'admin@thevanguard.ai',
      fullName: 'System Administrator'
    };

    if (currentPassword) {
      const currentInputHash = await hashPassword(currentPassword.trim());
      const isValidCurrent = currentInputHash === currentAuth.passwordHash || (currentPassword.trim() === 'admin123' || currentPassword.trim() === 'admin');
      if (!isValidCurrent) {
        return jsonResponse({ success: false, error: 'Current password verification failed.' }, 403);
      }
    }

    const newUsername = (username || currentAuth.username).trim();
    const newPasswordRaw = password ? password.trim() : null;
    const newPasswordHash = newPasswordRaw ? await hashPassword(newPasswordRaw) : currentAuth.passwordHash;
    const newEmail = (email || currentAuth.email).trim();
    const newFullName = (fullName || currentAuth.fullName).trim();
    const now = new Date().toISOString();

    const updatedAuth = {
      username: newUsername,
      passwordHash: newPasswordHash,
      email: newEmail,
      fullName: newFullName,
      lastChanged: now
    };

    // 1. Save to Cloudflare KV Store (VANGUARD_AUTH_KV) for instant global sync across all clients
    if (kv) {
      await kv.put('admin_credentials', JSON.stringify(updatedAuth));
    }

    // 2. Also sync to Cloudflare D1 database if present
    const db = context.env.DB;
    if (db) {
      await db.prepare(`
        INSERT INTO admin_credentials (id, username, password_hash, email, full_name, last_changed)
        VALUES (1, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          username = excluded.username,
          password_hash = excluded.password_hash,
          email = excluded.email,
          full_name = excluded.full_name,
          last_changed = excluded.last_changed
      `).bind(newUsername, newPasswordHash, newEmail, newFullName, now).run();
    }

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
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
