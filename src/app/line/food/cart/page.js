'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Header from '../../components/header';
import { db, signInIfNeeded } from '../../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
} from 'firebase/firestore';

export default function AllFoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    let unsub = null;

    (async () => {
      setLoading(true);
      try {
        const user = await signInIfNeeded();
        const uid = user?.uid;
        if (!uid) throw new Error('No user');

        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        );
        const endOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        );
        const ymd = toYMD(now);

        // สร้างคิวรี 2 แบบ
        const qYmd = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('ymd', '==', ymd),
          limit(2000)
        );

        const qDate = query(
          collection(db, 'food'),
          where('uid', '==', uid),
          where('date', '>=', startOfDay),
          where('date', '<=', endOfDay),
          orderBy('date', 'desc'),
          limit(2000)
        );

        // ตรวจว่ามีข้อมูลแบบ ymd ไหม ถ้ามีใช้ตัวนี้, ถ้าไม่มีก็ใช้แบบ date
        let useYmd = false;
        try {
          const probe = await getDocs(qYmd);
          useYmd = !probe.empty;
        } catch {
          useYmd = false;
        }

        const activeQuery = useYmd ? qYmd : qDate;

        // ฟังแบบ realtime
        unsub = onSnapshot(
          activeQuery,
          (snap) => {
            const list = snap.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                item: x.item ?? x.name ?? x.menu ?? 'ไม่ระบุเมนู',
                calories: Number(x.calories ?? 0),
                qty: Number(x.qty ?? 1),
                imageUrl: x.imageUrl ?? x.image ?? '/placeholder.png',
                date: x.date?.toDate?.() ?? null,
                ymd: x.ymd ?? null,
                createdAt: x.createdAt?.toDate?.() ?? null,
              };
            });

            // เรียงฝั่งไคลเอนต์ให้สวย (โดย date > createdAt > ymd)
            list.sort((a, b) => {
              const ta =
                a.date?.getTime?.() ??
                a.createdAt?.getTime?.() ??
                (a.ymd ? new Date(a.ymd).getTime() : 0);
              const tb =
                b.date?.getTime?.() ??
                b.createdAt?.getTime?.() ??
                (b.ymd ? new Date(b.ymd).getTime() : 0);
              return tb - ta; // ใหม่ไปเก่า
            });

            setFoods(list);
            setLoading(false);
          },
          (err) => {
            console.error('snapshot error:', err);
            setFoods([]);
            setLoading(false);
          }
        );
      } catch (e) {
        console.error('load foods error:', e);
        setFoods([]);
        setLoading(false);
      }
    })();

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'food', id));
      // ไม่ต้อง setFoods เองก็ได้ onSnapshot จะอัปเดตให้
    } catch (e) {
      console.error('delete error:', e);
      alert('ลบไม่สำเร็จ');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        :root {
          color-scheme: light;
        }
        html,
        body,
        #__next {
          height: 100%;
        }
        html,
        body {
          margin: 0;
          padding: 0;
        }
        body {
          background: #ffffff;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      <Header title="เมนูของคุณ" cartoonImage="/8.png" />

      <div style={{ padding: 16, maxWidth: 560, margin: '0 auto' }}>
        {loading && (
          <div style={{ padding: 8, textAlign: 'center', color: '#888' }}>
            กำลังโหลดเมนู...
          </div>
        )}

        {!loading && foods.length === 0 && (
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
            }}
          >
            <Image src="/bear.png" alt="เมนูของคุณ" width={190} height={240} />
            <div style={{ marginTop: 8, fontSize: 18 }}>ยังไม่มีเมนูอาหาร</div>
          </div>
        )}

        {!loading &&
          foods.map((food) => (
            <div
              key={food.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#F3FAF4',
                borderRadius: 12,
                padding: 10,
                marginBottom: 10,
                boxShadow: '0 1px 4px rgba(0,0,0,.08)',
                gap: 12,
              }}
            >
              <Image
                src={food.imageUrl}
                alt={food.item}
                width={60}
                height={60}
                style={{ borderRadius: 8, objectFit: 'cover' }}
                unoptimized
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {food.item}
                </div>
                <div style={{ fontSize: 14, color: '#555' }}>
                  {food.calories} แคลอรี่
                </div>
              </div>

              <div
                style={{ fontWeight: 700, minWidth: 24, textAlign: 'right' }}
              >
                {food.qty}
              </div>

              <button
                onClick={() => handleDelete(food.id)}
                disabled={deletingId === food.id}
                title="ลบ"
                style={{
                  marginLeft: 8,
                  border: 'none',
                  background: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  boxShadow: '0 1px 4px rgba(0,0,0,.08)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {deletingId === food.id ? (
                  <span style={{ fontSize: 12, color: '#999' }}>…</span>
                ) : (
                  <Image src="/trash.png" alt="ลบ" width={16} height={16} />
                )}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
