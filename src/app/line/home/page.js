'use client';

import Image from 'next/image';
import BottomMenu from '@/app/line/components/menu'; // ปรับ path ตามโปรเจกต์คุณ

export default function HomePage() {
  return (
    <>
      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="profile">
            <Image src="/test.png" alt="profile" width={72} height={72} />
          </div>

          {/* Summary Box */}
          <div className="summary-container">
            <div className="title">สรุปแคลอรี่</div>
            <div className="summary-content">
              <div className="summary-item">
                <div className="summary-date">20/07/68</div>
                <div className="summary-value">250</div>
                <div className="summary-unit">แคลอรี่</div>
              </div>
              <div className="divider" />
              <div className="summary-item">
                <div className="summary-date">รายสัปดาห์</div>
                <div className="summary-value">500</div>
                <div className="summary-unit">แคลอรี่</div>
              </div>
            </div>
          </div>
        </div>

        {/* Circle Menu */}
        <div className="circle-menu">
          {['บันทึกอาหาร', 'แนะนำอาหาร', 'พูดคุย', 'วิดีโอสุขภาพ'].map((label) => (
            <div className="circle-menu-item" key={label}>
              <div className="circle-icon">
                <Image src="/test.png" alt={label} width={36} height={36} />
              </div>
              <div className="circle-label">{label}</div>
            </div>
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
              { name: 'ยำคอหมูย่าง', cal: '250', img: '/test.png' },
              { name: 'ข้าวมันไก่', cal: '500', img: '/test.png' },
              { name: 'น้ำเปล่า', cal: '300x4', img: '/test.png' },
              { name: 'แตงโม', cal: '30x5', img: '/test.png' },
            ].map((item, index) => (
              <div className="menu-row" key={index}>
                <div className="menu-col-img">
                  <Image src={item.img} alt={item.name} width={50} height={50} />
                </div>
                <div className="menu-col-name">{item.name}</div>
                <div className="menu-col-cal">{item.cal}</div>
              </div>
            ))}
          </div>
        </div>

        <BottomMenu />
      </div>

      {/* CSS */}
      <style>{`
        .page {
          background-color: #f3faee;
          min-height: 100vh;
          padding-bottom: 100px;
        }

        .header {
          background-color: #3ABB47;
          position: relative;
          height: 200px;
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

        .summary-container {
          position: absolute;
          top: 130px;
          left: 50%;
          transform: translateX(-50%);
          width: 332px;
          height: 145px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.20);
          padding: 16px;
          z-index: 10;
          text-align: center;
        }

        .title {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .summary-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .summary-date {
          font-size: 14px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: bold;
        }

        .summary-unit {
          font-size: 14px;
        }

        .divider {
          width: 1px;
          height: 40px;
          background: #ccc;
        }

        .circle-menu {
          display: flex;
          justify-content: space-around;
          margin-top: 130px;
          padding: 0 16px;
        }

        .circle-menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .circle-icon {
          background: white;
          border-radius: 50%;
          padding: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          width: 64px;
          height: 64px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .circle-label {
          font-size: 12px;
          color: #333;
          margin-top: 4px;
        }

        .menu-today {
          margin-top: 24px;
          padding: 0 16px;
        }

        .menu-table {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-top: 16px;
        }

        .menu-header-row {
          display: flex;
          background-color: #ffffff;
          padding: 12px 16px;
          font-weight: bold;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #ddd;
        }

        .menu-header-img {
          width: 80px;
          text-align: center;
        }

        .menu-header-name {
          flex: 1;
          text-align: center;
        }

        .menu-header-cal {
          width: 80px;
          text-align: center;
        }

        .menu-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-top: 1px solid #eee;
          background-color: white;
        }

        .menu-col-img {
          width: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .menu-col-name {
          flex: 1;
          font-size: 14px;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .menu-col-cal {
          width: 80px;
          font-size: 14px;
          font-weight: bold;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .menu-row:last-child {
          border-bottom: none;
        }
      `}</style>
    </>
  );
}
