// ==========================
// auth.js – Global Auth Utilities
// ==========================

const API_BASE_URL = (() => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return `${location.protocol}//${location.host}`;
})();

// 🔒 Singleton cache
let authPromise = null;

async function getAuthState() {
  if (authPromise) return authPromise;

  authPromise = (async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) {
      return { isAuth: false, role: 'guest' };
    }

    try {
      if (role === 'admin') {
        const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Admin auth failed');

        const data = await res.json();
        return { isAuth: true, role: 'admin', token, admin: data.admin };
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('User auth failed');

      const data = await res.json();
      return { isAuth: true, role: 'user', token, user: data.user };

    } catch (err) {
      clearAuth();
      return { isAuth: false, role: 'guest' };
    }
  })();

  return authPromise;
}

window.getAuthState = getAuthState;

// ==========================
// Clear Authentication
// ==========================
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  authPromise = null;
}

window.clearAuth = clearAuth;

// ==========================
// Logout Handler
// ==========================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#logoutBtn');
  if (!btn) return;

  const role = localStorage.getItem('role');
  clearAuth();

  window.location.href =
    role === 'admin' ? 'admin-dashboard.html' : 'adminSignLogin.html';
});








/*
// ==========================
// auth.js – Global Auth Utilities
// ==========================

// Dynamically resolve backend base URL
const API_BASE_URL = (() => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'http://localhost:3000';
  }
  return `${window.location.protocol}//${window.location.host}`;
})();

// ==========================
// Get Authentication State
// ==========================
async function getAuthState() {
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');

  if (!token || !storedRole) {
    return { isAuth: false, role: 'guest' };
  }

  try {
    // ==========================
    // ADMIN TOKEN VALIDATION
    // ==========================
    if (storedRole === 'admin') {
      const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Admin auth failed: ${res.status}`);
      }

      const data = await res.json();

      return {
        isAuth: true,
        role: 'admin',
        token,
        admin: data.admin
      };
    }

    // ==========================
    // USER TOKEN VALIDATION
    // ==========================
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`User auth failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      isAuth: true,
      role: data.user.role || 'user',
      token,
      user: data.user
    };

  } catch (err) {
    console.error('❌ Auth validation failed:', err.message);
    clearAuth();
    return { isAuth: false, role: 'guest' };
  }
}

// Expose globally
window.getAuthState = getAuthState;

// ==========================
// Clear Authentication
// ==========================
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}

window.clearAuth = clearAuth;

// ==========================
// Logout Button Handler
// ==========================
document.addEventListener('click', (e) => {
  const logoutBtn = e.target.closest('#logoutBtn');
  if (!logoutBtn) return;

  const role = localStorage.getItem('role');

  clearAuth();

  // ✅ Role-aware redirect
  if (role === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'adminSingLogin.html';
  }
});
*/
