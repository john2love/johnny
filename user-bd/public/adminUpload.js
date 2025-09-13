
//upload.js (frontend)
document.getElementById("uploadForm").addEventListener("submit", handleUpload);

async function handleUpload(e) {
  e.preventDefault();

  const statusDiv = document.getElementById("status");
  const title = document.getElementById("title").value.trim();
  const file = document.getElementById("fileInput").files[0];
  const token = localStorage.getItem("adminToken");

  // 🛑 Input validation
  if (!title || !file) {
    return showStatus("❌ Please provide both title and file.", "error");
  }
  if (!token) {
    return showStatus("❌ No admin token found. Please login.", "error");
  }

  showStatus("⏳ Uploading...", "info");

  // Build FormData
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/api/materials/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    // Parse JSON safely
    const rawText = await response.text();
    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      result = { message: rawText || "⚠️ No JSON body" };
    }

    // Debug logging (structured)
    console.group("📡 Upload Debug Info");
    console.log("Status:", response.status);
    console.log("Response:", result);
    console.groupEnd();

    if (!response.ok) {
      throw new Error(result.message || "Upload failed");
    }

    // ✅ Success
    showStatus(result.message || "✅ Upload successful!", "success");
    document.getElementById("uploadForm").reset();

  } catch (err) {
    // ❌ Any failure (network or backend)
    console.error("❌ Upload error:", err);
    showStatus("❌ Upload failed: " + err.message, "error");
  }
}

// 🔧 Helper: show status with styling
function showStatus(message, type = "info") {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = message;

  // optional: color feedback
  statusDiv.style.color =
    type === "success" ? "green" :
    type === "error" ? "red" :
    "black";

  // auto-clear on success/info
  if (type !== "error") {
    setTimeout(() => (statusDiv.textContent = ""), 3000);
  }
}


//// adminUpload.js (frontend)
// document.getElementById("uploadForm").addEventListener("submit", handleUpload);

// async function handleUpload(e) {
//   e.preventDefault();

//   const title = document.getElementById("title").value.trim();
//   const file = document.getElementById("fileInput").files[0];
//   const token = localStorage.getItem("adminToken");

//   // 🛑 Input validation
//   if (!title || !file) {
//     return showStatus("❌ Please provide both title and file.", "error");
//   }
//   if (!token) {
//     return showStatus("❌ No admin token found. Please login.", "error");
//   }

//   showStatus("⏳ Uploading...", "info");

//   // Build FormData
//   const formData = new FormData();
//   formData.append("title", title);
//   formData.append("file", file);

//   try {
//     const response = await fetch("http://localhost:3000/api/materials/upload", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     // Parse JSON safely
//     const rawText = await response.text();
//     let result;
//     try {
//       result = JSON.parse(rawText);
//     } catch {
//       result = { message: rawText || "⚠️ No JSON body" };
//     }

//     console.group("📡 Upload Debug Info");
//     console.log("Status:", response.status);
//     console.log("Response:", result);
//     console.groupEnd();

//     if (!response.ok) {
//       throw new Error(result.message || "Upload failed");
//     }

//     // ✅ Success
//     showStatus(result.message || "✅ Upload successful!", "success");

//     // Reset form after short delay so user can see success message
//     setTimeout(() => document.getElementById("uploadForm").reset(), 1500);

//   } catch (err) {
//     console.error("❌ Upload error:", err);
//     showStatus("❌ Upload failed: " + err.message, "error");
//   }
// }

// // 🔧 Helper: show status with styling
// function showStatus(message, type = "info") {
//   const statusDiv = document.getElementById("status");
//   statusDiv.textContent = message;

//   statusDiv.style.color =
//     type === "success" ? "green" :
//     type === "error" ? "red" :
//     "black";

//   if (type !== "error") {
//     setTimeout(() => (statusDiv.textContent = ""), 3000);
//   }
// }
























// let timeoutId;
// document.getElementById('uploadForm').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const title = document.getElementById('title').value;
//   const file = document.getElementById('fileInput').files[0];
//   const statusDiv = document.getElementById('status');

//   // ✅ Show progress state early
//   statusDiv.innerText = "⏳ Uploading...";

//   if (!file || !title) {
//     statusDiv.innerText = "Please provide both title and file.";
//     return;
//   }

//   const formData = new FormData();
//   formData.append('title', title);
//   formData.append('file', file);

//   const token = localStorage.getItem('adminToken');
//   if (!token) {
//     statusDiv.innerText = "No admin token found. Please login.";
//     return;
//   }

//   // 🔧 DEBUG: Show the token and form data
//   console.log("🔧 DEBUG: Admin Token:", token);
//   console.log("🔧 DEBUG: FormData entries:");
//   for (let pair of formData.entries()) {
//     console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
//   }

//   try {
//     const response = await fetch('http://localhost:3000/api/materials/upload', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: formData
//     });

//     // ✅ Try parsing JSON; if fails, capture raw text (Fix F)
//     let result = null;
//     let rawText = null;
//     try {
//       rawText = await response.text(); // read raw body first
//       result = JSON.parse(rawText);    // attempt parse
//     } catch (parseErr) {
//       console.warn("⚠️ Response not valid JSON, raw body:", rawText);
//       result = { message: rawText || "No response body" };
//     }

//     // 🔧 DEBUG: Full response and result
//     console.log("🔧 DEBUG: Response status:", response.status);
//     console.log("🔧 DEBUG: Parsed result:", result);

//     if (response.ok) {
//       statusDiv.textContent = result?.message || "✅ Upload successful!";
//       // ✅ Clear the form after success (non-breaking addition)
//       document.getElementById('uploadForm').reset();

//         document.getElementById('title').value = title;
        
//       if (timeoutId) clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         statusDiv.textContent = "";
//       }, 2000);

//     } else {
//       statusDiv.textContent = "❌ Error: " + (result.message || "Unknown error occurred");
//       console.error("❌ Server returned error with raw body:", rawText);
//     }
//   } catch (error) {
//     console.error("❌ Upload error (exception):", error);
//     statusDiv.textContent = "❌ Upload failed. See console for details.";
//   }
// });



























