
function MenuPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 16,
          width: 320, // เพิ่มความกว้าง
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '28px 0 12px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ข้อมูลส่วนตัว */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'none',
            border: 'none',
            padding: '14px 40px',
            fontSize: 19,
            color: '#222',
            cursor: 'pointer',
            borderRadius: 0,
            textAlign: 'left',
            width: '100%',
          }}
        >
          <img src={"/profile.png"} alt="ข้อมูลส่วนตัว" style={{ width: 30, height: 30 }} />
          ข้อมูลส่วนตัว
        </button>
        <div style={{ height: 1, background: '#F0F0F0', margin: '0 32px' }} />
        {/* การตั้งค่า */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'none',
            border: 'none',
            padding: '14px 40px',
            fontSize: 19,
            color: '#222',
            cursor: 'pointer',
            borderRadius: 0,
            textAlign: 'left',
            width: '100%',
          }}
        >
          <img src={"/Menu.png"} alt="การตั้งค่า" style={{ width: 30, height: 30 }} />
          การตั้งค่า
        </button>
        <div style={{ height: 1, background: '#F0F0F0', margin: '0 32px' }} />
        {/* ปุ่มออกจากระบบ */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'none',
            border: 'none',
            padding: '8px 40px',
            fontSize: 15,
            color: '#F35B5B',
            cursor: 'pointer',
            borderRadius: 0,
            textAlign: 'left',
            width: '100%',
            marginTop: 10,
          }}
        >
          <img src={"/logout.png"} alt="ออกจากระบบ" style={{ width: 18, height: 18 }} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export default MenuPopup;
