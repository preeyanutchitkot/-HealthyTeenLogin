'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../line/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function LineLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // ✅ หน้าที่ไม่ต้องล็อคอิน
  const publicPaths = [
    '/line/login',
    '/line/register',
    '/line/contact',
    '/line/lookvideo',
    '/line/manual',
    '/line/request-otp',
  ];

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isPublic) {
      setReady(true);
      return;
    }

    if (auth.currentUser) {
      setReady(true);
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/line/login');
      } else {
        setReady(true);
      }
    });

    // กันค้างนาน
    const fallback = setTimeout(() => setReady(true), 400);

    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, [pathname, isPublic, router]);

  // ✅ Splash Screen (ระหว่างเช็คสิทธิ์)
  if (!ready) {
    return (
      <div style={{
        height: '100vh',
        background: '#e9f8ea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img
          src="/Logo.png"
          width={120}
          alt="loading"
          style={{ opacity: 0.85 }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
