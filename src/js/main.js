// src/js/main.js

import { sendMessage, listenForMessages } from './chat.js';
import { renderMessages } from './ui.js';
import { register, login } from './auth.js';
import { auth, db } from './firebaseConfig.js';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  onSnapshot,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Register new user
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

// Login existing user
window.handleLogin = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await login(email, password);
  } catch (err) {
    alert(err.message);
  }
};

// Logout
window.logout = function () {
  signOut(auth);
};

// Auto-switch views based on auth state
onAuthStateChanged(auth, (user) => {
  const authSection = document.getElementById("authSection");
  const chatSection = document.getElementById("chatSection");

  if (user) {
    authSection.style.display = "none";
    chatSection.style.display = "block";
    loadJoinedRooms();
  } else {
    authSection.style.display = "block";
    chatSection.style.display = "none";
  }
});


// Create new room
window.createRoom = async function () {
  const name = document.getElementById("roomNameInput").value.trim();
  if (!name || !auth.currentUser) return;

  try {
    await addDoc(collection(db, "rooms"), {
      name,
      createdBy: auth.currentUser.uid,
      members: [auth.currentUser.uid],
    });

    loadJoinedRooms();
  } catch (err) {
    alert("Error creating room: " + err.message);
  }
};

// Join existing room
window.joinRoom = async function () {
  const name = document.getElementById("roomNameInput").value.trim();
  if (!name || !auth.currentUser) return;

  try {
    const q = query(collection(db, "rooms"), where("name", "==", name));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const roomDoc = snapshot.docs[0];
      const roomData = roomDoc.data();

      if (!roomData.members.includes(auth.currentUser.uid)) {
        await updateDoc(roomDoc.ref, {
          members: arrayUnion(auth.currentUser.uid),
        });
      }

      loadJoinedRooms();
    } else {
      alert("Room not found.");
    }
  } catch (err) {
    alert("Error joining room: " + err.message);
  }
};

// Load sidebar room list
async function loadJoinedRooms() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const q = query(collection(db, "rooms"), where("members", "array-contains", userId));
  const snapshot = await getDocs(q);

  const list = document.getElementById("roomList");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().name;
    li.onclick = () => openRoomChat(doc.id);
    list.appendChild(li);
  });
}

// Open chat window for selected room
function openRoomChat(roomId) {
  document.getElementById("chatSection").style.display = "block";

  window.handleSend = async function () {
    const text = document.getElementById("messageInput").value.trim();
    if (!text) return;

    await addDoc(collection(db, "rooms", roomId, "messages"), {
  senderId: auth.currentUser.uid,
  senderName: auth.currentUser.displayName,
  text,
  timestamp: serverTimestamp(),
});


    document.getElementById("messageInput").value = "";
  };

  const q = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("timestamp")
  );

  onSnapshot(q, (snapshot) => {
    const container = document.getElementById("messages");
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.textContent = `${msg.senderName || "Unknown"}: ${msg.text}`;
      container.appendChild(div);
    });
  });
}
