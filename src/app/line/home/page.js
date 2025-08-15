"use client";

import Image from "next/image";
import BottomMenu from "@/app/line/components/menu";
import Link from "next/link";
import CalorieSummary from "@/app/line/components/CalorieSummary";
import { Noto_Sans_Thai } from "next/font/google";

// โหลดฟอนต์ Noto Sans Thai
const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function HomePage() {
  return (
    <div className={`${notoSansThai.className} page`}>
      {/* Header */}
      <div className="header">
        <div className="profile">
          <Image src="/test.png" alt="profile" width={72} height={72} />
        </div>

        <div className="header-icons">
          <Link href="/line/notification">
            <Image src="/Doorbell.png" alt="doorbell" width={28} height={40} />
          </Link>
          <Link href="/line/editmenu">
            <Image src="/Menu.png" alt="menu" width={28} height={40} />
          </Link>
        </div>
      </div>

      {/* กล่องสรุป (วางซ้อนให้ต่ำลงจากแถบเขียว) */}
      <div className="summary-wrap">
        <CalorieSummary
          date="20/07/68"
          dailyCalorie={250}
          weeklyCalorie={500}
          bunnyImage="/bunny.png"
        />
      </div>

      {/* วงกลมเมนู (ไอคอนไม่เหมือนกันทั้ง 4 อัน) */}
      <div className="circle-menu">
        {[
          { label: "บันทึกอาหาร", href: "/line/food",      icon: "/IMG_9581 1.png" },
          { label: "แนะนำอาหาร", href: "/line/recommend",  icon: "/IMG_9582 2.png" },
          { label: "พูดคุย",     href: "/line/chat",       icon: "/Group 231.png" },
          { label: "วิดีโอสุขภาพ", href: "/line/lookvideo", icon: "/Group 231 (1).png" },
        ].map((item) => (
          <Link href={item.href} key={item.label} className="circle-menu-item" aria-label={item.label}>
            <div className="circle-icon">
              {/* encodeURI เพื่อรองรับชื่อไฟล์ที่มีช่องว่าง/วงเล็บ */}
              <Image
                src={encodeURI(item.icon)}
                alt={item.label}
                width={40}
                height={40}
                className="circle-img"
                priority
              />
            </div>
            <div className="circle-label">{item.label}</div>
          </Link>
        ))}
      </div>

      {/* เมนูวันนี้ */}
      <div className="menu-today">
        <div className="menu-table">
          <div className="menu-header-row">
            <div className="menu-header-img">เมนูวันนี้</div>
            <div className="menu-header-name">เมนู</div>
            <div className="menu-header-cal">แคลอรี่</div>
          </div>

          {[
            { name: "ยำคอหมูย่าง", cal: "250",   img: "/test.png" },
            { name: "ข้าวมันไก่",   cal: "500",   img: "/test.png" },
            { name: "น้ำเปล่า",     cal: "300x4", img: "/test.png" },
            { name: "แตงโม",        cal: "30x5",  img: "/test.png" },
          ].map((item, index) => (
            <div className="menu-row" key={`${item.name}-${index}`}>
              <div className="menu-col-img">
                <Image src={item.img} alt={item.name} width={50} height={50} />
              </div>
              <div className="menu-col-name">{item.name}</div>
              <div className="menu-col-cal">{item.cal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* แท็บล่างแบบล็อกจอ */}
      <BottomMenu />

      <style>{`
        /* ===== หน้าและฟอนต์ ===== */
        .page {
          background-color: #f3faee;
          min-height: 100vh;
          /* กันคอนเทนต์ถูกทับโดย BottomMenu (ประมาณ 88px) + safe area */
          padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: 0.1px;
          font-size: 14px;
          line-height: 1.45;
        }

        /* ===== Header ===== */
        .header {
          background-color: #3ABB47;
          position: relative;
          height: 200px;
        }
        .header-icons {
          position: absolute;
          top: 10px;
          right: 20px;
          display: flex;
          gap: 16px;
          z-index: 20;
        }
        .profile {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 50%;
          overflow: hidden;
          width: 72px;
          height: 72px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          z-index: 20;
        }

        /* ===== Summary card position (ซ้อนลงมาจาก header) ===== */
        .summary-wrap {
          position: relative;
          width: 332px;
          margin: -70px auto 0;
          z-index: 30;
        }

        /* ===== Circle menu (responsive ด้วยตัวแปร) ===== */
        .circle-menu {
          display: flex;
          justify-content: space-around;
          margin-top: 16px;
          padding: 0 16px;

          /* ตัวแปรควบคุมขนาด (จอเล็ก) */
          --circle-size: 64px;  /* ขนาดกรอบวงกลม */
          --icon-size:   50px;  /* ขนาดรูปด้านใน */
        }
        @media (min-width: 400px) {
          .circle-menu { --circle-size: 68px; --icon-size: 38px; }
        }
        @media (min-width: 480px) {
          .circle-menu { --circle-size: 72px; --icon-size: 40px; }
        }

        .circle-menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .circle-icon {
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.12);
          width: var(--circle-size);
          height: var(--circle-size);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .circle-img {
          width: var(--icon-size);
          height: var(--icon-size);
          object-fit: contain; /* ป้องกันรูปโดนบีบ */
        }
        .circle-label {
          font-size: 12.5px;
          font-weight: 500;
          color: #39434d;
        }

        /* ===== ตารางเมนูวันนี้ ===== */
        .menu-today {
          margin-top: 24px;
          padding: 0 16px;
        }
        .menu-table {
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          margin-top: 16px;
        }
        .menu-header-row {
          display: flex;
          background-color: #fff;
          padding: 12px 16px;
          font-weight: 600;
          font-size: 15px;
          color: #2a2a2a;
          border-bottom: 1px solid #e8e8e8;
        }
        .menu-header-img { width: 90px; text-align: center; }
        .menu-header-name { flex: 1; text-align: center; }
        .menu-header-cal { width: 90px; text-align: center; }
        .menu-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-top: 1px solid #f0f0f0;
          background-color: white;
        }
        .menu-col-img {
          width: 90px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .menu-col-name {
          flex: 1;
          font-size: 14.5px;
          font-weight: 500;
          color: #2f3a43;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .menu-col-cal {
          width: 90px;
          font-size: 14px;
          font-weight: 700;
          color: #2a2a2a;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .menu-row:last-child { border-bottom: none; }
      `}</style>
    </div>
  );
}
