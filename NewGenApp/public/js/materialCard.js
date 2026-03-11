function renderMaterialCard(material, user) {
  const {
    _id,
    title,
    type,
    price = 0,
    owned = false,
    isFree = false,
  } = material;

  const { email = '', username = '' } = user || {};

  let actionHTML = '';

  /* ------------------------------
     ACTION LOGIC (AUTHORITATIVE)
  ------------------------------ */

  if (owned) {
    actionHTML = `
      <button class="btn owned" disabled>
        ✔ In Your Library
      </button>
      <a href="profile.html#library" class="btn secondary">
        Go to Library
      </a>
    `;
  } else if (isFree || price === 0) {
    actionHTML = `
      <button
        class="btn buy-now"
        data-material-id="${_id}"
        data-type="${type}"
        data-email="${email}"
        data-username="${username}"
      >
        Add to Library
      </button>
    `;
  } else {
    actionHTML = `
      <button
        class="btn buy-now"
        data-material-id="${_id}"
        data-price="${price}"
        data-currency="NGN"
        data-title="${title}"
        data-type="${type}"
        data-email="${email}"
        data-username="${username}"
      >
        Buy Now · ₦${price.toLocaleString()}
      </button>
    `;
  }

  /* ------------------------------
     RENDER CARD
  ------------------------------ */

  return `
    <div class="material-card ${owned ? 'owned' : 'locked'}">
      <div class="material-meta">
        <h3 class="material-title">${title}</h3>

        <span class="material-type">
          <i class="ri-${
            type === 'video' ? 'play-circle-line' : 'file-text-line'
          }"></i>
          ${type === 'video' ? 'Video' : 'PDF'}
        </span>

        ${
          isFree || price === 0
            ? `<span class="material-price free">Free</span>`
            : `<span class="material-price">₦${price.toLocaleString()}</span>`
        }
      </div>

      <div class="material-actions">
        ${actionHTML}
      </div>
    </div>
  `;
}

window.renderMaterialCard = renderMaterialCard;





/*function renderMaterialCard(material, user) {
  const { _id, title, type, price = 0, owned = false, isFree = false } = material;
  const { email, username } = user || {};

  // Ensure email & username exist
  const safeEmail = email || "";
  const safeUsername = username || "";

  let actionHTML = '';

  if (isFree || price === 0) {
    // Free material
    actionHTML = `
      <button
        class="btn buy-now"
        data-material-id="${_id}"
        data-type="${type}"
        data-email="${safeEmail}"
        data-username="${safeUsername}"
      >
        Add to Library
      </button>
    `;
  } else if (owned) {
    // Purchased material
    actionHTML = `
      <button class="btn owned" disabled>
        ✔ In Your Library
      </button>
      <a href="profile.html#library" class="btn secondary">
        Go to Library
      </a>
    `;
  } else {
    // Not purchased
    actionHTML = `
      <button
        class="btn buy-now"
        data-material-id="${_id}"
        data-price="${price}"
        data-currency="NGN"
        data-title="${title}"
        data-type="${type}"
        data-email="${safeEmail}"
        data-username="${safeUsername}"
      >
        Buy Now · ${price > 0 ? `₦${price.toLocaleString()}` : 'Free'}
      </button>
    `;
  }

  return `
    <div class="material-card ${owned ? 'owned' : 'locked'}">
      <div class="material-meta">
        <h3 class="material-title">${title}</h3>
        <span class="material-type">
          <i class="ri-${type === 'video' ? 'play-circle-line' : 'file-text-line'}"></i>
          ${type === 'video' ? 'Video' : 'PDF'}
        </span>
        ${
          isFree || price === 0
            ? `<span class="material-price free">Free</span>`
            : `<span class="material-price">₦${price.toLocaleString()}</span>`
        }
      </div>
      <div class="material-actions">
        ${actionHTML}
      </div>
    </div>
  `;
}

// expose globally
window.renderMaterialCard = renderMaterialCard;

*/


