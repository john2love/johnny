document.getElementById('regForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent page reload

  const message = document.getElementById('message');
  const submitBtn = document.querySelector('#regForm button[type="submit"]');

  // Disable the button and show progress
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';

  const formData = {
    username: e.target.username.value.trim(),
    email: e.target.email.value.trim(),
    password: e.target.password.value.trim()
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    let result = {};

    // Try to parse JSON if possible
    try {
      result = await response.json();
    } catch (jsonErr) {
      console.warn('Invalid JSON response');
    }

    if (response.ok) {
      message.style.color = 'green';
      message.textContent = result.message || "Registration successful!";

      setTimeout(() => {
        document.getElementById('regForm').reset();
        message.textContent = '';

        // ✅ Redirect to login page
        window.location.href = 'login.html';
      }, 3000);
    } else {
      message.style.color = 'red';
      message.textContent = result.error || result.message || "Something went wrong!";
    }

  } catch (error) {
    message.style.color = 'red';
    message.textContent = 'Network error. Please try again.';
    console.error(error);
  } finally {
    // ✅ Re-enable the button regardless of success/failure
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});











// document.getElementById('regForm').addEventListener('submit', async function(e) {
//   e.preventDefault(); // Prevent page reload

//   const message = document.getElementById('message');

//   const formData = {
//     username: e.target.username.value.trim(),
//     email: e.target.email.value.trim(),
//     password: e.target.password.value.trim()
//   };

//   try {
//     const response = await fetch('http://localhost:3000/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData)
//     });

//     const result = await response.json();

//     if (response.ok) {
//       message.style.color = 'green';
//       message.textContent = result.message || "Registration successful!";
//       setTimeout(() => {
//         document.getElementById('regForm').reset();
//         message.textContent = '';

//         // ✅ Redirect to login page
//         window.location.href = 'login.html';
//       }, 3000);
//     } else {
//       message.style.color = 'red';
//       message.textContent = result.error || result.message || "Something went wrong!";
//     }

//   } catch (error) {
//     message.style.color = 'red';
//     message.textContent = 'An error occurred.';
//     console.error(error);
//   }
// });



