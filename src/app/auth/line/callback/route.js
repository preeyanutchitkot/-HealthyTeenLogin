import { NextResponse } from "next/server";
import axios from "axios";
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

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const uid = url.searchParams.get("state");

    // 1) แลก token จาก LINE Login
    const tokenRes = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_BASE_URL + "/auth/line/callback",
        client_id: process.env.NEXT_PUBLIC_LINE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET,
      })
    );

    const loginAccessToken = tokenRes.data.access_token;

    // 2) Get LINE Login Profile
    const loginProfile = await axios.get("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${loginAccessToken}` },
    });

    const linkedLineId = loginProfile.data.userId;

    // 3) Get Messaging API profile (OA userId)
    let oaUserId = null;

    try {
      const oaRes = await axios.get(
        `https://api.line.me/v2/bot/profile/${linkedLineId}`,
        {
          headers: { Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}` },
        }
      );
      oaUserId = oaRes.data.userId;
    } catch {
      // ผู้ใช้ยังไม่ได้เพิ่มเพื่อน OA
    }

    // 4) Save to Firestore
    await db.collection("users").doc(uid).set(
      {
        linkedLineId,
        oaUserId: oaUserId || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // ✅ ส่ง welcome message ถ้าเพิ่มเพื่อนบอทแล้ว
    if (oaUserId) {
    try {
        await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/line/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oaUserId }),
        });
    } catch (err) {
        // เก็บ error log ไว้เพื่อการ debug
        console.error("ส่งข้อความต้อนรับไม่สำเร็จ:", err);
    }
    }

    // ✅ Redirect ไปหน้าข้อตกลง
    return NextResponse.redirect(
    process.env.NEXT_PUBLIC_BASE_URL + "/line/agreement?from=link-line"
    );

    // ✅ เปลี่ยน Redirect มาที่หน้า 'ยอมรับข้อตกลง' ก่อน
    return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + "/line/agreement?from=link-line");
  } catch (err) {
    // เก็บ error log ไว้เพื่อการ debug
    console.error("CALLBACK ERROR:", err.response?.data || err);
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_BASE_URL + "/line/link-line?error=1"
    );
  }
}
