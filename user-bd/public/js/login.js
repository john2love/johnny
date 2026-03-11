// ===============================
// Initialize Layout & Login Logic
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // Render Navbar (guest state on login page)
  const navbarEl = document.getElementById("navbar");
  if (navbarEl && typeof window.renderNavbar === "function") {
    navbarEl.innerHTML = await window.renderNavbar();
  }

  // Render Footer
  const footerEl = document.getElementById("footer");
  if (footerEl && typeof window.renderFooter === "function") {
    footerEl.innerHTML = window.renderFooter();
  }

  // Attach Login Handler
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginMessage = document.getElementById("loginMessage");
  const submitBtn = loginForm.querySelector('button[type="submit"]');

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!submitBtn || !loginMessage) return;

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) {
      loginMessage.textContent = "Please enter username and password.";
      loginMessage.style.color = "red";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
      const response = await fetch(
        `${window.API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      if (!response.ok) {
        loginMessage.textContent = "Invalid credentials.";
        loginMessage.style.color = "red";
        return;
      }

      const result = await response.json();

      if (!result || !result.token || !result.user) {
        loginMessage.textContent = "Login failed. Invalid server response.";
        loginMessage.style.color = "red";
        return;
      }

      // Save auth state
      window.setAuth(result.token, result.user);

      loginMessage.textContent = "Login successful! Redirecting...";
      loginMessage.style.color = "green";

      setTimeout(() => {
        window.location.href =
          result.user.role === "admin"
            ? "admin-dashboard.html"
            : "profile.html";
      }, 600);

    } catch (error) {
      console.error("Login error:", error);
      loginMessage.textContent = "Network error. Please try again.";
      loginMessage.style.color = "red";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
});











/*
// ===============================
// Render Layout (FORCE GUEST NAVBAR)
// ===============================
(async () => {
  console.log("🧭 [Login] Layout bootstrap");

  const navbarEl = document.getElementById("navbar");
  if (navbarEl) {
    navbarEl.innerHTML = await window.renderNavbar(true);
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = window.renderFooter();
  }
})();

// ===============================
// Handle Login
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 [Login] DOM ready");

  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("❌ [Login] loginForm not found");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) {
    console.error("❌ [Login] submit button not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🚀 [Login] Submit fired");

    const loginMessage = document.getElementById("loginMessage");
    if (!loginMessage) return;

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Signing in...";

    const credentials = {
      username: e.target.username.value.trim(),
      password: e.target.password.value.trim()
    };
    console.log("📦 [Login] Credentials =", credentials);

    try {
      const response = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      console.log("📨 [Login] HTTP status =", response.status);
      const result = await response.json();
      console.log("📨 [Login] Response =", result);

      if (!response.ok || !result.token || !result.user) {
        console.error("❌ [Login] API rejected login");
        loginMessage.style.color = "red";
        loginMessage.textContent = result.message || "Login failed";
        return;
      }

      // 🔐 Save auth using new cache-safe function
      window.setAuth(result.token, result.user);

      loginMessage.style.color = "green";
      loginMessage.textContent = "Login successful! Redirecting...";

      console.log("➡️ [Login] Redirecting, role =", result.user.role);

      setTimeout(() => {
        if (result.user.role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "profile.html";
        }
      }, 700);

    } catch (err) {
      console.error("🔥 [Login] Crash", err);
      loginMessage.style.color = "red";
      loginMessage.textContent = "Login failed. Please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

*/






