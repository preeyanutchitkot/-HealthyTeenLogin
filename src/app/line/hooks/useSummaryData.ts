'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  limit,
} from 'firebase/firestore';
import { db, signInIfNeeded } from '../lib/firebase';

export type WeekItem = { date: string; label: string; cal: number };

type Opts = {
  uid?: string;
  defaultGoal?: number;
  weekStartMonday?: boolean;
  tz?: string;
  baseDate?: Date; 
};

const getLocalYMD_TZ = (d: Date, tz = 'Asia/Bangkok') =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d); // YYYY-MM-DD

const dateFromYMD_UTC = (ymd: string) => new Date(`${ymd}T00:00:00Z`);

const addDaysYMD = (ymd: string, days: number) => {
  const dt = dateFromYMD_UTC(ymd);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};

const dowFromYMD = (ymd: string) => dateFromYMD_UTC(ymd).getUTCDay();
const TH_DAY_SUN_FIRST = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัส',
  'ศุกร์',
  'เสาร์',
];

export function useSummaryData({
  uid,
  defaultGoal = 2000,
  weekStartMonday = true,
  tz = 'Asia/Bangkok',
  baseDate, 
}: Opts) {
  const [weekData, setWeekData] = useState<WeekItem[]>([]);
  const [todayCalories, setTodayCalories] = useState(0);
  const [goal, setGoal] = useState<number>(defaultGoal);

  const anchorYMD = useMemo(
    () => getLocalYMD_TZ(baseDate ?? new Date(), tz),
    [baseDate, tz]
  );

  const { ymdStart, ymdEnd, startYMD } = useMemo(() => {
    const dow = dowFromYMD(anchorYMD);
    const offset = weekStartMonday ? (dow + 6) % 7 : dow;
    const start = addDaysYMD(anchorYMD, -offset);
    const end = addDaysYMD(start, 6);
    return { ymdStart: start, ymdEnd: end, startYMD: start };
  }, [anchorYMD, weekStartMonday]);

  useEffect(() => {
    (async () => {
      const user = await signInIfNeeded();
      const effectiveUid = uid || user?.uid;

      /* 1) goal = BMR */
      let newGoal = defaultGoal;
      try {
        if (effectiveUid) {
          let snapUser = await getDoc(doc(db, 'users', effectiveUid));
          if (!snapUser.exists()) {
            const qU = query(
              collection(db, 'users'),
              where('uid', '==', effectiveUid),
              limit(1)
            );
            const list = await getDocs(qU);
            snapUser = list.docs[0] ?? snapUser;
          }
          if (snapUser?.exists()) {
            const bmr = Number((snapUser.data() as any)?.bmr);
            if (Number.isFinite(bmr) && bmr > 0) newGoal = Math.round(bmr);
          }
        }
      } catch (err) {
        console.warn('⚠️ load goal failed', err);
      }
      setGoal(newGoal);

      const cons: any[] = [
        where('ymd', '>=', ymdStart),
        where('ymd', '<=', ymdEnd),
        orderBy('ymd', 'asc'),
      ];
      if (effectiveUid) cons.unshift(where('uid', '==', effectiveUid));

      const qFood = query(collection(db, 'food'), ...cons);
      const snap = await getDocs(qFood);

      const byYmd: Record<string, number> = {};
      snap.forEach((docx) => {
        const d: any = docx.data();
        const y =
          d.ymd ||
          (d.date?.toDate
            ? getLocalYMD_TZ(d.date.toDate(), tz)
            : typeof d.date === 'string'
              ? d.date.slice(0, 10)
              : '') ||
          '';

        const qty = Number(d.qty ?? 1) || 1;
        const calEach = Number(d.calories ?? d.cal ?? 0) || 0;
        const total = calEach * qty;

        if (y && Number.isFinite(total)) {
          byYmd[y] = (byYmd[y] || 0) + total;
        }
      });

      let arr: WeekItem[] = Array.from({ length: 7 }).map((_, i) => {
        const ymd = addDaysYMD(startYMD, i);
        const cal = byYmd[ymd] || 0;
        const label = TH_DAY_SUN_FIRST[dowFromYMD(ymd)];
        return { date: ymd, label, cal };
      });
      arr = arr.filter((day) => day.date !== anchorYMD);

      setWeekData(arr);
      setTodayCalories(byYmd[anchorYMD] || 0); 
    })().catch(console.error);
  }, [
    uid,
    defaultGoal,
    ymdStart,
    ymdEnd,
    startYMD,
    tz,
    anchorYMD,
    weekStartMonday,
  ]);

  /* ✅ progress (%) */
  const progress = Math.round(((todayCalories || 0) / (goal || 1)) * 100);

  return {
    weekData, // 6 วัน (ตัดวัน anchor ออก)
    todayCalories, // ค่าแคลของวัน anchor
    progress, // %
    goal, // ค่าเป้าหมาย (BMR)
    todayYMD: anchorYMD,
    ymdStart,
    ymdEnd,
  };
}
