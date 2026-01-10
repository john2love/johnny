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

// Sample data (UI-only)
const certificates = [
  { title: "JavaScript Fundamentals", issuer: "NewGen", date: "Dec 2025" },
  { title: "Node.js Backend", issuer: "NewGen", date: "Dec 2025" }
];

const badges = [
  { title: "Fast Learner", description: "Completed 3 courses in a month" },
  { title: "Backend Pro", description: "Completed 5 backend courses" }
];

// Render
document.getElementById("certificatesGrid").innerHTML = certificates.map(window.renderCertificateCard).join("");
document.getElementById("badgesGrid").innerHTML = badges.map(window.renderBadgeCard).join("");
