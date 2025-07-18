const show = document.getElementById('show');
const button = document.getElementById('btn');
const input = document.getElementById('num');

let setout;
const checkEvenOrOdd = (value) => {
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  return num % 2 === 0 ? `${num} is Even` : `${num} is Odd`;
};

button.addEventListener("click", () => {
  const result = checkEvenOrOdd(input.value);
  show.textContent = result;
  
  if(setout){
    clearTimeout(setout);
    
  }
  setout = setTimeout(() => {
    document.getElementById('num').value = "";
  }, 2000);
});


// 1. ✅ User System (Login, Signup, Profile Page)
// 🔹 Objectives:
// Tie purchases to a specific user

// Provide secure, personalized access

// 🔸 Mini Steps:
// Signup Page (username, email, password)

// Login Page

// User Profile Dashboard:

// List of purchased materials

// Payment status

// Logout button

// Optional: profile image upload (Cloudinary)

// Store users in MongoDB with fields:

// js
// Copy
// Edit
// {
//   username,
//   email,
//   password (hashed),
//   paidMaterials: [{ materialId, accessGranted }]
// }
// 💡 Recommendation:
// Use JWT for session management

// Add simple email verification (optional at first)

// 2. ✅ Admin Upload Panel (for Materials)
// 🔹 Objectives:
// Only admin should upload materials

// Save metadata and access control info

// 🔸 Mini Steps:
// Create an admin login route

// Protected admin page/form to:

// Upload video or PDF

// Add title, description, price

// Choose type (video/pdf)

// On form submit:

// Upload file to Cloudinary

// Save metadata + file URL to MongoDB:

// js
// Copy
// Edit
// {
//   title,
//   description,
//   type: 'video' | 'pdf',
//   cloudinaryUrl,
//   price
// }
// 💡 Recommendation:
// Skip Firebase/other services — Cloudinary is enough

// Add watermark field for videos later

// 3. ✅ Payment & Access Workflow (Simplified)
// 🔹 Objectives:
// Users can buy materials with bank transfer

// Admin can verify payment manually or automatically

// 🔸 Mini Steps:
// Option A: Bank Transfer + Manual Verification

// User clicks Buy

// Modal pops up with:

// Bank account info

// Payment form: transaction ID, material, amount

// On form submit:

// Save payment request to MongoDB:

// js
// Copy
// Edit
// {
//   userId,
//   materialId,
//   amount,
//   transactionId,
//   verified: false
// }
// Admin panel shows pending requests

// Admin verifies → sets verified: true

// Backend sets access flag in user record

// Option B: [Later Upgrade] Virtual Bank Account (e.g. Monnify)

// Automates steps 3–6

// Recommended for scale

// 💡 Recommendation:
// Start with manual flow

// Automate using webhook/payment APIs later

// 4. ✅ Secure Content Access (Streaming Only, No Direct Download)
// 🔹 Objectives:
// Prevent download/sharing/screen recording

// 🔸 Mini Steps:
// After access is granted:

// Show “Play” (for video) or “Read” (for PDF)

// Use secure streaming:

// Shaka Player or Plyr + Cloudinary signed URLs

// Hide real file URLs

// Optional:

// Overlay watermark (user email on video)

// Use Cloudinary transformations

// 💡 Notes:
// Preventing screen recording is not fully possible

// Use watermarking for deterrence

// 5. ✅ Offline Streaming (PWA Support + Local Caching)
// 🔹 Objectives:
// Allow offline access after purchase

// 🔸 Mini Steps:
// Convert app to PWA (Progressive Web App)

// Use Service Workers + IndexedDB to:

// Cache encrypted files

// Decrypt only when user is logged in

// Detect login state before playback

// Allow offline access to previously granted materials only

// 💡 Recommendation:
// Prioritize PWA with simple file caching first

// Add encryption layer later if needed

// 📦 Refined MongoDB Schema
// js
// Copy
// Edit
// // User
// {
//   username: String,
//   email: String,
//   password: String,
//   paidMaterials: [ { materialId: ObjectId, accessGranted: Boolean } ]
// }

// // Materials
// {
//   title: String,
//   description: String,
//   type: 'video' | 'pdf',
//   cloudinaryUrl: String,
//   price: Number
// }

// // Payment Requests
// {
//   userId: ObjectId,
//   materialId: ObjectId,
//   amount: Number,
//   transactionId: String,
//   verified: Boolean,
//   date: Date
// }
// 🧭 Development Roadmap (Smaller Steps)
// Phase	Milestones
// 1. Auth System	Signup/Login, hashed passwords, JWT
// 2. Admin Panel	Upload video/PDF, save metadata
// 3. Material Viewer	Secure PDF/video player
// 4. Payment Flow	Bank transfer form, admin approval
// 5. Content Access Control	Allow only verified users to access
// 6. Offline PWA	Add caching, offline viewer
// 7. Improvements	Watermarking, virtual accounts, automation

// ✅ Recommendations Summary
// Area	Best Practice
// Login Form	✅ Required (tie content to user)
// Profile Page	✅ Yes, modern + trust-building
// Payment Flow	✅ Start simple, automate later
// Content Access	✅ Stream-only with hidden URLs
// Offline Access	✅ Use PWA + IndexedDB caching
// Security	✅ Use JWT, hide Cloudinary URLs, watermarking

// 💬 What Next?
// Let me know what you’d like to build first:

// Authentication (Login + Signup)?

// Admin Upload Form?

// Payment Submission Page?

// User Dashboard Design?

// Secure Viewer (video/pdf)?

// PWA Setup?
