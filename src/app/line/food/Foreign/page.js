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
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (raw) setCartItems(JSON.parse(raw));
    } catch (_) {}
  }, []);

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
              .filter((it) => it.qty > 0); // กรองออกถ้าต่ำกว่า 0
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
