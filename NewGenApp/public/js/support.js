
// Layout
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// Sample FAQ (UI only)
const faqs = [
  { question: "How do I enroll in a course?", answer: "Go to the Course Catalog and click Enroll." },
  { question: "How can I get a certificate?", answer: "Certificates are available upon course completion." },
];

// Render FAQ
const faqList = document.getElementById("faq-list");
faqList.innerHTML = faqs.map(f => renderFAQItem(f)).join("");

// Contact Form (UI only)
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent! (UI-only, no backend)");
  e.target.reset();
});
