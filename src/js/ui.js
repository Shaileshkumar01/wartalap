export function renderMessages(messages, currentUserId) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    
    const sender = msg.senderId === currentUserId ? "You" : msg.senderName || "Unknown";
    msgDiv.textContent = `${sender}: ${msg.text}`;

    chatBox.appendChild(msgDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}
