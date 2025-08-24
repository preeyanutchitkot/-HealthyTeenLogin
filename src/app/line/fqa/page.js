"use client";

import { useState } from "react";
import BottomMenu from '../components/menu';

export default function AgreementPage() {
  const [tab, setTab] = useState("privacy");

  const privacyText = `
1. จะเริ่มใช้งานระบบบันทึกอาหารได้อย่างไร?
เข้าแชท LINE OA แล้วกดปุ่ม “บันทึกอาหาร” ที่อยู่ในเมนู หรือพิมพ์คำว่า บันทึก จากนั้นระบบจะพาไปยังหน้าให้กรอกข้อมูล
2. สามารถบันทึกอาหารได้กี่ครั้งต่อวัน?
ระบบเปิดให้บันทึกได้ไม่จำกัดจำนวนครั้งต่อวัน คุณสามารถบันทึกทุกมื้อหรือของว่างระหว่างวันได้ตามต้องการ
3. ข้อมูลที่บันทึกจะถูกนำไปใช้ทำอะไร?
ข้อมูลอาหารที่คุณบันทึกจะถูกใช้เพื่อวิเคราะห์พฤติกรรมการกิน และช่วยแนะนำเมนูสุขภาพที่เหมาะสมให้คุณ
4. จะดูเมนูอาหารแนะนำได้จากที่ไหน?
ในแชท LINE OA กดปุ่ม “เมนูแนะนำ” หรือพิมพ์คำว่า แนะนำเมนู ระบบจะแสดงเมนูที่เหมาะกับสุขภาพของคุณ
5. สามารถพูดคุยกับผู้อื่นหรือผู้เชี่ยวชาญได้หรือไม่?
สามารถเข้าร่วมกลุ่มพูดคุยได้ โดยกดลิงก์ “เข้ากลุ่มพูดคุย” หรือพิมพ์คำว่า กลุ่ม เพื่อรับลิงก์เข้าร่วม
6. ดูคลิปวิดีโอสุขภาพได้จากที่ไหน?
เลือกปุ่ม “คลิปสุขภาพ” หรือพิมพ์ คลิป เพื่อรับวิดีโอความรู้ด้านสุขภาพ เช่น โภชนาการ, ออกกำลังกาย, เคล็ดลับสุขภาพดี
7. ถ้ามีคำถามเกี่ยวกับสุขภาพหรือการใช้งาน ต้องทำอย่างไร?
คุณสามารถพิมพ์คำถามในแชท ระบบแชทบอทจะตอบอัตโนมัติ หรือส่งคำถามให้ทีมงานกรณีบอทไม่สามารถตอบได้
8. ข้อมูลที่บันทึกไว้ปลอดภัยหรือไม่?
ข้อมูลของคุณจะถูกเก็บไว้อย่างปลอดภัยในระบบ Firebase โดยไม่มีการเปิดเผยต่อบุคคลภายนอก
9. สามารถลบหรือแก้ไขข้อมูลอาหารที่บันทึกไว้ได้หรือไม่?
ในเวอร์ชันปัจจุบันยังไม่รองรับการแก้ไขย้อนหลัง แต่จะมีการอัปเดตในอนาคตเพื่อให้สามารถลบ/แก้ไขได้
10. สามารถใช้ระบบได้ฟรีหรือมีค่าใช้จ่าย?
ระบบนี้เปิดให้ใช้งานฟรีสำหรับผู้เข้าร่วมโครงการ ไม่คิดค่าใช้จ่ายใดๆ ทั้งสิ้น
`;
   
return (
  <div className="wrapper">
    <style jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .wrapper {
        min-height: 100vh;
        background-color: #e9f8ea;
        font-family: 'Noto Sans Thai', sans-serif;
        display: flex;
        flex-direction: column;
      }

      .header {
        background-color: #3ABB47;
        color: white;
        text-align: center;
        padding: 16px;
        font-size: 18px;
        font-weight: bold;
        width: 100%;
      }

      .tabs {
        display: flex;
        width: 100%;
      }

      .tab {
        flex: 1;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #EAF0EB;
        border-top: none;
      }

      .tab.active {
        background-color: #3ABB47;
        color: white;
      }

      .tab.inactive {
        background-color: white;
        color: #3ABB47;
      }

      .content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        font-size: 14px;
        line-height: 1.7;
        color: #333;
        white-space: pre-wrap;
      }

      .footer {
        position: sticky;
        bottom: 0;
        width: 100%;
        background: white;
        padding: 16px;
        border-top: 1px solid #ddd;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        z-index: 999;
      }

      .agreement {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }

      .agreement-text span {
        text-decoration: underline;
        color: #3ABB47;
      }

    `}</style>

    <div className="header"> คำถามที่พบบ่อย (FAQ) </div>

    <div className="content">{tab === "privacy" ? privacyText : termsText}</div>
<BottomMenu />
  </div>
);

}