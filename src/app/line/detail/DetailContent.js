'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  limit,
  getDocs,
} from 'firebase/firestore';
import styles from './DetailPage.module.css';

/* ====== TZ-safe date helpers ====== */
const TZ_BKK = 'Asia/Bangkok';
const getLocalYMD = (d = new Date(), tz = TZ_BKK) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
const ymdToDateUTC = (ymd) => new Date(`${(ymd || '').slice(0, 10)}T00:00:00Z`);
const fmtDateSlashTH = (ymd, tz = TZ_BKK) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: tz,
  }).format(ymdToDateUTC(ymd));

export default function DetailContent() {
  const params = useSearchParams();
  const pickedYMD = (params.get('date') || getLocalYMD(new Date(), TZ_BKK)).slice(0, 10);
  const isToday = pickedYMD === getLocalYMD(new Date(), TZ_BKK);

  const [uid, setUid] = useState(null);
  const [goal, setGoal] = useState(2000);
  const [rows, setRows] = useState([]);
  const [totalCal, setTotalCal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) {
      setRows([]);
      setTotalCal(0);
      setGoal(2000);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        let snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          const qs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', uid), limit(1))
          );
          snap = qs.docs[0] ?? snap;
        }
        const bmr = Number(snap?.data()?.bmr);
        if (Number.isFinite(bmr) && bmr > 0) setGoal(Math.round(bmr));
      } catch {}
    })();

    const qFood = query(
      collection(db, 'food'),
      where('uid', '==', uid),
      where('ymd', '==', pickedYMD)
    );

    const unsubFood = onSnapshot(
      qFood,
      (snap) => {
        let sum = 0;
        const list = snap.docs.map((d) => {
          const x = d.data();
          const qty = Number(x.qty ?? 1) || 1;
          const calEach = Number(x.calories ?? x.cal ?? 0) || 0;
          const calTotal = calEach * qty;
          sum += calTotal;

          return {
            id: d.id,
            name: x.name || x.item || '-',
            img: x.imageUrl || '/placeholder.png',
            calText: qty > 1 ? `${calEach}x${qty}` : `${calEach}`,
            cal: calTotal,
          };
        });
        setRows(list);
        setTotalCal(sum);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubFood();
  }, [uid, pickedYMD]);

  const pct = useMemo(() => Math.round(((totalCal || 0) / (goal || 1)) * 100), [totalCal, goal]);
  const level = pct <= 79 ? 'green' : pct < 100 ? 'yellow' : 'red';

  return (
    <div className={styles.page}>
      <Header title="สรุปแคลอรี่" cartoonImage="/9.png" />
      <main className={styles.main}>
        <section className={`${styles.todayBadge} ${styles[`lv-${level}`]}`}>
          <div className={styles.tbTitle}>
            {isToday ? 'วันนี้' : fmtDateSlashTH(pickedYMD, TZ_BKK)}
          </div>
          <div className={styles.tbValue}>
            {totalCal.toLocaleString()}
            <span className={styles.tbUnit}>CAL</span>
          </div>
        </section>

        <section className={styles.menuToday}>
          <div className={styles.menuTable}>
            <div className={styles.tableDate}>
              {fmtDateSlashTH(pickedYMD, TZ_BKK)}
            </div>

            <div className={styles.menuHeaderRow}>
              <div className={styles.menuHeaderImg}>เมนูวันนี้</div>
              <div className={styles.menuHeaderName}>เมนู</div>
              <div className={styles.menuHeaderCal}>แคลอรี่</div>
            </div>

            {loading ? (
              <div className={styles.menuRow}>
                <div className={styles.empty}>กำลังโหลด...</div>
              </div>
            ) : rows.length === 0 ? (
              <div className={styles.menuRow}>
                <div className={styles.empty}>ยังไม่มีบันทึกในวันนี้</div>
              </div>
            ) : (
              rows.map((it) => (
                <div className={styles.menuRow} key={it.id}>
                  <div className={styles.menuColImg}>
                    <Image
                      src={it.img}
                      alt={it.name}
                      width={50}
                      height={50}
                      className={styles.menuThumb}
                      unoptimized
                    />
                  </div>
                  <div className={styles.menuColName}>{it.name}</div>
                  <div className={styles.menuColCal}>{it.calText}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
