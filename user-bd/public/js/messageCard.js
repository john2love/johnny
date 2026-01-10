function renderMessageCard(message) {
  const alignClass = message.from === "You" ? "message-sent" : "message-received";
  
  return `
    <div class="message-card ${alignClass}">
      <p class="message-sender">${message.from}</p>
      <p class="message-content">${message.content}</p>
    </div>
  `;
}
window.renderMessageCard = renderMessageCard;