

function MenuPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  // ไอคอนที่ใช้ในแต่ละเมนู (ใช้ public/xxx.png)
  const menuItems = [
    {
      section: 'การตั้งค่า',
      items: [
        {
          icon: '🔧', // ดำ
          label: 'แก้ไขข้อมูล',
          onClick: () => {},
        },
      ],
    },
    {
      section: 'ข้อมูลเพิ่มเติม',
      items: [
        {
          icon: '📖',
          label: 'วิธีการใช้งาน',
          onClick: () => {},
        },
        {
          icon: '❓',
          label: 'คำถามที่พบบ่อย',
          onClick: () => {},
        },
        {
          icon: '📄',
          label: 'ข้อกำหนดและเงื่อนไขการใช้งาน',
          onClick: () => {},
        },
        {
          icon: '📞',
          label: 'ติดต่อเรา',
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.15)',
      zIndex: 1000,
    }} onClick={onClose}>
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 0,
          width: 370,
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          marginRight: 16,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header สีเขียว */}
        <div style={{
          background: '#3ABB47',
          color: '#fff',
          padding: '20px 0 16px 0',
          textAlign: 'center',
          fontSize: 26,
          fontWeight: 700,
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              left: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="close menu"
          >
            <span style={{ fontSize: 32, color: '#fff' }}>{'←'}</span>
          </button>
          เมนู
        </div>

        <div style={{ padding: '18px 0 0 0' }}>
          {menuItems.map((section, idx) => (
            <div key={section.section} style={{ marginBottom: idx === 0 ? 18 : 0 }}>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: '#222',
                padding: '0 32px 8px 32px',
              }}>{section.section}</div>
              {section.items.map((item, i) => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 32px',
                  borderBottom: i === section.items.length - 1 ? 'none' : '1px solid #E0E0E0',
                  cursor: 'pointer',
                  color: '#3ABB47',
                  fontWeight: 500,
                  fontSize: 16,
                  background: 'none',
                }} onClick={item.onClick}>
                  <span style={{ width: 28, height: 28, marginRight: 16, fontSize: 24, color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1, color: '#222', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ color: '#3ABB47', fontSize: 22, fontWeight: 700 }}>{'>'}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 32px 32px 32px', textAlign: 'center' }}>
          <button
            style={{
              width: '100%',
              background: '#3ABB47',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              fontSize: 20,
              fontWeight: 700,
              padding: '14px 0',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(58,187,71,0.08)',
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuPopup;
