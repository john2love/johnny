// ===============================
// Render Layout (FORCE GUEST NAVBAR)
// ===============================
(async () => {
  document.getElementById("navbar").innerHTML =
    await window.renderNavbar(true); // 👈 FORCE GUEST
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// ===============================
// Handle Login
// ===============================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const loginMessage = document.getElementById('loginMessage');
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';

  const credentials = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim()
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();

    if (!response.ok) {
      loginMessage.style.color = 'red';
      loginMessage.textContent = result.message || 'Invalid credentials';
      return;
    }

    if (!result.token || !result.user) {
      throw new Error('Missing token or user data');
    }

    // ✅ STORE TOKEN (ROLE COMES FROM BACKEND PROFILE)
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    loginMessage.style.color = 'green';
    loginMessage.textContent = 'Login successful! Redirecting...';

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1000);

  } catch (err) {
    console.error('❌ Login error:', err);
    loginMessage.style.color = 'red';
    loginMessage.textContent = 'Login failed. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});





/*Reset any existing auth safely
if (typeof window.clearAuth === "function") {
  window.clearAuth();
}

// Render layout
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// Handle login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const loginMessage = document.getElementById('loginMessage');
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';

  const credentials = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim()
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();

    if (!response.ok) {
      loginMessage.style.color = 'red';
      loginMessage.textContent = result.message || 'Invalid credentials';
      return;
    }

    if (!result.token || !result.user) {
      throw new Error('Missing token or user data');
    }

    // ✅ STORE TOKEN ONLY (ROLE COMES FROM BACKEND)
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    loginMessage.style.color = 'green';
    loginMessage.textContent = 'Login successful! Redirecting...';

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1000);

  } catch (err) {
    console.error('❌ Login error:', err);
    loginMessage.style.color = 'red';
    loginMessage.textContent = 'Login failed. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
*/





