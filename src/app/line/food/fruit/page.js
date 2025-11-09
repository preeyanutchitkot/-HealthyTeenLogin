'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomMenu from '../../components/menu';
import CartIcon from '../../components/CartIcon';
import CategoryBar from '../../components/CategoryBar';
import Header from '../../components/header';
import FoodGrid from '../../components/FoodGrid';
import CartSheet from '../../components/CartSheet';
import AddFoodSheet from '../../components/AddFoodSheet';
import FoodFooter from '../../components/FoodFooter';
import { saveCartToFirestore } from '../../lib/saveCart';
import { auth } from "../../lib/firebase";
import '../FoodsPage.css';


const fruitMenus = [
  { name: 'แอปเปิ้ล (1 ลูก)', calories: 95, image: '/foods/apple.png' },
  { name: 'กล้วย (1 ผล)', calories: 105, image: '/foods/banana.png' },
  { name: 'แตงโม (1 ชิ้น)', calories: 30, image: '/foods/watermelon.png' },
  { name: 'มะม่วงสุก (1 ผล)', calories: 135, image: '/foods/mango.png' },
  { name: 'สตรอเบอร์รี่ (1 ลูก)', calories: 5, image: '/foods/strawberry.png' },
  { name: 'ชมพู่ (1 ลูก)', calories: 25, image: '/foods/rose-apple.png' },
  { name: 'ฝรั่ง (1 ลูก)', calories: 120, image: '/foods/guava.png' },
  { name: 'สับปะรด (1 ชิ้น)', calories: 45, image: '/foods/pineapple.png' },
  { name: 'ลำไย (1 ลูก)', calories: 10, image: '/foods/longan.png' },
  { name: 'องุ่น (1 ลูก)', calories: 7, image: '/foods/grape.png' },
  { name: 'มังคุด (1 ลูก)', calories: 50, image: '/foods/mangosteen.png' },
  { name: 'เงาะ (1 ลูก)', calories: 7, image: '/foods/rambutan.png' },
  { name: 'ทุเรียน (1 เม็ด)', calories: 150, image: '/foods/durian.png' },
  { name: 'ลิ้นจี่ (1 ลูก)', calories: 16, image: '/foods/lychee.png' },
  { name: 'ลูกพลับ (1 ผล)', calories: 120, image: '/foods/persimmon.png' },
  {
    name: 'มะขามหวาน (10 ฝัก)',
    calories: 180,
    image: '/foods/sweet-tamarind.png',
  },
  {
    name: 'มะพร้าวอ่อน (1 ลูก)',
    calories: 140,
    image: '/foods/young-coconut.png',
  },
  { name: 'แก้วมังกร (1 ลูก)', calories: 60, image: '/foods/dragon-fruit.png' },
  { name: 'พุทรา (1 ลูก)', calories: 6, image: '/foods/jujube.png' },
  { name: 'ลูกแพร์ (1 ลูก)', calories: 100, image: '/foods/pear.png' },
  { name: 'บร็อคโคลี่ (1 ถ้วย)', calories: 55, image: '/foods/broccoli.png' },
  {
    name: 'ผักกาดขาว (1 ถ้วย)',
    calories: 10,
    image: '/foods/chinese-cabbage.png',
  },
  { name: 'แครอท (1 หัว)', calories: 25, image: '/foods/carrot.png' },
  { name: 'ฟักทอง (1 ถ้วย)', calories: 50, image: '/foods/pumpkin.png' },
  { name: 'แตงกวา (1 ลูก)', calories: 15, image: '/foods/cucumber.png' },
  { name: 'มะเขือเทศ (1 ลูก)', calories: 20, image: '/foods/tomato.png' },
  {
    name: 'ถั่วฝักยาว (1 ถ้วย)',
    calories: 35,
    image: '/foods/yardlong-bean.png',
  },
  { name: 'คะน้า (1 ถ้วย)', calories: 30, image: '/foods/chinese-kale.png' },
  { name: 'กะหล่ำปลี (1 ถ้วย)', calories: 20, image: '/foods/cabbage.png' },
  { name: 'ผักโขม (1 ถ้วย)', calories: 40, image: '/foods/spinach.png' },
  {
    name: 'หน่อไม้ฝรั่ง (1 ถ้วย)',
    calories: 25,
    image: '/foods/asparagus.png',
  },
  { name: 'ถั่วงอก (1 ถ้วย)', calories: 30, image: '/foods/bean-sprout.png' },
  {
    name: 'เห็ดฟาง (1 ถ้วย)',
    calories: 35,
    image: '/foods/straw-mushroom.png',
  },
  { name: 'ผักบุ้ง (1 ถ้วย)', calories: 25, image: '/foods/morning-glory.png' },
  { name: 'ข้าวโพดอ่อน (1 ถ้วย)', calories: 55, image: '/foods/baby-corn.png' },
  { name: 'มันฝรั่ง (1 หัว)', calories: 110, image: '/foods/potato.png' },
];

export default function fruitMenusPage() {
  const [foods, setFoods] = useState(fruitMenus);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [customFoods, setCustomFoods] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cartItems');
      if (raw) setCartItems(JSON.parse(raw));
    } catch (_) {}
  }, []);

  useEffect(() => {
    const totalQty = cartItems.reduce(
      (sum, it) => sum + (Number(it.qty) || 0),
      0
    );
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
    localStorage.setItem('cartItems', JSON.stringify(items));
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
      localStorage.setItem('cartItems', JSON.stringify(updated));
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

    // 1) บันทึกลง Firestore
    await saveCartToFirestore(cartItems);

    // 2) ส่งข้อมูลให้ n8n
    if (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: auth.currentUser.uid,
          source: "healthyteen-app"
        }),
      });
    }

    // 3) ล้างตะกร้า + redirect
    persist([]);
    setShowSheet(false);
    router.replace('/line/food/cart');

  } catch (err) {
    console.error(err);
    alert(err?.message || 'บันทึกล้มเหลว');
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
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>
      </div>

      <CategoryBar
      backgroundColor="#f3fdf1"
        categories={[
          { name: 'อาหารคาว', icon: '/food1.png' },
          { name: 'อาหารหวาน', icon: '/food2.png' },
          { name: 'ของว่าง', icon: '/food4.png' },
          { name: 'อาหารเจ', icon: '/jfood7.png' },
          { name: 'อาหารต่างประเทศ', icon: '/food5.png' },
          { name: 'เครื่องดื่ม', icon: '/food3.png' },
          { name: 'ผักและผลไม้', icon: '/food6.png' },
        ]}
        categoryPathMap={{
          อาหารคาว: '/line/food/savory',
          อาหารหวาน: '/line/food/sweet',
          ของว่าง: '/line/food/snack',
          อาหารเจ: '/line/food/J',
          อาหารต่างประเทศ: '/line/food/Foreign',
          เครื่องดื่ม: '/line/food/drink',
          ผักและผลไม้: '/line/food/fruit',
        }}
      />

      <div className="tabs">
        <div className="tab-left">
          <button className="active">ผักและผลไม้</button>
          <button className="add-new" onClick={() => setShowAddSheet(true)}>
            + เพิ่มเมนูใหม่
          </button>
        </div>
        <CartIcon count={cartCount} onClick={() => setShowSheet(true)} />
      </div>

      <FoodGrid foods={filteredFoods} onAdd={addToCart} layout="grid" />


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

      <FoodFooter />
      <BottomMenu />
    </div>
  );
}
