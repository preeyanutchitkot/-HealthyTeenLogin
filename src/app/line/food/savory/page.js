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
import "../FoodsPage.css";

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
  { name: "ข้าวผัดกุ้ง", calories: 520, image: "/foods/khao-pad-kung.png" },
  { name: "ข้าวไข่เจียว", calories: 400, image: "/foods/khao-kai-jiew.png" },
  { name: "ข้าวซอยไก่", calories: 480, image: "/foods/khao-soi-kai.png" },
  { name: "ข้าวหมกไก่", calories: 520, image: "/foods/khao-mok-kai.png" },
  { name: "ข้าวกล่องไก่ย่าง", calories: 450, image: "/foods/khao-klong-kai-yang.png" },
  { name: "บะหมี่หมูแดง", calories: 450, image: "/foods/ba-mee-moo-daeng.png" },
  { name: "ก๋วยเตี๋ยว", calories: 350, image: "/foods/kuay-tiew-lord.png" },
  { name: "ข้าวคั่วกลิ้งหมูกรอบ", calories: 600, image: "/foods/khao-kua-kling-moo-krob.png" },
  { name: "ข้าวต้มปลา", calories: 180, image: "/foods/khao-tom-pla.png" },
  { name: "ส้มตำ", calories: 180, image: "/foods/som-tam.png" },
];

export default function savoryFoodsPage() {
  const [foods, setFoods] = useState(savoryFoods);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [customFoods, setCustomFoods] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (raw) setCartItems(JSON.parse(raw));
    } catch (_) {}
  }, []);

  useEffect(() => {
    const totalQty = cartItems.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    setCartCount(Math.floor(totalQty));
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
    localStorage.setItem("cartItems", JSON.stringify(items));
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
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomFood = (foodItem) => {
    setCustomFoods((prev) => [foodItem, ...prev]);
  };

  const handleSaveNewFood = () => setShowAddSheet(false);

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

      <div className="tabs">
        <div className="tab-left">
          <button className="active">อาหารคาว</button>
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
          onIncrease={(name, step = 1) => {
            const updated = cartItems.map((it) =>
              it.name === name ? { ...it, qty: it.qty + step } : it
            );
            persist(updated);
          }}
          onDecrease={(name, step = 1) => {
            const updated = cartItems
              .map((it) =>
                it.name === name ? { ...it, qty: it.qty - step } : it
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
    </div>
  );
}
