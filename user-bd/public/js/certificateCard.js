function renderCertificateCard(item) {
  return `
    <article class="achievement-card">
      <h3>${item.title}</h3>
      <p>${item.issuer}</p>
      <p>${item.date}</p>
      <button class="btn btn-primary">View</button>
    </article>
  `;
}

function renderBadgeCard(item) {
  return `
    <article class="achievement-card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <button class="btn btn-primary">View</button>
    </article>
  `;
}

// expose globally
window.renderCertificateCard = renderCertificateCard;
window.renderBadgeCard = renderBadgeCard;
