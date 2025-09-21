"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/header";
import CalorieAlertCard from "../components/CalorieAlertCard.js";
import BottomMenu from "../components/menu";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

export default function NotificationPage() {
  const [bmr, setBmr] = useState(null);
  const [calorie, setCalorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("normal");
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const uSnap = await getDoc(doc(db, "users", user.uid));
        const uData = uSnap.exists() ? uSnap.data() : null;
        const bmrVal = uData?.bmr ? Number(uData.bmr) : null;
        setBmr(bmrVal);

        const today = new Date();
        const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const q = query(
          collection(db, "food"),
          where("uid", "==", user.uid),
          where("ymd", "==", ymd)
        );
        const snap = await getDocs(q);
        const sum = snap.docs.reduce((s, docu) => {
          const d = docu.data();
          return s + Number(d.calories || 0) * Number(d.qty || 1);
        }, 0);
        setCalorie(sum);

        let percent = null;
        if (bmrVal && bmrVal > 0) {
          percent = Math.round((sum / bmrVal) * 100);
        }

        let lv = "normal";
        let ic = <img src="/enough.png" alt="enough" style={{ width: 80 }} />;

        if (percent !== null) {
          if (percent > 100) {
            lv = "over";
            ic = <img src="/full.png" alt="full" style={{ width: 80 }} />;
          } else if (percent >= 80) {
            lv = "near";
            ic = <img src="/nearfull.png" alt="nearfull" style={{ width: 80 }} />;
          } else {
            lv = "normal";
            ic = <img src="/enough.png" alt="enough" style={{ width: 80 }} />;
          }
        }

        setLevel(lv);
        setIcon(ic);

        if (typeof window !== "undefined") {
          window.localStorage.setItem("notifLevel", lv);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="wrapper">
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
        }
        * { box-sizing: border-box; }
        .wrapper {
          min-height: 100vh;
          background-color: #f3faee;
          display: flex;
          flex-direction: column;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          margin-top: 32px;
          padding: 0 16px;
          padding-bottom: 120px;
        }
      `}</style>

      <Header title="ปริมาณแคลลอรี่วันนี้" cartoonImage="/8.png" />

      <div className="content">
        {loading ? (
          <div>กำลังโหลด...</div>
        ) : (
          <CalorieAlertCard
            level={level}
            title={
              level === "over"
                ? "ปริมาณแคลอรี่ของคุณเกินกำหนด"
                : level === "near"
                ? "วันนี้ปริมาณแคลอรี่ของคุณใกล้เต็ม"
                : "ปริมาณแคลอรี่ของคุณพอดี"
            }
            calorie={calorie}
            maxCalorie={bmr}
            icon={icon}
          />
        )}
      </div>
      <BottomMenu />
    </div>
  );
}
