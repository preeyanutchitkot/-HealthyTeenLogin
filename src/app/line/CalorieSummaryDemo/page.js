"use client";
import React, { useEffect, useState } from "react";
import CalorieSummary from "../components/CalorieSummary";

function CalorieSummaryDemo() {
  const [date, setDate] = useState("");
  const [dailyCalorie, setDailyCalorie] = useState(0);
  const [weeklyCalorie, setWeeklyCalorie] = useState(0);

  useEffect(() => {
    // mock ข้อมูลจาก API
    const response = {
      date: "20/07/68",
      daily: 250,
      weekly: 500,
    };
    setDate(response.date);
    setDailyCalorie(response.daily);
    setWeeklyCalorie(response.weekly);
  }, []);

  return (
    <CalorieSummary
      date={date}
      dailyCalorie={dailyCalorie}
      weeklyCalorie={weeklyCalorie}
      bunnyImage={"/bunny.png"}
    />
  );
}

export default CalorieSummaryDemo;
