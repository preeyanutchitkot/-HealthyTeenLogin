"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/header";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  // ดึงข้อมูลจาก localStorage เมื่อ component โหลด
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    console.log("Stored Cart Items from localStorage:", storedCartItems);
    setCartItems(storedCartItems);
  }, []);

  const updateQty = (index, newQty) => {
    if (newQty < 1) {
      // ถ้าจำนวนเป็น 0 หรือน้อยกว่า ให้ลบรายการนั้นออก
      removeItem(index);
      return;
    }
    const updated = [...cartItems];
    updated[index].qty = newQty;
    console.log("Updated cart items:", updated);
    setCartItems(updated);
    // บันทึกข้อมูลที่อัปเดตลง localStorage
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    console.log("Removed item, updated cart:", updated);
    setCartItems(updated);
    // บันทึกข้อมูลที่อัปเดตลง localStorage
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  return (
    <div>
      <Header title="เมนูของคุณ" cartoonImage="/mymenu.png" />
      <style jsx global>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }
        :root {
          color-scheme: light;
        }
        html, body, #__next {
          height: 100%;
        }
        html, body {
          margin: 0;
          padding: 0;
        }
        body {
          background: #ffffff;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      {cartItems.length === 0 ? (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="/bear.png" alt="เมนูของคุณ" width={190} height={240} />
          <div
            style={{
              marginTop: 8,
              fontSize: 18,
              color: "#888",
              textAlign: "center",
            }}
          >
            คุณยังไม่เพิ่มอาหารของคุณ
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px" }}>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F3FAF4",
                borderRadius: "12px",
                padding: "10px",
                marginBottom: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                style={{ borderRadius: "8px" }}
              />

              <div style={{ flex: 1, marginLeft: "12px" }}>
                <div style={{ fontWeight: "700" }}>{item.name}</div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {item.calories} แคลอรี่
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => updateQty(index, item.qty - 1)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#3abb47",
                    color: "#fff",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span style={{ fontWeight: "700" }}>{item.qty}</span>
                <button
                  onClick={() => updateQty(index, item.qty + 1)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#3abb47",
                    color: "#fff",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(index)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                <Image
                  src="/trash.png"
                  alt="ลบ"
                  width={22}
                  height={22}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}