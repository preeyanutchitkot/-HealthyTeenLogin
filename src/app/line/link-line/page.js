"use client";
import { auth } from "../lib/firebase";
import Image from "next/image";

export default function LinkLinePage() {
  const uid = auth.currentUser?.uid || "";

  const redirectURL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + "/auth/line/callback")}&state=${uid}&scope=profile%20openid`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e8fce8 0%, #ffffff 80%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Noto Sans Thai', sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          padding: "40px 30px",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <Image
          src="/Logo.png"
          alt="LINE Connect"
          width={80}
          height={80}
          style={{ margin: "0 auto 20px" }}
        />
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>เชื่อมต่อบัญชี LINE</h2>
        <p style={{ fontSize: 15, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
          เมื่อกดเชื่อมต่อ ระบบจะนำคุณไปที่ LINE เพื่ออนุญาตการเข้าถึงโปรไฟล์ของคุณ
          และเมื่อยืนยันสำเร็จ ระบบจะเชื่อมโยงบัญชี LINE ของคุณกับข้อมูลในฐานข้อมูล
          <strong> Healthy Teen </strong> โดยอัตโนมัติ 💚
        </p>

        <a href={redirectURL}>
          <button
            style={{
              padding: "14px 28px",
              background: "#00B900",
              color: "#fff",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,185,0,0.3)",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,185,0,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,185,0,0.3)";
            }}
          >
            เชื่อมต่อ LINE ✅
          </button>
        </a>

        <p style={{ fontSize: 13, color: "#777", marginTop: 20 }}>
          🔒 ข้อมูลของคุณจะถูกเก็บอย่างปลอดภัยใน Firebase Firestore  
          และใช้เพื่อให้บริการด้านโภชนาการเฉพาะบุคคลเท่านั้น
        </p>
      </div>
    </div>
  );
}
