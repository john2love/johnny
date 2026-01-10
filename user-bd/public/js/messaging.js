// import { renderNavbar } from "./navbar.js";
// import { renderFooter } from "./footer.js";
// import { renderMessageCard } from "./messageCard.js";

// Layout
(async () => {
  document.getElementById("navbar").innerHTML = await window.renderNavbar();
})();

document.getElementById("footer").innerHTML = window.renderFooter();

// Sample messages (UI only)
let messages = [
  { from: "Alice", content: "Hi, are you attending the JS course?" },
  { from: "You", content: "Yes, I just enrolled today!" },
];

// Render messages
const grid = document.getElementById("messages-grid");
function renderMessages() {
  grid.innerHTML = messages.map(m => renderMessageCard(m)).join("");
}
renderMessages();

// Send message (UI only)
document.getElementById("send-message").addEventListener("click", () => {
  const input = document.getElementById("new-message");
  const text = input.value.trim();
  if (text === "") return;
  messages.push({ from: "You", content: text });
  input.value = "";
  renderMessages();
});
