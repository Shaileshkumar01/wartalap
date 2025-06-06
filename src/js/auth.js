// src/js/auth.js
import { auth, db, storage } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export async function register(email, password, displayName, profilePicFile) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  const uid = userCred.user.uid;

  // Upload profile pic
  let photoURL = "";
  if (profilePicFile) {
    const picRef = ref(storage, `profilePics/${uid}`);
    await uploadBytes(picRef, profilePicFile);
    photoURL = await getDownloadURL(picRef);
  }

  // Update Firebase user profile
  await updateProfile(userCred.user, {
    displayName,
    photoURL,
  });

  // Save in Firestore
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    displayName,
    photoURL,
  });

  return userCred.user;
}

export async function login(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}
