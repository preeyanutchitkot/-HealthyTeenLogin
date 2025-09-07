// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,        // ใช้เฉพาะกรณีผู้ใช้กดปุ่มเอง
  // signInWithRedirect,   // ถ้าอยากใช้ redirect ก็เปลี่ยนมาใช้ตัวนี้แทน popup
  // getRedirectResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyErYOU1dSQ1DNygQoGTF6gRNCq-Ne1wk",
  authDomain: "healthy-teen-cec6c.firebaseapp.com",
  projectId: "healthy-teen-cec6c",
  storageBucket: "healthy-teen-cec6c.firebasestorage.app",
  messagingSenderId: "53156353248",
  appId: "1:53156353248:web:4dc33444f70d07c3202c85",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * ลงชื่อเข้าใช้แบบ "เงียบ ๆ" เพื่อให้ query/firestore ทำงานได้โดยไม่โดน popup-blocked
 * ต้องเปิด Anonymous sign-in ใน Firebase Console:
 * Authentication → Sign-in method → Anonymous → Enable
 */
export async function signInIfNeeded() {
  if (auth.currentUser) return auth.currentUser;

  try {
    // เก็บ session ใน localStorage
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // ข้ามได้ ไม่ critical
  }

  try {
    const { user } = await signInAnonymously(auth);
    return user;
  } catch (e) {
    if (e?.code === "auth/operation-not-allowed") {
      throw new Error(
        "ต้องเปิด Anonymous sign-in ใน Firebase Console (Authentication → Sign-in method → Anonymous)."
      );
    }
    throw e;
  }
}

/**
 * (ออปชัน) ฟังก์ชันล็อกอิน Google — เรียกเฉพาะจากการกดปุ่มของผู้ใช้เท่านั้น
 * เพื่อไม่ให้โดน popup-blocked
 */
export async function signInWithGoogleManual() {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider); // เรียกจาก onClick เท่านั้น
  return user;
}
