import React from "react";

function CalorieSummary({ date, dailyCalorie, weeklyCalorie, bunnyImage }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "16px",
        color: "#222",
        position: "relative",
        textAlign: "center",
        width: "300px",
        margin: "0 auto",
        fontFamily: "'Prompt', 'Kanit', 'Noto Sans Thai', Arial, sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      {/* การ์ตูน Bunny */}
      <img
        src={bunnyImage}
        alt="bunny"
        style={{
          position: "absolute",
          top: "-20px",
          right: "-10px",
          width: "70px",
        }}
      />
      {/* กล่องสรุปแคลอรี่ */}
      <div
        style={{
          background: "#fff",
          color: "#222",
          borderRadius: "12px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ margin: "0", fontWeight: "bold" }}>{date}</p>
          <p style={{ margin: "4px 0", fontSize: "18px", fontWeight: "bold" }}>{dailyCalorie}</p>
          <p style={{ margin: "0", fontSize: "12px" }}>แคลอรี่</p>
        </div>
        <div
          style={{
            width: "1px",
            background: "#ccc",
            margin: "0 8px",
          }}
        ></div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ margin: "0", fontWeight: "bold" }}>รายสัปดาห์</p>
          <p style={{ margin: "4px 0", fontSize: "18px", fontWeight: "bold" }}>{weeklyCalorie}</p>
          <p style={{ margin: "0", fontSize: "12px" }}>แคลอรี่</p>
        </div>
      </div>
    </div>
  );
}

export default CalorieSummary;
