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
  { name: "วุ้นกะทิ", calories: 150, image: "/foods/woon-kati.png" },
  { name: "เค้กช็อกโกแลต", calories: 450, image: "/foods/chocolate-cake.png" },
  { name: "บราวนี่", calories: 400, image: "/foods/brownie.png" },
  { name: "ขนมปังสังขยา", calories: 250, image: "/foods/khanom-pang-sangkaya.png" },
  { name: "โรตีใส่นม", calories: 350, image: "/foods/roti-sai-nom.png" },
  { name: "โรตีโอวัลติน", calories: 370, image: "/foods/roti-ovaltine.png" },
  { name: "เค้กกล้วยหอม", calories: 280, image: "/foods/banana-cake.png" },
  { name: "ขนมต้ม", calories: 200, image: "/foods/khanom-tom.png" },
  { name: "ขนมกล้วย", calories: 220, image: "/foods/khanom-kluai.png" },
  { name: "ขนมถ้วย", calories: 150, image: "/foods/khanom-tuay.png" },
];

export default function SweetFoodsPage() {
  const [foods, setFoods] = useState(sweetFoods);
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
          <button className="active">อาหารหวาน</button>
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
