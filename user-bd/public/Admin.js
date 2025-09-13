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
  submitBtn.style.background = 'red';

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
      localStorage.setItem('adminToken', result.token);
      loginMessage.style.color = 'green';
      loginMessage.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        console.log('🔁 Redirecting to dashboard.html...');
        window.location.href = "dashboard.html";
      }, 1500);
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




















// let timeoutId;

// // ADMIN SIGNUP
//  document.getElementById('admin-signup').addEventListener('submit', async function (e) {
//   e.preventDefault();
//   console.log('✅ Admin signup form submitted');

//   const regMessage = document.querySelector('.regMessage');

//   const submitBtn = e.target.querySelector('button[type="submit"]');

//   submitBtn.disabled = true;
//   const originalText = submitBtn.textContent;
//   submitBtn.textContent = 'Signing in...';
//   submitBtn.style.background = 'red';

//   const form = e.target;
//   const data = {
//     username: form.username.value,
//     password: form.password.value
//   };

//   try {
//     const resp = await fetch('http://localhost:3000/api/admin/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });

//     console.log('Response status:', resp.status);

//     let result;
//     try {
//       result = await resp.json();
//       console.log('Parsed result:', result);
//     } catch (jsonErr) {
//       console.error('Failed to parse JSON:', jsonErr);
//       throw new Error("Invalid JSON from server");
//     }

//     if (resp.ok) {
//       alert(`✅ Your login code is: ${result.code}`);
//       regMessage.style.color = 'green';
//       regMessage.textContent = "Signup successful! Redirecting...";

//       setTimeout(() => {
//         const signupDiv = document.querySelector('.signup-form');
//         const loginDiv = document.querySelector('.login-form');

//         if (signupDiv && loginDiv) {
//           signupDiv.style.display = 'none';
//           loginDiv.style.display = 'block';

//         } else {
//           console.warn("One of the elements (.hide or #admin-signup) not found in DOM.");
//         }
//       }, 2000);
//     } else {
//       alert(`❌ Error: ${result.error || 'Signup failed'}`);
//     }
//   } catch (err) {
//     console.error("❌ Caught error:", err);
//     console.error("⚠️ Error during signup:", err.message);

//   } finally {
//     submitBtn.disabled = false;
//     submitBtn.textContent = originalText;
//   }
// });



// // ADMIN LOGIN
// document.getElementById('admin-login').addEventListener('submit', async function (e) {
//   e.preventDefault();
//   console.log('✅ Login form submitted');

//   const loginMessage = document.querySelector('.loginMessage');
//   const submitBtn = e.target.querySelector('button[type="submit"]');


// submitBtn.disabled = true;
// const originalText = submitBtn.textContent;
// submitBtn.textContent = 'Signing in...';
// submitBtn.style.background = 'red';

//   const form = e.target;
//   const data = {
//     username: form.username.value,
//     password: form.password.value,
//     code: form.code.value
//   };

//   try {
//     const resp = await fetch('http://localhost:3000/api/admin/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });

//     console.log('🔎 Response status:', resp.status);

//     let result;
//     try {
//       result = await resp.json();
//       console.log('📦 Parsed result:', result);
//     } catch (jsonErr) {
//       console.error('❌ Failed to parse JSON:', jsonErr);
//       throw new Error("Invalid response from server");
//     }

//     if (resp.ok) {
//       localStorage.setItem('adminToken', result.token);
//       loginMessage.style.color = 'green';
//       loginMessage.textContent = "Login successful! Redirecting...";

//       setTimeout(() => {
//         console.log('🔁 Redirecting to dashboard.html...');
//         window.location.href = "dashboard.html";
//       }, 1500);
//     } else {
//       alert(`❌ Login failed: ${result.error || 'Invalid credentials'}`);
//     }
//   } catch (err) {
//     console.error("🚨 Login error:", err);
//     alert("⚠️ Login request failed. Try again.");
//   } finally {
//     submitBtn.disabled = false;
//     submitBtn.textContent = originalText;
//   }
// });













// let timeoutId;

//     // ADMIN SIGNUP
//     const adminForm = document.getElementById('admin-signup');
//     adminForm.onsubmit = async (e) => {
//       e.preventDefault();
//       if (timeoutId) clearTimeout(timeoutId);

//       const form = e.target;
//       const data = {
//         username: form.username.value,
//         password: form.password.value
//       };

//       try {
//         const resp = await fetch('http://localhost:3000/api/admin/register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data)
//         });

//         const result = await resp.json();

//         if (resp.ok) {
//           alert(`✅ Your login code is: ${result.code}`);
//           timeoutId = setTimeout(() => {
//             adminForm.style.display = 'none';
//             document.querySelector('.hide').style.display = 'block';
//           }, 2000);
//         } else {
//           alert(`❌ Error: ${result.error}`);
//         }
//       } catch (err) {
//         alert("⚠️ Network error. Try again.");
//       }
//     };

//     // ADMIN LOGIN
//     const loginForm = document.getElementById('admin-login');
//     loginForm.onsubmit = async (e) => {
//       e.preventDefault();
//       const form = e.target;
//       const data = {
//         username: form.username.value,
//         code: form.code.value
//       };

//       try {
//         const resp = await fetch('http://localhost:3000/api/admin/login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data)
//         });

//         const result = await resp.json();

//         if (resp.ok) {
//           localStorage.setItem('adminToken', result.token);
//           alert("✅ Login successful. Redirecting to dashboard...");
//           window.location.href = 'dashboard.html';
//         } else {
//           alert(`❌ Login failed: ${result.error}`);
//         }
//       } catch (err) {
//         alert("⚠️ Login request failed. Try again.");
//       }
//     };





