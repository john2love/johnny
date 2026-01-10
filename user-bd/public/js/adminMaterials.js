// adminMaterials.js

document.addEventListener("DOMContentLoaded", init);

const API_BASE = "http://localhost:3000/api/admin/materials";
const tableBody = document.getElementById("materials-table-body");

/* =========================
   INIT
========================= */
async function init() {
  await loadMaterials();
}

/* =========================
   LOAD MATERIALS
========================= */
async function loadMaterials() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    console.warn("⚠️ No admin token — redirecting to login");
    window.location.href = "admin-login.html";
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("⚠️ Admin auth expired");
      localStorage.removeItem("adminToken");
      window.location.href = "admin-login.html";
      return;
    }

    if (!res.ok) throw new Error("Failed to fetch materials");

    const materials = await res.json();
    renderMaterials(materials);

  } catch (err) {
    console.error("❌ Load materials error:", err);
  }
}

/* =========================
   RENDER TABLE
========================= */
function renderMaterials(materials) {
  tableBody.innerHTML = "";

  materials.forEach((m) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(m.title)}</td>
      <td>${m.type}</td>
      <td>${m.price === 0 ? "Free" : "₦" + m.price}</td>
      <td>${m.isActive ? "Active" : "Inactive"}</td>
      <td>
        <button class="toggle-btn" data-id="${m._id}" data-active="${m.isActive}">
          ${m.isActive ? "Deactivate" : "Activate"}
        </button>
        <button class="delete-btn" data-id="${m._id}">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  bindToggleButtons();
  bindDeleteButtons();
}

/* =========================
   ACTIVATE / DEACTIVATE
========================= */
function bindToggleButtons() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const isActive = btn.dataset.active === "true";
      await toggleMaterial(id, isActive);
    });
  });
}

async function toggleMaterial(id, isActive) {
  const token = localStorage.getItem("adminToken");

  const endpoint = isActive
    ? `${API_BASE}/${id}/deactivate`
    : `${API_BASE}/${id}/activate`;

  try {
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Toggle failed");

    await loadMaterials();
  } catch (err) {
    console.error("❌ Toggle error:", err);
  }
}

/* =========================
   HLS-SAFE DELETE
========================= */
function bindDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this material permanently? This cannot be undone.")) return;
      await deleteMaterial(id);
    });
  });
}

async function deleteMaterial(id) {
  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    const result = await res.json();

    // 🔥 HLS service-worker cleanup
    if (navigator.serviceWorker?.controller && result.hlsFolder) {
      navigator.serviceWorker.controller.postMessage({
        type: "DELETE_HLS",
        hlsFolder: result.hlsFolder,
      });
    }

    await loadMaterials();
  } catch (err) {
    console.error("❌ Delete error:", err);
  }
}

/* =========================
   SECURITY
========================= */
function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, (m) => {
    return (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m] || m
    );
  });
}





/*document.addEventListener("DOMContentLoaded", loadMaterials);

async function loadMaterials() {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/api/admin/materials", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch materials");

    const materials = await res.json();
    renderMaterials(materials);

  } catch (err) {
    console.error("❌ Materials load error:", err);
  }
}

function renderMaterials(materials) {
  const tbody = document.getElementById("materials-body");
  tbody.innerHTML = "";

  materials.forEach((m) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.title}</td>
      <td>${m.type}</td>
      <td>₦${m.price}</td>
      <td>${m.isActive ? "Active" : "Inactive"}</td>
      <td>${new Date(m.createdAt).toLocaleDateString()}</td>
      <td>
        <button data-id="${m._id}" class="toggle-btn">
          ${m.isActive ? "Deactivate" : "Activate"}
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  bindToggleButtons();
}

function bindToggleButtons() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await toggleMaterial(id);
    });
  });
}

async function toggleMaterial(id) {
  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(
      `http://localhost:3000/api/admin/materials/${id}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Toggle failed");

    await loadMaterials(); // refresh list

  } catch (err) {
    console.error("❌ Toggle error:", err);
  }
}
*/