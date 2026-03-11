// ===============================
// Navbar Renderer (Auth-aware)
// ===============================

async function renderNavbar() {
  let authState = { isAuth: false, role: "guest" };

  try {
    // Always force refresh to avoid stale cache issues
    authState = await window.getAuthState(true);
  } catch (err) {
    console.error("[Navbar] Failed to fetch auth state:", err);
    authState = { isAuth: false, role: "guest" };
  }

  const { isAuth = false, role = "guest" } = authState;

  const navbarHTML = `
    <nav class="navbar">
      <div class="nav-logo"><a href="index.html">NewGen</a></div>

      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="catalog.html">Courses</a></li>
        <li><a href="support.html">Support</a></li>
        <li><a href="about.html">About Us</a></li>

        ${
          isAuth && role === "user"
            ? `
          <li><a href="resource-library.html">Library</a></li>
          <li><a href="progress.html">Progress</a></li>
          <li><a href="certificates.html">Certificates</a></li>
          <li><a href="coursedetail.html">Course Detail</a></li>
        `
            : ""
        }

        ${
          isAuth && role === "admin"
            ? `
          <li><a href="admin-dashboard.html">Admin</a></li>
        `
            : ""
        }
      </ul>

      <div class="nav-actions">
        ${
          !isAuth
            ? `
          <a href="login.html" class="btn-outline">Login</a>
          <a href="register.html" class="btn-primary">Create Account</a>
        `
            : `
          <a href="messaging.html" class="btn-icon">
            <i class="ri-chat-3-line"></i>
          </a>
          <a href="profile.html" class="btn-primary">Profile</a>
          <button id="logoutBtn" class="btn-outline">Logout</button>
        `
        }
      </div>
    </nav>
  `;

  return navbarHTML;
}

window.renderNavbar = renderNavbar;












/* ===============================
// Navbar Renderer (Auth-aware)
// ===============================
async function renderNavbar(forceGuest = false) {
  // ✅ Cache auth state to prevent loops
  if (!window.__authState) {
    window.__authState = forceGuest
      ? { isAuth: false, role: "guest" }
      : await window.getAuthState();
  }

  const { isAuth, role } = window.__authState;

  return `
    <nav class="navbar">
      <div class="nav-logo">
        <a href="index.html">NewGen</a>
      </div>

      <ul class="nav-links">
        <!-- Guest-visible -->
        <li><a href="index.html">Home</a></li>
        <li><a href="catalog.html">Courses</a></li>
        <li><a href="support.html">Support</a></li>
        <li><a href="about.html">About Us</a></li>

        <!-- Authenticated User -->
        ${isAuth && role === "user" ? `
          <li><a href="resource-library.html">Library</a></li>
          <li><a href="progress.html">Progress</a></li>
          <li><a href="certificates.html">Certificates</a></li>
          <li><a href="coursedtail.html">Course Detail</a></li>
        ` : ""}

        <!-- Admin -->
        ${isAuth && role === "admin" ? `
          <li><a href="admin-dashboard.html">Admin</a></li>
        ` : ""}
      </ul>

      <div class="nav-actions">
        ${!isAuth ? `
          <a href="login.html" class="btn-outline">Login</a>
          <a href="register.html" class="btn-primary">Create Account</a>
        ` : `
          <a href="messaging.html" class="btn-icon">
            <i class="ri-chat-3-line"></i>
          </a>
          <a href="profile.html" class="btn-primary">Profile</a>
          <button id="logoutBtn" class="btn-outline">Logout</button>
        `}
      </div>
    </nav>
  `;
}

window.renderNavbar = renderNavbar;
*/












