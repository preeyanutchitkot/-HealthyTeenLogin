"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import BottomMenu from "../../components/menu";
import CartIcon from "../../components/CartIcon";
import CategoryBar from "../../components/CategoryBar";
import Header from "../../components/header";
import FoodGrid from "../../components/FoodGrid";
import CartSheet from "../../components/CartSheet";
import AddFoodSheet from "../../components/AddFoodSheet";

import { saveCartToFirestore } from "../../lib/saveCart";

const ForeignFoods = [
  { name: 'พิซซ่า (1 ชิ้น)', calories: 285, image: '/foods/pizza.png' },
  { name: 'สปาเกตตี้คาโบนารา', calories: 400, image: '/foods/spaghetti-carbonara.png' },
  { name: 'เบอร์ริโต', calories: 290, image: '/foods/burrito.png' },
  { name: 'ซูชิ (5 คำ)', calories: 200, image: '/foods/sushi.png' },
  { name: 'สเต็กเนื้อ (100 กรัม)', calories: 25, image: '/foods/beef-steak.png' },
  { name: 'นาโชส์ (1 ถุงเล็ก)', calories: 150, image: '/foods/nachos.png' },
  { name: 'ครัวซองต์ (1 ชิ้น)', calories: 230, image: '/foods/croissant.png' },
  { name: 'ชีสบาร์เกอร์', calories: 300, image: '/foods/cheeseburger.png' },
  { name: 'ไก่ย่างบาร์บีคิว (1 ชิ้น)', calories: 250, image: '/foods/bbq-chicken.png' },
  { name: 'ชิลลี่คอนคาร์เน่ (1 ถ้วย)', calories: 290, image: '/foods/chili-con-carne.png' },
  { name: 'ปาเอยา (1 ถ้วย)', calories: 350, image: '/foods/paella.png' },
  { name: 'แซนด์วิชทูน่า', calories: 280, image: '/foods/tuna-sandwich.png' },
  { name: 'พาสต้าคาโบนาร่า', calories: 400, image: '/foods/pasta-carbonara.png' },
  { name: 'ฟิชแอนด์ชิพส์', calories: 450, image: '/foods/fish-and-chips.png' },
  { name: 'ข้าวผัดญี่ปุ่น', calories: 280, image: '/foods/japanese-fried-rice.png' },
  { name: 'ซุปหัวหอม', calories: 150, image: '/foods/onion-soup.png' },

];

export default function ForeignFoodsPage() {
  const [foods, setFoods] = useState(ForeignFoods);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [customFoods, setCustomFoods] = useState([]);
  const router = useRouter();


  // ✅ NEW: โหลดตะกร้าจาก localStorage เมื่อเปิดหน้า
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (raw) setCartItems(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // อัปเดตตัวเลขบนไอคอนรถเข็น
  useEffect(() => {
    const total = cartItems.reduce((sum, it) => sum + it.qty, 0);
    setCartCount(total);
  }, [cartItems]);

  const filteredFoods = useMemo(
    () =>
      [...foods, ...customFoods].filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [foods, customFoods, searchQuery]
  );

  const persist = (items) => {
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items)); // ✅ ให้ตรงกันเสมอ
  };

  const addToCart = (food) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.name === food.name);
      let updated;
      if (idx === -1) {
        updated = [...prev, { ...food, qty: 1 }];
      } else {
        updated = [...prev];
        updated[idx].qty += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(updated)); // มีอยู่แล้ว
      return updated;
    });
  };

  const addCustomFood = (foodItem) => {
    setCustomFoods((prev) => [foodItem, ...prev]);
  };

  const handleSaveNewFood = () => setShowAddSheet(false);

  // ✅ NEW: บันทึกลง Firestore ตาม rules ของคุณ
  const handleSaveCart = async () => {
    try {
      if (!cartItems.length) return;
      setIsSaving(true);
      await saveCartToFirestore(cartItems);

      // เคลียร์/ปิด sheet
      persist([]);
      setShowSheet(false);

      // ✅ เด้งไปหน้ารายการ (วันนี้/เดือนนี้ แล้วแต่คุณตั้ง)
      router.replace("/line/food/cart");
    } catch (err) {
      console.error(err);
      alert(err?.message || "บันทึกล้มเหลว");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page">
      <Header title="บันทึกอาหาร" cartoonImage="/8.png" />

      <div className="search-wrap">
        <div className="search-pill" role="search">
          <Image src="/search.png" alt="ค้นหา" width={23} height={23} />
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href="/line/food/cart">
            <Image src="/character.png" alt="ตัวการ์ตูน" width={26} height={26} style={{cursor:'pointer'}} />
          </Link>
        </div>
      </div>

      <CategoryBar
        categories={[
          { name: "อาหารคาว", icon: "/food1.png" },
          { name: "อาหารหวาน", icon: "/food2.png" },
          { name: "ของว่าง", icon: "/food4.png" },
          { name: "อาหารเจ", icon: "/jfood7.png" },
          { name: "อาหารต่างประเทศ", icon: "/food5.png" },
          { name: "เครื่องดื่ม", icon: "/food3.png" },
          { name: "ผักและผลไม้", icon: "/food6.png" },
        ]}
        categoryPathMap={{
          อาหารคาว: "/line/food/savory",
          อาหารหวาน: "/line/food/sweet",
          ของว่าง: "/line/food/snack",
          อาหารเจ: "/line/food/J",
          อาหารต่างประเทศ: "/line/food/Foreign",
          เครื่องดื่ม: "/line/food/drink",
          ผักและผลไม้: "/line/food/fruit",
        }}
      />

      <div className="tabs">
        <div className="tab-left">
          <button className="active">อาหารต่างประเทศ</button>
          <button className="add-new" onClick={() => setShowAddSheet(true)}>
            + เพิ่มเมนูใหม่
          </button>
        </div>
        <CartIcon count={cartCount} onClick={() => setShowSheet(true)} />
      </div>

      <FoodGrid foods={filteredFoods} onAdd={addToCart} />

      {showSheet && (
        <CartSheet
          cartItems={cartItems}
          onClose={() => setShowSheet(false)}
          onIncrease={(name) => {
            const updated = cartItems.map((it) =>
              it.name === name ? { ...it, qty: it.qty + 1 } : it
            );
            persist(updated); // ✅ อัปเดต localStorage ด้วย
          }}
          onDecrease={(name) => {
            const updated = cartItems
              .map((it) =>
                it.name === name ? { ...it, qty: it.qty - 1 } : it
              )
              .filter((it) => it.qty > 0);
            persist(updated); // ✅
          }}
          onRemove={(name) => {
            const updated = cartItems.filter((it) => it.name !== name);
            persist(updated); // ✅
          }}
          onSave={handleSaveCart} // ✅ เปลี่ยนจาก router.push เป็นบันทึกจริง
          isSaving={isSaving}     // ✅ ส่งสถานะไปให้ปุ่ม
        />
      )}

      {showAddSheet && (
        <AddFoodSheet
          customFoods={customFoods}
          setCustomFoods={setCustomFoods}
          onAddCustom={addCustomFood}
          onSave={handleSaveNewFood}
          onClose={() => setShowAddSheet(false)}
        />
      )}

      <BottomMenu />

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
        .page {
          background: #f3fdf1;
          min-height: 100vh;
          font-family: 'Noto Sans Thai', sans-serif;
          padding-bottom: 80px;
          margin: 0;
        }
        .search-wrap { position: relative; height: 0; }
        .search-pill {
          position: absolute; top: -45px; left: 50%; transform: translateX(-50%);
          background: #fff; border-radius: 16px; padding: 10px 12px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, .12);
          width: 85%;
        }
        .search-pill input {
          border: none; outline: none; flex: 1;
          background: transparent; font-size: 16px;
        }
        .search-pill input::placeholder { color: #1f2937; opacity: .85; }
        .tabs { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px 16px;margin-top: 20px; }
        .tab-left { display: flex; gap: 8px; align-items: center; }
        .tabs button {
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
          padding: 6px 16px; color: #3abb47; font-weight: 700;
        }
        .tabs .active { background: #3abb47; border: 2px solid #3abb47; color: #fff; }
        .add-new {
          background: #fff; border: 1px dashed #3abb47; color: #000;
          border-radius: 12px; padding: 10px 16px; font-weight: 700;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .add-new:active { transform: scale(0.96); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); }
        .food-grid{
        --card-w: 120px;   
        --card-h: 160px;   /* เพิ่มความสูงขึ้นนิดหน่อย */
        --gap: 8px;        
        --pad: 8px;        
        --img: 70px;       /* เดิม 60px → เพิ่มขนาดรูป */
        --btn: 30px;       /* ขยายปุ่ม + อีกนิด */
        }

      .food-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 คอลัมน์เท่ากัน */
        gap: var(--gap);
        padding: 12px;
        width: 100%;
        max-width: 400px;  /* กำหนดความกว้างสูงสุดถ้าต้องการ */
        margin: 0 auto;    /* จัดกลาง */
        background: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
      }

      .food-grid::-webkit-scrollbar{ display: none; }

      .food-grid::-webkit-scrollbar{
        display: none;                   /* Chrome/Safari ซ่อนสกรอลบาร์ */
      }

      .food-item{
        flex: 0 0 var(--card-w);         /* ความกว้างคงที่ → ต่อกันเป็นแถวเดียว */
        min-height: var(--card-h);
        background: #fff;
        border-radius: 12px;
        text-align: center;
        padding: var(--pad) var(--pad) calc(var(--pad) + var(--btn) + 6px);
        position: relative;
        box-shadow: 0 1px 4px rgba(0,0,0,.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      /* รูปในการ์ด (ถ้าใช้ <Image> ให้ใส่ className="thumb" ที่ wrapper หรือรูป) */
      .food-item img,
      .food-item .thumb{
        width: var(--img);
        height: var(--img);
        object-fit: contain;
        margin: 0 auto 6px;
        display: block;
      }

      .name{ font-size: 14px; font-weight: 700; }
      .calories{ font-size: 13px; color: #555; }

      /* ปุ่ม + มุมล่างขวา */
      .add{
        position: absolute;
        right: 8px;
        bottom: 8px;
        width: var(--btn);
        height: var(--btn);
        border-radius: 50%;
        border: none;
        background: #3abb47;
        color: #fff;
        font-size: 16px;
        line-height: 1;
      }

        .overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, .35); z-index: 1000; animation: fadeIn .15s ease-out; }
        .sheet {
          position: fixed; left: 0; right: 0; bottom: 0; height: 61vh;
          background: #fff; z-index: 1001;
          border-top-left-radius: 18px; border-top-right-radius: 18px;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
          display: flex; flex-direction: column;
          animation: slideUp .2s ease-out;
        }
        .sheet-head { position: relative; padding: 10px 16px 8px; }
        .dragbar { width: 48px; height: 5px; background: #E5E7EB; border-radius: 999px; margin: 0 auto 6px; }
        .title { text-align: center; font-weight: 700; }
        .close {
          position: absolute; top: 6px; right: 10px;
          width: 32px; height: 32px; border-radius: 50%;
          border: none; background: #F3F4F6; font-size: 20px;
        }
        .sheet-list { flex: 1; overflow: auto; padding: 8px 12px 0; }
        .row {
          display: flex; justify-content: space-between; align-items: center;
          background: #F3FAF4; border-radius: 12px; padding: 10px; margin-bottom: 10px;
        }
        .left { display: flex; gap: 10px; align-items: center; }
        .thumb { border-radius: 10px; }
        .meta .r-name { font-weight: 700; font-size: 14px; }
        .meta .r-cal { font-size: 12px; color: #4B5563; }
        .right { display: flex; align-items: center; gap: 8px; }
        .qtybtn { width: 28px; height: 28px; border-radius: 50%; border: none; background: #3abb47; color: #fff; font-size: 18px; }
        .qty { width: 20px; text-align: center; font-weight: 700; }
        .trash { background: transparent; border: none; font-size: 18px; padding: 4px; }
        .empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #8a8a8a; gap: 6px; }
        .sheet-footer { padding: 12px 16px 18px; display: flex; align-items: center; gap: 12px; }
        .total { font-weight: 700; color: #111827; min-width: max-content; }
        .save { flex: 1; height: 44px; border: none; border-radius: 10px; background: #7CAD87; color: #fff; font-weight: 700; }
        .r-cal b { font-weight: 700; }
        .icon-btn { border: none; background: transparent; cursor: pointer; padding: 0; }
        .trash-btn { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 4px rgba(0, 0, 0, .08); }
        .trash-btn:active { transform: scale(0.96); }
        .trash-icon { width: 16px; height: 16px; object-fit: contain; }

        .add-btn, .delete-btn {
          flex-shrink: 0;
          align-self: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
