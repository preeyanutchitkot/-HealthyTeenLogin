"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "../components/menu";
import CalorieSummary from "../components/CalorieSummary";
import MenuPopup from "../components/MenuPopup";
import { Noto_Sans_Thai } from "next/font/google";

/* ===== Firebase ===== */
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";

import styles from "./MePage.module.css"; // ✅ ใช้ CSS Module

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function MePage() {
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "2-digit" });
  const today = useMemo(() => fmtDate(new Date()), []);

  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  // แจ้งเตือน (ให้เหมือนหน้า Home)
  const [showNotif, setShowNotif] = useState(true);
  const [notifColor, setNotifColor] = useState("green");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lv = window.localStorage.getItem("notifLevel");
      if (lv === "over") setNotifColor("red");
      else if (lv === "near") setNotifColor("yellow");
      else setNotifColor("green");
    }
  }, []);
  const notifDotClass =
    notifColor === "red"
      ? `${styles.notifDot} ${styles.dotRed}`
      : notifColor === "yellow"
      ? `${styles.notifDot} ${styles.dotYellow}`
      : `${styles.notifDot} ${styles.dotGreen}`;

  const toggleDate = (date) => setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      /* users/<uid> — อ่าน BMI/BMR */
      try {
        const uSnap = await getDoc(doc(db, "users", user.uid));
        const uData = uSnap.exists() ? uSnap.data() : null;
        setBmi(uData?.bmi != null ? Number(uData.bmi) : null);
        setBmr(uData?.bmr != null ? Number(uData.bmr) : null);
      } catch (e) {
        console.error("load BMI/BMR error:", e);
      }

      /* food/* — อ่าน log ทั้งหมดของผู้ใช้ เรียงล่าสุดก่อน */
      try {
        const qy = query(collection(db, "food"), where("uid", "==", user.uid), orderBy("date", "desc"));
        const snap = await getDocs(qy);

        const byDate = {};
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          const dateStr = d?.date?.toDate ? fmtDate(d.date.toDate()) : today;
          if (!byDate[dateStr]) byDate[dateStr] = [];
          const itemName = d.item ?? d.name ?? d.menu ?? d.title ?? "ไม่ระบุเมนู";
          byDate[dateStr].push({
            name: itemName,
            cal: d.calories != null && d.qty != null ? `${Number(d.calories)}x${Number(d.qty)}` : String(d.calories ?? "-"),
            img: d.imageUrl || d.img || "/placeholder.png",
          });
        });

        const orderedDates = Object.keys(byDate).sort((a, b) => {
          const [da, ma, ya] = a.split("/").map(Number);
          const [dbb, mb, yb] = b.split("/").map(Number);
          return new Date(2000 + yb, mb - 1, dbb) - new Date(2000 + ya, ma - 1, da);
        });

        const logsArr = orderedDates.length
          ? orderedDates.map((dateStr) => ({ date: dateStr, items: byDate[dateStr] }))
          : [{ date: today, items: [] }];

        setDailyLogs(logsArr);
        setOpenDates({ [logsArr[0].date]: true });
      } catch (e) {
        console.error("load food logs error:", e);
        const fallback = [{ date: today, items: [] }];
        setDailyLogs(fallback);
        setOpenDates({ [today]: true });
      }
    });

    return () => unsub();
  }, [today]);

  return (
    <div className={`${notoSansThai.className} ${styles.page}`}>
      {/* global bg ให้เหมือนเดิมเป๊ะ */}
      <style jsx global>{`
        html, body, #__next { height:100%; margin:0; padding:0; background-color:#f3faee; }
        * { box-sizing:border-box; }
      `}</style>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/line/home" aria-label="ย้อนกลับ" className={styles.back}></Link>
          <div className={styles.title}></div>
          <div className="right-icons" />
        </div>

        <div className={styles.profile}>
          <Image src="/profile.png" alt="profile" width={72} height={72} />
        </div>

        <div className={styles.headerIcons}>
          <Link
            href="/line/notification"
            aria-label="การแจ้งเตือน"
            onClick={() => setShowNotif(false)}
            className={styles.notifWrap}
          >
            <Image src="/Doorbell.png" alt="doorbell" width={28} height={40} />
            {showNotif && <span className={notifDotClass} />}
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="เมนู"
          >
            <Image src="/Menu.png" alt="menu" width={28} height={40} />
          </button>
        </div>

        <div className={styles.metrics}>
          <div>
            BMI
            {bmi != null && !isNaN(bmi) ? `: ${Number(bmi).toFixed(1)}` : "..........................................."}
            {bmr != null && !isNaN(bmr) ? ` | BMR: ${Number(bmr)}` : ""}
          </div>
        </div>

      </div>

  
      <div className={styles.summaryWrap}>
        <CalorieSummary variant="floating" />
        <Image
          src="/bunny.png"
          alt="bunny"
          width={78}
          height={78}
          className={styles.bunnyByCard}
        />
      </div>

      {/* รายการแบบกางวัน */}
      <div className={styles.dayAccordion}>
        {dailyLogs.map((d) => {
          const open = !!openDates[d.date];
          return (
            <div className={`${styles.dayCard} ${open ? "open" : ""}`} key={d.date}>
              <button
                className={styles.dayHeader}
                onClick={() => toggleDate(d.date)}
                aria-expanded={open}
                aria-controls={`panel-${d.date}`}
              >
                <span className="day-label">{d.date}</span>
                <span className={`${styles.chev} ${open ? styles.rot : ""}`}>▾</span>
              </button>

              <div id={`panel-${d.date}`} className={styles.dayBody} style={{ maxHeight: open ? "500px" : "0px" }}>
                {d.items && d.items.length > 0 ? (
                  <div className={styles.menuTable}>
                    <div className={styles.menuHeaderRow}>
                      <div className={styles.menuHeaderImg}>เมนูวันนี้</div>
                      <div className={styles.menuHeaderName}>เมนู</div>
                      <div className={styles.menuHeaderCal}>แคลอรี่</div>
                    </div>

                    {d.items.map((item, idx) => (
                      <div className={styles.menuRow} key={`${item.name}-${idx}`}>
                        <div className={styles.menuColImg}>
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
                            className={styles.menuThumb}
                            unoptimized
                          />
                        </div>
                        <div className={styles.menuColName}>{item.name}</div>
                        <div className={styles.menuColCal}>{item.cal}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>ยังไม่มีบันทึกในวันนี้</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MenuPopup isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomMenu />
    </div>
  );
}
