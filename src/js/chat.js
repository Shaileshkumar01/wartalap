// src/js/chat.js
import { db } from './firebaseConfig.js';
import { doc, collection, addDoc, updateDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function sendMessage(chatId, senderId, text) {
  const chatRef = doc(db, "chats", chatId);

  await addDoc(collection(chatRef, "messages"), {
    senderId: senderId,
    text: text,
    timestamp: serverTimestamp()
  });

  await updateDoc(chatRef, {
    lastUpdated: serverTimestamp()
  });
}

export function listenForMessages(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach(doc => messages.push(doc.data()));
    callback(messages);
  });
}
