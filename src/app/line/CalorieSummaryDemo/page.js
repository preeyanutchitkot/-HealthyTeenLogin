'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BottomMenu from '../components/menu';
import CalorieSummary from '../components/CalorieSummary';

export default function HomeLikeNoTable() {
  return (
    <div className="page">
      {/* รีเซ็ตขอบขาวรอบนอก */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div className="header">
        <div className="profile">
          <Image src="/test.png" alt="profile" width={72} height={72} />
        </div>
        <div className="header-icons">
          <Link href="/line/notification">
            <Image src="/Doorbell.png" alt="doorbell" width={28} height={40} />
          </Link>
          <Link href="/editmenu">
            <Image src="/Menu.png" alt="menu" width={28} height={40} />
          </Link>
        </div>

        {/* Summary Box: floating */}
        <CalorieSummary variant="floating" />
      </div>

      {/* เมนูไอคอน 4 วงกลม เหมือนหน้า Home */}
      <div className="circle-menu">
        {[
          { label: 'บันทึกอาหาร', href: '/line/food', img: '/m1.png' },
          { label: 'แนะนำอาหาร', href: '/line/recommend', img: '/m2.png' },
          { label: 'พูดคุย', href: '/line/chat', img: '/m3.png' },
          { label: 'วิดีโอสุขภาพ', href: '/line/lookvideo', img: '/m4.png' },
        ].map((item) => (
          <Link href={item.href} key={item.label} className="circle-menu-item">
            <div className="circle-icon">
              <Image src={item.img} alt={item.label} width={46} height={50} />
            </div>
            <div className="circle-label">{item.label}</div>
          </Link>
        ))}
      </div>

      {/* (ตัด 'เมนูวันนี้/ตาราง' ออกแล้ว) 
          สามารถใส่คอนเทนต์อื่นทีหลังได้ เช่น โปสเตอร์โภชนาการ ฯลฯ */}

      <BottomMenu />

      <style>{`
        .page { background-color:#f3faee; min-height:100vh; padding-bottom:100px; }

       .header { background-color:#3ABB47; position:relative; height:240px; }
       .header-icons { position:absolute; top:10px; right:20px; display:flex; gap:16px; z-index:20; }
       .profile { position:absolute; top:16px; left:50%; transform:translateX(-50%); background:#fff; border-radius:50%; overflow:hidden; width:72px; height:72px; box-shadow:0 2px 6px rgba(0,0,0,.2); z-index:20; }

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
        .circle-menu-item { display:flex; flex-direction:column; align-items:center; }
       .circle-icon {
          background:#fff;
          border-radius:50%;
          padding:16px; /* เพิ่ม padding */
          box-shadow:0 4px 10px rgba(0,0,0,.15);
          width:69px; /* กว้างขึ้น */
          height:69px; /* สูงขึ้น */
          display:flex;
          justify-content:center;
          align-items:center;
        }
        .circle-label { font-size:12px; color:#333; margin-top:4px; }
      `}</style>
    </div>
  );
}
