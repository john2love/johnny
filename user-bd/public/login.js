document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log('Form submitted');

  const loginMessage = document.getElementById('loginMessage');
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');

  // Disable the button and show progress
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.style.background = 'red';  // Fixed: changed from `background` to `style.background`

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

    console.log('✅ Server responded with status:', response.status);
    console.log('📦 Server result payload:', result);

    if (response.ok) {
      if (result.token && result.user) {
        // Store JWT token and user info in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        console.log('✅ Login token saved to localStorage.');
        console.log('✅ User data saved to localStorage.');

        // Show success message
        loginMessage.style.color = 'green';
        loginMessage.textContent = "Login successful! Redirecting...";

        // Redirect to profile page after short delay
        setTimeout(() => {
          console.log('🔁 Redirecting to profile.html...');
          window.location.href = "profile.html";
        }, 1500);
      } else {
        console.error("❌ Login failed: Missing token or user data.");
        loginMessage.style.color = 'red';
        loginMessage.textContent = "Login failed: No token or user data received.";
      }
    } else {
      console.warn('⚠️ Login failed with server message:', result.message);
      loginMessage.style.color = 'red';
      loginMessage.textContent = result.message || "Invalid credentials!";
    }

  } catch (error) {
    console.error('💥 Login error:', error);
    loginMessage.style.color = 'red';
    loginMessage.textContent = 'An error occurred during login.';
  } finally {
    // ✅ Re-enable the button regardless of success/failure
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});







// document.getElementById('loginForm').addEventListener('submit', async function(e) {
//   e.preventDefault();
//   console.log('Form submitted');

//   const loginMessage = document.getElementById('loginMessage');

//    const submitBtn = document.querySelector('#loginForm button[type="submit"]');

//   // Disable the button and show progress
//   submitBtn.disabled = true;
//   const originalText = submitBtn.textContent;
//   submitBtn.textContent = 'Signing in...';
//   submitBtn.background = 'red';

//   const credentials = {
//     username: e.target.username.value.trim(),
//     password: e.target.password.value.trim()
//   };

//   try {
//     const response = await fetch('http://localhost:3000/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(credentials)
//     });

//     const result = await response.json();

//     if (response.ok) {
//       // Debugging logs
//       console.log('Received token:', result.token);
//       console.log('User data:', result.user);

//       if (result.token) {
//         // Store JWT token and user info in localStorage
//         localStorage.setItem('token', result.token);
       
//         console.log('Login token saved to localStorage.');

//         // Show success message
//         loginMessage.style.color = 'green';
//         loginMessage.textContent = "Login successful! Redirecting...";

//         // Redirect to profile page after short delay
//         setTimeout(() => {
//           window.location.href = "profile.html";
//         }, 1500);
//       } else {
//         // If token is missing
//         loginMessage.style.color = 'red';
//         loginMessage.textContent = "Login failed: No token received.";
//         console.error("Login failed: Token was not returned.");
//       }
//     } else {
//       loginMessage.style.color = 'red';
//       loginMessage.textContent = result.message || "Invalid credentials!";
//       console.warn('Login failed with message:', result.message);
//     }

//   } catch (error) {
//     console.error('Login error:', error);
//     loginMessage.style.color = 'red';
//     loginMessage.textContent = 'An error occurred during login.';
//   }
//   finally {
//     // ✅ Re-enable the button regardless of success/failure
//     submitBtn.disabled = false;
//     submitBtn.textContent = originalText;
//   }
// });






// // document.getElementById('loginForm').addEventListener('submit', async function(e) {
// //   e.preventDefault();
// //   console.log('form submitted');

// //   const loginMessage = document.getElementById('loginMessage');

// //   const credentials = {
// //     username: e.target.username.value.trim(),
// //     password: e.target.password.value.trim()
// //   };

// //   try {
// //     const response = await fetch('http://localhost:3000/api/auth/login', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(credentials)
// //     });

// //     const result = await response.json();

// //     if (response.ok) {
// //       // Store JWT token in localStorage (optional)
// //       localStorage.setItem('token', result.token);
// //       localStorage.setItem('user', JSON.stringify(result.user));

// //       loginMessage.style.color = 'green';
// //       loginMessage.textContent = "Login successful! Redirecting...";

// //       // Redirect to profile page after delay
// //       setTimeout(() => {
// //         window.location.href = "profile.html";
// //       }, 1500);
// //     } else {
// //       loginMessage.style.color = 'red';
// //       loginMessage.textContent = result.message || "Invalid credentials!";
// //     }

// //   } catch (error) {
// //     console.error(error);
// //     loginMessage.style.color = 'red';
// //     loginMessage.textContent = 'An error occurred during login.';
// //   }
// // });
