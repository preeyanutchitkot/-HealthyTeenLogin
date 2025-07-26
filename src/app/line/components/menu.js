'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'หน้าหลัก', href: '/line/home', icon: '/home.png' },
    { label: 'บันทึกอาหาร', href: '/line/food', icon: '/foodlog.png' },
    { label: 'แชทบอท', href: '/chatbot', icon: '/chatbot.jpg', center: true },
    { label: 'พูดคุย', href: '/chat', icon: '/talk.png' },
    { label: 'ฉัน', href: '/me', icon: '/profile.png' },
  ];

  return (
    <>
      <div className="bottom-menu">
        {menuItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`menu-item ${item.center ? 'centered' : ''} ${pathname === item.href ? 'active' : ''}`}
          >
            <div className={item.center ? 'center-icon' : ''}>
              <Image src={item.icon} alt={item.label} width={28} height={28} />
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <style>{`
        .bottom-menu {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background-color: #ffffff;
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          border-top: 1px solid #ddd;
          z-index: 999;
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
          padding-top: 6px;
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: #777;
          text-decoration: none;
          position: relative;
        }

        .menu-item.active {
          color: #4caf50;
          font-weight: bold;
        }

        .menu-item img {
          width: 28px;
          height: 28px;
          margin-bottom: 4px;
        }

        .center-icon {
          background-color: #ffffff;
          border: 2px solid #4caf50;
          border-radius: 50%;
          padding: 10px;
          transform: translateY(-16px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .menu-item span {
          margin-top: 6px;
        }

        .menu-item.centered span {
          margin-top: -6px; /* ปรับขึ้นให้ตรง */
        }
      `}</style>
    </>
  );
};

export default BottomMenu;
