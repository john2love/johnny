function renderAnalyticsCard(analytics) {
  return `
    <div class="admin-card analytics-card">
      <h3>${analytics.course}</h3>
      <p>Enrolled: ${analytics.enrolled}</p>
      <p>Completed: ${analytics.completed}</p>
    </div>
  `;
}
window.renderAnalyticsCard = renderAnalyticsCard;