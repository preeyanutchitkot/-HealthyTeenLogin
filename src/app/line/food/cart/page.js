"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../components/header";
import { db, signInIfNeeded } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  limit,
} from "firebase/firestore";

export default function AllFoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await signInIfNeeded();
        const uid = user?.uid;
        if (!uid) throw new Error("No user");

        // ✅ ดึง "ทั้งหมด" ของผู้ใช้ เรียงตามวันที่ใหม่ → เก่า
        const q = query(
          collection(db, "food"),
          where("uid", "==", uid),
          orderBy("date", "desc"),
          limit(2000) // ปรับได้ตามต้องการ
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            item: x.item ?? x.name ?? x.menu ?? "ไม่ระบุเมนู",
            calories: Number(x.calories ?? 0),
            qty: Number(x.qty ?? 1),
            imageUrl: x.imageUrl ?? x.image ?? "/placeholder.png",
            date: x.date?.toDate?.() ?? null,
          };
        });

        setFoods(list);
      } catch (e) {
        console.error("load foods error:", e);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "food", id));
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.error("delete error:", e);
      alert("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        :root { color-scheme: light; }
        html, body, #__next { height: 100%; }
        html, body { margin: 0; padding: 0; }
        body {
          background: #ffffff;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      <Header title="เมนูของคุณ" cartoonImage="/8.png" />

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
        {loading && (
          <div style={{ padding: 8, textAlign: "center", color: "#888" }}>
            กำลังโหลดเมนู...
          </div>
        )}

        {!loading && foods.length === 0 && (
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
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
                display: "flex",
                alignItems: "center",
                background: "#F3FAF4",
                borderRadius: 12,
                padding: 10,
                marginBottom: 10,
                boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                gap: 12,
              }}
            >
              <Image
                src={food.imageUrl}
                alt={food.item}
                width={60}
                height={60}
                style={{ borderRadius: 8, objectFit: "cover" }}
                unoptimized
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {food.item}
                </div>
                <div style={{ fontSize: 14, color: "#555" }}>
                  {food.calories} แคลอรี่
                </div>
              </div>

              <div style={{ fontWeight: 700, minWidth: 24, textAlign: "right" }}>
                {food.qty}
              </div>

              <button
                onClick={() => handleDelete(food.id)}
                disabled={deletingId === food.id}
                title="ลบ"
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "#fff",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                {deletingId === food.id ? (
                  <span style={{ fontSize: 12, color: "#999" }}>…</span>
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
