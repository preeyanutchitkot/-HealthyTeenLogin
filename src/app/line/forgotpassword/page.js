"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

const notoSansThai = Noto_Sans_Thai({ weight:["300","400","500","700"], subsets:["thai","latin"], display:"swap" });

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [err, setErr] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!email) return;
    try {
      setErr(null); setIsSending(true);
      auth.languageCode = "th";
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/line/reset-password`,
        handleCodeInApp: true,
      });
      router.push("/line/checkemail");
    } catch (e) {
      setErr(e?.message || "ส่งอีเมลไม่สำเร็จ");
    } finally {
      setIsSending(false);
    }
  };

  const MENU_H = 76;
  const buttonBottom = `calc(${MENU_H}px + 50px + env(safe-area-inset-bottom))`;

  // ✅ ปรับขนาดฟอร์ม/ช่อง
  const FORM_MAX_W = 390; // ทำให้แคบลง
  const inputStyle = {
    width: "100%",
    height: 50,                 // สูงกำลังดี
    padding: "14px 16px",
    borderRadius: 12,           // มุมโค้ง
    border: "1.5px solid #BDBDBD",
    fontSize: 16,
    background: "#fff",
    color: "#222",
    boxSizing: "border-box",
  };

  return (
    <div className={notoSansThai.className}>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box}
        :root{color-scheme:light}
        html,body,#__next{height:100%}
        html,body{margin:0;padding:0}
        body{background:#fff;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
      `}</style>

      <div style={{minHeight:"100svh",background:"#fff",paddingBottom:`calc(${MENU_H}px + 24px + env(safe-area-inset-bottom))`}}>
        <div style={{maxWidth:FORM_MAX_W,width:"100%",margin:"0 auto",padding:"32px 20px 0"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
            <button
              onClick={()=>router.back()}
              style={{background:"#E9F8EA",border:"none",cursor:"pointer",padding:0,marginRight:8,width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}
              aria-label="ย้อนกลับ"
            >
              <Image src="/back2.png" alt="back" width={22} height={22} priority />
            </button>
          </div>

          <div style={{color:"#3ABB47",fontWeight:700,fontSize:22,textAlign:"center",marginBottom:12}}>ลืมรหัสผ่าน</div>
          <p style={{textAlign:"center",color:"#4B5563",margin:"0 0 20px"}}>
            ใส่อีเมลที่ใช้สมัคร เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ
          </p>

          <form onSubmit={handleSubmit} style={{position:"relative",minHeight:140}}>
            <div style={{marginBottom:12}}>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="กรอกอีเมล"
                autoComplete="email"
                autoCapitalize="none"
                inputMode="email"
                required
                style={inputStyle}  // ← ใช้สไตล์ช่องที่ปรับแล้ว
              />
            </div>

            {err && <div style={{color:"#DC2626",fontSize:14,marginBottom:8}}>{err}</div>}

            <button
              type="submit"
              disabled={!email || isSending}
              style={{
                position:"fixed",
                left:"50%",
                transform:"translateX(-50%)",
                bottom:buttonBottom,
                width:"calc(100% - 40px)",
                maxWidth:FORM_MAX_W,   // ← ปุ่มกว้างพอดีกับฟอร์ม
                height:48,
                background:!email||isSending?"#BDBDBD":"#3ABB47",
                color:"#fff",
                border:`1.5px solid ${!email||isSending?"#BDBDBD":"#3ABB47"}`,
                borderRadius:12,
                fontWeight:600,
                fontSize:18,
                boxShadow:"0 2px 8px rgba(58,187,71,.12)",
                cursor:!email||isSending?"not-allowed":"pointer",
              }}
            >
              {isSending ? "กำลังส่ง…" : "ส่งลิงก์ให้ฉัน"}
            </button>
          </form>
        </div>
      </div>

      <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:10,background:"#fff"}} />
    </div>
  );
}
