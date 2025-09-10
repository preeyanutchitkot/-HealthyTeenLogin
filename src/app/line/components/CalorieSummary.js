import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, where, Timestamp } from "firebase/firestore";

const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const formatDateTH = (d) => `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getFullYear()+543).slice(-2)}`;

export default function CalorieSummary({
  variant = "floating",
  uid,
  daysRange = 7,
  bunnyImage = "/bunny.png",
  topOffset = 120,            // ✅ เพิ่มพร็อพนี้
}) {
  const [dailyCalorie, setDailyCalorie] = useState(0);
  const [weeklyCalorie, setWeeklyCalorie] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const today = useMemo(() => new Date(), []);
  const todayLabel = useMemo(() => formatDateTH(today), [today]);
  const todayYMD = useMemo(() => toYMD(today), [today]);

  useEffect(() => {
    const run = async () => {
      const userId = uid || auth.currentUser?.uid;
      if (!userId) { setErr("ยังไม่ได้ล็อกอิน"); setLoading(false); return; }
      setLoading(true); setErr(null);
      try {
        const qDaily = query(collection(db,"food"), where("uid","==",userId), where("ymd","==",todayYMD));
        const dailySnap = await getDocs(qDaily);
        const dailySum = dailySnap.docs.reduce((s,doc)=> {
          const d=doc.data(); return s + Number(d.calories||0) * Number(d.qty||1);
        },0);
        setDailyCalorie(dailySum);

        const start = new Date(today); start.setHours(0,0,0,0); start.setDate(start.getDate()-(daysRange-1));
        const end = new Date(today);   end.setHours(23,59,59,999);
        const qWeek = query(
          collection(db,"food"),
          where("uid","==",userId),
          where("date",">=",Timestamp.fromDate(start)),
          where("date","<=",Timestamp.fromDate(end)),
          orderBy("date")
        );
        const weekSnap = await getDocs(qWeek);
        const weekSum = weekSnap.docs.reduce((s,doc)=> {
          const d=doc.data(); return s + Number(d.calories||0) * Number(d.qty||1);
        },0);
        setWeeklyCalorie(weekSum);
      } catch(e){ setErr(e?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"); }
      finally{ setLoading(false); }
    };
    run();
  }, [uid, todayYMD, daysRange, today]);

  return (
    <div
      className={`summary-container ${variant==="inline" ? "inline" : "floating"}`}
      style={variant==="floating" ? { ["--cs-top"]: `${topOffset}px` } : undefined}  // ✅ ส่งค่าเข้า CSS variable
    >
      <Image src={bunnyImage} alt="bunny" width={72} height={100} className="bunny-img" priority />

      <p className="summary-title">สรุปแคลอรี่</p>

      {loading ? (
        <div className="loading">กำลังคำนวณ...</div>
      ) : err ? (
        <div className="error">{err}</div>
      ) : (
        <div className="summary-box">
          <div className="summary-item">
            <p className="summary-date">{todayLabel}</p>
            <p className="summary-value">{dailyCalorie}</p>
            <p className="summary-unit">แคลอรี่</p>
          </div>
          <span className="divider" aria-hidden="true" />
          <div className="summary-item">
            <p className="summary-date">รายสัปดาห์</p>
            <p className="summary-value">{weeklyCalorie}</p>
            <p className="summary-unit">แคลอรี่</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .summary-container{
          position: relative;
          width: 90vw;
          max-width: 300px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          padding: 20px 16px;
          text-align: center;
          z-index: 10;
        }
        .summary-container.floating{
          position: absolute;
          top: var(--cs-top, 120px); 
          left: 50%;
          transform: translateX(-50%);
        }
        .summary-container.inline{ position: static; transform:none; margin:16px auto; }

        .bunny-img {
          position: absolute;
          top: -24px;
          left: 50%;              /* วางให้อยู่กึ่งกลางแนวนอน */
          transform: translateX(-50%); /* เลื่อนครึ่งนึงของความกว้างรูป */
          width: 72px;
          height: auto;
          margin: 0;
          display: inline-block;
          pointer-events: none;
          user-select: none;
        }

        .summary-title{ font-weight:700; font-size:18px; margin:4px 0 10px; color:#111827; }
        .summary-box{ background:#f8fafc; border-radius:12px; padding:12px 8px; display:flex; justify-content:space-between; margin-top:10px; box-shadow:0 1px 4px rgba(0,0,0,.04); }
        .summary-item{ flex:1; text-align:center; }
        .summary-date{ margin:0; font-weight:600; color:#000000; font-size:15px; }
        .summary-value{ margin:4px 0; font-size:20px; font-weight:700; color:#222; }
        .summary-unit{ margin:0; font-size:13px; color:#888; }
        .divider{ width:1px; background:#e5e7eb; margin:0 8px; }
        .loading,.error{ font-size:14px; color:#6b7280; padding:8px 0; }
        .error{ color:#dc2626; }
      `}</style>
    </div>
  );
}
