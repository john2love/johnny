// ==========================
// auth.js – Global Auth Utilities
// ==========================

// API Base URL Detection
const API_BASE_URL = (() => {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  return `${location.protocol}//${location.host}`;
})();

// Singleton cache
let authPromise = null;

// ==========================
// Get Auth State
// ==========================
async function getAuthState(forceRefresh = false) {
  if (authPromise && !forceRefresh) {
    return authPromise;
  }

  authPromise = (async () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      return { isAuth: false, role: "guest" };
    }

    let user;
    try {
      user = JSON.parse(userRaw);
    } catch (err) {
      clearAuth();
      return { isAuth: false, role: "guest" };
    }

    const role = user?.role === "admin" ? "admin" : "user";

    const roleRoutes = {
    // Use the same profile endpoint for both roles
    admin: "/api/auth/profile",
    user: "/api/auth/profile",
};

/*
    const roleRoutes = {
      admin: "/api/admin/profile",
      user: "/api/auth/profile",
    };
    */

    const endpoint = `${API_BASE_URL}${roleRoutes[role]}`;

    try {
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        clearAuth();
        return { isAuth: false, role: "guest" };
      }

      if (!res.ok) {
        throw new Error(`Auth validation failed: ${res.status}`);
      }

      const data = await res.json();

      return {
        isAuth: true,
        role,
        token,
        user: data.user || data.admin || user,
      };
    } catch (err) {
      console.error("[Auth] Profile validation failed:", err);
      clearAuth();
      return { isAuth: false, role: "guest" };
    }
  })();

  return authPromise;
}

window.getAuthState = getAuthState;

// ==========================
// Save Auth State
// ==========================
function setAuth(token, user) {
  if (!token || !user) return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // Reset cache so next call revalidates
  authPromise = null;
}

window.setAuth = setAuth;

// ==========================
// Clear Authentication
// ==========================
function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  authPromise = null;
}

window.clearAuth = clearAuth;

// ==========================
// Logout Handler (Global)
// ==========================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#logoutBtn");
  if (!btn) return;

  let role = "user";

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    role = user?.role === "admin" ? "admin" : "user";
  } catch {
    role = "user";
  }

  clearAuth();

  window.location.href =
    role === "admin" ? "adminSignLogin.html" : "login.html";
});










/* ==========================
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

*/






