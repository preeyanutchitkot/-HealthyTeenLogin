"use client";

import Image from "next/image";

export default function CartSheet({ cartItems, onClose, onIncrease, onDecrease, onRemove, onSave }) {
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <div className="dragbar" />
          <div className="title">เมนูของคุณ</div>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <div className="sheet-list">
          {cartItems.map((it) => (
            <div key={it.name} className="row">
              <div className="left">
                <Image src={it.image} alt={it.name} width={56} height={56} className="thumb" />
                <div className="meta">
                  <div className="r-name">{it.name}</div>
                  <div className="r-cal">{it.calories} × {it.qty} = <b>{it.calories * it.qty}</b> แคลอรี่</div>
                </div>
              </div>
              <div className="right">
                <button className="qtybtn" onClick={() => onDecrease(it.name)}>−</button>
                <span className="qty">{it.qty}</span>
                <button className="qtybtn" onClick={() => onIncrease(it.name)}>+</button>
                <button className="icon-btn trash-btn" onClick={() => onRemove(it.name)}>
                  <img src="/trash.png" alt="ลบ" className="trash-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sheet-footer">
          <button className="save" disabled={cartItems.length === 0} onClick={onSave}>บันทึก</button>
        </div>
      </div>
    </>
  );
}
