function renderFAQItem(faq) {
  return `
    <div class="faq-item">
      <h3 class="faq-question">${faq.question}</h3>
      <p class="faq-answer">${faq.answer}</p>
    </div>
  `;
}

window.renderFAQItem = renderFAQItem; 