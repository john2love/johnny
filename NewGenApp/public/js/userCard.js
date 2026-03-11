function renderUserCard(user) {
  return `
    <div class="admin-card user-card">
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>Role: ${user.role}</p>
      <button class="btn btn-secondary">Edit</button>
    </div>
  `;
}
window.renderUserCard = renderUserCard;