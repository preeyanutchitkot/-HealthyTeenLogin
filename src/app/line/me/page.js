"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "../components/menu";
import CalorieSummary from "../components/CalorieSummary";
import MenuPopup from "../components/MenuPopup"; // ← แก้ path ให้เหลือ /MenuPopup เดียว
import { Noto_Sans_Thai } from "next/font/google";

/* ===== Firebase ===== */
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function MePage() {
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  const today = useMemo(() => fmtDate(new Date()), []);

  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDate = (date) =>
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      // users/<uid> — อ่าน BMI/BMR
      try {
        const uSnap = await getDoc(doc(db, "users", user.uid));
        const uData = uSnap.exists() ? uSnap.data() : null;
        setBmi(uData?.bmi != null ? Number(uData.bmi) : null);
        setBmr(uData?.bmr != null ? Number(uData.bmr) : null);
      } catch (e) {
        console.error("load BMI/BMR error:", e);
      }

      // food/* — อ่าน log ทั้งหมดของผู้ใช้ เรียงล่าสุดก่อน
      try {
        const qy = query(
          collection(db, "food"),
          where("uid", "==", user.uid),
          orderBy("date", "desc")
        );
        const snap = await getDocs(qy);

        const byDate = {};
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          const dateStr = d?.date?.toDate ? fmtDate(d.date.toDate()) : today;

          if (!byDate[dateStr]) byDate[dateStr] = [];

          const itemName = d.item ?? d.name ?? d.menu ?? d.title ?? "ไม่ระบุเมนู";
          byDate[dateStr].push({
            name: itemName,
            cal:
              d.calories != null && d.qty != null
                ? `${Number(d.calories)}x${Number(d.qty)}`
                : String(d.calories ?? "-"),
            // ✅ ใช้รูปจริงจาก Firestore; fallback เป็น placeholder
            img: d.imageUrl || d.img || "/placeholder.png",
          });
        });

        // เรียงวันที่ใหม่ → ล่าสุดก่อน
        const orderedDates = Object.keys(byDate).sort((a, b) => {
          const [da, ma, ya] = a.split("/").map(Number);
          const [dbb, mb, yb] = b.split("/").map(Number);
          return (
            new Date(2000 + yb, mb - 1, dbb) - new Date(2000 + ya, ma - 1, da)
          );
        });

        const logsArr =
          orderedDates.length > 0
            ? orderedDates.map((dateStr) => ({
                date: dateStr,
                items: byDate[dateStr],
              }))
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
    <div className={`${notoSansThai.className} page`}>
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <Link href="/line/home" aria-label="ย้อนกลับ" className="back"></Link>
          <div className="title"></div>
          <div className="right-icons" />
        </div>

        <div className="profile">
          <Image src="/profile.png" alt="profile" width={72} height={72} />
        </div>

        <div className="header-icons">
          <Link href="/line/notification">
            <Image src="/Doorbell.png" alt="doorbell" width={28} height={40} />
          </Link>
          <button
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
            onClick={() => setMenuOpen(true)}
            aria-label="เมนู"
          >
            <Image src="/Menu.png" alt="menu" width={28} height={40} />
          </button>
        </div>

        <div className="metrics">
          <div>
            BMI
            {bmi != null && !isNaN(bmi)
              ? `: ${Number(bmi).toFixed(1)}`
              : "..........................................."}
            {bmr != null && !isNaN(bmr) ? ` | BMR: ${Number(bmr)}` : ""}
          </div>
        </div>
      </div>

      <div className="summary-wrap">
        <CalorieSummary variant="floating" bunnyImage="/bunny.png" />
      </div>

      {/* รายการแบบกางวัน */}
      <div className="day-accordion">
        {dailyLogs.map((d) => {
          const open = !!openDates[d.date];
          return (
            <div className={`day-card ${open ? "open" : ""}`} key={d.date}>
              <button
                className="day-header"
                onClick={() => toggleDate(d.date)}
                aria-expanded={open}
                aria-controls={`panel-${d.date}`}
              >
                <span className="day-label">{d.date}</span>
                <span className={`chev ${open ? "rot" : ""}`}>▾</span>
              </button>

              <div
                id={`panel-${d.date}`}
                className="day-body"
                style={{ maxHeight: open ? "500px" : "0px" }}
              >
                {d.items && d.items.length > 0 ? (
                  <div className="menu-table">
                    <div className="menu-header-row">
                      <div className="menu-header-img">เมนูวันนี้</div>
                      <div className="menu-header-name">เมนู</div>
                      <div className="menu-header-cal">แคลอรี่</div>
                    </div>

                    {d.items.map((item, idx) => (
                      <div className="menu-row" key={`${item.name}-${idx}`}>
                        <div className="menu-col-img">
                          {/* ✅ unoptimized: แสดงรูปจากโดเมนภายนอกได้ทันที
                              ถ้าต้องการ optimize ให้ไปเพิ่มโดเมนใน next.config.js */}
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div className="menu-col-name">{item.name}</div>
                        <div className="menu-col-cal">{item.cal}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty">ยังไม่มีบันทึกในวันนี้</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MenuPopup isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomMenu />

      <style>{`
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
        }
        * {
          box-sizing: border-box;
        }
        .bunny-img {
          position: absolute;
          top: -24px;
          right: -12px;
          width: 72px;
        }
        .page {
          background-color: #f3faee;
          min-height: 100vh;
          padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: 0.1px;
          font-size: 14px;
          line-height: 1.45;
        }
        .header { background-color: #3ABB47; position: relative; padding-bottom: 40px; }
        .header-top { display: grid; grid-template-columns: 48px 1fr 64px; align-items: center; color: #fff; padding: 10px 12px; }
        .back { color: #fff; font-size: 24px; text-decoration: none; display:flex; align-items:center; }
        .title { text-align: center; line-height: 1.1; }
        .title .app { font-weight: 700; }
        .title .sub { font-size: 12px; opacity: .8; }
        .profile { position: absolute; top: 56px; left: 50%; transform: translateX(-50%); background: white; border-radius: 50%; overflow: hidden; width: 72px; height: 72px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 20; }
        .header-icons { position: absolute; top: 16px; right: 16px; display: flex; gap: 12px; z-index: 20; }
        .metrics { color: #fff; margin-top: 138px; padding: 0 20px 12px; font-size: 13px; text-align: center ;}
        .summary-wrap { position: relative; width: 332px; margin: -100px auto 10px; z-index: 30; }
        .day-accordion { padding: 0 16px 12px; display: grid; gap: 12px; margin-top: 320px; }
        .day-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        .day-header { width: 100%; text-align: left; background: #fff; border: none; display: flex; align-items: center; justify-content: space-between; padding: 20px 16px; cursor: pointer; font-weight: 600; }
        .chev { transition: transform .2s ease; }
        .chev.rot { transform: rotate(180deg); }
        .day-body { overflow: hidden; transition: max-height .25s ease, opacity .2s ease; opacity: 1; padding: 0 12px 12px; }
        .day-card:not(.open) .day-body { opacity: 0; padding: 0 12px; }
        .empty { background: #fafafa; border: 1px dashed #e3e3e3; border-radius: 10px; padding: 14px; text-align: center; color: #6b7280; font-size: 13px; }
        .menu-table { background: white; border-radius: 12px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); overflow: hidden; margin-top: 8px; }
        .menu-header-row { display: flex; background-color: #ffffff; padding: 10px 12px; font-weight: 700; font-size: 14px; color: #333; border-bottom: 1px solid #e8e8e8; }
        .menu-header-img { width: 90px; text-align: center; }
        .menu-header-name { flex: 1; text-align: center; }
        .menu-header-cal { width: 90px; text-align: center; }
        .menu-row { display: flex; align-items: center; padding: 10px 12px; border-top: 1px solid #f0f0f0; background-color: white; }
        .menu-col-img { width: 90px; display: flex; justify-content: center; align-items: center; }
        .menu-col-name { flex: 1; font-size: 14.5px; font-weight: 500; color: #2f3a43; display: flex; justify-content: center; align-items: center; text-align: center; }
        .menu-col-cal { width: 90px; font-size: 14px; font-weight: 700; color: #2a2a2a; display: flex; justify-content: center; align-items: center; }
      `}</style>
    </div>
  );
}
