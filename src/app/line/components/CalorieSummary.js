'use client';
import { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const getLocalYMD_TZ = (d, tz = 'Asia/Bangkok') =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d); // YYYY-MM-DD

const ymdToUTCDate = (ymd) => new Date(`${ymd.slice(0, 10)}T00:00:00Z`);
const addDaysYMD = (ymd, days) => {
  const dt = ymdToUTCDate(ymd);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};
const formatDateTH = (ymd, tz = 'Asia/Bangkok') =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: tz,
  }).format(ymdToUTCDate(ymd));

export default function CalorieSummary({
  variant = 'floating',
  uid,
  tz = 'Asia/Bangkok',

  // ✅ แก้ตรงนี้: ให้เริ่มสัปดาห์ = วันอาทิตย์
  weekStartMonday = false,

  baseYMD,
}) {
  const anchorYMD = useMemo(
    () => baseYMD?.slice(0, 10) || getLocalYMD_TZ(new Date(), tz),
    [baseYMD, tz]
  );

  const { ymdStart, ymdEnd } = useMemo(() => {
    const dow = ymdToUTCDate(anchorYMD).getUTCDay(); // 0=อาทิตย์...6=เสาร์
    const offset = weekStartMonday ? (dow + 6) % 7 : dow;
    const start = addDaysYMD(anchorYMD, -offset);
    const end = addDaysYMD(start, 6);
    return { ymdStart: start, ymdEnd: end };
  }, [anchorYMD, weekStartMonday]);

  const [dailyCalorie, setDailyCalorie] = useState(0);
  const [weeklyCalorie, setWeeklyCalorie] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

useEffect(() => {
  (async () => {
    setLoading(true);
    setErr(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("ยังไม่ได้ล็อกอิน");
      }
      const userId = uid || user.uid;

      // ดึงแคลอรี่วันนี้
      const qDay = query(
        collection(db, "food"),
        where("uid", "==", userId),
        where("ymd", "==", anchorYMD)
      );
      const daySnap = await getDocs(qDay);
      const daySum = daySnap.docs.reduce((s, doc) => {
        const d = doc.data();
        const calEach = Number(d.calories ?? d.cal ?? 0) || 0;
        const qty = Number(d.qty ?? 1) || 1;
        return s + calEach * qty;
      }, 0);
      setDailyCalorie(daySum);

      // ดึงแคลอรี่สัปดาห์
      const qWeek = query(
        collection(db, "food"),
        where("uid", "==", userId),
        where("ymd", ">=", ymdStart),
        where("ymd", "<=", ymdEnd)
      );
      const weekSnap = await getDocs(qWeek);
      const weekSum = weekSnap.docs.reduce((s, doc) => {
        const d = doc.data();
        const calEach = Number(d.calories ?? d.cal ?? 0) || 0;
        const qty = Number(d.qty ?? 1) || 1;
        return s + calEach * qty;
      }, 0);
      setWeeklyCalorie(weekSum);

    } catch (e) {
      setErr(e?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  })();
}, [uid, anchorYMD, ymdStart, ymdEnd]);

  return (
    <div
      className={`summary-container ${variant === 'inline' ? 'inline' : 'floating'}`}
    >
      <p className="summary-title">สรุปแคลอรี่</p>

      {loading ? (
        <div className="loading">กำลังคำนวณ...</div>
      ) : err ? (
        <div className="error">{err}</div>
      ) : (
        <div className="summary-box">
          <div className="summary-item">
            <p className="summary-date">{formatDateTH(anchorYMD, tz)}</p>
            <p className="summary-value">{dailyCalorie.toLocaleString()}</p>
            <p className="summary-unit">แคลอรี่</p>
          </div>
          <span className="divider" aria-hidden="true" />
          <div className="summary-item">
            <p className="summary-date">รายสัปดาห์</p>
            <p className="summary-value">{weeklyCalorie.toLocaleString()}</p>
            <p className="summary-unit">แคลอรี่</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .summary-container {
          position: relative;
          width: 90vw;
          max-width: 300px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          padding: 20px 16px;
          text-align: center;
          z-index: 10;
        }
        .summary-container.floating {
          position: absolute;
          top: 140px;
          left: 50%;
          transform: translateX(-50%);
        }
        .summary-container.inline {
          position: static;
          transform: none;
          margin: 16px auto;
        }

        .summary-title {
          font-weight: 700;
          font-size: 18px;
          margin: 4px 0 10px;
          color: #111827;
        }
        .summary-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px 8px;
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }
        .summary-item {
          flex: 1;
          text-align: center;
        }
        .summary-date {
          margin: 0;
          font-weight: 600;
          color: #000000;
          font-size: 15px;
        }
        .summary-value {
          margin: 4px 0;
          font-size: 20px;
          font-weight: 700;
          color: #222;
        }
        .summary-unit {
          margin: 0;
          font-size: 13px;
          color: #888;
        }
        .divider {
          width: 1px;
          background: #e5e7eb;
          margin: 0 8px;
        }
        .loading,
        .error {
          font-size: 14px;
          color: #6b7280;
          padding: 8px 0;
        }
        .error {
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}
