const token = localStorage.getItem('token');
console.log('Token found in localStorage:', token);

if (!token) {
  window.location.href = 'login.html';
} else {
  fetch('http://localhost:3000/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
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

// ===== Tab & Sub-tab Switching =====
document.querySelectorAll('.footer-item').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-sub');
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.sub-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`available-${target}`).classList.add('active');
  });
});

// ===== Load Purchased Materials =====
function loadPurchasedMaterials() {
  fetch('http://localhost:3000/api/auth/materials', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => {
    if (!res.ok) {
      console.error('Failed to fetch purchased materials. Status:', res.status);
      throw new Error('Failed to load materials');
    }
    return res.json();
  })
  .then(data => {
    console.log('Purchased materials:', data);
    const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
    purchasedGrid.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

      if (item.type === 'video') {
        const videoEl = document.createElement('video');
        videoEl.id = `video-${item._id}`;
        videoEl.controls = true;
        videoEl.preload = 'metadata';
        videoEl.setAttribute('controlsList', 'nodownload');
        videoEl.setAttribute('oncontextmenu', 'return false;');

        const titleEl = document.createElement('p');
        titleEl.innerText = item.title;

        const offlineBtn = document.createElement('button');
          offlineBtn.textContent = 'Make available offline';

          offlineBtn.onclick = async () => {
            try {
              const url = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8?token=${token}`;
              const reg = await navigator.serviceWorker.ready;
              reg.active?.postMessage({ type: 'PREFETCH_HLS', url });
              console.log('[OFFLINE] Prefetch requested:', url);
            } catch (e) {
              console.error('[OFFLINE] Prefetch failed:', e);
            }
        };

card.appendChild(offlineBtn);


        card.appendChild(videoEl);
        card.appendChild(titleEl);

        const hlsUrl = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8`;

        try {
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: function(xhr, url) {
                const separator = url.includes('?') ? '&' : '?';
                xhr.open('GET', url + separator + 'token=' + token, true);
              }
            });
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoEl);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // do nothing — user must click play
          });

          } else {
            videoEl.src = hlsUrl + `?token=${token}`;
          }
        } catch (err) {
          console.error(`[HLS] Error initializing video ${item._id}:`, err);
        }

      } else {
        const titleEl = document.createElement('p');
        titleEl.innerText = item.title;
        const linkEl = document.createElement('a');
        linkEl.href = `http://localhost:3000/api/materials/stream/${item._id}?token=${token}`;
        linkEl.target = '_blank';
        linkEl.innerText = 'Open PDF';
        card.appendChild(titleEl);
        card.appendChild(linkEl);
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

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}












/*
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
  .then(res => {
    if (!res.ok) {
      console.error('Failed to fetch purchased materials. Status:', res.status);
      throw new Error('Failed to load materials');
    }
    return res.json();
  })
  .then(data => {
    console.log('Purchased materials:', data);

    const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
    purchasedGrid.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

      if (item.type === 'video') {
        // Create video element
        const videoEl = document.createElement('video');
        videoEl.id = `video-${item._id}`;
        videoEl.controls = true;
        videoEl.preload = 'metadata';
        videoEl.setAttribute('controlsList', 'nodownload');
        videoEl.setAttribute('oncontextmenu', 'return false;');

        const titleEl = document.createElement('p');
        titleEl.innerText = item.title;

        card.appendChild(videoEl);
        card.appendChild(titleEl);

        // HLS streaming URL for manifest
        const hlsUrl = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8`;

        try {
          if (Hls.isSupported()) {
            const hls = new Hls({
              // Attach JWT token to all requests (manifest + segments)
              xhrSetup: function(xhr, url) {
                const separator = url.includes('?') ? '&' : '?';
                xhr.open('GET', url + separator + 'token=' + token, true);
              }
            });
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoEl);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoEl.play();
            });
          } else {
            // Safari fallback (HLS natively supported)
            videoEl.src = hlsUrl + `?token=${token}`;
          }
        } catch (err) {
          console.error(`[HLS] Error initializing video ${item._id}:`, err);
        }

      } else {
        // PDF handling
        const titleEl = document.createElement('p');
        titleEl.innerText = item.title;

        const linkEl = document.createElement('a');
        linkEl.href = `http://localhost:3000/api/materials/stream/${item._id}?token=${token}`;
        linkEl.target = '_blank';
        linkEl.innerText = 'Open PDF';

        card.appendChild(titleEl);
        card.appendChild(linkEl);
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
*/ 













