'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function PreviewModal({ open, onClose, food, onConfirm }) {
  const [qty, setQty] = useState(1);
  useEffect(() => {
    setQty(1);
  }, [food]);
  if (!open || !food) return null;

  const plus = () => setQty(q => q + 1);
  const minus = () => setQty(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>ยืนยันเมนู</h3>
        <div className="row">
          <Image src={food.image} alt={food.name} width={72} height={72} />
          <div className="info">
            <div className="name">{food.name}</div>
            <div className="cal">{food.calories} แคลอรี่</div>
          </div>
        </div>

        <div className="qty">
          <button onClick={minus}>-</button>
          <span>{qty}</span>
          <button onClick={plus}>+</button>
        </div>

        <button
          className="save"
          onClick={() => {
            if (food && food.name && food.calories) {
              onConfirm?.({ ...food, qty });
            }
            onClose?.();
          }}
        >
          บันทึก
        </button>
        <button className="cancel" onClick={onClose}>ยกเลิก</button>
      </div>

      <style jsx>{`
        .modal{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:50}
        .modal-content{background:#fff;padding:20px;border-radius:12px;width:min(420px,90%);display:flex;flex-direction:column;gap:12px}
        .row{display:flex;gap:12px;align-items:center}
        .name{font-weight:700}
        .cal{font-size:13px;color:#555}
        .qty{display:flex;align-items:center;gap:12px;justify-content:center;margin-top:8px}
        .qty button{width:36px;height:36px;border-radius:8px;border:none;background:#e8f8e3;color:#3abb47;font-size:20px}
        .save{background:#3abb47;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700}
        .cancel{background:transparent;color:#3abb47;border:1px solid #3abb47;border-radius:8px;padding:10px}
      `}</style>
    </div>
  );
}
