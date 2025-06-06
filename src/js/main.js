// src/js/main.js
import { sendMessage, listenForMessages } from './chat.js';
import { renderMessages } from './ui.js';
import { register, login } from './auth.js';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.handleSend = handleSend;
window.handleRegister = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const displayName = document.getElementById("displayName").value;
  const profilePic = document.getElementById("profilePic").files[0];

  try {
    await register(email, password, displayName, profilePic);
  } catch (err) {
    alert(err.message);
  }
};

window.handleLogin = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await login(email, password);
  } catch (err) {
    alert(err.message);
  }
};


onAuthStateChanged(auth, (user) => {
  const authSection = document.getElementById("authSection");
  const chatSection = document.getElementById("chatSection");

  if (user) {
    // Logged in
    authSection.style.display = "none";
    chatSection.style.display = "block";

    const currentUserId = user.uid;
    const partnerUserId = "YOUR_GF_FIREBASE_UID"; // You can hardcode this or set dynamically
    const chatId = [currentUserId, partnerUserId].sort().join("_");

    window.handleSend = function () {
      const input = document.getElementById("messageInput");
      const text = input.value.trim();
      if (!text) return;
      sendMessage(chatId, currentUserId, text);
      input.value = "";
    };

    listenForMessages(chatId, (messages) => {
      renderMessages(messages, currentUserId);
    });

  } else {
    // Not logged in
    authSection.style.display = "block";
    chatSection.style.display = "none";
  }
});


// TEMP: Replace with actual Firebase authenticated user IDs
const currentUserId = "user123";
const partnerUserId = "user456";

// Generate a consistent chatId (e.g., sorted UID pair)
const chatId = [currentUserId, partnerUserId].sort().join("_");

function handleSend() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  sendMessage(chatId, currentUserId, text);
  input.value = "";
}

listenForMessages(chatId, (messages) => {
  renderMessages(messages, currentUserId);
});


import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
window.logout = function () {
  signOut(auth);
};
