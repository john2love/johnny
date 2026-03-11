// ===============================
// Render Layout
// ===============================
(async () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.innerHTML = await window.renderNavbar();
  }

  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = window.renderFooter();
  }
})();

// ===============================
// ADMIN SIGNUP
// ===============================
document.getElementById('admin-signup')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log("🚀 Admin signup submitted");

  const regMessage = document.querySelector('.regMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing up...';

  const form = e.target;
  const data = {
    username: form.username.value.trim(),
    password: form.password.value.trim()
  };

  try {
    const resp = await fetch(`${window.API_BASE_URL}/api/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log("📨 Signup response status:", resp.status);

    if (!resp.ok) {
      const text = await resp.text();
      console.error("❌ Raw signup error response:", text);

      if (regMessage) {
        regMessage.style.color = "red";
        regMessage.textContent = "Signup failed.";
      }
      return;
    }

    const result = await resp.json();
    console.log("📨 Signup parsed response:", result);

    if (regMessage) {
      regMessage.style.color = 'green';
      regMessage.textContent = "Signup successful! Redirecting...";
    }

    if (result.code) {
      alert(`✅ Your signup code: ${result.code}`);
    }

    setTimeout(() => {
      document.querySelector('.signup-form')?.classList.add('hidden');
      document.querySelector('.login-form')?.classList.remove('hidden');
    }, 1500);

  } catch (err) {
    console.error("🔥 Admin signup crash:", err);
    if (regMessage) {
      regMessage.style.color = "red";
      regMessage.textContent = "Network error. Try again.";
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// ===============================
// ADMIN LOGIN
// ===============================
document.getElementById('admin-login')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log("🚀 Admin login submitted");

  const loginMessage = document.querySelector('.loginMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';

  const form = e.target;
  const data = {
    username: form.username.value.trim(),
    password: form.password.value.trim(),
    code: form.code?.value?.trim()
  };

  try {
    const resp = await fetch(`${window.API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log("📨 Login response status:", resp.status);

    if (!resp.ok) {
      const text = await resp.text();
      console.error("❌ Raw login error response:", text);

      if (loginMessage) {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Login failed.";
      }
      return;
    }

    const result = await resp.json();
    console.log("📨 Login parsed response:", result);

    if (!result.token || !result.admin) {
      console.error("❌ Missing token or admin in response");
      if (loginMessage) {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Login failed.";
      }
      return;
    }

    // Clear old session before setting admin auth
    window.clearAuth();
    window.setAuth(result.token, result.admin);

    if (loginMessage) {
      loginMessage.style.color = 'green';
      loginMessage.textContent = "Login successful! Redirecting...";
    }

    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 1000);

  } catch (err) {
    console.error("🔥 Admin login crash:", err);
    if (loginMessage) {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Network error. Try again.";
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});








/*(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// --------------------------
// ADMIN SIGNUP
// --------------------------
document.getElementById('admin-signup')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('✅ Admin signup form submitted');

  const regMessage = document.querySelector('.regMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing up...';
  submitBtn.style.background = 'red';

  const form = e.target;
  const data = { username: form.username.value, password: form.password.value };

  try {
    const resp = await fetch(`${window.API_BASE_URL}/api/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    let result;
    try { result = await resp.json(); } 
    catch { throw new Error("Invalid JSON from server"); }

    if (resp.ok) {
      alert(`✅ Your signup code: ${result.code}`);
      regMessage.style.color = 'green';
      regMessage.textContent = "Signup successful! Redirecting...";

      setTimeout(() => {
        document.querySelector('.signup-form')?.classList.add('hidden');
        document.querySelector('.login-form')?.classList.remove('hidden');
      }, 2000);
    } else {
      alert(`❌ Error: ${result.error || 'Signup failed'}`);
    }
  } catch (err) {
    console.error("❌ Signup error:", err);
    alert("⚠️ Signup failed. Try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// --------------------------
// ADMIN LOGIN
// --------------------------
document.getElementById('admin-login')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('✅ Admin login form submitted');

  const loginMessage = document.querySelector('.loginMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.style.background = 'green';

  const form = e.target;
  const data = { username: form.username.value, password: form.password.value, code: form.code?.value };

  try {
    const resp = await fetch(`${window.API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    let result;
    try { result = await resp.json(); } 
    catch { throw new Error("Invalid JSON from server"); }

    if (resp.ok) {
      // 🔥 Clear old auth
      window.clearAuth();
      window.setAuth(result.token, result.admin);

      loginMessage.style.color = 'green';
      loginMessage.textContent = "Login successful! Redirecting...";

      setTimeout(() => window.location.href = "admin-dashboard.html", 1500);
    } else {
      alert(`❌ Login failed: ${result.error || 'Invalid credentials'}`);
    }
  } catch (err) {
    console.error("🚨 Login error:", err);
    alert("⚠️ Login request failed. Try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
*/

















