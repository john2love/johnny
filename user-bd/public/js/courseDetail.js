(async () => {
  const { isAuth, role } = await window.getAuthState();

  if (!isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (role !== "user") {
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
