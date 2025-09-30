import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase'; // ← ปรับ path ให้ถูกกับโปรเจ็กต์

export default function MenuPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  // ปรับขนาดตัวอักษรได้ตรงนี้
  const FONT = { header: 18, section: 13, item: 13, arrow: 16, button: 14 };

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {}
    try {
      localStorage.clear();
    } catch {}
    onClose?.();
    router.replace('/'); // ไปหน้าล็อกอิน
  };

  const icons = {
    edit: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20h4.586a1 1 0 0 0 .707-.293l10.5-10.5a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0l-10.5 10.5A1 1 0 0 0 4 15.414V20z"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 6.5l3 3"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    book: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="#222"
          strokeWidth="2"
        />
        <path d="M7 4v16" stroke="#222" strokeWidth="2" />
      </svg>
    ),
    question: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2" />
        <path
          d="M12 16h.01"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 8a2 2 0 0 1 2 2c0 1-2 2-2 4"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    doc: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="2"
          width="16"
          height="20"
          rx="2"
          stroke="#222"
          strokeWidth="2"
        />
        <path d="M8 6h8M8 10h8M8 14h6" stroke="#222" strokeWidth="2" />
      </svg>
    ),
    phone: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const menuItems = [
    {
      section: 'การตั้งค่า',
      items: [
        { icon: icons.edit, label: 'แก้ไขข้อมูล', href: '/line/editmenu' },
      ],
    },
    {
      section: 'ข้อมูลเพิ่มเติม',
      items: [
        { icon: icons.book, label: 'วิธีการใช้งาน', href: '/line/manual' },
        { icon: icons.question, label: 'คำถามที่พบบ่อย', href: '/line/fqa' },
        {
          icon: icons.doc,
          label: 'ข้อกำหนดและเงื่อนไขการใช้งาน',
          href: '/line/agreement',
        },
        { icon: icons.phone, label: 'ติดต่อเรา', href: '/line/contact' },
      ],
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.15)',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 24,
          right: 0,
          width: 'min(80vw, 230px)',
          maxHeight: 'calc(100vh - 64px)',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          marginRight: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#3ABB47',
            color: '#fff',
            padding: '12px 0 10px',
            textAlign: 'center',
            fontSize: FONT.header,
            fontWeight: 700,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            aria-label="close menu"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src="/back2.png"
              alt="ย้อนกลับ"
              style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
          </button>
          เมนู
        </div>

        {/* Body */}
        <div style={{ paddingTop: 8, overflowY: 'auto' }}>
          {menuItems.map((section, idx) => (
            <div
              key={section.section}
              style={{ marginBottom: idx === 0 ? 8 : 0 }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: FONT.section,
                  color: '#222',
                  padding: '0 16px 4px',
                }}
              >
                {section.section}
              </div>
              {section.items.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderBottom:
                      i === section.items.length - 1
                        ? 'none'
                        : '1px solid #EAEAEA',
                    textDecoration: 'none',
                    color: '#222',
                    fontSize: FONT.item,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{item.label}</span>
                  <span
                    style={{
                      color: '#3ABB47',
                      fontSize: FONT.arrow,
                      fontWeight: 700,
                    }}
                  >
                    {'>'}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', flexShrink: 0 }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              background: '#3ABB47',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              fontSize: FONT.button, // 14px
              fontWeight: 700,
              padding: '8px 0', // ปุ่มเล็กลง
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
