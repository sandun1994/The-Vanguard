// Cloudflare Pages / Worker Function: POST /api/auth/login
// Validates credentials globally against Cloudflare KV (VANGUARD_AUTH_KV)

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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestPost(context) {
  try {
    const { username, password } = await context.request.json();
    if (!username || !password) {
      return jsonResponse({ success: false, error: 'Username and password are required' }, 400);
    }

    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();

    // 1. Fetch credentials from Cloudflare KV (VANGUARD_AUTH_KV)
    const kv = context.env.VANGUARD_AUTH_KV;
    let storedAuth = null;

    if (kv) {
      const rawKv = await kv.get('admin_credentials');
      if (rawKv) {
        storedAuth = JSON.parse(rawKv);
      }
    }

    // Default credentials if KV is empty
    const defaultPassHash = await hashPassword('admin123');
    const authData = storedAuth || {
      username: 'admin',
      passwordHash: defaultPassHash,
      email: 'admin@thevanguard.ai',
      fullName: 'System Administrator',
      lastChanged: null
    };

    const inputHash = await hashPassword(inputPass);

    const isUserValid = inputUser === authData.username.toLowerCase();
    const isPasswordValid = inputHash === authData.passwordHash;

    if (isUserValid && isPasswordValid) {
      return jsonResponse({
        success: true,
        user: {
          username: authData.username,
          email: authData.email || 'admin@thevanguard.ai',
          fullName: authData.fullName || 'System Administrator',
          lastChanged: authData.lastChanged
        }
      });
    }

    return jsonResponse({ success: false, error: 'Invalid admin username or password.' }, 401);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
