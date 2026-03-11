// adminDashboard.js

(async () => {
  // 1️⃣ Check admin auth
  const auth = await window.getAuthState();
  if (!auth.isAuth || auth.role !== "admin") {
    return window.location.href = "adminSignLogin.html";
  }

  // 2️⃣ Render layout
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.innerHTML = await window.renderNavbar();

  const footer = document.getElementById("footer");
  if (footer) footer.innerHTML = window.renderFooter();

  // 3️⃣ Fetch dynamic data from backend
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("Missing admin token");

    // Fetch users
    const usersRes = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = usersRes.ok ? await usersRes.json() : [];
    document.getElementById("user-list").innerHTML = users.map(u => window.renderUserCard(u)).join("");

    // Fetch course analytics
    const analyticsRes = await fetch("/api/admin/courses/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const analytics = analyticsRes.ok ? await analyticsRes.json() : [];
    document.getElementById("course-analytics").innerHTML = analytics.map(a => window.renderAnalyticsCard(a)).join("");

    // Fetch revenue reports
    const revenueRes = await fetch("/api/admin/revenue", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const revenues = revenueRes.ok ? await revenueRes.json() : [];
    document.getElementById("revenue-reports").innerHTML = revenues.map(r => window.renderRevenueCard(r)).join("");

  } catch (err) {
    console.error("❌ Dashboard data fetch error:", err);

    // Show fallback messages
    document.getElementById("user-list").innerHTML = "<p>No users available.</p>";
    document.getElementById("course-analytics").innerHTML = "<p>No analytics data.</p>";
    document.getElementById("revenue-reports").innerHTML = "<p>No revenue data.</p>";
  }
})();
