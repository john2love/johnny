const token = localStorage.getItem('token');
console.log('Token found in localStorage:', token);

if (!token) {
  window.location.href = 'login.html';
} else {
  fetch('http://localhost:3000/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) {
      console.error('Failed to fetch profile. Status:', res.status);
      throw new Error('Unauthorized');
    }
    return res.json();
  })
  .then(data => {
    console.log('Profile data:', data);
    document.getElementById('username').innerText = data.user.username;
    document.getElementById('email').innerText = data.user.email;
  })
  .catch(err => {
    console.error('Error fetching profile:', err.message);
    window.location.href = 'login.html';
  });
}

// ===== New Code for Tabs & Dynamic Content =====

// Tab switching
document.querySelectorAll('.footer-item').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-tab');
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// Sub-tab switching (Videos / PDFs in Available Materials)
document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-sub');

    // Remove active from all buttons
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Hide all sub-content
    document.querySelectorAll('.sub-tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Show selected sub-content
    document.getElementById(`available-${target}`).classList.add('active');
  });
});

// Load Purchased Materials
function loadPurchasedMaterials() {
  fetch('http://localhost:3000/api/auth/materials', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    console.log('Purchased materials:', data);

    const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
    purchasedGrid.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

      if (item.type === 'video') {
        card.innerHTML = `
          <video src="${item.url}" controls></video>
          <p>${item.title}</p>
        `;
      } else {
        card.innerHTML = `
          <p>${item.title}</p>
          <a href="${item.url}" target="_blank">Open PDF</a>
        `;
      }

      purchasedGrid.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading purchased materials:', err));
}

// Load data on page ready
document.addEventListener('DOMContentLoaded', () => {
  loadPurchasedMaterials();

});


























// const token = localStorage.getItem('token');
// console.log('Token found in localStorage:', token);

// if (!token) {
//   window.location.href = 'login.html';
// } else {
//   fetch('http://localhost:3000/api/auth/profile', {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(res => {
//     if (!res.ok) {
//       console.error('Failed to fetch profile. Status:', res.status);
//       throw new Error('Unauthorized');
//     }
//     return res.json();
//   })
//   .then(data => {
//     console.log('Profile data:', data);
//     document.getElementById('username').innerText = data.user.username;
//     document.getElementById('email').innerText = data.user.email;
//   })
//   .catch(err => {
//     console.error('Error fetching profile:', err.message);
//     window.location.href = 'login.html';
//   });
// }

// // ===== New Code for Tabs & Dynamic Content =====

// // Tab switching
// document.querySelectorAll('.footer-item').forEach(item => {
//   item.addEventListener('click', () => {
//     const target = item.getAttribute('data-tab');
    
//     // Hide all tabs
//     document.querySelectorAll('.tab-content').forEach(tab => {
//       tab.classList.remove('active');
//     });

//     // Show selected tab
//     document.getElementById(`tab-${target}`).classList.add('active');
//   });
// });

// // Sub-tab switching (Videos / PDFs in Available Materials)
// document.querySelectorAll('.sub-tab-btn').forEach(btn => {
//   btn.addEventListener('click', () => {
//     const target = btn.getAttribute('data-sub');

//     // Remove active from all buttons
//     document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');

//     // Hide all sub-content
//     document.querySelectorAll('.sub-tab-content').forEach(content => {
//       content.classList.remove('active');
//     });

//     // Show selected sub-content
//     document.getElementById(`available-${target}`).classList.add('active');
//   });
// });


// // Load Purchased Materials
// function loadPurchasedMaterials() {
//   fetch('http://localhost:3000/api/user/materials', {
//     headers: { 'Authorization': `Bearer ${token}` }
//   })
//   .then(res => res.json())
//   .then(data => {
//     console.log('Purchased materials:', data);

//     const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
//     purchasedGrid.innerHTML = '';

//     data.forEach(item => {
//       const card = document.createElement('div');
//       card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

//       if (item.type === 'video') {
//         card.innerHTML = `
//           <video src="${item.url}" controls></video>
//           <p>${item.title}</p>
//         `;
//       } else {
//         card.innerHTML = `
//           <p>${item.title}</p>
//           <a href="${item.url}" target="_blank">Open PDF</a>
//         `;
//       }

//       purchasedGrid.appendChild(card);
//     });
//   })
//   .catch(err => console.error('Error loading purchased materials:', err));
// }

// // Buy button click
// function attachBuyEvents() {
//   document.querySelectorAll('.buy-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const materialId = btn.getAttribute('data-id');
//       console.log('Buy Now clicked for:', materialId);

//       // Call backend to initiate Paystack payment
//       fetch('http://localhost:3000/api/paystack/initiate-payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ materialId })
//       })
//       .then(res => res.json())
//       .then(data => {
//         if (data.authorization_url) {
//           // Redirect to Paystack checkout
//           window.location.href = data.authorization_url;
//         } else {
//           alert('Error initiating payment. Please try again.');
//         }
//       })
//       .catch(err => {
//         console.error('Error initiating payment:', err);
//         alert('Error initiating payment. Please try again.');
//       });
//     });
//   });
// }

// // Load data on page ready
// document.addEventListener('DOMContentLoaded', () => {
//   loadAvailableMaterials();
//   loadPurchasedMaterials();
// });


















// const token = localStorage.getItem('token');
// console.log('Token found in localStorage:', token); // ✅ log it

// if (!token) {
//   window.location.href = 'login.html';
// } else {
//   fetch('http://localhost:3000/api/auth/profile', {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(res => {
//     if (!res.ok) {
//       console.error('Failed to fetch profile. Status:', res.status); // log response
//       throw new Error('Unauthorized');
//     }
//     return res.json();
//   })
//   .then(data => {
//     console.log('Profile data:', data); // ✅ log profile data
//     document.getElementById('username').innerText = data.user.username;
//     document.getElementById('email').innerText = data.user.email;
//   })
//   .catch(err => {
//     console.error('Error fetching profile:', err.message);
//     window.location.href = 'login.html';
//   });
// }
