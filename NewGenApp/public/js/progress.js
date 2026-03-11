// ===============================
// Page Guard: Ensure user auth
// ===============================
(async () => {
  const auth = await window.getAuthState(true); // force refresh auth state

  if (!auth.isAuth) {
    window.location.href = "login.html";
    return;
  }

  if (auth.role !== "user") {
    window.location.href = "index.html";
    return;
  }

  // Render Navbar and Footer AFTER auth check
  const navbarEl = document.getElementById("navbar");
  if (navbarEl) navbarEl.innerHTML = await window.renderNavbar();

  const footerEl = document.getElementById("footer");
  if (footerEl) footerEl.innerHTML = window.renderFooter();

  // ===============================
  // Sample enrolled courses (UI-only, backend ready)
  // ===============================
  const enrolledCourses = [
    { title: "JavaScript Fundamentals", level: "Beginner", progress: 40 },
    { title: "Node.js Backend", level: "Intermediate", progress: 20 },
  ];

  const coursesGrid = document.getElementById("courses-grid");
  if (!coursesGrid) return;

  coursesGrid.innerHTML = enrolledCourses
    .map(course => renderCourseCard(course, true)) // true = progress mode
    .join("");

})();
