'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "../components/menu";
import CalorieSummary from "../components/CalorieSummary";
import MenuPopup from "../components/MenuPopup";

import { auth, db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const OA_URL    = "https://line.me/R/ti/p/@696kpmzu"; // แนะนำอาหาร (Official Account)
const GROUP_URL = "https://line.me/ti/g/t8BaEgh4cw";   // พูดคุย (Group)

const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function HomePage() {
  const [showNotif, setShowNotif] = useState(true);
  const [notifColor, setNotifColor] = useState('green');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lv = window.localStorage.getItem('notifLevel');
      if (lv === 'over') setNotifColor('red');
      else if (lv === 'near') setNotifColor('yellow');
      else setNotifColor('green');
    }
  }, []);
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // รอสถานะล็อกอิน
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
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const ymd = toYMD(new Date());
        const qRef = query(
          collection(db, "food"),
          where("uid", "==", uid),
          where("ymd", "==", ymd)
        );
        const snap = await getDocs(qRef);
        const rows = snap.docs.map((d) => {
          const x = d.data();
          return {
            name: x.name || x.item || "",
            // ✅ ใช้รูปจริงจาก Firestore; ถ้าไม่มีค่อย fallback เป็นโลคัล
            img: x.imageUrl || "/placeholder.png",
            calText:
              x.qty && Number(x.qty) > 1
                ? `${Number(x.calories || 0)}x${Number(x.qty)}`
                : `${Number(x.calories || 0)}`,
          };
        });
        setItems(rows);
      } catch (e) {
        console.error("load today menu error:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  return (
    <div className="page">
      <style jsx global>{`
        html, body, #__next { height: 100%; margin: 0; padding: 0; background-color: #f3faee; }
      `}</style>

      {/* Header */}
      <div className="header">
        <div className="profile">
          <Image src="/profile.png" alt="profile" width={72} height={72} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>


        <div className="header-icons">
          <Link href="/line/notification" aria-label="การแจ้งเตือน" onClick={() => setShowNotif(false)} style={{position:'relative',display:'inline-block'}}>
            <Image src="/Doorbell.png" alt="doorbell" width={28} height={40} />
            {showNotif && (
              <span style={{
                position: 'absolute',
                bottom: 10,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: '1.5px solid #fff',
                background: notifColor === 'red' ? '#F44336' : notifColor === 'yellow' ? '#FFD600' : '#4CAF50',
                zIndex: 2
              }} />
            )}
          </Link>

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              width: 44,
              height: 44,
              cursor: "pointer",
              display: "grid",
              placeItems: "center"
            }}
          >
            <Image src="/Menu.png" alt="เมนู" width={28} height={40} />
          </button>
        </div>

        <CalorieSummary variant="floating" />
      </div>

    {/* เมนูไอคอน 4 วงกลม */}
    <div className="circle-menu">
      {[
        { label: "บันทึกอาหาร", href: "/line/food",      img: "/enough.png", external: false },
        { label: "แนะนำอาหาร", href: OA_URL,              img: "/ploy3.png", external: true  },
        { label: "พูดคุย",     href: GROUP_URL,           img: "/mo.png", external: true  },
        { label: "วิดีโอสุขภาพ", href: "/line/lookvideo", img: "/p4.png", external: false },
      ].map((item) =>
        item.external ? (
          // ➜ ลิงก์ภายนอก: เปิดใน LINE / เบราว์เซอร์
          <a
            key={item.label}
            href={item.href}
            className="circle-menu-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="circle-icon">
              <Image src={item.img} alt={item.label} width={46} height={50} />
            </div>
            <div className="circle-label">{item.label}</div>
          </a>
        ) : (
          // ➜ ลิงก์ภายในแอป: ใช้ Next Link เหมือนเดิม
          <Link href={item.href} key={item.label} className="circle-menu-item">
            <div className="circle-icon">
              <Image src={item.img} alt={item.label} width={46} height={50} />
            </div>
            <div className="circle-label">{item.label}</div>
          </Link>
        )
      )}
    </div>

      {/* เมนูวันนี้ */}
      <div className="menu-today">
        <div className="menu-table">
          <div className="menu-header-row">
            <div className="menu-header-img">เมนูวันนี้</div>
            <div className="menu-header-name">เมนู</div>
            <div className="menu-header-cal">แคลอรี่</div>
          </div>

          {loading ? (
            <div className="menu-row"><div className="empty">กำลังโหลด...</div></div>
          ) : items.length === 0 ? (
            <div className="menu-row"><div className="empty">ยังไม่มีบันทึกในวันนี้</div></div>
          ) : (
            items.map((it, idx) => (
              <div className="menu-row" key={`${it.name}-${idx}`}>
                <div className="menu-col-img">
                  {/* ✅ unoptimized เพื่อให้โชว์ได้แม้เป็นรูปจากโดเมนภายนอก */}
                  <Image
                    src={it.img}
                    alt={it.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div className="menu-col-name">{it.name}</div>
                <div className="menu-col-cal">{it.calText}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <MenuPopup isOpen={menuOpen} onClose={() => setMenuOpen(false)} size="compact" />


      <BottomMenu />

      <style>{`
        .page { background-color:#f3faee; min-height:100vh; padding-bottom:100px; }

        .header { background-color:#3ABB47; position:relative; height:240px; }
        .header-icons { position:absolute; top:10px; right:20px; display:flex; gap:16px; z-index:20; }
  .profile { position:absolute; top:16px; left:50%; transform:translateX(-50%); background:#fff; border-radius:50%; overflow:hidden; width:72px; height:72px; box-shadow:0 2px 6px rgba(0,0,0,.2); z-index:20; }
  .profile img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        .summary-container { position:absolute; top:120px; left:50%; transform:translateX(-50%); width:90vw; max-width:300px; background:#fff; border-radius:16px; box-shadow:0 4px 16px rgba(0,0,0,.1); padding:20px 16px; text-align:center; z-index:10; }
        .bunny-img { position:absolute; top:-24px; right:-12px; width:72px; }

        .summary-box { background:#f8fafc; border-radius:12px; padding:12px 8px; display:flex; justify-content:space-between; margin-top:10px; box-shadow:0 1px 4px rgba(0,0,0,.04); }
        .title { font-weight:700; font-size:18px; margin-bottom:8px; }
        .summary-item { flex:1; text-align:center; }
        .summary-date { margin:0; font-weight:600; color:#3ABB47; font-size:15px; }
        .summary-value { margin:4px 0; font-size:20px; font-weight:700; color:#222; }
        .summary-unit { margin:0; font-size:13px; color:#888; }
        .divider { width:1px; background:#e5e7eb; margin:0 8px; }

        .circle-menu { display:flex; justify-content:space-around; margin-top:100px; padding:0 16px; }
        .circle-menu-item { display:flex; flex-direction:column; align-items:center; text-decoration:none; }
        .circle-icon { background:#fff; border-radius:50%; padding:12px; box-shadow:0 4px 10px rgba(0,0,0,.15); width:44px; height:44px; display:flex; justify-content:center; align-items:center; }
        .circle-label { font-size:12px; color:#333; margin-top:4px; }

        .menu-today { margin-top:24px; padding:0 16px; }
        .menu-table { background:#fff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,.05); overflow:hidden; margin-top:16px; }
        .menu-header-row { display:flex; background:#fff; padding:12px 16px; font-weight:700; font-size:14px; color:#333; border-bottom:1px solid #ddd; }
        .menu-header-img { width:80px; text-align:center; }
        .menu-header-name { flex:1; text-align:center; }
        .menu-header-cal { width:80px; text-align:center; }
        .menu-row { display:flex; align-items:center; padding:12px 16px; border-top:1px solid #eee; background:#fff; }
        .menu-col-img { width:80px; display:flex; justify-content:center; align-items:center; }
        .menu-col-name { flex:1; font-size:14px; color:#333; display:flex; justify-content:center; align-items:center; text-align:center; }
        .menu-col-cal { width:80px; font-size:14px; font-weight:700; color:#333; display:flex; justify-content:center; align-items:center; }
        .menu-row:last-child { border-bottom:none; }
        .empty { width:100%; text-align:center; color:#6b7280; }
      `}</style>
    </div>
  );
}
