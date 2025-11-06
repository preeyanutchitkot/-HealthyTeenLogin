// components/WeekCalories.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function WeekCalories({
  data = [],
  goal = 2000,
  todayYMD, // ส่งจาก useSummaryData
  tz = 'Asia/Bangkok',
}) {
  const router = useRouter();

  const getLocalYMD = (d = new Date(), timeZone = tz) =>
    new Intl.DateTimeFormat('en-CA', { timeZone }).format(d);

  const _todayYMD = todayYMD || getLocalYMD(new Date(), tz); // fallback

  const level = (cal) => {
    const pct = goal > 0 ? (cal / goal) * 100 : 0;
    if (pct <= 79) return 'green';
    if (pct <= 100) return 'yellow';
    return 'red';
  };

  const items = (data || []).filter((d) => d?.date && d.date !== _todayYMD);

  return (
    <div className="week-strip">
      {items.map((d) => {
        const ymd = d.date;
        const lv = level(d.cal || 0);
        return (
          <button
            key={ymd || d.label}
            onClick={() => router.push(`/line/detail?date=${ymd}`)}
            className={`day-pill lv-${lv}`}
            aria-label={`เปิดรายละเอียด ${d.label}`}
          >
            <div className="pill-head">
              <span className="pill-day">{d.label}</span>
            </div>
            <div className="pill-body">
              <strong className="pill-num">
                {(d.cal || 0).toLocaleString()}
              </strong>
              <span className="pill-unit">CAL</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
