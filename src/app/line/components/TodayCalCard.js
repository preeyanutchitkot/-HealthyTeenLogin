// app/components/TodayCalCard.jsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { auth, db, signInIfNeeded } from '../lib/firebase';
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

/* ===== helpers & palette ===== */
const GREEN = '#2e7d32';
const YELLOW = '#f9a825';
const RED = '#d32f2f';
const colorByPct = (p) => (p >= 100 ? RED : p >= 80 ? YELLOW : GREEN);

export default function TodayCalCard({
  calories, // ถ้าส่งมา จะใช้ค่าที่ส่งมา (ไม่คิวรี)
  autoFetch = false, // true = คิวรี Firestore เอง
  dateYMD, // YYYY-MM-DD
  tz = 'Asia/Bangkok',
  label, // "วันนี้" หรือ "23/09/2568"
  goal, // (ออปชัน) ใช้คำนวณ % เมื่อไม่ได้ autoFetch
  capAt100 = false, // ปล่อยให้เกิน 100% ได้ (การ์ดยังเปลี่ยนเป็นแดง)
}) {
  // ===== วันที่สำหรับลิงก์/คิวรี =====
  const ymd = useMemo(() => {
    if (dateYMD) return dateYMD.slice(0, 10);
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(
      new Date()
    );
  }, [dateYMD, tz]);

  const needFetch = autoFetch || calories === undefined || calories === null;

  const [sumCal, setSumCal] = useState(0);
  const [loading, setLoading] = useState(needFetch);
  const [percent, setPercent] = useState(0);

  // ===== โหมดคิวรี Firestore เอง =====
  useEffect(() => {
    if (!needFetch) {
      // โหมดรับค่าจาก props
      const total = Number(calories || 0);
      const g = Number.isFinite(goal) && goal > 0 ? Number(goal) : 2000;
      const pct = Math.round((total / g) * 100);
      setSumCal(total);
      setPercent(capAt100 ? Math.max(0, Math.min(100, pct)) : Math.max(0, pct));
      setLoading(false);
      return;
    }

    let unsub = () => {};
    let mounted = true;

    (async () => {
      try {
        const user = auth.currentUser ?? (await signInIfNeeded());
        const uid = user?.uid;
        if (!uid) {
          if (mounted) {
            setSumCal(0);
            setPercent(0);
            setLoading(false);
          }
          return;
        }

        // อ่าน BMR
        let snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          const qs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', uid), limit(1))
          );
          if (!qs.empty) snap = qs.docs[0];
        }
        const bmr = Number(snap?.data()?.bmr) || 2000;

        // ฟังอาหารของวันนั้น
        const qFood = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('ymd', '==', ymd)
        );

        unsub = onSnapshot(
          qFood,
          (qs) => {
            let total = 0;
            qs.forEach((d) => {
              const x = d.data();
              const qty = Number(x?.qty ?? 1) || 1;
              const calEach = Number(x?.calories ?? x?.cal ?? 0) || 0;
              total += calEach * qty;
            });

            const pct = Math.round((total / bmr) * 100);
            if (mounted) {
              setSumCal(total);
              setPercent(
                capAt100 ? Math.max(0, Math.min(100, pct)) : Math.max(0, pct)
              );
              setLoading(false);
            }
          },
          () => {
            if (mounted) setLoading(false);
          }
        );
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      unsub();
    };
  }, [needFetch, calories, goal, ymd, capAt100]);

  // ===== สีตามช่วง % =====
  const ringColor = colorByPct(percent);
  const cardLabel = label ?? 'วันนี้';
  const valueToShow = needFetch ? sumCal : Number(calories || 0);

  return (
    <Link
      href={{ pathname: '/line/detail', query: { date: ymd } }}
      className="today-card link-reset"
      aria-label={`เปิดรายละเอียดแคลอรี่วันที่ ${ymd}`}
      style={{
        // override สีพื้นตามช่วง %
        background: ringColor,
        color: '#fff',
      }}
    >
      <div className="today-title today-title-strong">{cardLabel}</div>

      <div className="today-value">
        <span className="today-number">
          {loading ? '…' : valueToShow.toLocaleString()}
        </span>
        <span className="today-unit">CAL</span>
      </div>
    </Link>
  );
}
