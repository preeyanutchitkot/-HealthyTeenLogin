import React from 'react';

const levelConfig = {
  over: { color: '#e53935', icon: '/alarm 1.png', alt: 'dangerous' },
  normal: { color: '#43a047', icon: '/Approval.png', alt: 'normal' },
  near: { color: '#fbc02d', icon: '/Answers.png', alt: 'near' },
};

function CalorieAlertCard(props) {
  const { level, title, calorie, maxCalorie, icon, iconAlert } = props;
  const config = levelConfig[level] || levelConfig.normal;

  const fontFamily = "'Prompt','Kanit','Noto Sans Thai',Arial,sans-serif";
  const cardStyle = {
    border: `2px solid ${config.color}`,
    borderRadius: 16,
    padding: 20,
    textAlign: 'center',
    width: '100%',
    maxWidth: 340,
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,.08)',
    margin: '0 auto',
    boxSizing: 'border-box',
    fontFamily,
  };

  if (typeof window !== 'undefined') {
    const styleId = 'calorie-alert-card-responsive';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media (max-width: 480px){ .calorie-alert-card{ max-width:98vw!important; padding:12px!important } }
        @media (max-width: 768px){ .calorie-alert-card{ max-width:90vw!important } }
      `;
      document.head.appendChild(style);
    }
  }

  return (
    <div className="calorie-alert-card" style={cardStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          color: config.color,
          fontFamily,
        }}
      >
        <span>{title}</span>
        {iconAlert ? (
          <span style={{ marginLeft: 8 }}>{iconAlert}</span>
        ) : (
          <span style={{ marginLeft: 8 }}>
            <img src={config.icon} alt={config.alt} style={{ width: 20 }} />
          </span>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <progress
          value={calorie}
          max={maxCalorie}
          style={{ width: '100%', height: 18, accentColor: config.color }}
        />
        <style>{`
          .calorie-alert-card progress::-webkit-progress-value { background-color: ${config.color}; }
          .calorie-alert-card progress::-moz-progress-bar       { background-color: ${config.color}; }
          .calorie-alert-card progress::-ms-fill                { background-color: ${config.color}; }
        `}</style>
      </div>

      <p style={{ fontSize: 16, margin: '8px 0', fontFamily }}>
        ปริมาณแคลอรี่ของคุณคือ {calorie} kcal
      </p>
      <p style={{ fontSize: 14, color: '#888', fontFamily }}>
        เป้าหมาย {maxCalorie} kcal
      </p>

      {icon && (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

export default CalorieAlertCard;
