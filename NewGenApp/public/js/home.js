
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

const courses = [
   {
    title: "JavaScript Fundamentals",
    category: "frontend",
    description: "Learn modern JS basics.",
    instructor: "John Doe",
    level: "Beginner",
  },
  
  {
    title: "Backend with Node.js",
    category: "backend",
    description: "Build scalable backend apps.",
    instructor: "Jane Smith",
    level: "Intermediate",
  },
  {
    title: "Web Development Bootcamp",
    description: "HTML, CSS, and JavaScript from scratch.",
  },
  {
    title: "Backend with Node.js",
    description: "Build scalable backend applications.",
  },
];

const grid = document.getElementById("course-grid");
grid.innerHTML = courses.map(c => window.renderCourseCard(c)).join("");
