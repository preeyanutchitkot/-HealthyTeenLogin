"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomMenu from "../components/menu";

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
    <div className={notoSansThai.className}>
      {/* พื้นหลังสีขาวเต็มจอ + รีเซ็ต margin/padding */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #ffffff; /* พื้นหลังขาวทั้งหน้า */
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* เนื้อหา (ให้เลื่อนได้ + กันเมนูล่างทับ) */}
      <div
        className="content"
        style={{
          minHeight: "100vh",
          background: "#ffffff",                 // พื้นหลังขาว
          padding: "32px 20px 0 20px",
          paddingBottom: "calc(140px + env(safe-area-inset-bottom, 0px))",
          // ↑ เผื่อความสูง BottomMenu เพื่อเลื่อนไปถึงด้านล่างได้จริง
        }}
      >
        {/* ปุ่มย้อนกลับ */}
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

        {/* หัวข้อ */}
        <div
          style={{
            color: "#3ABB47",
            fontWeight: 700,
            fontSize: 22,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          ตั้งรหัสผ่านใหม่
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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
              }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

      {/* เมนูล่าง (fixed) */}
      <BottomMenu />
    </div>
  );
}
