"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "../../line/components/menu";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle send reset link
    router.push("/line/checkemail");
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
          ลืมรหัสผ่าน
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', minHeight: 120 }}>
          <div style={{ marginBottom: 32 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="กรอกอีเมล"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "1.5px solid #BDBDBD",
                fontSize: 16,
                background: "#fff",
                color: "#222",
                fontFamily: "inherit",
                marginBottom: 0,
                boxSizing: "border-box",
              }}
            />
          </div>
          {/* ปุ่มชิดขอบล่าง */}
          <button
            type="submit"
            disabled={!email}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 140,
              width: 'calc(100% - 40px)',
              maxWidth: 400,
              margin: '0 auto',
              background: email ? "#3ABB47" : "#BDBDBD",
              color: "#fff",
              border: email ? '1.5px solid #3ABB47' : '1.5px solid #BDBDBD',
              borderRadius: 10,
              height: 48,
              fontWeight: 400,
              fontSize: 20,
              boxShadow: "0 2px 8px rgba(58,187,71,0.08)",
              cursor: email ? "pointer" : "not-allowed",
              transition: "background 0.2s",
              zIndex: 10,
              padding: 0,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            ส่งลิงก์ให้ฉัน
          </button>
        </form>
      </div>
      {/* Bottom nav */}
      <div style={{ height: 80 }} />
      <Menu />
    </div>
  );
}
