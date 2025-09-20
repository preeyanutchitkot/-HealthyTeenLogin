"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BottomMenu from "../components/menu";
import CartIcon from "../components/CartIcon";
import CategoryBar from "../components/CategoryBar";
import Header from "../components/header";
import FoodGrid from "../components/FoodGrid";
import CartSheet from "../components/CartSheet";
import { saveCartToFirestore } from "../lib/saveCart";
import "./FoodsPage.module.css";

const savoryFoods = [
  { name: "ข้าวกะเพราไก่ไข่ดาว", calories: 630, image: "/foods/khao-krapao-kai-kai-dao.png" },
  { name: "ข้าวผัดหมู", calories: 590, image: "/foods/khao-pad-moo.png" },
  { name: "ข้าวมันไก่", calories: 700, image: "/foods/khao-man-kai.png" },
  { name: "ข้าวราดแกงเขียวหวานไก่", calories: 600, image: "/foods/khao-rad-kaeng-kiew-wan-kai.png" },
  { name: "ผัดไทยกุ้งสด", calories: 550, image: "/foods/pad-thai-kung-sod.png" },
  { name: "ข้าวคลุกกะปิ", calories: 450, image: "/foods/khao-kluk-kapi.png" },
  { name: "ข้าวหน้าเป็ด", calories: 520, image: "/foods/khao-na-ped.png" },
  { name: "ข้าวแกงกะหรี่ไก่", calories: 610, image: "/foods/khao-kaeng-karee-kai.png" },
  { name: "โรตีหมูสับไข่", calories: 540, image: "/foods/roti-moo-sap-kai.png" },
];

const sweetFoods = [
  { name: "ทับทิมกรอบ", calories: 200, image: "/foods/tub-tim-krob.png" },
  { name: "ขนมชั้น", calories: 220, image: "/foods/khanom-chan.png" },
  { name: "บัวลอย", calories: 240, image: "/foods/bua-loi.png" },
  { name: "ข้าวเหนียวมะม่วง", calories: 330, image: "/foods/khao-niew-mamuang.png" },
  { name: "ลูกชุบ", calories: 150, image: "/foods/look-chup.png" },
  { name: "เครปเค้ก", calories: 350, image: "/foods/crepe-cake.png" },
  { name: "พายสัปปะรด", calories: 270, image: "/foods/pineapple-pie.png" },
  { name: "ชีสเค้ก", calories: 400, image: "/foods/cheesecake.png" },
  { name: "ทองหยิบ", calories: 210, image: "/foods/thong-yip.png" },
  { name: "ฝอยทอง", calories: 180, image: "/foods/foi-thong.png" },
];

const snackFoods = [
  { name: "ขนมครก", calories: 180, image: "/foods/khanom-khrok.png" },
  { name: "หมูปิ้ง ", calories: 75, image: "/foods/moo-ping-3.png" },
  { name: "ลูกชิ้นปิ้ง", calories: 25, image: "/foods/look-chin-ping-5.png" },
  { name: "เฉาก๊วย", calories: 120, image: "/foods/chao-kuai.png" },
  { name: "ไข่ตุ๋น", calories: 120, image: "/foods/kai-tun.png" },
  { name: "ข้าวโพดปิ้ง", calories: 100, image: "/foods/khao-phot-ping.png" },
  { name: "กล้วยทอด", calories: 250, image: "/foods/kluai-thot.png" },
  { name: "มันทอด", calories: 150, image: "/foods/man-thot.png" },
  { name: "ถั่วทอด", calories: 200, image: "/foods/thua-thot.png" },
  { name: "เกี๊ยวทอด", calories: 190, image: "/foods/kiao-thot.png" },
];

export default function FoodsPage() {
  const [foods, setFoods] = useState(sweetFoods);
  const [snacks, setSnacks] = useState(snackFoods);
  const [savoryFoodsState, setSavoryFoods] = useState(savoryFoods);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, it) => sum + it.qty, 0);
    setCartCount(total);
  }, [cartItems]);


  const persist = (next) => {
    setCartItems(next);
    try {
      localStorage.setItem("cartItems", JSON.stringify(next));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  };

  const filteredFoods = useMemo(
    () => foods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [foods, searchQuery]
  );
  const filteredSnacks = useMemo(
    () => snacks.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [snacks, searchQuery]
  );
  const filteredSavoryFoods = useMemo(
    () => savoryFoodsState.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [savoryFoodsState, searchQuery]
  );

  const roundHalf = (n) => Math.round(n * 2) / 2;

  const addToCart = (food) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.name === food.name);
      const updated =
        idx === -1
          ? [...prev, { ...food, qty: 1 }] // ✅ ครั้งแรก = 1
          : prev.map((it, i) =>
              i === idx ? { ...it, qty: roundHalf(it.qty + 0.5) } : it
            );
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (name) =>
    setCartItems((prev) => prev.filter((it) => it.name !== name));

  const handleSaveCart = async () => {
    try {
      if (!cartItems.length) return;
      setIsSaving(true);
      await saveCartToFirestore(cartItems);
      persist([]);
      setShowSheet(false);
      router.replace("/line/food/cart");
    } catch (err) {
      console.error(err);
      alert(err?.message || "บันทึกล้มเหลว");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page foods-page">
      <Header title="บันทึกอาหาร" cartoonImage="/8.png" />

      {/* Search */}
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
            <Image
              src="/character.png"
              alt="ตัวการ์ตูน"
              width={26}
              height={26}
              style={{ cursor: "pointer" }}
            />
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

      {/* อาหารคาว */}
      <div className="tabs">
        <div className="tab-left">
          <button className="active">อาหารคาว</button>
        </div>
        <CartIcon count={cartCount} onClick={() => setShowSheet(true)} />
      </div>
      <FoodGrid foods={filteredSavoryFoods} onAdd={addToCart} />

      {/* อาหารหวาน */}
      <div className="tabs">
        <div className="tab-left">
          <button className="active">อาหารหวาน</button>
        </div>
      </div>
      <FoodGrid foods={filteredFoods} onAdd={addToCart} />

      {/* ของว่าง */}
      <div className="tabs">
        <div className="tab-left">
          <button className="active">ของว่าง</button>
        </div>
      </div>
      <FoodGrid foods={filteredSnacks} onAdd={addToCart} />

      {/* CartSheet */}
      {showSheet && (
        <>
          <div className="overlay" onClick={() => setShowSheet(false)} />
          <CartSheet
            cartItems={cartItems}
            onClose={() => setShowSheet(false)}
            onIncrease={(name, step = 0.5) => {
              const updated = cartItems.map((it) =>
                it.name === name
                  ? { ...it, qty: Math.round((it.qty + step) * 2) / 2 }
                  : it
              );
              persist(updated);
            }}
            onDecrease={(name, step = 0.5) => {
              const updated = cartItems
                .map((it) =>
                  it.name === name
                    ? { ...it, qty: Math.max(0, Math.round((it.qty - step) * 2) / 2) }
                    : it
                )
                .filter((it) => it.qty > 0);
              persist(updated);
            }}
            onRemove={(name) => {
              const updated = cartItems.filter((it) => it.name !== name);
              persist(updated);
            }}
            onSave={handleSaveCart}
            isSaving={isSaving}
          />
        </>
      )}

      <BottomMenu />
    </div>
  );
}
