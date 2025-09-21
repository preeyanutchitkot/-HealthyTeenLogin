'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "../components/menu";
import CalorieSummary from "../components/CalorieSummary";
import MenuPopup from "../components/MenuPopup";

import { auth, db } from "../lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import styles from "./HomePage.module.css";

const OA_URL = "https://line.me/R/ti/p/@696kpmzu";

const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const bellSrcByPercent = (percent) => {
  if (percent == null) return "/b1.png";        // ไม่มีข้อมูล => เขียวไว้ก่อน
  if (percent > 100) return "/b3.png";          // แดง
  if (percent >= 80) return "/b2.png";          // เหลือง
  return "/b1.png";                              // เขียว
};

export default function HomePage() {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // รูประฆังตามเปอร์เซ็นต์ของเป้าหมายวันนี้
  const [bellSrc, setBellSrc] = useState("/b1.png");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!uid) {
        setItems([]);
        setBellSrc("/b1.png");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const ymd = toYMD(new Date());

        // 1) ดึง BMR ผู้ใช้
        const uSnap = await getDoc(doc(db, "users", uid));
        const uData = uSnap.exists() ? uSnap.data() : null;
        const bmrVal = uData?.bmr ? Number(uData.bmr) : null;

        // 2) ดึงรายการอาหารวันนี้ + คำนวณผลรวมแคลอรี่
        const qRef = query(
          collection(db, "food"),
          where("uid", "==", uid),
          where("ymd", "==", ymd)
        );
        const snap = await getDocs(qRef);

        let sumCal = 0;
        const rows = snap.docs.map((d) => {
          const x = d.data();
          const cal = Number(x.calories || 0);
          const qty = Number(x.qty || 1);
          sumCal += cal * qty;
          return {
            name: x.name || x.item || "",
            img: x.imageUrl || "/placeholder.png",
            calText: qty > 1 ? `${cal}x${qty}` : `${cal}`
          };
        });
        setItems(rows);

        let percent = null;
        if (bmrVal && bmrVal > 0) {
          percent = Math.round((sumCal / bmrVal) * 100);
        }
        setBellSrc(bellSrcByPercent(percent));
      } catch (e) {
        console.error("load today menu error:", e);
        setItems([]);
        setBellSrc("/b1.png");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  return (
    <div className={styles.page}>
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
        }
      `}</style>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.profile}>
          <Image
            src="/profile.png"
            alt="profile"
            width={72}
            height={72}
            className={styles.profileImg}
          />
        </div>

        <div className={styles.headerIcons}>
          <Link
            href="/line/notification"
            aria-label="การแจ้งเตือน"
            className={styles.notifWrap}
          >
            <Image src={bellSrc} alt="doorbell" width={38} height={50} />
          </Link>

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={styles.menuBtn}
          >
            <Image src="/Menu.png" alt="เมนู" width={28} height={40} />
          </button>
        </div>

        <CalorieSummary variant="floating" />
        <Image
          src="/bunny.png"
          alt="bunny"
          width={72}
          height={72}
          className={styles.bunnyOverlay}
        />
      </div>

    <div className={styles.circleMenu}>
      {[
        { label: "บันทึกอาหาร", href: "/line/food", img: "/enough.png", external: false },
        { label: "แนะนำอาหาร", href: OA_URL,       img: "/ploy3.png",  external: true  },
        { label: "พูดคุย",     href: "/line/food",  img: "/mo.png",     external: false },
        { label: "วิดีโอสุขภาพ", href: "/line/lookvideo", img: "/p4.png", external: false }
      ].map((item) =>
        item.external ? (
          <a key={item.label} href={item.href} className={styles.circleMenuItem} target="_blank" rel="noopener noreferrer">
            <div className={styles.circleIcon}>
              <Image src={item.img} alt={item.label} width={36} height={36} />
            </div>
            <div className={styles.circleLabel}>{item.label}</div>
          </a>
        ) : (
          <Link href={item.href} key={item.label} className={styles.circleMenuItem}>
            <div className={styles.circleIcon}>
              <Image src={item.img} alt={item.label} width={36} height={36} />
            </div>
            <div className={styles.circleLabel}>{item.label}</div>
          </Link>
        )
      )}
    </div>
      {/* เมนูวันนี้ */}
      <div className={styles.menuToday}>
        <div className={styles.menuTable}>
          <div className={styles.menuHeaderRow}>
            <div className={styles.menuHeaderImg}>เมนูวันนี้</div>
            <div className={styles.menuHeaderName}>เมนู</div>
            <div className={styles.menuHeaderCal}>แคลอรี่</div>
          </div>

          {loading ? (
            <div className={styles.menuRow}><div className={styles.empty}>กำลังโหลด...</div></div>
          ) : items.length === 0 ? (
            <div className={styles.menuRow}><div className={styles.empty}>ยังไม่มีบันทึกในวันนี้</div></div>
          ) : (
            items.map((it, idx) => (
              <div className={styles.menuRow} key={`${it.name}-${idx}`}>
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
      </div>

      <MenuPopup isOpen={menuOpen} onClose={() => setMenuOpen(false)} size="compact" />
      <BottomMenu />
    </div>
  );
}
