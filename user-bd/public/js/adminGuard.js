(async () => {
  if (window.__adminGuardRan) return;
  window.__adminGuardRan = true;

  const { isAuth, role } = await window.getAuthState();

  if (!isAuth) {
    window.location.href = 'adminSignLogin.html';
    return;
  }

  if (role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  // ✅ Access granted
})();






/*(async () => {
  // ✅ Prevent multiple executions
  if (window.__adminGuardRan) return;
  window.__adminGuardRan = true;

  const { isAuth, role } = await window.getAuthState();

  // ❌ Not logged in → admin login
  if (!isAuth) {
    window.location.href = "adminSignLogin.html";
    return;
  }

  // ❌ Logged in but not admin
  if (role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  // ✅ Admin authenticated — page allowed
})();
*/