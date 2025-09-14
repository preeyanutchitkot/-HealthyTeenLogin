"use client";

import React from "react";
import Image from "next/image";

const Header = ({ title, cartoonImage }) => {
  return (
    <header className="header-bar">
      <div className="header-center">
        <span className="header-title">{title}</span>
        {cartoonImage && (
          <Image
            src={cartoonImage}
            alt="การ์ตูน"
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
          />
        )}
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
          min-width: 320px;
          min-height: 90px;
        }
        .header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 145px;
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
        @media (max-width: 500px) {
          .header-title { font-size: 20px; }
          .header-bar {
             padding: 24px 16px 24px 16px;
             min-width: 200px;
             min-height: 120px;
          }
          .header-center { min-width: 98px; }
        }
      `}</style>
    </header>
  );
};

export default Header;
