// src/js/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ✅ Correct config with fixed storageBucket
const firebaseConfig = {
  apiKey: "AIzaSyD14hcTY9kDBJj2L39ff2Cm_GlculEtRxc",
  authDomain: "wartalap-c7311.firebaseapp.com",
  projectId: "wartalap-c7311",
  storageBucket: "wartalap-c7311.appspot.com", // <-- fixed
  messagingSenderId: "397454314037",
  appId: "1:397454314037:web:59206437e766e2e82b7f7c",
  measurementId: "G-DM3HDBPDZW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
