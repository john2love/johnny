function renderCourseCard(course, isEnrolled = false) {
  return `
    <div class="course-card">
      <h3>${course.title}</h3>
      <p class="course-level">Level: ${course.level || "All Levels"}</p>
      <p class="course-instructor">By ${course.instructor || "TBA"}</p>
      <p class="course-description">${course.description || ""}</p>

      ${
        isEnrolled
          ? `<span class="badge enrolled">Enrolled</span>`
          : `<button class="btn btn-primary">Enroll Now</button>`
      }
    </div>
  `;
}

window.renderCourseCard = renderCourseCard;
