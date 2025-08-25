"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomMenu from "@/app/line/components/menu";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault?.();
    // TODO: call reset API
    router.push("/line/checkemail");
  };

  const MENU_H = 76; // px

  // คำนวณ bottom เผื่อ safe-area (iOS)
  const buttonBottom = `calc(${MENU_H}px + 50px + env(safe-area-inset-bottom))`;

  return (
    <div className={notoSansThai.className}>
      {/* Global reset + safe-area (ป้องกันขอบขาว/วาบ) */}
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        :root { color-scheme: light; }
        html, body, #__next { height: 100%; }
        html, body { margin: 0; padding: 0; }
        body {
          background: #ffffff;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      <div
        style={{
          minHeight: "100svh",
          background: "#fff",
          // เว้นที่เผื่อเมนูล่าง เพื่อไม่ให้คอนเทนต์ท้ายสุดโดนทับ
          paddingBottom: `calc(${MENU_H}px + 24px + env(safe-area-inset-bottom))`,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            margin: "0 auto",
            padding: "32px 20px 0 20px",
            boxSizing: "border-box",
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
              <Image
                src="/back2.png"
                alt="back"
                width={22}
                height={22}
                style={{ width: "22px", height: "auto" }} // กัน aspect ratio warning
                priority
              />
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
            ลืมรหัสผ่าน
          </div>

          {/* ฟอร์ม */}
          <form onSubmit={handleSubmit} style={{ position: "relative", minHeight: 120 }}>
            <div style={{ marginBottom: 32 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมล"
                autoComplete="email"
                autoCapitalize="none"
                inputMode="email"
                required
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
                  outline: "none",
                }}
              />
            </div>

            {/* ปุ่ม submit – fixed เหนือเมนู */}
            <button
              type="submit"
              disabled={!email}
              style={{
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: buttonBottom,
                width: "calc(100% - 40px)",
                maxWidth: 400,
                background: email ? "#3ABB47" : "#BDBDBD",
                color: "#fff",
                border: email ? "1.5px solid #3ABB47" : "1.5px solid #BDBDBD",
                borderRadius: 10,
                height: 48,
                fontWeight: 600,
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(58,187,71,0.12)",
                cursor: email ? "pointer" : "not-allowed",
                transition: "background 0.2s, border 0.2s",
                padding: 0,
                zIndex: 20,
              }}
              aria-disabled={!email}
            >
              ส่งลิงก์ให้ฉัน
            </button>
          </form>
        </div>
      </div>

      {/* เมนูล่างติดจอ */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: "#fff",
        }}
      >
        <BottomMenu />
      </div>
    </div>
  );
}
