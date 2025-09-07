"use client";
import Image from "next/image";

export default function MenuPopup({
  isOpen,
  onClose,
  size = "normal", // "normal" | "compact"
}) {
  if (!isOpen) return null;

  const SIZES = {
    normal: { w: 380, radius: 20, pad: 16, rowPad: 14, title: 22, icon: 22, gap: 12 },
    compact:{ w: 320, radius: 14, pad: 12, rowPad: 10, title: 18, icon: 18, gap: 8  },
  };
  const s = SIZES[size] ?? SIZES.normal;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="wrap" role="dialog" aria-modal="true" aria-label="เมนู">
        <div className="sheet">
          {/* header */}
          <div className="head">
            <button className="back" onClick={onClose} aria-label="ปิด">
              <Image src="/back2.png" alt="" width={s.icon} height={s.icon} />
            </button>
            <div className="title">เมนู</div>
            <div style={{ width: s.icon }} />
          </div>

          {/* กลุ่ม: การตั้งค่า */}
          <div className="section">
            <div className="section-title">การตั้งค่า</div>
            <button className="row" onClick={() => location.href = "/line/editmenu"}>
              <div className="left">
                <Image src="/edit-pen.png" alt="" width={s.icon} height={s.icon} />
                <span>แก้ไขข้อมูล</span>
              </div>
              <span className="chev">›</span>
            </button>
          </div>

          {/* กลุ่ม: ข้อมูลเพิ่มเติม */}
          <div className="section">
            <div className="section-title">ข้อมูลเพิ่มเติม</div>

            <button className="row" onClick={() => location.href = "/line/howto"}>
              <div className="left">
                <Image src="/doc.png" alt="" width={s.icon} height={s.icon} />
                <span>วิธีการใช้งาน</span>
              </div>
              <span className="chev">›</span>
            </button>

            <button className="row" onClick={() => location.href = "/line/faq"}>
              <div className="left">
                <Image src="/faq.png" alt="" width={s.icon} height={s.icon} />
                <span>คำถามที่พบบ่อย</span>
              </div>
              <span className="chev">›</span>
            </button>

            <button className="row" onClick={() => location.href = "/line/terms"}>
              <div className="left">
                <Image src="/doc.png" alt="" width={s.icon} height={s.icon} />
                <span>ข้อกำหนดและเงื่อนไขการใช้งาน</span>
              </div>
              <span className="chev">›</span>
            </button>

            <button className="row" onClick={() => location.href = "/line/contact"}>
              <div className="left">
                <Image src="/phone.png" alt="" width={s.icon} height={s.icon} />
                <span>ติดต่อเรา</span>
              </div>
              <span className="chev">›</span>
            </button>
          </div>

          <button className="logout" onClick={() => location.href = "/line/logout"}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.35);
          z-index: 999;
        }
        .wrap {
          position: fixed; inset: 0;
          display: grid; place-items: start center;
          padding-top: 8vh;
          z-index: 1000;
        }
        .sheet {
          width: min(${s.w}px, 92vw);
          background: #fff;
          border-radius: ${s.radius}px;
          box-shadow: 0 10px 30px rgba(0,0,0,.15);
          overflow: hidden;
        }
        .head {
          display: grid; grid-template-columns: ${s.icon + 8}px 1fr ${s.icon}px;
          align-items: center;
          gap: ${s.gap}px;
          background: #3ABB47;
          color: #fff;
          padding: ${s.pad}px;
        }
        .back {
          width: ${s.icon + 12}px; height: ${s.icon + 12}px;
          border: none; border-radius: 999px; background: rgba(255,255,255,.2);
          display: grid; place-items: center; cursor: pointer;
        }
        .title {
          text-align: center; font-weight: 800; font-size: ${s.title}px;
        }

        .section { padding: ${s.pad}px; }
        .section + .section { padding-top: 0; }
        .section-title {
          font-weight: 800; color: #2e7d32; margin: 4px 0 ${s.pad - 4}px 0;
          font-size: ${Math.max(13, s.title - 6)}px;
        }

        .row {
          width: 100%;
          background: #fff; border: none; border-top: 1px solid #EEF3EE;
          display: flex; align-items: center; justify-content: space-between;
          padding: ${s.rowPad}px ${s.pad}px;
          font-size: ${Math.max(14, s.title - 4)}px;
          cursor: pointer;
        }
        .row:first-of-type { border-top: none; }
        .left { display: flex; align-items: center; gap: ${s.gap}px; color: #1f2937; }
        .chev { color: #85c792; font-weight: 700; }

        .logout {
          margin: 0 ${s.pad}px ${s.pad}px; width: calc(100% - ${s.pad * 2}px);
          height: ${size === "compact" ? 44 : 48}px;
          background: #33B24A; color:#fff; border:none; border-radius: 999px;
          font-weight: 800; font-size: ${Math.max(15, s.title - 4)}px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
