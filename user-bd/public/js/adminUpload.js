// ===============================
// Admin Material Upload (Frontend)
// Contract-compliant, safe implementation
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) form.addEventListener("submit", handleUpload);
});

async function handleUpload(e) {
  e.preventDefault();

  const statusEl = document.getElementById("status");
  const title = document.getElementById("title").value.trim();
  const priceInput = document.getElementById("price");
  const fileInput = document.getElementById("fileInput");

  const file = fileInput.files[0];
  const token = localStorage.getItem("adminToken"); // MUST match auth system
  const role = localStorage.getItem("role");

  // ===============================
  // Guard checks
  // ===============================
  if (!token || role !== "admin") {
    return showStatus("❌ Admin authentication required.", "error");
  }

  if (!title || !file || priceInput?.value === "") {
    return showStatus("❌ All fields are required.", "error");
  }

  const price = Number(priceInput.value);
  if (Number.isNaN(price) || price < 0) {
    return showStatus("❌ Invalid price value.", "error");
  }

  showStatus("⏳ Uploading material...", "info");

  // ===============================
  // Build FormData (contract-safe)
  // ===============================
  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("file", file);

  try {
    const response = await fetch("/api/materials/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text || "Unexpected server response" };
    }

    if (!response.ok) throw new Error(result.message || "Upload failed");

    // ===============================
    // Success
    // ===============================
    showStatus(result.message || "✅ Material uploaded successfully!", "success");
    document.getElementById("uploadForm").reset();

    // Optional: refresh materials table automatically
    if (typeof loadMaterials === "function") loadMaterials();

  } catch (err) {
    console.error("❌ Material upload error:", err);
    showStatus(`❌ ${err.message}`, "error");
  }
}

// ===============================
// UI Status Helper
// ===============================
function showStatus(message, type = "info") {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.style.color =
    type === "success" ? "green" : type === "error" ? "red" : "black";

  if (type !== "error") {
    setTimeout(() => {
      statusEl.textContent = "";
    }, 3000);
  }
}







/*// ===============================
// Admin Material Upload (Frontend)
// Contract-compliant implementation
// ===============================

document
  .getElementById("uploadForm")
  .addEventListener("submit", handleUpload);

async function handleUpload(e) {
  e.preventDefault();

  const statusEl = document.getElementById("status");

  const title = document.getElementById("title").value.trim();
  const priceInput = document.getElementById("price");
  const fileInput = document.getElementById("fileInput");

  const file = fileInput.files[0];
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ===============================
  // Guard checks
  // ===============================
  if (!token || role !== "admin") {
    return showStatus("❌ Admin authentication required.", "error");
  }

  if (!title || !file || !priceInput?.value) {
    return showStatus("❌ All fields are required.", "error");
  }

  const price = Number(priceInput.value);
  if (Number.isNaN(price) || price <= 0) {
    return showStatus("❌ Invalid price value.", "error");
  }

  showStatus("⏳ Uploading material...", "info");

  // ===============================
  // Build FormData (contract-safe)
  // ===============================
  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("file", file);

  try {
    const response = await fetch("/api/materials", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text || "Unexpected server response" };
    }

    if (!response.ok) {
      throw new Error(result.message || "Upload failed");
    }

    // ===============================
    // Success
    // ===============================
    showStatus(
      result.message || "✅ Material uploaded successfully!",
      "success"
    );

    document.getElementById("uploadForm").reset();

  } catch (err) {
    console.error("❌ Material upload error:", err);
    showStatus(`❌ ${err.message}`, "error");
  }
}

// ===============================
// UI Status Helper
// ===============================
function showStatus(message, type = "info") {
  const statusEl = document.getElementById("status");
  statusEl.textContent = message;

  statusEl.style.color =
    type === "success"
      ? "green"
      : type === "error"
      ? "red"
      : "black";

  if (type !== "error") {
    setTimeout(() => {
      statusEl.textContent = "";
    }, 3000);
  }
}

*/




























