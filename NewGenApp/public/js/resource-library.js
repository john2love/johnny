document.addEventListener("DOMContentLoaded", async () => {
  /* ==========================
     AUTH GUARD (SOURCE OF TRUTH)
     ========================== */
  const authState = await window.getAuthState(true); // force refresh
  const { isAuth, role, user, token } = authState || {};

  if (!isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (role !== "user") {
    window.location.href = "index.html";
    return;
  }

  /* ==========================
     LAYOUT
     ========================== */
  const navbarEl = document.getElementById("navbar");
  const footerEl = document.getElementById("footer");

  if (navbarEl && typeof window.renderNavbar === "function") {
    navbarEl.innerHTML = await window.renderNavbar();
  }

  if (footerEl && typeof window.renderFooter === "function") {
    footerEl.innerHTML = window.renderFooter();
  }

  /* ==========================
     DOM REFERENCES
     ========================== */
  const grid = document.getElementById("material-grid");
  const searchInput = document.getElementById("search-input");

  if (!grid) {
    console.error("❌ material-grid element not found");
    return;
  }

  /* ==========================
     FETCH MATERIALS
     ========================== */
  async function fetchMaterials() {
    try {
      const res = await fetch(`${window.API_BASE_URL || ""}/api/materials`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      return Array.isArray(data.materials) ? data.materials : [];
    } catch (err) {
      console.error("❌ Failed to fetch materials:", err.message);
      return [];
    }
  }

  /* ==========================
     RENDER
     ========================== */
  function renderLibrary(materials) {
    if (!Array.isArray(materials) || materials.length === 0) {
      grid.innerHTML = `<p class="no-materials">No materials available at the moment.</p>`;
      return;
    }

    grid.innerHTML = materials
      .map(material => window.renderMaterialCard(material, user))
      .join("");
  }

  /* ==========================
     SEARCH (FRONTEND ONLY)
     ========================== */
  function setupSearch(materials) {
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (!query) {
        renderLibrary(materials);
        return;
      }

      const filtered = materials.filter(m =>
        typeof m.title === "string" &&
        m.title.toLowerCase().includes(query)
      );

      renderLibrary(filtered);
    });
  }

  /* ==========================
     INIT
     ========================== */
  const materials = await fetchMaterials();
  renderLibrary(materials);
  setupSearch(materials);
});






/*document.addEventListener("DOMContentLoaded", async () => {

  // ✅ AUTH GUARD
  const authState = await window.getAuthState();
  const { isAuth, role, user } = authState;

  if (!isAuth) {
    window.location.href = "login.html";
    return;
  }
  if (role !== "user") {
    window.location.href = "index.html";
    return;
  }

  // Render Navbar and Footer
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();
  document.getElementById("footer").innerHTML = window.renderFooter();

  const grid = document.getElementById("material-grid");
  const searchInput = document.getElementById("search-input");

  // Fetch all materials from backend
  async function fetchMaterials() {
    try {
      const res = await fetch(`${window.API_BASE_URL}/api/materials`, {
        headers: { "Authorization": `Bearer ${authState.token}` }
      });
      if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
      const data = await res.json();
      return data.materials || [];
    } catch (err) {
      console.error("❌ Error fetching materials:", err);
      return [];
    }
  }

  // Mark materials as owned
  function markOwnedMaterials(materials, purchasedIds = []) {
    return materials.map(m => ({
      ...m,
      owned: purchasedIds.includes(m._id)
    }));
  }

  // Ensure at least 5 video cards exist
  function ensureFiveVideos(materials) {
    const videoCount = materials.filter(m => m.type === "video").length;
    if (videoCount >= 5) return materials;

    const dummyVideos = [];
    for (let i = videoCount + 1; i <= 5; i++) {
      dummyVideos.push({
        _id: `dummy-video-${i}`,
        title: `Demo Video ${i}`,
        type: "video",
        price: 2000 + i * 500,
        owned: false,
        isFree: false
      });
    }
    return [...materials, ...dummyVideos];
  }

  // Render material library
  function renderLibrary(materials) {
    if (!materials.length) {
      grid.innerHTML = `<p class="no-materials">No materials found.</p>`;
      return;
    }
    grid.innerHTML = materials
      .map(material => window.renderMaterialCard(material, user))
      .join("");
  }

  // Filter materials by search input
  function setupSearch(materials) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = materials.filter(m =>
        m.title.toLowerCase().includes(query)
      );
      renderLibrary(filtered);
    });
  }

  // Fetch, process, and render materials
  const materialsFromBackend = await fetchMaterials();
  let finalMaterials = markOwnedMaterials(materialsFromBackend, user.purchasedMaterials || []);
  finalMaterials = ensureFiveVideos(finalMaterials);

  renderLibrary(finalMaterials);
  setupSearch(finalMaterials);

});
*/






