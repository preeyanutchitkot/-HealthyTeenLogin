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
  getDoc,
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
  if (percent == null) return '/b1.png';
  if (percent >= 100) return '/b3.png';
  if (percent >= 80) return '/b2.png';
  return '/b1.png';
};

export default function MePage() {
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

  const [bellSrc, setBellSrc] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bellSrc') || null;
    }
    return null;
  });
  useEffect(() => {
    if (bellSrc) localStorage.setItem('bellSrc', bellSrc);
  }, [bellSrc]);

  const bmrRef = useRef(null);
  const sumTodayRef = useRef(0);

  const recomputeBell = () => {
    const b = bmrRef.current;
    const s = sumTodayRef.current;
    let percent = null;
    if (b && b > 0) percent = Math.round((s / b) * 100);
    const next = bellSrcByPercent(percent);
    setBellSrc((prev) => (prev === next ? prev : next));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) {
      const fallback = [{ date: today, items: [] }];
      setDailyLogs(fallback);
      setOpenDates({ [today]: true });
      return;
    }

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
    const unsubFoodToday = onSnapshot(
      qToday,
      (snapToday) => {
        let sumCal = 0;
        snapToday.forEach((docSnap) => {
          const x = docSnap.data();
          const cal = Number(x.calories || 0);
          const qty = Number(x.qty || 1);
          sumCal += cal * qty;
        });
        sumTodayRef.current = sumCal;
        recomputeBell();
      },
      (e) => {
        console.error('today food snapshot error:', e);
      }
    );

    return () => {
      unsubUser();
      unsubFoodToday();
    };
  }, [uid, today]);

  useEffect(() => {
    let cancelled = false;
    const ymdToTh = (ymd) => {
      const [y, m, d] = String(ymd).split('-').map(Number);
      return fmtTh(new Date(y, m - 1, d));
    };

    const run = async () => {
      if (!uid) return;
      try {
        const qy = query(collection(db, 'food'), where('uid', '==', uid));
        const snap = await getDocs(qy);

        const byDate = {};
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          const dateStr = d?.ymd
            ? ymdToTh(d.ymd)
            : d?.date?.toDate
              ? fmtTh(d.date.toDate())
              : today;

          if (!byDate[dateStr]) byDate[dateStr] = [];

          const itemName =
            d.item ?? d.name ?? d.menu ?? d.title ?? 'ไม่ระบุเมนู';
          byDate[dateStr].push({
            name: itemName,
            cal:
              d.calories != null && d.qty != null
                ? `${Number(d.calories)}x${Number(d.qty)}`
                : String(d.calories ?? '-'),
            img: d.imageUrl || d.imgUrl || d.img || '/placeholder.png',
          });
        });

        const orderedDates = Object.keys(byDate).sort((a, b) => {
          const [da, ma, ya] = a.split('/').map(Number);
          const [dbb, mb, yb] = b.split('/').map(Number);
          return (
            new Date(2000 + yb, mb - 1, dbb) - new Date(2000 + ya, ma - 1, da)
          );
        });

        const logs =
          orderedDates.length > 0
            ? orderedDates.map((ds) => ({ date: ds, items: byDate[ds] }))
            : [{ date: today, items: [] }];

        if (!cancelled) {
          setDailyLogs(logs);
          setOpenDates({ [logs[0].date]: true });
        }
      } catch (e) {
        console.error('load food logs error:', e);
        if (!cancelled) {
          const fallback = [{ date: today, items: [] }];
          setDailyLogs(fallback);
          setOpenDates({ [today]: true });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [uid, today]);

  const toggleDate = (date) =>
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));

  return (
    <div className={`${notoSansThai.className} ${styles.page}`}>
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f3faee;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link
            href="/line/home"
            aria-label="ย้อนกลับ"
            className={styles.back}
          />
          <div className={styles.title} />
          <div className={styles.headerIcons}>
            <Link
              href="/line/notification"
              aria-label="การแจ้งเตือน"
              className={styles.notifWrap}
            >
              {bellSrc ? (
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

            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(true)}
              aria-label="เมนู"
              type="button"
            >
              <Image src="/Menu.png" alt="menu" width={28} height={40} />
            </button>
          </div>
        </div>

        <div className={styles.profile}>
          <Image src="/profile.png" alt="profile" width={72} height={72} />
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricLine}>
            BMI
            {bmi != null && !isNaN(bmi)
              ? `: ${Number(bmi).toFixed(1)}`
              : '...........................................'}
          </div>
          <div className={styles.metricLine}>
            พลังที่ควรได้รับต่อวัน
            {bmr != null && !isNaN(bmr) ? `: ${Number(bmr)}` : '...........................................'}
          </div>
        </div>
      </div>

      {/* ใช้ตำแหน่งมาตรฐาน (ไม่เลื่อนลงเยอะเหมือน Home) */}
      <div className={styles.summaryWrap}>
        <CalorieSummary variant="floating" topOffset={120} />
        <Image
          src="/bunny.png"
          alt="bunny"
          width={78}
          height={78}
          className={styles.bunnyByCard}
        />
      </div>

      {/* รายการแบบกางวัน */}
      <div className={styles.dayAccordion}>
        {dailyLogs.map((d) => {
          const open = !!openDates[d.date];
          return (
            <div
              className={`${styles.dayCard} ${open ? styles.open : ''}`}
              key={d.date}
            >
              <button
                className={styles.dayHeader}
                onClick={() => toggleDate(d.date)}
                aria-expanded={open}
                aria-controls={`panel-${d.date}`}
              >
                <span className={styles.dayLabel}>{d.date}</span>
                <span className={`${styles.chev} ${open ? styles.rot : ''}`}>
                  ▾
                </span>
              </button>

              <div
                id={`panel-${d.date}`}
                className={styles.dayBody}
                style={{ maxHeight: open ? '560px' : '0px' }}
              >
                {d.items && d.items.length > 0 ? (
                  <div className={styles.menuTable}>
                    <div className={styles.menuHeaderRow}>
                      <div className={styles.menuHeaderImg}>เมนูวันนี้</div>
                      <div className={styles.menuHeaderName}>เมนู</div>
                      <div className={styles.menuHeaderCal}>แคลอรี่</div>
                    </div>

                    {d.items.map((item, idx) => (
                      <div
                        className={styles.menuRow}
                        key={`${item.name}-${idx}`}
                      >
                        <div className={styles.menuColImg}>
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
                            className={styles.menuThumb}
                            unoptimized
                          />
                        </div>
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
