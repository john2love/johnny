document.getElementById('regForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent page reload

  const message = document.getElementById('message');

  const formData = {
    username: e.target.username.value.trim(),
    email: e.target.email.value.trim(),
    password: e.target.password.value.trim()
  };
//'http://localhost:3000/api/auth/register', this is what connect frontend to backend
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      message.style.color = 'green';
      message.textContent = result.message || "Registration successful!";
      setTimeout(() => {
        document.getElementById('regForm').reset();
        message.textContent = '';
      }, 3000);
    } else {
      message.style.color = 'red';
      message.textContent = result.message || "Something went wrong!";
    }

  } catch (error) {
    message.style.color = 'red';
    message.textContent = 'An error occurred.';
    console.error(error);
  }
});



// document.getElementById('regForm').addEventListener('submit', async function(e) {
//   e.preventDefault(); // Prevent full page reload
//   let message = document.getElementById('message');

//     const formData = {
//         username: e.target.username.value,
//         email: e.target.email.value,
//         password: e.target.password.value        
//     };

//     try {
//       let clearone;
//         const sendAndResponse = await fetch('http://localhost:3000/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData)
//         });

//         const result = await sendAndResponse.json();
//         message.textContent =result;

//         if(clearone){
//           clearTimeout(clearone);
//         }

//          if (sendAndResponse.ok) {
      
//           clearone = setTimeout(() => {
//           document.getElementById('regForm').reset();
//         }, 3000);
//       }

//     } 
//     catch (error) {
//         message.textContent = 'An error occurred.';
//         console.error(error);
//     }

    
// });
 


