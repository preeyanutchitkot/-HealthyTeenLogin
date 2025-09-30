'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { auth, db, signInIfNeeded } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  getDocs,
  limit,
} from 'firebase/firestore';

// 🕐 แปลง YYYY-MM-DD เป็น Date UTC
function ymdToUTCDate(ymd) {
  return new Date(`${(ymd || '').slice(0, 10)}T00:00:00Z`);
}

// 🎨 สีหลัก
const GREEN = '#2e7d32',
  YELLOW = '#f9a825',
  RED = '#d32f2f',
  DARK_RED = '#b71c1c';
const hexToRgba = (hex, a = 0.18) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
};

export default function ActivityRing({
  dateYMD,
  baseDate = new Date(),
  tz = 'Asia/Bangkok',
  size = 240,
  thickness = 22,
  capAt100 = false, // ✅ ให้เกิน 100 ได้
  showDebug = false,
}) {
  const [percent, setPercent] = useState(0);
  const [title, setTitle] = useState('สรุปแคลอรี่วันนี้');
  const [todayCal, setTodayCal] = useState(0);
  const [targetCal, setTargetCal] = useState(2000);
  const [diff, setDiff] = useState(0);

  const ymd = useMemo(() => {
    if (dateYMD) return dateYMD.slice(0, 10);
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(baseDate);
  }, [dateYMD, baseDate, tz]);

  const todayYMD = useMemo(
    () => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date()),
    [tz]
  );

  useEffect(() => {
    let unsub = () => {};
    let active = true;

    (async () => {
      try {
        const user = auth.currentUser ?? (await signInIfNeeded());
        const uid = user?.uid;
        if (!uid) return;

        let snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          const qs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', uid), limit(1))
          );
          if (!qs.empty) snap = qs.docs[0];
        }
        const bmr = Number(snap?.data()?.bmr) || 2000;
        setTargetCal(bmr);

        const qFoodToday = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('ymd', '==', ymd)
        );
        const todayDocs = await getDocs(qFoodToday);
        let totalToday = 0;
        todayDocs.forEach((d) => {
          const x = d.data();
          totalToday +=
            (Number(x?.calories ?? x?.cal ?? 0) || 0) *
            (Number(x?.qty ?? 1) || 1);
        });
        setTodayCal(totalToday);

        // 🔹 โหลดข้อมูลเมื่อวาน
        const yesterday = new Date(ymdToUTCDate(ymd));
        yesterday.setDate(yesterday.getDate() - 1);
        const ymdYesterday = new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
        }).format(yesterday);
        const qFoodYest = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('ymd', '==', ymdYesterday)
        );
        const yestDocs = await getDocs(qFoodYest);
        let totalYest = 0;
        yestDocs.forEach((d) => {
          const x = d.data();
          totalYest +=
            (Number(x?.calories ?? x?.cal ?? 0) || 0) *
            (Number(x?.qty ?? 1) || 1);
        });

        // 🔹 คำนวณเปอร์เซ็นต์ & diff
        const pct = Math.round((totalToday / bmr) * 100);
        if (active) setPercent(pct);

        const diffPct =
          totalYest > 0 ? ((totalToday - totalYest) / totalYest) * 100 : 0;
        if (active) setDiff(diffPct);

        // 🔹 Realtime update วันนี้
        unsub = onSnapshot(qFoodToday, (snap) => {
          let total = 0;
          snap.forEach((d) => {
            const x = d.data();
            total +=
              (Number(x?.calories ?? x?.cal ?? 0) || 0) *
              (Number(x?.qty ?? 1) || 1);
          });
          setTodayCal(total);
          setPercent(Math.round((total / bmr) * 100));
        });

        // 🔹 ชื่อหัวข้อ
        if (ymd === todayYMD) {
          setTitle('สรุปแคลอรี่วันนี้');
        } else {
          const th = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          setTitle(`สรุปแคลอรี่ ${th.format(ymdToUTCDate(ymd))}`);
        }
      } catch (e) {
        console.error('ActivityRing error:', e);
      }
    })();

    return () => {
      active = false;
      unsub();
    };
  }, [ymd, tz, capAt100, showDebug, todayYMD]);

  const ringColor = percent > 100 ? RED : percent >= 80 ? YELLOW : GREEN;
  const trackColor = hexToRgba(ringColor, 0.18);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const pctMain = Math.min(percent, 100);
  const pctExtra = percent > 100 ? percent - 100 : 0;

  return (
    <div className="ring-card">
      <div className="ring-card-title">{title}</div>

      <div className="ring-row">
        <div className="ring-left">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={trackColor}
              strokeWidth={thickness}
              strokeLinecap="round"
            />

            {/* ✅ วงหลัก (0–100%) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * (1 - pctMain / 100)}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 600ms ease',
              }}
            />

            {/* 🔴 ส่วนเกิน >100% */}
            {pctExtra > 0 && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={DARK_RED}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={circumference * (1 - pctExtra / 100)}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 600ms ease',
                }}
              />
            )}

            {/* 🔢 ตัวเลขกลาง */}
            <text
              x="50%"
              y="50%"
              dy="0.35em"
              textAnchor="middle"
              className="ring-text"
              style={{
                fill: percent > 100 ? RED : ringColor,
              }}
            >
              {Math.round(percent)}%
            </text>
          </svg>
        </div>

        {/* 🔹 ขวา: เปรียบเทียบ & แคล */}
        <div className="ring-right">
          <div className="compare-label-box">
            <span className="compare-label">เทียบกับเมื่อวาน</span>
          </div>
          <div className={`compare-box ${diff >= 0 ? 'up' : 'down'}`}>
            <span className="arrow"></span>
            <span className="diff-text">
              {diff >= 0 ? '+' : ''}
              {diff.toFixed(1)}%
            </span>
          </div>

          <div className="summary-box">
            <span className="today-cal">{todayCal}</span>
            <span className="slash">/</span>
            <span className="target-cal">
              {targetCal}
              <span className="cal-label"> CAL</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
