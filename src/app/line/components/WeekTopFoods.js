"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";

/* ===== helpers (TZ-safe) ===== */
const ymdToDateUTC = (ymd) => new Date(`${(ymd || "").slice(0, 10)}T00:00:00Z`);
const addDaysYMD = (ymd, days) => {
  const d = ymdToDateUTC(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const getLocalYMD_TZ = (d, tz) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);

/* ====== Normalize name ====== */
function normalizeName(raw) {
  const s = String(raw ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return s.toLowerCase();
}

export default function WeekTopFoods({
  ymdStart,
  ymdEnd,
  baseYMD,
  weekStartMonday = true,
  tz = "Asia/Bangkok",

  maxItems = 4,
  countMode = "rows",
  placeholder = "/placeholder.png",
}) {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]); // [{name,image,count}]
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  const { s: effStart, e: effEnd } = useMemo(() => {
    if (ymdStart && ymdEnd) return { s: ymdStart.slice(0, 10), e: ymdEnd.slice(0, 10) };
    const anchor = (baseYMD && baseYMD.slice(0, 10)) || getLocalYMD_TZ(new Date(), tz);
    const dow = ymdToDateUTC(anchor).getUTCDay();
    const offset = weekStartMonday ? ((dow + 6) % 7) : dow;
    const s = addDaysYMD(anchor, -offset);
    const e = addDaysYMD(s, 6);
    return { s, e };
  }, [ymdStart, ymdEnd, baseYMD, tz, weekStartMonday]);

  useEffect(() => {
    if (!uid || !effStart || !effEnd) {
      setItems([]); 
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrMsg("");

    const qFood = query(
      collection(db, "food"),
      where("uid", "==", uid),
      where("ymd", ">=", effStart),
      where("ymd", "<=", effEnd)
    );

    const build = (docs) => {
      const map = new Map();
      docs.forEach((docx) => {
        const d = docx.data();
        const displayName = (d.name || d.item || "-").trim() || "-";
        const key = normalizeName(displayName);

        const image = d.imageUrl || placeholder;
        const add = countMode === "qty" ? (Number(d.qty ?? 1) || 1) : 1;

        if (!map.has(key)) {
          map.set(key, {
            name: displayName,
            image,
            count: 0,
            _imageCounts: {},
          });
        }
        const cur = map.get(key);
        cur.count += add;
        cur._imageCounts[image] = (cur._imageCounts[image] || 0) + add;

        // เลือกรูปตามสถิติ
        let bestImg = cur.image;
        let bestCnt = cur._imageCounts[bestImg] || 0;
        for (const [img, c] of Object.entries(cur._imageCounts)) {
          const isBetter =
            c > bestCnt ||
            (c === bestCnt && bestImg === placeholder && img !== placeholder);
          if (isBetter) {
            bestImg = img;
            bestCnt = c;
          }
        }
        cur.image = bestImg;
        map.set(key, cur);
      });

      const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
      setItems(arr);
    };

    const unsub = onSnapshot(
      qFood,
      (snap) => { build(snap.docs); setLoading(false); },
      async (err) => {
        console.warn("onSnapshot failed, fallback to getDocs:", err);
        try {
          const snapAll = await getDocs(query(collection(db, "food"), where("uid", "==", uid)));
          const docs = snapAll.docs.filter(d => {
            const y = (d.data().ymd || "").slice(0,10);
            return y && y >= effStart && y <= effEnd;
          });
          build(docs);
        } catch (e) {
          console.error(e);
          setErrMsg("ไม่สามารถดึงข้อมูลได้");
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, [uid, effStart, effEnd, countMode, placeholder]);

  const featured = items[0] ?? { name: "-", image: placeholder, count: 0 };
  const rest = useMemo(() => items.slice(1), [items]);

  const collapsedCountRight = Math.max(0, (maxItems || 4) - 1);
  const preview = rest.slice(0, collapsedCountRight);
  const overflow = rest.slice(collapsedCountRight);

  return (
    <section className="tf2-card" aria-label="สรุปเมนูที่ทานบ่อยของสัปดาห์นี้">
      <div className="tf2-head">
        <h3>สรุปเมนูที่ทานบ่อยรายสัปดาห์</h3>
        {items.length > maxItems && (
          <button
            type="button"
            className="tf2-toggle"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "ย่อ" : "ดูทั้งหมด"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="tf2-loading">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="tf2-empty">
          ยังไม่มีข้อมูลในสัปดาห์นี้
          {errMsg ? <div className="tf2-error">{errMsg}</div> : null}
        </div>
      ) : (
        <div className="tf2-body">
          {/* 🔹 ฝั่งซ้าย (เมนูอันดับ 1) */}
          <div className="tf2-left">
            <figure className="tf2-hero">
              <Image
                src={featured.image}
                alt={featured.name}
                width={150}
                height={150}
                className="tf2-hero-img"
                unoptimized
              />
              <figcaption className="tf2-hero-caption">
                <div className="tf2-hero-name">{featured.name}</div>
                <div className="tf2-hero-count">
                  {featured.count.toLocaleString()} ครั้ง
                </div>
              </figcaption>
            </figure>
          </div>

          {/* 🔹 ฝั่งขวา (รายการอื่น ๆ) */}
          <div className={`tf2-right ${showAll ? "showAll" : ""}`}>
            {preview.map((it) => (
              <div className="tf2-row" key={`${it.name}|${it.image}`}>
                <Image
                  src={it.image}
                  alt={it.name}
                  width={44}
                  height={44}
                  className="tf2-thumb"
                  unoptimized
                />
                <div className="tf2-row-name">{it.name}</div>
                <div className="tf2-row-count">
                  {it.count.toLocaleString()} ครั้ง
                </div>
              </div>
            ))}

            {showAll && overflow.length > 0 && (
              <div className="tf2-morelist">
                {overflow.map((it) => (
                  <div
                    className="tf2-row"
                    key={`more:${it.name}|${it.image}`}
                  >
                    <Image
                      src={it.image}
                      alt={it.name}
                      width={44}
                      height={44}
                      className="tf2-thumb"
                      unoptimized
                    />
                    <div className="tf2-row-name">{it.name}</div>
                    <div className="tf2-row-count">
                      {it.count.toLocaleString()} ครั้ง
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
