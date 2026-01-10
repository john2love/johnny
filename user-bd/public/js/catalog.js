document.addEventListener("DOMContentLoaded", () => {
  // Render Navbar & Footer
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

  document.getElementById("footer").innerHTML = window.renderFooter();

  const courses = [
    {
      id: "js-fundamentals",
      title: "JavaScript Fundamentals",
      category: "frontend",
      description: "Learn modern JS basics.",
      instructor: "John Doe",
      level: "Beginner"
    },
    {
      id: "node-backend",
      title: "Backend with Node.js",
      category: "backend",
      description: "Build scalable backend apps.",
      instructor: "Jane Smith",
      level: "Intermediate"
    },
    {
      id: "web-bootcamp",
      title: "Web Development Bootcamp",
      category: "fullstack",
      description: "HTML, CSS, JS from scratch."
    },
    {
      id: "react-essentials",
      title: "React.js Essentials",
      category: "frontend",
      description: "Build reactive UI components."
    }
  ];

  const grid = document.getElementById("course-grid");

  function displayCourses(list) {
    grid.innerHTML = list
      .map(course => {
        const isEnrolled = window.enrolledCourseIds?.includes(course.id);
        return window.renderCourseCard(course, isEnrolled);
      })
      .join("");
  }

  displayCourses(courses);

  // Search & Filter
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = courses.filter(c =>
      c.title.toLowerCase().includes(query)
    );
    displayCourses(filtered);
  });

  categoryFilter.addEventListener("change", () => {
    const category = categoryFilter.value;
    const filtered = category
      ? courses.filter(c => c.category === category)
      : courses;
    displayCourses(filtered);
  });
});

