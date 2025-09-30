// app/summary/page.jsx
"use client";

import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";

import "./summary.css";
import ActivityRing from "../components/ActivityRing";      // ← เวอร์ชันที่ดึง Firestore เอง (baseDate)
import BottomMenu from "../components/menu";
import Header from "../components/header";
import TodayCalCard from "../components/TodayCalCard";
import WeekCalories from "../components/WeekCalories";
import DateWeekBar from "../components/DateWeekBar";
import WeekTopFoods from "../components/WeekTopFoods";
import CalendarModal from "../components/CalendarModal";
import { useSummaryData } from "../hooks/useSummaryData";   // สำหรับกราฟ/สรุปรายสัปดาห์เท่านั้น

dayjs.locale("th");

export default function SummaryPage() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [openCal, setOpenCal] = React.useState(false);

  // ===== ดึงข้อมูลสัปดาห์ตามวันเลือก (โค้ดเดิมของคุณ) =====
  const { weekData, goal, ymdStart, ymdEnd } = useSummaryData({
    defaultGoal: 2000,
    weekStartMonday: true,
    tz: "Asia/Bangkok",
    baseDate: selectedDate.toDate(),
  });

  const weekTotal = (weekData || []).reduce((s, d) => s + (Number(d?.cal) || 0), 0);

  // ===== วันที่แบบไทย/พุทธ (แสดงบนการ์ด/ป้าย) =====
  const fmtThaiSlash = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const selectedThai = fmtThaiSlash.format(selectedDate.toDate());
  const selectedYMD = selectedDate.format("YYYY-MM-DD");
  const todayYMD = dayjs().format("YYYY-MM-DD");

  const handleConfirmDate = (d) => {
    setSelectedDate(d);
    setOpenCal(false);
  };

  return (
    <div className="summary-page">
      <div className="header-container">
        <Header title="สรุปแคลอรี่" cartoonImage="/9.png" />
      </div>

      <main className="summary-main">
        {/* ===== วงแหวน: ดึง Firestore เองจาก baseDate ===== */}
        <div className="ring-wrapper">
        <ActivityRing dateYMD={selectedYMD} tz="Asia/Bangkok" />

        </div>

        {/* ===== แถบวันที่: แสดงวันเลือก + เปิดปฏิทิน ===== */}
        <DateWeekBar
          weekStartMonday
          baseDate={selectedDate.toDate()}
          onCalendarClick={() => setOpenCal(true)}
        />

        {/* ===== การ์ดค่ารวมของวันเลือก (ดึงเองหรือจะส่งค่ามาก็ได้) ===== */}
        <TodayCalCard
          autoFetch
          dateYMD={selectedYMD}
          label={selectedYMD === todayYMD ? "วันนี้" : selectedThai}
        />

        {/* ===== กราฟสัปดาห์ ===== */}
        <WeekCalories data={weekData} goal={goal} todayYMD={selectedYMD} />

        <div className="divider" />

        {/* ===== สรุปรายสัปดาห์ ===== */}
        <section className="week-total-card" aria-label="สรุปรายสัปดาห์">
          <div className="wt-left">
            <div className="wt-title">สรุปรายสัปดาห์</div>
            <div className="wt-sub">
              รวมแคลอรี่สัปดาห์นี้ • เฉลี่ย{" "}
              {(Math.round(weekTotal / 7) || 0).toLocaleString()} CAL/วัน
            </div>
          </div>
          <div className="wt-right">
            <span className="wt-number">{weekTotal.toLocaleString()}</span>
            <span className="wt-unit">CAL</span>
          </div>
        </section>

        {/* ===== Top foods ในช่วงสัปดาห์ที่เลือก ===== */}
        <WeekTopFoods ymdStart={ymdStart} ymdEnd={ymdEnd} maxItems={4} countMode="qty" />

        {/* ===== ภาพ footer ===== */}
        <div className="bear-footer">
          <img src="/bear.png" alt="Chef Bear" className="bear-img" />
        </div>
      </main>

      <BottomMenu />

      {/* ===== ปฏิทิน ===== */}
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
