(async () => {
  const { isAuth, role } = await window.getAuthState();

  if (!isAuth) {
    window.location.href = "adminSignLogin.html";
    return;
  }

  if (role !== "admin") {
    window.location.href = "index.html";
    return;
  }
})();

// Layout (ONLY HERE)
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();
document.getElementById("footer").innerHTML = window.renderFooter();

// Sample data
const users = [
  { name: "John Doe", email: "john@example.com", role: "Student" },
  { name: "Jane Smith", email: "jane@example.com", role: "Instructor" },
];

const analytics = [
  { course: "JS Basics", enrolled: 120, completed: 80 },
  { course: "Node.js Backend", enrolled: 90, completed: 50 },
];

const revenues = [
  { month: "December", revenue: "$1200" },
  { month: "January", revenue: "$1450" },
];

// Render
document.getElementById("user-list").innerHTML =
  users.map(u => window.renderUserCard(u)).join("");

document.getElementById("course-analytics").innerHTML =
  analytics.map(a => window.renderAnalyticsCard(a)).join("");

document.getElementById("revenue-reports").innerHTML =
  revenues.map(r => window.renderRevenueCard(r)).join("");
