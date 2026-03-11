// ===============================
// Course Detail Page
// ===============================
(async () => {
  console.log("🧭 [CourseDetail] Page bootstrap");

  const auth = await window.getAuthState(true); // force refresh

  if (!auth.isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (auth.role !== "user") {
    window.location.href = "index.html";
    return;
  }

  console.log("✅ [CourseDetail] Auth passed:", auth);

  // Render layout
  const navbarEl = document.getElementById("navbar");
  if (navbarEl) navbarEl.innerHTML = await window.renderNavbar();

  const footerEl = document.getElementById("footer");
  if (footerEl) footerEl.innerHTML = window.renderFooter();

  // ===============================
  // Temporary static data (UI only)
  // ===============================
  const course = {
    title: "JavaScript Fundamentals",
    description: "Master the basics of modern JavaScript.",
    instructor: "John Doe",
    level: "Beginner",
    topics: [
      "Variables and Data Types",
      "Functions",
      "DOM Manipulation",
      "Events",
    ],
  };

  // Safe DOM injection
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  };

  setText("course-title", course.title);
  setText("course-description", course.description);
  setText("course-instructor", course.instructor);
  setText("course-level", course.level);

  const topicsList = document.getElementById("course-topics");
  if (topicsList) {
    topicsList.innerHTML = (course.topics || [])
      .map(topic => `<li>${topic}</li>`)
      .join("");
  }

  // ===============================
  // Related Materials (UI only)
  // ===============================
  const relatedMaterials = [
    { type: "video", title: "JS Variables", instructor: "John Doe", description: "Learn variables." },
    { type: "pdf", title: "JS Guide", instructor: "John Doe", description: "Comprehensive guide." }
  ];

  const resourcesGrid = document.getElementById("related-resources-grid");
  if (resourcesGrid) {
    resourcesGrid.innerHTML = (relatedMaterials || [])
      .map(m => window.renderMaterialCard(m))
      .join("");
  }

  // ===============================
  // Enroll button (placeholder)
  // ===============================
  const enrollBtn = document.getElementById("enroll-btn");
  if (enrollBtn) {
    enrollBtn.addEventListener("click", () => {
      alert("Enrollment UI-only (backend integration later).");
    });
  }
})();







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

  // Page logic continues safely below
})();


(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// Temporary static data (UI only)
const course = {
  title: "JavaScript Fundamentals",
  description: "Master the basics of modern JavaScript.",
  instructor: "John Doe",
  level: "Beginner",
  topics: [
    "Variables and Data Types",
    "Functions",
    "DOM Manipulation",
    "Events",
  ],
};

// Populate UI
document.getElementById("course-title").textContent = course.title;
document.getElementById("course-description").textContent = course.description;
document.getElementById("course-instructor").textContent = course.instructor;
document.getElementById("course-level").textContent = course.level;

const topicsList = document.getElementById("course-topics");
topicsList.innerHTML = course.topics
  .map(topic => `<li>${topic}</li>`)
  .join("");
// Sample related materials (UI only)
const relatedMaterials = [
  { type: "video", title: "JS Variables", instructor: "John Doe", description: "Learn variables." },
  { type: "pdf", title: "JS Guide", instructor: "John Doe", description: "Comprehensive guide." }
];

const resourcesGrid = document.getElementById("related-resources-grid");
resourcesGrid.innerHTML = relatedMaterials.map(m => renderMaterialCard(m)).join("");

document.getElementById("enroll-btn").addEventListener("click", () => {
  alert("Enrollment UI-only (backend integration later).");
});
*/