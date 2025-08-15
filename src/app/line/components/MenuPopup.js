

function MenuPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  // ไอคอนที่ใช้ในแต่ละเมนู (ใช้ public/xxx.png)
  // SVG ไอคอนสีดำ
  const icons = {
    edit: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4.586a1 1 0 0 0 .707-.293l10.5-10.5a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0l-10.5 10.5A1 1 0 0 0 4 15.414V20z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 6.5l3 3" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    book: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#222" strokeWidth="2"/><path d="M7 4v16" stroke="#222" strokeWidth="2"/></svg>
    ),
    question: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2"/><path d="M12 16h.01" stroke="#222" strokeWidth="2" strokeLinecap="round"/><path d="M12 8a2 2 0 0 1 2 2c0 1-2 2-2 4" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    doc: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="16" height="20" rx="2" stroke="#222" strokeWidth="2"/><path d="M8 6h8M8 10h8M8 14h6" stroke="#222" strokeWidth="2"/></svg>
    ),
    phone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  };

  const menuItems = [
    {
      section: 'การตั้งค่า',
      items: [
        {
          icon: icons.edit,
          label: 'แก้ไขข้อมูล',
          onClick: () => {},
        },
      ],
    },
    {
      section: 'ข้อมูลเพิ่มเติม',
      items: [
        {
          icon: icons.book,
          label: 'วิธีการใช้งาน',
          onClick: () => {},
        },
        {
          icon: icons.question,
          label: 'คำถามที่พบบ่อย',
          onClick: () => {},
        },
        {
          icon: icons.doc,
          label: 'ข้อกำหนดและเงื่อนไขการใช้งาน',
          onClick: () => {},
        },
        {
          icon: icons.phone,
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
                  <span style={{ width: 28, height: 28, marginRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
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
