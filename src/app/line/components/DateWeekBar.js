"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function DateWeekBar({
  weekStartMonday = true,
  onCalendarClick,
  baseDate, // <-- เพิ่ม
}) {
  const router = useRouter();
  const refDate = baseDate ? new Date(baseDate) : new Date(); // fallback เป็นวันนี้

  const { start, end } = useMemo(() => {
    const d = new Date(refDate);
    const day = d.getDay(); // 0=อาทิตย์ … 6=เสาร์
    const offset = weekStartMonday ? ((day + 6) % 7) : day;

    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    start.setDate(d.getDate() - offset);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, [refDate, weekStartMonday]);

  const fmtThaiDay = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "numeric" });
  const fmtThaiMonthYear = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { month: "long", year: "numeric" });
  const fmtThaiDateSlash = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "2-digit", month: "2-digit", year: "numeric" });

  const weekRangeLabel = useMemo(() => {
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear  = start.getFullYear() === end.getFullYear();
    if (sameMonth && sameYear) {
      return `${fmtThaiDay.format(start)}–${fmtThaiDay.format(end)} ${fmtThaiMonthYear.format(end)}`;
    }
    const full = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day:"numeric", month:"long", year:"numeric" });
    return `${full.format(start)} – ${full.format(end)}`;
  }, [start, end]);

  const handleCalendar = () => {
    if (typeof onCalendarClick === "function") return onCalendarClick();
    // ถ้าไม่ได้ส่ง onCalendarClick มาก็ค่อยนำทางไปหน้าอื่น
    // router.push("/components/calendar");
  };

  return (
    <div className="datebar">
      <div className="datebar-left">
        <time className="datebar-today">{fmtThaiDateSlash.format(refDate)}</time>
      </div>

      <div className="datebar-center" aria-live="polite">
        {weekRangeLabel}
      </div>

      <button
        className="datebar-right calendar-btn"
        type="button"
        aria-label="เลือกวันที่"
        onClick={handleCalendar}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="2.5" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="2.5" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
