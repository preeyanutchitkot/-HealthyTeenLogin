'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const OA_URL    = 'https://line.me/R/ti/p/@696kpmzu';
const GROUP_URL = 'https://line.me/ti/g/t8BaEgh4cw';

export default function BottomMenu() {
  const pathname = usePathname();

  const safeSrc = (p) => encodeURI(p);

  const menuItems = [
    { label: 'หน้าหลัก',   type: 'internal', href: '/line/home', icon: '/home 3.png' },
    { label: 'บันทึกอาหาร', type: 'internal', href: '/line/food', icon: '/savefood.png' },
    { label: 'แชทบอท',     type: 'external', url: OA_URL,          icon: '/55.png', center: true },
    { label: 'พูดคุย',      type: 'external', url: GROUP_URL,       icon: '/Group 230 (1).png' },
    { label: 'ฉัน',         type: 'internal', href: '/line/me',     icon: '/Group 230 (2).png' },
  ];

  // ✅ เปิด external: ใช้ LIFF ถ้ามี, ไม่งั้นเปิดแท็บใหม่
  const openExternal = (url) => (e) => {
    e.preventDefault();
    try {
      if (globalThis?.liff?.openWindow) {
        globalThis.liff.openWindow({ url, external: true });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // ✅ แจ้งความสูงเมนูให้ทั้งหน้า (กันคอนเทนต์โดนทับ)
  useEffect(() => {
    const nav = document.getElementById('bottom-menu');
    if (!nav) return;
    const apply = () => {
      document.documentElement.style.setProperty('--menu-h', `${nav.offsetHeight}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    window.addEventListener('load', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', apply);
    };
  }, []);

  return (
    <>
      <nav id="bottom-menu" className="bottom-menu" role="navigation" aria-label="Main tabs">
        {menuItems.map((item) => {
          const isActive =
            item.type === 'internal' &&
            (pathname === item.href || pathname?.startsWith(item.href + '/'));

          const IconBlock = (
            <>
              {item.center ? (
                <div className={`center-wrap ${isActive ? 'active' : ''}`}>
                  <Image
                    src={safeSrc(item.icon)}
                    alt={item.label}
                    width={40}
                    height={50}
                    className="center-img"
                    priority
                  />
                </div>
              ) : (
                <Image
                  src={safeSrc(item.icon)}
                  alt={item.label}
                  width={32}
                  height={32}
                  className={`icon ${isActive ? 'icon-active' : 'icon-inactive'}`}
                />
              )}
              <span className={`label ${isActive ? 'label-active' : 'label-inactive'}`}>
                {item.label}
              </span>
            </>
          );

          // 🔁 internal ใช้ Link / external ใช้ <a> + handler
          return item.type === 'internal' ? (
            <Link
              href={item.href}
              key={item.label}
              prefetch={false}
              className={`menu-item ${item.center ? 'centered' : ''} ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {IconBlock}
            </Link>
          ) : (
            <a
              key={item.label}
              href={item.url}
              onClick={openExternal(item.url)}
              className={`menu-item ${item.center ? 'centered' : ''}`}
              aria-label={item.label}
              rel="noopener noreferrer"
            >
              {IconBlock}
            </a>
          );
        })}
      </nav>

      <style>{`
        .bottom-menu {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          height: 84px;
          background: #fff;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: start;
          border-top: 1px solid #E7E7E7;
          box-shadow: 0 -2px 6px rgba(0,0,0,0.05);
          z-index: 999;
          padding-top: 8px;
        }
        .menu-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 6px;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }
        .icon { display: block; }
        .icon-inactive { filter: grayscale(100%) opacity(0.55); }
        .icon-active { filter: none; }
        .centered { transform: translateY(-12px); }
        .center-wrap {
          width: 64px; height: 64px; border-radius: 9999px;
          background: #fff; border: 2px solid #4CAF50;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 12px rgba(0,0,0,0.12);
        }
        .center-wrap.active { border-color: #3ABB47; }
        .center-img { display: block; }
        .label { font-size: 12px; line-height: 1; margin-top: 2px; }
        .label-inactive { color: #9AA0A6; font-weight: 400; }
        .label-active { color: #4CAF50; font-weight: 700; }
        .menu-item.centered .label { margin-top: 0; }
        @media (min-width: 480px) {
          .bottom-menu { height: 88px; }
          .centered { transform: translateY(-16px); }
          .center-wrap { width: 68px; height: 68px; }
        }
      `}</style>
    </>
  );
}
