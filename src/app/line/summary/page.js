'use client';

import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

import './summary.css';
import ActivityRing from '../components/ActivityRing';
import BottomMenu from '../components/menu';
import Header from '../components/header';
import TodayCalCard from '../components/TodayCalCard';
import WeekCalories from '../components/WeekCalories';
import DateWeekBar from '../components/DateWeekBar';
import WeekTopFoods from '../components/WeekTopFoods';
import CalendarModal from '../components/CalendarModal';
import { useSummaryData } from '../hooks/useSummaryData';

dayjs.locale('th');

export default function SummaryPage() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [openCal, setOpenCal] = React.useState(false);
  const [uidReady, setUidReady] = React.useState(false);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUidReady(!!user);
    });
    return () => unsub();
  }, []);

  const { weekData, goal, ymdStart, ymdEnd } = useSummaryData({
    defaultGoal: 2000,
    weekStartMonday: false,
    tz: 'Asia/Bangkok',
    baseDate: selectedDate.toDate(),
    enabled: uidReady, // ✅ สำคัญ
  });

  const weekTotal = (weekData || []).reduce(
    (s, d) => s + (Number(d?.cal) || 0),
    0
  );

  const fmtThaiSlash = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const selectedThai = fmtThaiSlash.format(selectedDate.toDate());
  const selectedYMD = selectedDate.format('YYYY-MM-DD');
  const todayYMD = dayjs().format('YYYY-MM-DD');

  const handleConfirmDate = (d) => {
    setSelectedDate(d);
    setOpenCal(false);
  };

  return (
    <div className="summary-page">
      <div className="header-container">
        <Header title="สรุปแคลอรี่" cartoonImage="/8.png" />
      </div>

      <main className="summary-main">
        {/* ถ้ายังไม่พร้อม → แสดง skeleton แทน */}
        {!uidReady ? (
          <div style={{ textAlign: 'center', padding: 40 }}>กำลังโหลด…</div>
        ) : (
          <>
            <div className="ring-wrapper">
              <ActivityRing dateYMD={selectedYMD} tz="Asia/Bangkok" />
            </div>

            <DateWeekBar
              weekStartMonday={false}
              baseDate={selectedDate.toDate()}
              onCalendarClick={() => setOpenCal(true)}
            />

            <TodayCalCard
              autoFetch
              dateYMD={selectedYMD}
              label={selectedYMD === todayYMD ? 'วันนี้' : selectedThai}
            />

            <WeekCalories data={weekData} goal={goal} todayYMD={selectedYMD} />

            <div className="divider" />

            <section className="week-total-card">
              <div className="wt-left">
                <div className="wt-title">สรุปรายสัปดาห์</div>
                <div className="wt-sub">
                  รวมแคลอรี่สัปดาห์นี้ • เฉลี่ย{' '}
                  {(Math.round(weekTotal / 7) || 0).toLocaleString()} CAL/วัน
                </div>
              </div>
              <div className="wt-right">
                <span className="wt-number">{weekTotal.toLocaleString()}</span>
                <span className="wt-unit">CAL</span>
              </div>
            </section>

            <WeekTopFoods
              ymdStart={ymdStart}
              ymdEnd={ymdEnd}
              maxItems={4}
              countMode="qty"
            />

            <div className="bear-footer">
              <img src="/bear.png" alt="Chef Bear" className="bear-img" />
            </div>
          </>
        )}
      </main>

      <BottomMenu />

      <CalendarModal
        open={openCal}
        onClose={() => setOpenCal(false)}
        value={selectedDate}
        onChange={(d) => setSelectedDate(d)}
        onConfirm={handleConfirmDate}
      />
    </div>
  );
}
