(async () => {
  const auth = await window.getAuthState();

  if (!auth.isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (auth.role !== "user") {
    window.location.href = "index.html";
    return;
  }

  // Populate profile UI
  if (auth.user) {
    document.getElementById('username').innerText = auth.user.username;
    document.getElementById('email').innerText = auth.user.email;
  }

  // Render layout AFTER auth
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
  document.getElementById("footer").innerHTML = window.renderFooter();
})();

// ===============================
// Token (used only for API calls)
// ===============================
const token = localStorage.getItem('token');

// ===============================
// Tab & Sub-tab Switching
// ===============================
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

// ===============================
// Load Purchased Materials
// ===============================
function loadPurchasedMaterials() {
  fetch('http://localhost:3000/api/auth/materials', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load materials');
      return res.json();
    })
    .then(data => {
      const purchasedGrid = document.getElementById('purchasedMaterialsGrid');
      purchasedGrid.innerHTML = '';

      data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add(item.type === 'video' ? 'video-card' : 'pdf-card');

        if (item.type === 'video') {
          const videoEl = document.createElement('video');
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
            } catch (e) {
              console.error('[OFFLINE] Prefetch failed:', e);
            }
          };

          card.appendChild(offlineBtn);
          card.appendChild(videoEl);
          card.appendChild(titleEl);

          const hlsUrl = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8`;

          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup(xhr, url) {
                const sep = url.includes('?') ? '&' : '?';
                xhr.open('GET', url + sep + 'token=' + token, true);
              }
            });
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoEl);
          } else {
            videoEl.src = `${hlsUrl}?token=${token}`;
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
    .catch(err => console.error('Error loading purchased materials:', err.message));
}

// ===============================
// Page Ready
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  loadPurchasedMaterials();
});

// ===============================
// Service Worker
// ===============================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('SW registration failed:', err));
  });
}

// ===============================
// UI-only Sections (unchanged)
// ===============================
const enrolledCourses = [
  { title: "JavaScript Fundamentals", level: "Beginner", progress: 40 },
  { title: "Node.js Backend", level: "Intermediate", progress: 20 },
];

const enrolledGrid = document.getElementById("enrolled-courses-grid");
if (enrolledGrid) {
  enrolledGrid.innerHTML = enrolledCourses
    .map(course => renderCourseCard(course, true))
    .join("");
}

const availableMaterials = [
  { type: "video", title: "JavaScript Variables", instructor: "John Doe" },
  { type: "video", title: "DOM Manipulation", instructor: "Jane Smith" },
  { type: "pdf", title: "JavaScript Cheat Sheet", instructor: "John Doe" },
];

const videosGrid = document.getElementById("availableVideosGrid");
const pdfsGrid = document.getElementById("availablePDFsGrid");

if (videosGrid && pdfsGrid) {
  videosGrid.innerHTML = availableMaterials
    .filter(m => m.type === "video")
    .map(window.renderMaterialCard)
    .join("");

  pdfsGrid.innerHTML = availableMaterials
    .filter(m => m.type === "pdf")
    .map(window.renderMaterialCard)
    .join("");
}





/*(async () => {
  const { isAuth, role } = await window.getAuthState();

  if (!isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (role !== "user") {
    window.location.href = "index.html";
    return;
  }

  // ✅ SAFE: authenticated user continues loading page
})();



document.getElementById("navbar").innerHTML = window.renderNavbar();

document.getElementById("footer").innerHTML = window.renderFooter();

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
    navigator.serviceWorker.register('../sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}

// ===== Enrolled Courses (UI-only) =====
const enrolledCourses = [
  { title: "JavaScript Fundamentals", level: "Beginner", progress: 40 },
  { title: "Node.js Backend", level: "Intermediate", progress: 20 },
];

const enrolledGrid = document.getElementById("enrolled-courses-grid");

if (enrolledGrid) {
  enrolledGrid.innerHTML = enrolledCourses
    .map(course => renderCourseCard(course, true)) // progress mode
    .join("");
}
// ===== Available Materials (Resource Library | UI-only) =====

// Sample materials (UI-only)
const availableMaterials = [
  {
    type: "video",
    title: "JavaScript Variables",
    instructor: "John Doe",
    description: "Understanding variables in JS",
  },
  {
    type: "video",
    title: "DOM Manipulation",
    instructor: "Jane Smith",
    description: "How to interact with the DOM",
  },
  {
    type: "pdf",
    title: "JavaScript Cheat Sheet",
    instructor: "John Doe",
    description: "Quick reference guide",
  },
];

// Containers
const videosGrid = document.getElementById("availableVideosGrid");
const pdfsGrid = document.getElementById("availablePDFsGrid");

if (videosGrid && pdfsGrid) {
  const videos = availableMaterials.filter(m => m.type === "video");
  const pdfs = availableMaterials.filter(m => m.type === "pdf");

  videosGrid.innerHTML = videos.map(window.renderMaterialCard).join("");
  pdfsGrid.innerHTML = pdfs.map(window.renderMaterialCard).join("");
}
*/


