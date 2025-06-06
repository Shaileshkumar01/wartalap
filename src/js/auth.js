// src/js/auth.js
import { auth, db, storage } from "./firebaseConfig.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/**
 * Register a new user with email, password, displayName, and optional profile pic.
 */
export async function register(email, password, displayName, profilePicFile) {
  if (!email || !password || !displayName) {
    throw new Error("All fields are required for registration.");
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    let photoURL = "";

    if (profilePicFile) {
      const picRef = ref(storage, `profilePics/${uid}`);
      await uploadBytes(picRef, profilePicFile);
      photoURL = await getDownloadURL(picRef);
    }

    // Set displayName and photo in Firebase Auth profile
    await updateProfile(userCred.user, {
      displayName,
      photoURL
    });

    // Store user info in Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName,
      photoURL,
    });

    return userCred.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Failed to register.");
  }
}

/**
 * Log in an existing user
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password.");
  }
}
