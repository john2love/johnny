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

// Sample enrolled courses (UI-only)
let enrolledCourses = [
  { title: "JavaScript Fundamentals", level: "Beginner", progress: 40 },
  { title: "Node.js Backend", level: "Intermediate", progress: 20 },
];

// Render courses
const coursesGrid = document.getElementById("courses-grid");
function renderCourses() {
  coursesGrid.innerHTML = enrolledCourses
    .map(c => renderCourseCard(c, true)) // 'true' indicates progress bar mode
    .join("");
}
renderCourses();
