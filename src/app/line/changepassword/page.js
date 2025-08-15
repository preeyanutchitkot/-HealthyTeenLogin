"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle password change logic
  };

  return (
    <div className={notoSansThai.className} style={{ background: "#fff", minHeight: "100vh", padding: 0 }}>
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px 0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Back button */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "#E9F8EA",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginRight: 8,
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="ย้อนกลับ"
          >
            <img src="/back2.png" alt="back" style={{ width: 22, height: 22 }} />
          </button>
        </div>
        {/* Title */}
        <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 22, textAlign: "center", marginBottom: 32 }}>
          ตั้งรหัสผ่านใหม่
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="รหัสผ่านปัจจุบัน"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "1.5px solid #E0E0E0",
                fontSize: 16,
                background: "#fff",
                color: "#222",
                fontFamily: "inherit",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="รหัสผ่านใหม่"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "1.5px solid #E0E0E0",
                fontSize: 16,
                background: "#fff",
                color: "#222",
                fontFamily: "inherit",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่าน"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "1.5px solid #E0E0E0",
                fontSize: 16,
                background: "#fff",
                color: "#222",
                fontFamily: "inherit",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
            <a
              href="/line/forgotpassword"
              style={{ color: "#3ABB47", fontWeight: 500, fontSize: 16, textDecoration: "underline" }}
            >
              ลืมรหัสผ่าน
            </a>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#3ABB47",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 0",
              fontWeight: 700,
              fontSize: 20,
              marginTop: 8,
              boxShadow: "0 2px 8px rgba(58,187,71,0.08)",
            }}
          >
            ยืนยัน
          </button>
        </form>
      </div>
      {/* Bottom nav placeholder (if needed) */}
      <div style={{ height: 80 }} />
    </div>
  );
}
