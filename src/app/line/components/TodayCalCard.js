'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { auth, db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  doc,
  getDocs,
  limit,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

/* ===== สีตามช่วง % ===== */
const GREEN = '#2e7d32';
const YELLOW = '#f9a825';
const RED = '#d32f2f';
const colorByPct = (p) => (p >= 100 ? RED : p >= 80 ? YELLOW : GREEN);

export default function TodayCalCard({
  calories,
  autoFetch = false,
  dateYMD,
  tz = 'Asia/Bangkok',
  label,
  goal,
  capAt100 = false,
}) {
  const ymd = useMemo(() => {
    return dateYMD
      ? dateYMD.slice(0, 10)
      : new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());
  }, [dateYMD, tz]);

  const needFetch = autoFetch || calories === undefined || calories === null;

  const [sumCal, setSumCal] = useState(0);
  const [loading, setLoading] = useState(needFetch);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!needFetch) {
      const total = Number(calories || 0);
      const g = Number.isFinite(goal) && goal > 0 ? Number(goal) : 2000;
      const pct = Math.round((total / g) * 100);
      setSumCal(total);
      setPercent(capAt100 ? Math.min(100, pct) : pct);
      return;
    }

    let unsubAuth = () => {};
    let unsubFood = () => {};
    let active = true;

    unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!active) return;
      if (!user) return setLoading(false);

      const uid = user.uid;

      try {
        let snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          const qs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', uid), limit(1))
          );
          if (!qs.empty) snap = qs.docs[0];
        }

        const bmr = Number(snap?.data()?.bmr) || 2000;

        const qFood = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('ymd', '==', ymd)
        );

        unsubFood = onSnapshot(qFood, (qs) => {
          let total = 0;
          qs.forEach((d) => {
            const x = d.data();
            total += (Number(x.calories ?? x.cal) || 0) * (Number(x.qty) || 1);
          });

          const pct = Math.round((total / bmr) * 100);
          if (!active) return;
          setSumCal(total);
          setPercent(capAt100 ? Math.min(100, pct) : pct);
          setLoading(false);
        });
      } catch {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubAuth();
      unsubFood();
    };
  }, [needFetch, calories, goal, ymd, capAt100]);

  const ringColor = colorByPct(percent);
  const cardLabel = label ?? 'วันนี้';

  return (
    <Link
      href={{ pathname: '/line/detail', query: { date: ymd } }}
      className="today-card link-reset"
      style={{ background: ringColor, color: '#fff' }}
    >
      <div className="today-title today-title-strong">{cardLabel}</div>
      <div className="today-value">
        <span className="today-number">{loading ? '…' : sumCal}</span>
        <span className="today-unit">CAL</span>
      </div>
    </Link>
  );
}
