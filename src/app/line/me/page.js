'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BottomMenu from '../components/menu';
import CalorieSummary from '../components/CalorieSummary';
import MenuPopup from '../components/MenuPopup';
import { Noto_Sans_Thai } from 'next/font/google';

import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

import styles from './MePage.module.css';

const notoSansThai = Noto_Sans_Thai({
  weight: ['300', '400', '500', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const bellSrcByPercent = (percent) => {
  if (percent == null || isNaN(percent)) return '/b_green.png';

  if (percent >= 100) return '/b_red.png';
  if (percent >= 80) return '/b_yellow.png';

  return '/b_green.png';
};

export default function MePage() {
  // ป้องกัน hydration mismatch
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const fmtTh = (date) =>
    new Date(date).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

  const today = useMemo(() => fmtTh(new Date()), []);

  const [uid, setUid] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);

  const [dailyLogs, setDailyLogs] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const [bellSrc, setBellSrc] = useState('/b_green.png'); // default สีเขียว
  const bmrRef = useRef(null);
  const sumTodayRef = useRef(0);

  const recomputeBell = () => {
    const b = Number(bmrRef.current);
    const s = Number(sumTodayRef.current);

    // ❗ ป้องกันไม่ให้ Bell แดงตอนข้อมูลยังโหลดไม่เสร็จ
    if (!b || isNaN(b) || b <= 0) {
      console.log("Skip bell: BMR ยังไม่พร้อม");
      return;   // <<==== หยุด ไม่เปลี่ยนสีระฆัง
    }

    const percent = Math.round((s / b) * 100);

    console.log("DEBUG percent =", percent, "sum =", s, "bmr =", b);

    // ถ้า percent ผิด (NaN / Infinity) → ให้เป็นเขียว
    if (isNaN(percent) || percent < 0) {
      setBellSrc('/b_green.png');
      return;
    }

    setBellSrc(bellSrcByPercent(percent));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // โหลดค่า BMR และแคลวันนี้แบบ realtime
  useEffect(() => {
    if (!uid) return;

    const ymd = toYMD(new Date());

    const unsubUser = onSnapshot(doc(db, 'users', uid), (uSnap) => {
      const u = uSnap.exists() ? uSnap.data() : null;
      const bmrVal = u?.bmr != null ? Number(u.bmr) : null;
      bmrRef.current = bmrVal;
      setBmr(bmrVal);
      setBmi(u?.bmi != null ? Number(u.bmi) : null);
      recomputeBell();
    });

    const qToday = query(
      collection(db, 'food'),
      where('uid', '==', uid),
      where('ymd', '==', ymd)
    );

    const unsubFoodToday = onSnapshot(qToday, (snapToday) => {
      let sumCal = 0;
      snapToday.forEach((docSnap) => {
        const x = docSnap.data();
        // calories ใน Firestore เป็นค่ารวมแล้ว ไม่ต้องคูณ qty
        sumCal += Number(x.calories || 0);
      });
      sumTodayRef.current = sumCal;
      recomputeBell();
    });

    return () => {
      unsubUser();
      unsubFoodToday();
    };
  }, [uid]);

  // โหลดประวัติย้อนหลัง
  useEffect(() => {
    if (!uid) return;

    const ymdToTh = (ymd) => {
      const [y, m, d] = ymd.split('-');
      return fmtTh(new Date(Number(y), Number(m) - 1, Number(d)));
    };

    (async () => {
      const qy = query(collection(db, 'food'), where('uid', '==', uid));
      const snap = await getDocs(qy);

      const byDate = {};
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        const dateStr = d?.ymd ? ymdToTh(d.ymd) : today;

        if (!byDate[dateStr]) byDate[dateStr] = [];

        const itemName =
          d.item ?? d.name ?? d.menu ?? d.title ?? 'ไม่ระบุเมนู';

        byDate[dateStr].push({
          name: itemName,
          cal:
            d.calories != null && d.qty != null
              ? `${Number(d.calories)}x${Number(d.qty)}`
              : String(d.calories ?? '-'),
          img: d.imageUrl || '/placeholder.png',
        });
      });

      const logs = Object.keys(byDate).map((date) => ({
        date,
        items: byDate[date],
      }));

      setDailyLogs(logs);
      setOpenDates({ [logs[0]?.date]: true });
    })();
  }, [uid]);

  const toggleDate = (date) =>
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));

  return (
    <div className={`${notoSansThai.className} ${styles.page}`}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/line/home" aria-label="ย้อนกลับ" className={styles.back} />

          <div className={styles.headerIcons}>
            <Link href="/line/notification" aria-label="การแจ้งเตือน" className={styles.notifWrap}>
              {hydrated ? (
                <Image
                  src={bellSrc}
                  alt="แจ้งเตือน"
                  width={38}
                  height={50}
                  className={styles.notifBell}
                  priority
                />
              ) : (
                <div style={{ width: 38, height: 50 }} />
              )}
            </Link>

            <button className={styles.menuBtn} onClick={() => setMenuOpen(true)}>
              <Image src="/Menu.png" alt="menu" width={28} height={40} />
            </button>
          </div>
        </div>

        <div className={styles.profile}>
          <Image src="/profile.png" alt="profile" width={72} height={72} />
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricLine}>
            BMI {bmi != null ? `: ${bmi.toFixed(1)}` : '...........................................'}
          </div>
          <div className={styles.metricLine}>
            พลังที่ควรได้รับต่อวัน {bmr != null ? `: ${bmr}` : '...........................................'}
          </div>
        </div>
      </div>

      <div className={styles.summaryWrap}>
        <CalorieSummary uid={uid} variant="floating" topOffset={120} />
        <Image src="/bunny.png" alt="bunny" width={78} height={78} className={styles.bunnyByCard} />
      </div>

      <div className={styles.dayAccordion}>
        {dailyLogs.map((d) => {
          const open = !!openDates[d.date];
          return (
            <div className={`${styles.dayCard} ${open ? styles.open : ''}`} key={d.date}>
              <button className={styles.dayHeader} onClick={() => toggleDate(d.date)}>
                <span className={styles.dayLabel}>{d.date}</span>
                <span className={`${styles.chev} ${open ? styles.rot : ''}`}>▾</span>
              </button>

              <div className={styles.dayBody}>
                {d.items?.length > 0 ? (
                  <div className={styles.menuTable}>
                    {d.items.map((item, idx) => (
                      <div className={styles.menuRow} key={idx}>
                        <Image src={item.img} alt={item.name} width={50} height={50} className={styles.menuThumb} unoptimized />
                        <div className={styles.menuColName}>{item.name}</div>
                        <div className={styles.menuColCal}>{item.cal}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>ยังไม่มีบันทึกในวันนี้</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MenuPopup isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomMenu />
    </div>
  );
}
