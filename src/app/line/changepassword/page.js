"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [working, setWorking] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const errText = (code) => {
    switch (code) {
      case "auth/wrong-password": return "รหัสผ่านปัจจุบันไม่ถูกต้อง";
      case "auth/weak-password": return "รหัสผ่านใหม่ควรมีอย่างน้อย 6 ตัวอักษร";
      case "auth/requires-recent-login": return "เพื่อความปลอดภัย โปรดเข้าสู่ระบบใหม่แล้วลองอีกครั้ง";
      case "auth/too-many-requests": return "พยายามมากเกินไป โปรดลองใหม่ภายหลัง";
      default: return "เปลี่ยนรหัสไม่สำเร็จ";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null); setOk(false);

    const user = auth.currentUser;
    if (!user || !user.email) { setErr("กรุณาเข้าสู่ระบบก่อน"); return; }
    if (!currentPassword) { setErr("กรุณากรอกรหัสผ่านปัจจุบัน"); return; }
    if (!newPassword || newPassword.length < 6) { setErr("รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร"); return; }
    if (newPassword !== confirmPassword) { setErr("รหัสผ่านใหม่และยืนยันไม่ตรงกัน"); return; }

    try {
      setWorking(true);
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);

      setOk(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      // setTimeout(() => router.replace("/line/profile"), 1200);
    } catch (e) {
      setErr(errText(e?.code) || e?.message || "เกิดข้อผิดพลาด");
    } finally {
      setWorking(false);
    }
  };

  // -------- UI: ทำฟอร์มแคบลง + ช่องสูงกำลังดี + ปุ่มตาเปิด/ปิด --------
  const formMaxW = 320; // ความกว้างสูงสุดของฟอร์ม (แคบลง)
  const inputBase = {
    width: "100%",
    height: 56,
    padding: "14px 44px 14px 16px", // เผื่อที่ด้านขวาให้ไอคอน
    borderRadius: 12,
    border: "1.5px solid #E0E0E0",
    fontSize: 16,
    background: "#fff",
    color: "#222",
    boxSizing: "border-box",
  };
  const eyeBtn = {
    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
    width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer",
    display: "grid", placeItems: "center",
  };

  const disabled = useMemo(() => working, [working]);

  return (
    <div className={notoSansThai.className}>
      <style jsx global>{`
        html, body, #__next { height: 100%; margin: 0; padding: 0; background: #ffffff; }
        * { box-sizing: border-box; }
      `}</style>

      <div
        className="content"
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          padding: "32px 20px 0 20px",
          paddingBottom: "calc(140px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, maxWidth: formMaxW, marginInline: "auto" }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "#E9F8EA", border: "none", cursor: "pointer", padding: 0,
              width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="ย้อนกลับ"
          >
            <img src="/back2.png" alt="back" style={{ width: 22, height: 22 }} />
          </button>
        </div>

        {/* Title */}
        <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 22, textAlign: "center", marginBottom: 24 }}>
          ตั้งรหัสผ่านใหม่
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: formMaxW, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: 12, marginBottom: 8 }}>
            {/* current */}
            <div style={{ position: "relative" }}>
              <input
                type={showCur ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="รหัสผ่านปัจจุบัน"
                style={inputBase}
              />
              <button type="button" onClick={() => setShowCur(v => !v)} aria-label="แสดง/ซ่อนรหัสผ่านปัจจุบัน" style={eyeBtn}>
                <img src={showCur ? "/eye2.png" : "/eye2.png"} alt="toggle" width={20} height={20} />
              </button>
            </div>

            {/* new */}
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
                style={inputBase}
              />
              <button type="button" onClick={() => setShowNew(v => !v)} aria-label="แสดง/ซ่อนรหัสผ่านใหม่" style={eyeBtn}>
                <img src={showNew ? "/eye2.png" : "/eye2.png"} alt="toggle" width={20} height={20} />
              </button>
            </div>

            {/* confirm */}
            <div style={{ position: "relative" }}>
              <input
                type={showCfm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่าน"
                style={inputBase}
              />
              <button type="button" onClick={() => setShowCfm(v => !v)} aria-label="แสดง/ซ่อนยืนยันรหัสผ่าน" style={eyeBtn}>
                <img src={showCfm ? "/eye2.png" : "/eye2.png"} alt="toggle" width={20} height={20} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <a href="/line/forgotpassword" style={{ color: "#3ABB47", fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>
              ลืมรหัสผ่าน
            </a>
          </div>

          {err && <div style={{ color: "#dc2626", marginBottom: 8 }}>{err}</div>}
          {ok && <div style={{ color: "#16a34a", marginBottom: 8 }}>เปลี่ยนรหัสสำเร็จ!</div>}

          <button
            type="submit"
            disabled={disabled}
            style={{
              width: "100%", background: disabled ? "#BDBDBD" : "#3ABB47", color: "#fff",
              border: "none", borderRadius: 12, padding: "16px 0",
              fontWeight: 700, fontSize: 20, marginTop: 8,
              boxShadow: "0 2px 8px rgba(58,187,71,0.08)", cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {working ? "กำลังบันทึก…" : "ยืนยัน"}
          </button>
        </form>
      </div>
    </div>
  );
}
