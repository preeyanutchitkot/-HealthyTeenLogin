"use client";

import React from 'react';
import Image from 'next/image';

const Header = ({ title, cartoonImage }) => {
  return (
    <header className="header-bar">
      <div className="header-center">
        <span className="header-title">{title}</span> 
        <Image className="header-cartoon" src={cartoonImage} alt="cartoon" width={45} height={60} />
      </div>
      <style>{`
        .header-bar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #3ABB47;
          padding: 20px 16px 24px 16px;
          border-radius: 0 0 16px 16px;
          margin-bottom: 24px;
        }
        .header-center {
          display: flex;
          align-items: center; /* ทำให้การ์ตูนและข้อความอยู่กลางแนวตั้ง */
          justify-content: center; /* จัดตำแหน่งแนวนอนให้ข้อความและการ์ตูน */
          gap: 8px; /* ระยะห่างระหว่างข้อความและการ์ตูน */
        }
        .header-title {
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 28px;
          font-weight: bold;
          color: #fff;
          text-align: center;
          line-height: 1;
          white-space: nowrap;
        }
        .header-cartoon {
          display: inline-block;
          vertical-align: middle; /* ให้การ์ตูนแสดงในแนวกลาง */
        }
        @media (max-width: 500px) {
          .header-title {
            font-size: 20px;
          }
          .header-cartoon {
            width: 70px !important;
            height: 90px !important;
          }
          .header-bar {
             padding: 24px 16px 24px 16px; 
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
