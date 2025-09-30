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
import { saveCartToFirestore } from '../../lib/saveCart';
import '../FoodsPage.css';

const snackFoods = [
  { name: 'ขนมครก', calories: 180, image: '/foods/khanom-khrok.png' },
  { name: 'หมูปิ้ง', calories: 75, image: '/foods/moo-ping-3.png' },
  { name: 'ลูกชิ้นปิ้ง', calories: 25, image: '/foods/look-chin-ping-5.png' },
  { name: 'เฉาก๊วย', calories: 120, image: '/foods/chao-kuai.png' },
  { name: 'ข้าวโพดปิ้ง', calories: 100, image: '/foods/khao-phot-ping.png' },
  { name: 'กล้วยทอด', calories: 250, image: '/foods/kluai-thot.png' },
  { name: 'มันทอด', calories: 150, image: '/foods/man-thot.png' },
  { name: 'ถั่วทอด', calories: 200, image: '/foods/thua-thot.png' },
  { name: 'เกี๊ยวทอด', calories: 190, image: '/foods/kiao-thot.png' },
  {
    name: 'ปลาเส้นทอดกรอบ',
    calories: 140,
    image: '/foods/pla-sen-thot-krop.png',
  },
  { name: 'แหนมหม้อ', calories: 180, image: '/foods/naem-mor.png' },
  { name: 'ปอเปี๊ยะทอด', calories: 200, image: '/foods/por-pia-thot.png' },
  { name: 'ไส้กรอกอีสาน', calories: 250, image: '/foods/sai-krok-isan.png' },
  { name: 'หอยทอด', calories: 300, image: '/foods/hoi-thot.png' },
  { name: 'ข้าวเกรียบ', calories: 200, image: '/foods/khao-kriap.png' },
  { name: 'เต้าหู้ทอด', calories: 120, image: '/foods/tao-hu-thot.png' },
  { name: 'ปลาหมึกบด', calories: 150, image: '/foods/pla-muek-bot.png' },
  {
    name: 'มันฝรั่งทอดกรอบ (1 ถุง)',
    calories: 150,
    image: '/foods/potato-chips.png',
  },
  { name: 'ป๊อปคอร์น (1 ถ้วย)', calories: 55, image: '/foods/popcorn.png' },
  {
    name: 'ขนมปังโฮลวีต (1 แผ่น)',
    calories: 70,
    image: '/foods/whole-wheat-bread.png',
  },
  {
    name: 'โยเกิร์ตผลไม้ (1 ถ้วย)',
    calories: 120,
    image: '/foods/fruit-yogurt.png',
  },
  {
    name: 'คุกกี้เนย (1 ชิ้น)',
    calories: 150,
    image: '/foods/butter-cookie.png',
  },
  {
    name: 'ข้าวเกรียบกุ้ง (1 แผ่น)',
    calories: 60,
    image: '/foods/shrimp-cracker.png',
  },
  { name: 'ขนมปังกรอบ', calories: 100, image: '/foods/crispy-bread.png' },
];

export default function snackFoodsPage() {
  const [foods, setFoods] = useState(snackFoods);
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
      await saveCartToFirestore(cartItems);
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
          <button className="active">ของว่าง</button>
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
