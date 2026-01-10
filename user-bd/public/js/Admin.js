
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();


let timeoutId;

// ADMIN SIGNUP
document.getElementById('admin-signup').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('✅ Admin signup form submitted');

  const regMessage = document.querySelector('.regMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]'); // ✅ safer selector
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.style.background = 'red';

  const form = e.target;
  const data = {
    username: form.username.value,
    password: form.password.value
  };

  try {
    const resp = await fetch('http://localhost:3000/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('Response status:', resp.status);

    let result;
    try {
      result = await resp.json();
      console.log('Parsed result:', result);
    } catch (jsonErr) {
      console.error('Failed to parse JSON:', jsonErr);
      throw new Error("Invalid JSON from server");
    }

    if (resp.ok) {
      alert(`✅ Your login code is: ${result.code}`);
      regMessage.style.color = 'green';
      regMessage.textContent = "Signup successful! Redirecting...";

      setTimeout(() => {
        const signupDiv = document.querySelector('.signup-form');
        const loginDiv = document.querySelector('.login-form');

        if (signupDiv && loginDiv) {
          signupDiv.style.display = 'none';
          loginDiv.style.display = 'block';
        } else {
          console.warn("One of the elements (.signup-form or .login-form) not found in DOM.");
        }
      }, 2000);
    } else {
      alert(`❌ Error: ${result.error || 'Signup failed'}`);
    }
  } catch (err) {
    console.error("❌ Caught error:", err);
    console.error("⚠️ Error during signup:", err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// ADMIN LOGIN
document.getElementById('admin-login').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('✅ Login form submitted');

  const loginMessage = document.querySelector('.loginMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]'); // ✅ safer selector

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.style.background = 'green';

  const form = e.target;
  const data = {
    username: form.username.value,
    password: form.password.value,
    code: form.code.value
  };

  try {
    const resp = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('🔎 Response status:', resp.status);

    let result;
    try {
      result = await resp.json();
      console.log('📦 Parsed result:', result);
    } catch (jsonErr) {
      console.error('❌ Failed to parse JSON:', jsonErr);
      throw new Error("Invalid response from server");
    }

   if (resp.ok) {
        // 🔥 CLEAR OLD AUTH FIRST
    window.clearAuth();
  // 🔐 Unified frontend auth state
  localStorage.setItem('token', result.token);
  localStorage.setItem('role', 'admin');

  // Optional: store admin info if backend sends it
  if (result.admin) {
    localStorage.setItem('user', JSON.stringify(result.admin));
  }

  loginMessage.style.color = 'green';
  loginMessage.textContent = "Login successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "admin-dashboard.html";
  }, 1500);
}
 else {
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




















