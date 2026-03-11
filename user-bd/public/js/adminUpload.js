// adminUpload.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) form.onsubmit = handleUpload;
});

async function handleUpload(e) {
  e.preventDefault();

  const statusEl = document.getElementById("status");
  const title = document.getElementById("title").value.trim();
  const priceInput = document.getElementById("price");
  const price = Number(priceInput.value);
  const file = document.getElementById("fileInput").files[0];

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") return showStatus("❌ Admin authentication required", "error");

  if (!title || !file || priceInput.value === "" || Number.isNaN(price) || price < 0) {
    return showStatus("❌ All fields must be valid", "error");
  }

  showStatus("⏳ Uploading...", "info");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("file", file);

  try {
    const res = await fetch("/api/materials/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text || "Unexpected response" }; }
    if (!res.ok) throw new Error(data.message || "Upload failed");

    showStatus(data.message || "✅ Upload successful", "success");
    document.getElementById("uploadForm").reset();

    // Refresh materials dynamically
    if (typeof window.loadMaterials === "function") window.loadMaterials();

  } catch (err) {
    console.error("❌ Upload error:", err);
    showStatus(err.message || "Upload failed", "error");
  }
}

function showStatus(msg, type = "info") {
  const el = document.getElementById("status");
  if (!el) return;

  el.textContent = msg;
  el.style.color = type === "success" ? "green" : type === "error" ? "red" : "black";

  if (type !== "error") setTimeout(() => (el.textContent = ""), 3000);
}










/*// ===============================
// Admin Material Upload (Frontend)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) form.addEventListener("submit", handleUpload);
});

async function handleUpload(e) {
  e.preventDefault();

  const statusEl = document.getElementById("status");
  const titleEl = document.getElementById("title");
  const priceEl = document.getElementById("price");
  const fileEl = document.getElementById("fileInput");

  const title = titleEl.value.trim();
  const file = fileEl.files[0];

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  /* =========================
     Guards
  ========================= *
  if (!token || role !== "admin") {
    return showStatus("❌ Admin authentication required.", "error");
  }

  if (!title || !file || priceEl.value === "") {
    return showStatus("❌ All fields are required.", "error");
  }

  const price = Number(priceEl.value);
  if (Number.isNaN(price) || price < 0) {
    return showStatus("❌ Invalid price value.", "error");
  }

  showStatus("⏳ Uploading...", "info");

  /* =========================
     Build form
  ========================= *
  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("file", file);

  try {
    const res = await fetch("/api/materials/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Unexpected response" };
    }

    if (!res.ok) throw new Error(data.message || "Upload failed");

    showStatus(data.message || "✅ Upload successful", "success");
    document.getElementById("uploadForm").reset();

    // Refresh admin materials table if present
    if (typeof window.loadMaterials === "function") {
      window.loadMaterials();
    }

  } catch (err) {
    console.error("❌ Upload error:", err);
    showStatus(err.message || "Upload failed", "error");
  }
}

/* =========================
   UI Helper
========================= *
function showStatus(message, type = "info") {
  const el = document.getElementById("status");
  if (!el) return;

  el.textContent = message;
  el.style.color =
    type === "success" ? "green" : type === "error" ? "red" : "black";

  if (type !== "error") {
    setTimeout(() => {
      el.textContent = "";
    }, 3000);
  }
}
*/






