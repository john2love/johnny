function renderRevenueCard(revenue) {
  return `
    <div class="admin-card revenue-card">
      <h3>${revenue.month}</h3>
      <p>Total Revenue: ${revenue.revenue}</p>
    </div>
  `;
}
window.renderRevenueCard = renderRevenueCard;