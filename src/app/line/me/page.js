"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "@/app/line/components/menu";
import CalorieSummary from "@/app/line/components/CalorieSummary";
import { Noto_Sans_Thai } from "next/font/google";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export default function MePage() {
  // ข้อมูลตัวอย่าง (ภายหลังค่อยเปลี่ยนเป็นข้อมูลจากฐานข้อมูล)
  const dailyLogs = [
    {
      date: "20/07/68",
      items: [
        { name: "ยำคอหมูย่าง", cal: "250", img: "/test.png" },
        { name: "ข้าวมันไก่", cal: "500", img: "/test.png" },
        { name: "น้ำเปล่า", cal: "300x4", img: "/test.png" },
        { name: "แตงโม", cal: "30x5", img: "/test.png" },
      ],
    },
    { date: "19/07/68", items: [] },
    { date: "18/07/68", items: [] },
    { date: "17/07/68", items: [] },
    { date: "16/07/68", items: [] },
    { date: "15/07/68", items: [] },
  ];

  // state JS ล้วน (ไม่มีไทป์)
  const [openDates, setOpenDates] = useState({ "20/07/68": true });
  const toggleDate = (date) =>
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));

  return (
    <div className={`${notoSansThai.className} page`}>
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <Link href="/line/home" aria-label="ย้อนกลับ" className="back">
           
          </Link>
          <div className="title">

          </div>
          <div className="right-icons" />
        </div>{/* ✅ ปิด header-top ให้เรียบร้อย */}

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

        <div className="metrics">
          <div>BMI...........................................</div>
          <div>TDEE ของคุณคือ 2036 แคลอรี่/วัน</div>
        </div>
      </div>

      {/* กล่องสรุปแคลอรี่ */}
      <div className="summary-wrap">
        <CalorieSummary
          date="20/07/68"
          dailyCalorie={250}
          weeklyCalorie={500}
          bunnyImage="/bunny.png"
        />
      </div>

      {/* รายการวันที่แบบกดแล้วกาง */}
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
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
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

      <BottomMenu />

      <style>{`
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
        .header { background-color: #3ABB47; position: relative; padding-bottom: 60px; }
        .header-top { display: grid; grid-template-columns: 48px 1fr 64px; align-items: center; color: #fff; padding: 10px 12px; }
        .back { color: #fff; font-size: 24px; text-decoration: none; display:flex; align-items:center; }
        .title { text-align: center; line-height: 1.1; }
        .title .app { font-weight: 700; }
        .title .sub { font-size: 12px; opacity: .8; }
        .profile { position: absolute; top: 56px; left: 50%; transform: translateX(-50%); background: white; border-radius: 50%; overflow: hidden; width: 72px; height: 72px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 20; }
        .header-icons { position: absolute; top: 16px; right: 16px; display: flex; gap: 12px; z-index: 20; }
        .metrics { color: #fff; margin-top: 138px; padding: 0 20px 12px; font-size: 13px; text-align: center ;}

        .summary-wrap { position: relative; width: 332px; margin: -30px auto 10px; z-index: 30; }

        .day-accordion { padding: 0 16px 12px; display: grid; gap: 12px; }
        .day-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        .day-header { width: 100%; text-align: left; background: #fff; border: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; font-weight: 600; }
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
