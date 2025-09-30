'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = ({ title, cartoonImage, backIcon = '/back-button.png' }) => {
  const router = useRouter();

  return (
    <header className="header-bar">
      <div className="header-left">
        <button
          className="back-btn"
          onClick={() => router.back()}
          aria-label="ย้อนกลับ"
        >
          <Image
            src={backIcon}
            alt="ย้อนกลับ"
            width={28}
            height={28}
            style={{ objectFit: 'contain' }}
          />
        </button>
      </div>

      <div className="header-center">
        <span className="header-title">{title}</span>
      </div>

      <div className="header-right">
        {cartoonImage && (
          <Image
            src={cartoonImage}
            alt="การ์ตูน"
            width={52}
            height={52}
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      <style>{`
        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #3ABB47;
          padding: 20px 16px 24px 16px;
          border-radius: 0 0 16px 16px;
          margin-bottom: 24px;
          min-width: 320px;
          min-height: 90px;
          position: relative;
        }

       .header-left {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        margin-left: 35px;
      }

      .header-right {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        margin-right: 55px;
      }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .back-btn {
        background: rgba(255,255,255,0.15);
        border: none;
        border-radius: 50%;
        padding: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
        .back-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .header-title {
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 32px;
          font-weight: bold;
          color: #fff;
          line-height: 1.2;
          white-space: nowrap;
          text-align: center;
        }

        @media (max-width: 500px) {
          .header-title { font-size: 24px; }
          .header-bar {
            padding: 24px 16px;
            min-height: 120px;
          }
          .back-btn { padding: 5px; }
        }
      `}</style>
    </header>
  );
};

export default Header;
