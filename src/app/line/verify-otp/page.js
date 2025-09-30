"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Noto_Sans_Thai } from "next/font/google";
import dayjs from "dayjs";

const notoSansThai = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "500", "700"] });

export default function VerifyOTPPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const q = query(
        collection(db, "email_otps"),
        where("email", "==", email),
        where("otp", "==", otp),
        where("used", "==", false)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMsg("รหัสไม่ถูกต้อง หรือหมดอายุ");
      } else {
        const docRef = snapshot.docs[0].ref;
        const data = snapshot.docs[0].data();

        // ✅ ตรวจเวลา (หมดอายุใน 5 นาที)
        const created = data.createdAt?.toDate?.() || new Date();
        if (dayjs().diff(dayjs(created), "minute") > 5) {
          setMsg("⏰ รหัสหมดอายุแล้ว");
        } else {
          // ✅ อัปเดตสถานะ
          await updateDoc(docRef, { used: true });
          setMsg("✅ ยืนยันสำเร็จ กำลังเข้าสู่ระบบ...");
          setTimeout(() => router.replace("/line/home"), 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setMsg("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={notoSansThai.className}
      style={{ padding: "40px 20px", maxWidth: 400, margin: "0 auto" }}
    >
      <h2 style={{ color: "#3ABB47", textAlign: "center" }}>ยืนยันรหัส OTP</h2>
      <p style={{ textAlign: "center", color: "#666" }}>
        กรอกรหัส 6 หลักที่ส่งไปยัง <b>{email}</b>
      </p>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="กรอกรหัส OTP"
          maxLength={6}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1.5px solid #ddd",
            marginTop: 16,
            textAlign: "center",
            fontSize: 24,
            letterSpacing: 4,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: "#3ABB47",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {loading ? "กำลังตรวจสอบ..." : "ยืนยันรหัส"}
        </button>

        {/* ✅ รูป + ข้อความตรงกลางด้านล่าง */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginTop: 40,
            gap: 12,
          }}
        >
          <img
            src="/Rectangle.png"
            alt="Rectangle Icon"
            style={{ width: 140, height: "auto", objectFit: "contain" }}
          />
          <p style={{ margin: 0, color: "#333", fontSize: 14, lineHeight: 1.6 }}>
            กรุณาตรวจสอบอีเมลของคุณ <br />
            เราได้ส่งข้อมูลไปยังอีเมลของคุณแล้ว
          </p>
          <p style={{ margin: 0, color: "#666", fontSize: 13, lineHeight: 1.6 }}>
            ระบบจะพาคุณไปยังหน้า Home หลังจากนั้นให้คลิกที่เมนู <b>สามขีด</b>
          </p>
          <p style={{ margin: 0, color: "#666", fontSize: 13, lineHeight: 1.6 }}>
            แล้วเลือก <b>“แก้ไข”</b> เพื่อดำเนินการต่อ
          </p>
        </div>
      </form>

      {msg && <p style={{ textAlign: "center", marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
