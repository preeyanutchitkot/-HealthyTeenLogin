// app/line/detail/page.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "../components/header";

import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  limit,
  getDocs,
} from "firebase/firestore";

import styles from "./DetailPage.module.css";

/* ===================== TZ-safe date helpers ===================== */
const TZ_BKK = "Asia/Bangkok";

// YYYY-MM-DD ของ "ตอนนี้" ในไทม์โซนที่กำหนด
const getLocalYMD = (d = new Date(), tz = TZ_BKK) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d); // YYYY-MM-DD

// แปลง YYYY-MM-DD -> Date ที่ 00:00:00Z เพื่อป้องกันเหลื่อมวันจาก TZ
const ymdToDateUTC = (ymd) => new Date(`${(ymd || "").slice(0,10)}T00:00:00Z`);

// ฟอร์แมตเป็นไทยแบบตัวเลข dd/MM/พ.ศ. และล็อก timeZone ให้ตรง
const fmtDateSlashTH = (ymd, tz = TZ_BKK) =>
  new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: tz,
  }).format(ymdToDateUTC(ymd));

/* ===================== Page ===================== */
export default function DetailPage() {
  const params = useSearchParams();

  // รับ date จาก query ถ้าไม่มีใช้วันนี้ (ทั้งคู่เป็นสตริง YYYY-MM-DD)
  const pickedYMD =
    (params.get("date") || getLocalYMD(new Date(), TZ_BKK)).slice(0, 10);

  const isToday = pickedYMD === getLocalYMD(new Date(), TZ_BKK);

  const [uid, setUid] = useState(null);
  const [goal, setGoal] = useState(2000); // จะอัปเดตจาก users.bmr
  const [rows, setRows] = useState([]);   // [{id,name,img,calText,cal}]
  const [totalCal, setTotalCal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ตามสถานะล็อกอิน
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  // โหลด BMR + รายการอาหารของวันนั้น (realtime)
  useEffect(() => {
    if (!uid) {
      setRows([]);
      setTotalCal(0);
      setGoal(2000);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1) BMR จาก users (doc/uid หรือ field uid)
    (async () => {
      try {
        let snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) {
          const qs = await getDocs(
            query(collection(db, "users"), where("uid", "==", uid), limit(1))
          );
          snap = qs.docs[0] ?? snap;
        }
        const bmr = Number(snap?.data()?.bmr);
        if (Number.isFinite(bmr) && bmr > 0) setGoal(Math.round(bmr));
      } catch {
        /* ใช้ค่าเดิม */
      }
    })();

    // 2) อาหารของ pickedYMD
    const qFood = query(
      collection(db, "food"),
      where("uid", "==", uid),
      where("ymd", "==", pickedYMD)
    );

    const unsubFood = onSnapshot(
      qFood,
      (snap) => {
        let sum = 0;
        const list = snap.docs.map((d) => {
          const x = d.data();
          const qty = Number(x.qty ?? 1) || 1;
          const calEach = Number(x.calories ?? x.cal ?? 0) || 0;
          const calTotal = calEach * qty;
          sum += calTotal;

          return {
            id: d.id,
            name: x.name || x.item || "-",
            img: x.imageUrl || "/placeholder.png",
            // ให้แสดงแบบ 300x4 ถ้ามีจำนวน
            calText: qty > 1 ? `${calEach}x${qty}` : `${calEach}`,
            cal: calTotal,
          };
        });

        setRows(list);
        setTotalCal(sum);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubFood();
  }, [uid, pickedYMD]);

  // สีการ์ดบนสุด
  const pct = useMemo(
    () => Math.round(((totalCal || 0) / (goal || 1)) * 100),
    [totalCal, goal]
  );
  const level = pct <= 79 ? "green" : pct < 100 ? "yellow" : "red";

  return (
    <div className={styles.page}>
      {/* แถบหัว */}
      <Header title="สรุปแคลอรี่" cartoonImage="/9.png" />

      <main className={styles.main}>
        {/* การ์ดรวมของวันนั้น (เปลี่ยนสีตาม % ของ BMR) */}
        <section className={`${styles.todayBadge} ${styles[`lv-${level}`]}`}>
          <div className={styles.tbTitle}>
            {isToday ? "วันนี้" : fmtDateSlashTH(pickedYMD, TZ_BKK)}
          </div>
          <div className={styles.tbValue}>
            {totalCal.toLocaleString()}
            <span className={styles.tbUnit}>CAL</span>
          </div>
        </section>

        {/* ตารางรายการอาหาร – สไตล์เดียวกับ HomePage */}
        <section className={styles.menuToday}>
          <div className={styles.menuTable}>
            {/* วันที่มุมซ้ายบนของการ์ด */}
            <div className={styles.tableDate}>
              {fmtDateSlashTH(pickedYMD, TZ_BKK)}
            </div>

            {/* หัวตาราง */}
            <div className={styles.menuHeaderRow}>
              <div className={styles.menuHeaderImg}>เมนูวันนี้</div>
              <div className={styles.menuHeaderName}>เมนู</div>
              <div className={styles.menuHeaderCal}>แคลอรี่</div>
            </div>

            {/* แถวข้อมูล */}
            {loading ? (
              <div className={styles.menuRow}>
                <div className={styles.empty}>กำลังโหลด...</div>
              </div>
            ) : rows.length === 0 ? (
              <div className={styles.menuRow}>
                <div className={styles.empty}>ยังไม่มีบันทึกในวันนี้</div>
              </div>
            ) : (
              rows.map((it) => (
                <div className={styles.menuRow} key={it.id}>
                  <div className={styles.menuColImg}>
                    <Image
                      src={it.img}
                      alt={it.name}
                      width={50}
                      height={50}
                      className={styles.menuThumb}
                      unoptimized
                    />
                  </div>
                  <div className={styles.menuColName}>{it.name}</div>
                  <div className={styles.menuColCal}>{it.calText}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
