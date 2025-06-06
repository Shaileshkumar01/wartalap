// src/js/ui.js
export function renderMessages(messages, currentUserId) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.textContent = (msg.senderId === currentUserId ? "You" : "Partner") + ": " + msg.text;
    chatBox.appendChild(msgDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}
