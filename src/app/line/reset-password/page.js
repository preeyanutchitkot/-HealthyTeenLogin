"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "../lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

const notoSansThai = Noto_Sans_Thai({ weight:["300","400","500","700"], subsets:["thai","latin"], display:"swap" });

// ดึง oobCode จาก query / continueUrl / hash
function extractOobCode() {
  try {
    const sp = new URLSearchParams(window.location.search);
    let code = sp.get("oobCode") || sp.get("oobcode") || sp.get("code");
    if (!code) {
      const cont = sp.get("continueUrl") || sp.get("continue");
      if (cont) {
        const u = new URL(decodeURIComponent(cont));
        const sp2 = new URLSearchParams(u.search);
        code = sp2.get("oobCode") || sp2.get("oobcode") || sp2.get("code");
      }
    }
    if (!code && window.location.hash) {
      const hs = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      code = hs.get("oobCode") || hs.get("oobcode") || hs.get("code");
    }
    return code || null;
  } catch { return null; }
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [oobCode, setOobCode] = useState(null);
  const [email, setEmail] = useState(null);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => setOobCode(extractOobCode()), []);
  useEffect(() => {
    const run = async () => {
      if (!oobCode) return;
      try {
        const e = await verifyPasswordResetCode(auth, oobCode);
        setEmail(e); setErr(null);
      } catch (e) { setErr(e?.message || "ลิงก์หมดอายุหรือไม่ถูกต้อง"); }
    };
    run();
  }, [oobCode]);

  const disabled = useMemo(
    () => !pw1 || pw1.length < 6 || pw1 !== pw2 || working || !oobCode,
    [pw1, pw2, working, oobCode]
  );

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!oobCode) { setErr("โค้ดไม่ถูกต้อง"); return; }
    setErr(null); setWorking(true);
    try {
      await confirmPasswordReset(auth, oobCode, pw1);
      setOk(true);
      setTimeout(() => router.replace("/"), 1200);
    } catch (e) { setErr(e?.message || "ตั้งรหัสใหม่ไม่สำเร็จ"); }
    finally { setWorking(false); }
  };

  // ── สไตล์ให้ “แคบลง” + ช่องสูงขึ้น ─────────────────────────────
  const formMaxW = 320;                // ← ทำให้ฟอร์มแคบลง (px)
  const inputBase = {
    width: "100%",
    height: 56,
    padding: "14px 44px 14px 16px",    // ขยายขวาไว้ให้ไอคอน
    borderRadius: 12,
    border: "1.5px solid #E5E7EB",
    fontSize: 16,
    background: "#fff",
    color: "#222",
    boxSizing: "border-box",
  };

  const eyeBtn = {
    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
    width: 28, height: 28, display: "grid", placeItems: "center",
    border: "none", background: "transparent", cursor: "pointer"
  };

  return (
    <div className={notoSansThai.className} style={{maxWidth: formMaxW, margin:"40px auto", padding:"0 16px"}}>
      <h2 style={{textAlign:"center",color:"#3ABB47", margin:"0 0 12px"}}>ตั้งรหัสผ่านใหม่</h2>
      {email && <p style={{textAlign:"center",marginTop:0,color:"#4B5563"}}>อีเมลบัญชี: <b>{email}</b></p>}

      <form onSubmit={onSubmit} style={{marginTop:16}}>
        <div style={{display:"grid", gap: 12}}>
          {/* ช่อง 1 + ไอคอนตา */}
          <div style={{position:"relative"}}>
            <input
              type={show1 ? "text" : "password"}
              placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              value={pw1}
              onChange={(e)=>setPw1(e.target.value)}
              style={inputBase}
            />
            <button type="button" onClick={()=>setShow1(v=>!v)} aria-label="แสดง/ซ่อนรหัสผ่านใหม่" style={eyeBtn}>
              <Image src={show1 ? "/eye2.png" : "/eye2.png"} alt="toggle" width={20} height={20}/>
            </button>
          </div>

          {/* ช่อง 2 + ไอคอนตา */}
          <div style={{position:"relative"}}>
            <input
              type={show2 ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่านใหม่"
              value={pw2}
              onChange={(e)=>setPw2(e.target.value)}
              style={inputBase}
            />
            <button type="button" onClick={()=>setShow2(v=>!v)} aria-label="แสดง/ซ่อนยืนยันรหัสผ่าน" style={eyeBtn}>
              <Image src={show2 ? "/eye2.png" : "/eye2.png"} alt="toggle" width={20} height={20}/>
            </button>
          </div>
        </div>

        {err && <div style={{color:"#dc2626",margin:"10px 0 0"}}>{err}</div>}
        {ok && <div style={{color:"#16a34a",margin:"10px 0 0"}}>ตั้งรหัสสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ…</div>}

        <button
          type="submit" disabled={disabled}
          style={{
            width:"100%", height:48, borderRadius:12, border:"none",
            background: disabled ? "#BDBDBD" : "#3ABB47",
            color:"#fff", fontWeight:700, fontSize:18,
            boxShadow:"0 2px 8px rgba(58,187,71,.12)", marginTop:16, cursor: disabled ? "not-allowed" : "pointer"
          }}
        >
          {working ? "กำลังบันทึก…" : "ยืนยันรหัสใหม่"}
        </button>
      </form>
    </div>
  );
}
