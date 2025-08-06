
import React from "react";


const levelConfig = {
  over: { color: "#e53935", icon: "/alarm 1.png", alt: "dangerous" },
  normal: { color: "#43a047", icon: "/Approval.png", alt: "normal" },
  near: { color: "#fbc02d", icon: "/Answers.png", alt: "near" },
};


function CalorieAlertCard(props) {
  const { level, title, calorie, maxCalorie, icon, iconAlert } = props;
  const config = levelConfig[level] || levelConfig['normal'];
  // Responsive style
  // เปลี่ยนชื่อฟอนต์ตามที่ติดตั้งในโปรเจกต์ เช่น 'Prompt', 'Kanit', 'Noto Sans Thai', หรือชื่อฟอนต์ที่ใช้ใน globals.css
  const fontFamily = "'Prompt', 'Kanit', 'Noto Sans Thai', Arial, sans-serif";
  const cardStyle = {
    border: `2px solid ${config.color}`,
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    width: "100%",
    maxWidth: "340px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    margin: "0 auto",
    boxSizing: "border-box",
    fontFamily,
  };

  // Add media query for mobile/tablet
  // This will inject a style tag for responsiveness
  if (typeof window !== 'undefined') {
    const styleId = 'calorie-alert-card-responsive';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media (max-width: 480px) {
          .calorie-alert-card {
            max-width: 98vw !important;
            padding: 12px !important;
          }
        }
        @media (max-width: 768px) {
          .calorie-alert-card {
            max-width: 90vw !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  return React.createElement(
    'div',
    {
      className: 'calorie-alert-card',
      style: cardStyle
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: config.color,
          fontFamily,
        }
      },
      React.createElement('span', null, title),
      iconAlert
        ? React.createElement('span', { style: { marginLeft: 8 } }, iconAlert)
        : React.createElement('span', { style: { marginLeft: 8 } },
            React.createElement('img', {
              src: config.icon,
              alt: config.alt,
              style: { width: 20 }
            })
          )
    ),
    React.createElement(
      'div',
      { style: { marginBottom: "10px" } },
      React.createElement('progress', {
        value: calorie,
        max: maxCalorie,
        style: {
          width: "100%",
          height: "18px",
          accentColor: config.color // modern browsers support accentColor for <progress>
        }
      }),
      // fallback for browsers that don't support accentColor
      React.createElement('style', null, `
        .calorie-alert-card progress::-webkit-progress-value {
          background-color: ${config.color};
        }
        .calorie-alert-card progress::-moz-progress-bar {
          background-color: ${config.color};
        }
        .calorie-alert-card progress::-ms-fill {
          background-color: ${config.color};
        }
      `)
    ),
    React.createElement('p', { style: { fontSize: "16px", margin: "8px 0", fontFamily } }, `ปริมาณแคลอรี่ของคุณคือ ${calorie} kcal`),
    React.createElement('p', { style: { fontSize: "14px", color: "#888", fontFamily } }, `เป้าหมาย ${maxCalorie} kcal`),
    icon && React.createElement('div', { style: { marginTop: "12px" } }, icon)
  );
}

export default CalorieAlertCard;
