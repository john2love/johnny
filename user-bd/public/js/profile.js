// ===============================
// Profile Page Script
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🧭 [Profile] DOM ready");

  // ===== Page Guard =====
  let auth;
  try {
    auth = await window.getAuthState();
    console.log("🔐 [Profile] Auth state:", auth);
  } catch (err) {
    console.error("❌ [Profile] Auth fetch failed:", err);
    window.location.href = "login.html";
    return;
  }

  if (!auth.isAuth) {
    console.warn("⛔ [Profile] Not authenticated, redirecting to login");
    window.location.href = "login.html";
    return;
  }
  if (auth.role !== "user") {
    console.warn("⛔ [Profile] Unauthorized role, redirecting to home");
    window.location.href = "index.html";
    return;
  }

  // ===== Render Layout =====
  try {
    const navbarEl = document.getElementById("navbar");
    const footerEl = document.getElementById("footer");
    if (navbarEl) navbarEl.innerHTML = await window.renderNavbar();
    if (footerEl) footerEl.innerHTML = window.renderFooter();
  } catch (err) {
    console.error("❌ [Profile] Layout render failed:", err);
  }

  // ===== Populate User Info =====
  if (auth.user) {
    const usernameEl = document.getElementById("username");
    const emailEl = document.getElementById("email");
    if (usernameEl) usernameEl.innerText = auth.user.username;
    if (emailEl) emailEl.innerText = auth.user.email;
  }

  // ===== Token for API calls =====
  const token = localStorage.getItem("token") || "";
  if (!token) console.warn("⚠️ [Profile] No token found in localStorage");

  // ===== Tab Switching =====
  const footerItems = document.querySelectorAll(".footer-item");
  footerItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      document.getElementById(`tab-${target}`)?.classList.add("active");
    });
  });

  const subTabBtns = document.querySelectorAll(".sub-tab-btn");
  subTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.sub;
      subTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".sub-tab-content").forEach(content => content.classList.remove("active"));
      document.getElementById(`available-${target}`)?.classList.add("active");
    });
  });

  // ===== Load Purchased Materials =====
  async function loadPurchasedMaterials() {
    if (!token) return;
    const grid = document.getElementById("purchasedMaterialsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    try {
      const res = await fetch("http://localhost:3000/api/auth/materials", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load purchased materials");

      const data = await res.json();
      console.log("📦 [Profile] Purchased materials loaded:", data);

      data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add(item.type === "video" ? "video-card" : "pdf-card");

        if (item.type === "video") {
          const videoEl = document.createElement("video");
          videoEl.controls = true;
          videoEl.preload = "metadata";
          videoEl.setAttribute("controlsList", "nodownload");
          videoEl.setAttribute("oncontextmenu", "return false;");

          const titleEl = document.createElement("p");
          titleEl.innerText = item.title;

          const offlineBtn = document.createElement("button");
          offlineBtn.textContent = "Make available offline";
          offlineBtn.onclick = async () => {
            try {
              const reg = await navigator.serviceWorker.ready;
              const url = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8?token=${token}`;
              reg.active?.postMessage({ type: "PREFETCH_HLS", url });
            } catch (e) {
              console.error("[OFFLINE] Prefetch failed:", e);
            }
          };

          card.appendChild(offlineBtn);
          card.appendChild(videoEl);
          card.appendChild(titleEl);

          const hlsUrl = `http://localhost:3000/api/materials/stream/${item._id}/index.m3u8`;
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup(xhr, url) {
                const sep = url.includes("?") ? "&" : "?";
                xhr.open("GET", url + sep + "token=" + token, true);
              }
            });
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoEl);
          } else {
            videoEl.src = `${hlsUrl}?token=${token}`;
          }

        } else {
          const titleEl = document.createElement("p");
          titleEl.innerText = item.title;
          const linkEl = document.createElement("a");
          linkEl.href = `http://localhost:3000/api/materials/stream/${item._id}?token=${token}`;
          linkEl.target = "_blank";
          linkEl.innerText = "Open PDF";
          card.appendChild(titleEl);
          card.appendChild(linkEl);
        }

        grid.appendChild(card);
      });
    } catch (err) {
      console.error("❌ [Profile] Error loading purchased materials:", err.message);
    }
  }

  await loadPurchasedMaterials();

  // ===== Service Worker =====
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("../sw.js")
        .then(() => console.log("✅ [Profile] Service Worker registered"))
        .catch(err => console.error("❌ [Profile] SW registration failed:", err));
    });
  }

  // ===== Populate static courses & materials (unchanged) =====
  const enrolledCourses = [
    { title: "JavaScript Fundamentals", level: "Beginner", progress: 40 },
    { title: "Node.js Backend", level: "Intermediate", progress: 20 },
  ];
  const enrolledGrid = document.getElementById("enrolled-courses-grid");
  if (enrolledGrid) {
    enrolledGrid.innerHTML = enrolledCourses.map(c => window.renderCourseCard?.(c, true) || "").join("");
  }

  const availableMaterials = [
    { type: "video", title: "JavaScript Variables", instructor: "John Doe" },
    { type: "video", title: "DOM Manipulation", instructor: "Jane Smith" },
    { type: "pdf", title: "JavaScript Cheat Sheet", instructor: "John Doe" },
  ];

  const videosGrid = document.getElementById("availableVideosGrid");
  const pdfsGrid = document.getElementById("availablePDFsGrid");
  if (videosGrid && pdfsGrid) {
    videosGrid.innerHTML = availableMaterials.filter(m => m.type === "video").map(window.renderMaterialCard || (() => "")).join("");
    pdfsGrid.innerHTML = availableMaterials.filter(m => m.type === "pdf").map(window.renderMaterialCard || (() => "")).join("");
  }
});








/*(async () => {
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
*/



