"use client";

import { Noto_Sans_Thai } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
// import BottomMenu from "../components/menu"; // ใช้จริงคงเปิดบรรทัดนี้
import "./EditMenuPage.css";

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

  // ★ เพิ่ม state สำหรับ activityFactor (อาจมีอยู่แล้วในโปรไฟล์)
  const [activityFactor, setActivityFactor] = useState("");

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
        // ★ ดึง activityFactor ถ้ามี
        setActivityFactor(
          data.activityFactor !== undefined && data.activityFactor !== null
            ? String(data.activityFactor)
            : ""
        );
      }
    });
    return () => unsub();
  }, []);

  // ===== ฟังก์ชันแปลงตัวเลขแบบปลอดภัย =====
  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // ===== เซฟข้อมูล + คำนวณ BMI/BMR/TDEE =====
  const handleSave = async () => {
    if (!uid) return;

    // แปลงชนิดข้อมูล
    const ageNum = toNum(age);
    const heightNum = toNum(height); // หน่วยซม.
    const weightNum = toNum(weight); // หน่วยกก.
    const activityNum = toNum(activityFactor);

    // คำนวณ BMI
    let bmi = null;
    if (heightNum && heightNum > 0 && weightNum && weightNum > 0) {
      const hM = heightNum / 100; // แปลงเป็นเมตร
      bmi = Number((weightNum / (hM * hM)).toFixed(2));
    }

    // คำนวณ BMR (Harris-Benedict)
    let bmr = null;
    if (gender && ageNum && heightNum && weightNum) {
      if (gender === "male") {
        bmr = 66.47 + 13.75 * weightNum + 5.003 * heightNum - 6.755 * ageNum;
      } else if (gender === "female") {
        bmr = 655.1 + 9.563 * weightNum + 1.85 * heightNum - 4.676 * ageNum;
      }
      if (bmr !== null) bmr = Math.round(bmr);
    }

    // คำนวณ TDEE (ถ้ามี activityFactor)
    let tdee = null;
    if (bmr && activityNum) {
      tdee = Math.round(bmr * activityNum);
    }

    const payload = {
      gender: gender || "",
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      // ★ update ค่าใหม่
      bmi: bmi ?? null,
      bmr: bmr ?? null,
      // ★ เก็บ activityFactor ถ้ามี
      activityFactor: activityNum ?? null,
      tdee: tdee ?? null,
      updatedAt: serverTimestamp(), // ★ timestamp เมื่ออัปเดต
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
      document.documentElement.style.setProperty(
        "--menu-h",
        `${nav.offsetHeight}px`
      );
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

  // (คงไว้เพื่ออิงตำแหน่งเหมือนเดิม แต่สไตล์ย้ายไป CSS แล้ว)
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
    <div className={`${notoSansThai.className} page-container`}>
      <div className="inner-wrapper">
        <div className="header">
          <button
            onClick={() => router.back()}
            className="back-btn"
            aria-label="ย้อนกลับ"
          >
            <Image
              src="/back2.png"
              alt="back"
              width={22}
              height={22}
              className="img-auto"
            />
          </button>
          <span className="header-title">อัพเดตโปรไฟล์</span>
        </div>

  
       <div className="avatar-wrap">
          <div className="avatar-circle">
            <Image
              src="/profile.png"
              alt="avatar"
              width={72}
              height={72}
              className="img-auto"
            />
          </div>
        </div>

        <input type="email" value={email} readOnly className="input" />

        <div className="password-row">
          <input
            type="password"
            value={"********"}
            readOnly
            placeholder="********"
            className="password-input"
          />
          <button
            onClick={() => router.push("/line/changepassword")}
            className="password-btn"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>

        <div className="field-row">
          <div className="field-card">
            <div className="field-title">ระบุเพศ</div>
            <div className="field-inner">
              <Image
                src="/gender.png"
                alt="gender"
                width={22}
                height={22}
                className="icon-muted"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`field-input ${!gender ? "is-empty" : ""}`}
              >
                <option value="">เพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
          </div>

          <div className="field-card">
            <div className="field-title">อายุ</div>
            <div className="field-inner">
              <Image
                src="/age.png"
                alt="age"
                width={22}
                height={22}
                className="icon-muted"
              />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="อายุ"
                className="field-input"
              />
            </div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-card">
            <div className="field-title">ส่วนสูง</div>
            <div className="field-inner">
              <Image
                src="/height.png"
                alt="height"
                width={22}
                height={22}
                className="icon-muted"
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="ส่วนสูง"
                className="field-input"
              />
            </div>
          </div>

          <div className="field-card">
            <div className="field-title">น้ำหนัก</div>
            <div className="field-inner">
              <Image
                src="/weight.png"
                alt="weight"
                width={22}
                height={22}
                className="icon-muted"
              />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="น้ำหนัก"
                className="field-input"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!uid || saving}
          className="save-btn"
        >
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      <div id="bottom-menu" style={menuDockStyle} className="bottom-menu-dock"></div>
    </div>
  );
}
