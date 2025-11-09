import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function POST(req) {
  const { uid, oaUserId, displayName } = await req.json();

  await db.collection("users").doc(uid).set({
    oaUserId,
    displayName,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return NextResponse.json({ success: true });
}
