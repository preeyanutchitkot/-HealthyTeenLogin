"use client";

import React from "react";
import Header from "../components/header";
import VideoList from "../components/VideoList";
import BottomMenu from "../components/menu"; // เรียกใช้ BottomMenu

export default function LookvideoPage() {
  return (
    <div className="wrapper">
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #FFFFFF;
        }
        * { box-sizing: border-box; }

        .wrapper {
          min-height: 100vh;
          background-color: #FFFFFF;
          font-family: 'Noto Sans Thai', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header-container {
          width: 100%; /* Header เต็มจอ */
        }

        .content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 16px;
          padding-bottom: 140px; /* กัน BottomMenu ทับ */
        }

        .bottom-btn {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .bottom-btn button {
          background-color: #3ABB47;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="header-container">
        <Header title="วิดีโอสุขภาพ" cartoonImage="/9.png" />
      </div>

      <div className="content">
        <VideoList />
      </div>

      {/* เมนูล่าง */}
      <BottomMenu />
    </div>
  );
}
