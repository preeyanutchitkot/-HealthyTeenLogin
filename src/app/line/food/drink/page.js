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

const drinkMenus = [
  { name: 'น้ำส้มคั้น', calories: 100, image: '/foods/orange-juice.png' },
  { name: 'โค้ก', calories: 150, image: '/foods/coke.png' },
  { name: 'น้ำเปล่า', calories: 0, image: '/foods/water.png' },
  { name: 'อเมริกาโน่', calories: 10, image: '/foods/americano.png' },
  { name: 'ลาเต้ร้อน', calories: 150, image: '/foods/hot-latte.png' },
  { name: 'น้ำมะนาว', calories: 90, image: '/foods/lemonade.png' },
  { name: 'น้ำแตงโมปั่น', calories: 250, image: '/foods/watermelon-smoothie.png' },
  { name: 'นมสดเย็น', calories: 370, image: '/foods/cold-milk.png' },
  { name: 'ชานมไข่มุก', calories: 450, image: '/foods/bubble-tea.png' },
  { name: 'ชาเขียวเย็น', calories: 200, image: '/foods/iced-green-tea.png' },
  { name: 'เอสเพรสโซ่', calories: 5, image: '/foods/espresso.png' },
  { name: 'คาปูชิโน่', calories: 120, image: '/foods/cappuccino.png' },
  { name: 'น้ำองุ่น', calories: 110, image: '/foods/grape-juice.png' },
  { name: 'น้ำแครอท', calories: 80, image: '/foods/carrot-juice.png' },
  { name: 'น้ำมะพร้าว', calories: 45, image: '/foods/coconut-water.png' },
  { name: 'น้ำแอปเปิ้ล', calories: 95, image: '/foods/apple-juice.png' },
  { name: 'ชาเย็น', calories: 250, image: '/foods/thai-iced-tea.png' },
  { name: 'โกโก้เย็น', calories: 300, image: '/foods/iced-cocoa.png' },
  { name: 'สมูทตี้สตรอเบอร์รี่', calories: 200, image: '/foods/strawberry-smoothie.png' },

  ];

export default function drinkMenusPage() {
  const [foods, setFoods] = useState(drinkMenus);
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
          <button className="active">เครื่องดื่ม</button>
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
