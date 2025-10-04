import { NextResponse } from "next/server";
import admin from "../../line/lib/firebase-admin";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Missing fields' });
    }

    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, { password: newPassword });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({
      success: false,
      message: err.message || 'Error resetting password',
    });
  }
}
