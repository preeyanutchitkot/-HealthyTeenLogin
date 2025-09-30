import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  connectAuthEmulator,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAyErYOU1dSQ1DNygQoGTF6gRNCq-Ne1wk',
  authDomain: 'healthy-teen-cec6c.firebaseapp.com',
  projectId: 'healthy-teen-cec6c',
  storageBucket: 'healthy-teen-cec6c.appspot.com',
  messagingSenderId: '53156353248',
  appId: '1:53156353248:web:4dc33444f70d07c3202c85',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

auth.useDeviceLanguage?.();

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch(() => {});
}

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
  } catch {}
}

export async function signInIfNeeded() {
  if (auth.currentUser) return auth.currentUser;

  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {}

  try {
    const { user } = await signInAnonymously(auth);
    return user;
  } catch (e) {
    if (e?.code === 'auth/operation-not-allowed') {
      throw new Error(
        'ต้องเปิด Anonymous sign-in ใน Firebase Console (Authentication → Sign-in method → Anonymous).'
      );
    }
    throw e;
  }
}

export async function signInWithGoogleManual() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const { user } = await signInWithPopup(auth, provider);
  return user;
}
