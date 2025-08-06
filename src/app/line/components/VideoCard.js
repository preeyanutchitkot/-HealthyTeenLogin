import React from "react";

/**
 * @param {{ thumbnail: string; title: string; onWatch: () => void; }} props
 */
function VideoCard({ thumbnail, title, onWatch }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      background: "#e6f7e6",
      borderRadius: "20px",
      padding: "18px 16px",
      marginBottom: "18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      fontFamily: "'Prompt', 'Kanit', 'Noto Sans Thai', Arial, sans-serif"
    }}>
      <div style={{ position: "relative", marginRight: "18px" }}>
        <img
          src={thumbnail}
          alt={title}
          style={{ width: "110px", height: "75px", borderRadius: "12px", objectFit: "cover" }}
        />
        {/* Play icon overlay */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)"
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#FF0000" />
            <polygon points="8,7 16,11 8,15" fill="#fff" />
          </svg>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ fontWeight: 600, fontSize: "18px", marginBottom: "10px", color: "#2e3a2e" }}>{title}</div>
        <button
          onClick={onWatch}
          style={{
            backgroundColor: "#A3D9A5",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "8px 24px",
            fontSize: "16px",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}
        >
          คลิกเพื่อดู
        </button>
      </div>
    </div>
  );
}

export default VideoCard;
