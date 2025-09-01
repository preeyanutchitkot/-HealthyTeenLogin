"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import BottomMenu from "../components/menu";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function EditMenuPage() {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // ===== อ่านข้อมูลผู้ใช้ =====
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setUid(user.uid || "");
      setEmail(user.email || "");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() || {};
        setGender(data.gender ?? "");
        setAge((data.age ?? "").toString());
        setHeight((data.height ?? "").toString());
        setWeight((data.weight ?? "").toString());
      }
    });
    return () => unsub();
  }, []);

  // ===== เซฟข้อมูล =====
  const handleSave = async () => {
    if (!uid) return;
    // แปลงตัวเลขแบบปลอดภัย
    const toNum = (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const payload = {
      gender: gender || "",
      age: toNum(age),
      height: toNum(height),
      weight: toNum(weight),
      // อาจเพิ่ม updatedAt ตามต้องการ
    };

    try {
      setSaving(true);
      await updateDoc(doc(db, "users", uid), payload);
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  // ===== แจ้งความสูงเมนูล่างให้หน้าอื่นใช้กันทับ (ตั้ง --menu-h) =====
  useEffect(() => {
    const nav = document.getElementById("bottom-menu");
    if (!nav) return;
    const apply = () => {
      document.documentElement.style.setProperty("--menu-h", `${nav.offsetHeight}px`);
    };
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    apply();
    window.addEventListener("load", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", apply);
    };
  }, []);

  const menuDockStyle = useMemo(
    () => ({
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      background: "#fff",
      zIndex: 10,
    }),
    []
  );

  return (
    <div
      className={notoSansThai.className}
      style={{
        // กันโดนเมนูล่างทับ (ถ้าไม่รู้สูงจริง ใช้ 100px เผื่อไว้)
        paddingBottom: "calc(var(--menu-h, 100px) + env(safe-area-inset-bottom))",
        background: "#fff",
        minHeight: "100vh",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      {/* Header + เนื้อหา */}
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px 0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* ปุ่มย้อนกลับ + หัวข้อ */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
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
            <Image src="/back2.png" alt="back" width={22} height={22} style={{ height: "auto" }} />
          </button>
          <span
            style={{
              color: "#3ABB47",
              fontWeight: 700,
              fontSize: 22,
              flex: 1,
              textAlign: "center",
            }}
          >
            อัพเดตโปรไฟล์
          </span>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#F3F8F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
              position: "relative",
            }}
          >
            <Image src="/profile.png" alt="avatar" width={48} height={48} style={{ height: "auto" }} />
            <div
              style={{
                width: 24,
                height: 24,
                background: "#3ABB47",
                borderRadius: "50%",
                border: "2px solid #fff",
                position: "absolute",
                bottom: 2,
                right: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 20h4.586a1 1 0 0 0 .707-.293l10.5-10.5a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0l-10.5 10.5A1 1 0 0 0 4 15.414V20z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Email (อ่านอย่างเดียว) */}
        <input
          type="email"
          value={email}
          readOnly
          style={{
            width: "100%",
            maxWidth: 400,
            boxSizing: "border-box",
            padding: "12px 20px",
            borderRadius: 10,
            border: "1.5px solid #E0E0E0",
            marginBottom: 14,
            fontSize: 16,
            background: "#fff",
            color: "#222",
            fontFamily: "inherit",
          }}
        />

        {/* Password + Change */}
        <div style={{ display: "flex", marginBottom: 18, width: "100%", maxWidth: 400 }}>
          <input
            type="password"
            value={"********"}
            readOnly
            placeholder="********"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 20px",
              borderRadius: "10px 0 0 10px",
              border: "1.5px solid #E0E0E0",
              borderRight: "none",
              fontSize: 16,
              background: "#fff",
              color: "#222",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => router.push("/line/changepassword")}
            style={{
              background: "#3ABB47",
              color: "#fff",
              border: "none",
              borderRadius: "0 10px 10px 0",
              padding: "0 18px",
              fontWeight: 700,
              fontSize: 16,
              minWidth: 110,
              height: 48,
              whiteSpace: "nowrap",
            }}
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>

        {/* Gender + Age */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, width: "100%", maxWidth: 400 }}>
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1.5px solid #E0E0E0",
              borderRadius: 10,
              padding: "12px 16px 8px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>ระบุเพศ</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Image src="/gender.png" alt="gender" width={22} height={22} style={{ height: "auto", opacity: 0.6, marginRight: 8 }} />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  color: gender ? "#222" : "#BDBDBD",
                  fontSize: 15,
                  border: "none",
                  background: "none",
                  width: "100%",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option value="">เพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1.5px solid #E0E0E0",
              borderRadius: 10,
              padding: "12px 16px 8px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>อายุ</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Image src="/age.png" alt="age" width={22} height={22} style={{ height: "auto", opacity: 0.6, marginRight: 8 }} />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="อายุ"
                style={{
                  color: age ? "#222" : "#BDBDBD",
                  fontSize: 15,
                  border: "none",
                  background: "none",
                  width: "100%",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Height + Weight */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, width: "100%", maxWidth: 400 }}>
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1.5px solid #E0E0E0",
              borderRadius: 10,
              padding: "12px 16px 8px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>ส่วนสูง</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Image src="/height.png" alt="height" width={22} height={22} style={{ height: "auto", opacity: 0.6, marginRight: 8 }} />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="ส่วนสูง"
                style={{
                  color: height ? "#222" : "#BDBDBD",
                  fontSize: 15,
                  border: "none",
                  background: "none",
                  width: "100%",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1.5px solid #E0E0E0",
              borderRadius: 10,
              padding: "12px 16px 8px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ color: "#3ABB47", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>น้ำหนัก</div>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Image src="/weight.png" alt="weight" width={22} height={22} style={{ height: "auto", opacity: 0.6, marginRight: 8 }} />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="น้ำหนัก"
                style={{
                  color: weight ? "#222" : "#BDBDBD",
                  fontSize: 15,
                  border: "none",
                  background: "none",
                  width: "100%",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!uid || saving}
          style={{
            width: "100%",
            maxWidth: 400,
            background: !uid || saving ? "#BDBDBD" : "#3ABB47",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px 0",
            fontWeight: 700,
            fontSize: 20,
            marginTop: 8,
            cursor: !uid || saving ? "not-allowed" : "pointer",
            transition: "background .15s",
          }}
        >
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      {/* เมนูด้านล่างติดจอ */}
      <div id="bottom-menu" style={menuDockStyle}>
        <BottomMenu />
      </div>
    </div>
  );
}
