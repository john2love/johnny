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

// Replace your existing loadPurchasedMaterials() with this function
async function loadPurchasedMaterials() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/materials', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error('Failed to fetch purchased materials, status:', res.status);
      return;
    }

    const data = await res.json();
    console.log('Purchased materials:', data);

    const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
    purchasedGrid.innerHTML = '';

    // iterate sequentially so large downloads don't all start at once (conservative)
    for (const item of data) {
      const card = document.createElement('div');
      card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

      // add title first
      const title = document.createElement('p');
      title.textContent = item.title || 'Untitled';
      card.appendChild(title);

      if (item.type === 'video') {
        const video = document.createElement('video');
        video.setAttribute('controls', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
        video.setAttribute('disablePictureInPicture', '');
        video.style.maxWidth = '100%';
        video.addEventListener('contextmenu', e => e.preventDefault());

        // show small loading indicator while we fetch the blob
        const loading = document.createElement('div');
        loading.textContent = 'Loading video...';
        loading.style.fontSize = '0.9em';
        card.appendChild(loading);

        try {
          // Fetch the protected stream with Authorization header
          const mediaRes = await fetch(item.streamUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!mediaRes.ok) {
            console.error('Failed to fetch media:', mediaRes.status, await mediaRes.text());
            loading.textContent = 'Unable to load video.';
          } else {
            const blob = await mediaRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            video.src = blobUrl;

            // Revoke blob URL when video is unloaded or ended to free memory
            video.addEventListener('ended', () => {
              try { URL.revokeObjectURL(blobUrl); } catch (e) {}
            });
            // Also revoke on page unload
            window.addEventListener('beforeunload', () => {
              try { URL.revokeObjectURL(blobUrl); } catch (e) {}
            });

            // remove loading indicator
            loading.remove();
            card.appendChild(video);
          }
        } catch (err) {
          console.error('Error fetching video blob:', err);
          loading.textContent = 'Error loading video.';
        }
      } else {
        // PDF handling: fetch blob and open in iframe (later replace with pdf.js)
        const loading = document.createElement('div');
        loading.textContent = 'Loading document...';
        card.appendChild(loading);

        try {
          const pdfRes = await fetch(item.streamUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!pdfRes.ok) {
            console.error('Failed to fetch pdf:', pdfRes.status);
            loading.textContent = 'Unable to load document.';
          } else {
            const blob = await pdfRes.blob();
            const blobUrl = URL.createObjectURL(blob);

            // use iframe to display; pdf.js would be better for security
            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            iframe.width = '100%';
            iframe.height = '500';
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin'); // slightly safer
            card.appendChild(iframe);

            // cleanup
            loading.remove();
            window.addEventListener('beforeunload', () => {
              try { URL.revokeObjectURL(blobUrl); } catch (e) {}
            });
          }
        } catch (err) {
          console.error('Error fetching PDF blob:', err);
          loading.textContent = 'Error loading document.';
        }
      }

      purchasedGrid.appendChild(card);
    }
  } catch (err) {
    console.error('Error loading purchased materials:', err);
  }
}
