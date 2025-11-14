'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import CalorieAlertCard from '../components/CalorieAlertCard.js';
import BottomMenu from '../components/menu';
import { auth, db } from '../lib/firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export default function NotificationPage() {
  const [bmr, setBmr] = useState(null);
  const [calorie, setCalorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState('normal');
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    let unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // ✅ ดึงค่า BMR ของ user
        const uSnap = await getDoc(doc(db, 'users', user.uid));
        const uData = uSnap.exists() ? uSnap.data() : null;
        const bmrVal = uData?.bmr ? Number(uData.bmr) : null;
        setBmr(bmrVal);

        // ✅ สรุปแคลวันนี้
        const today = new Date();
        const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
          today.getDate()
        ).padStart(2, '0')}`;

        const qFood = query(
          collection(db, 'food'),
          where('uid', '==', user.uid),
          where('ymd', '==', ymd)
        );

        const snap = await getDocs(qFood);

        const sum = snap.docs.reduce((s, docu) => {
          const d = docu.data();
          return s + Number(d.calories || 0);
        }, 0);

        setCalorie(sum);
        // ✅ คำนวณระดับแจ้งเตือน
        let lv = 'normal';
        let ic = <img src="/enough.png" alt="enough" style={{ width: 80 }} />;

        if (bmrVal && bmrVal > 0) {
          const percent = Math.round((sum / bmrVal) * 100);

          if (percent >= 100) {
            lv = 'over';
            ic = <img src="/full.png" alt="full" style={{ width: 80 }} />;
          } else if (percent >= 80) {
            lv = 'near';
            ic = <img src="/nearfull.png" alt="near" style={{ width: 80 }} />;
          }
        }

        setLevel(lv);
        setIcon(ic);

        // ✅ จำค่าระดับไว้ใน localStorage (ถ้าต้องใช้ที่ Tab อื่น)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('notifLevel', lv);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    });

    return () => {
      if (typeof unsubAuth === 'function') unsubAuth();
    };
  }, []);

  return (
    <div className="wrapper">
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
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
              level === 'over'
                ? 'ปริมาณแคลอรี่ของคุณเกินกำหนด'
                : level === 'near'
                ? 'วันนี้ปริมาณแคลอรี่ของคุณใกล้เต็ม'
                : 'ปริมาณแคลอรี่ของคุณพอดี'
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
