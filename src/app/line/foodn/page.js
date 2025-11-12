'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomMenu from '../components/menu';
import CartIcon from '../components/CartIcon';
import CategoryBar from '../components/CategoryBar';
import Header from '../components/header';
import FoodGrid from '../components/FoodGrid';
import CartSheet from '../components/CartSheet';
import FoodFooter from '../components/FoodFooter';
import { saveCartToFirestore } from '../lib/saveCart';
import { auth } from "../lib/firebase";
import styles from './FoodsPage.module.css';

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
];

const veganFoods = [
  { name: "เต้าหู้ทอด", calories: 100, image: "/foods/fried-tofu.png" },
  { name: "ผัดหมี่เจ", calories: 250, image: "/foods/vegetarian-fried-noodle.png" },
  { name: "ข้าวผัดเจ", calories: 300, image: "/foods/vegetarian-fried-rice.png" },
  { name: "แกงเขียวหวานเจ", calories: 180, image: "/foods/vegetarian-green-curry.png" },
  { name: "ซาลาเปาไส้เผือก", calories: 180, image: "/foods/taro-steamed-bun.png" },
  { name: "ปอเปี๊ยะสดเจ", calories: 120, image: "/foods/vegetarian-fresh-spring-roll.png" },
  { name: "ต้มจับฉ่ายเจ", calories: 90, image: "/foods/vegetarian-mixed-vegetable-soup.png" },
  { name: "เห็ดทอดเจ", calories: 150, image: "/foods/vegetarian-fried-mushroom.png" },
];

const foreignFoods = [
  { name: "พิซซ่า (1 ชิ้น)", calories: 280, image: "/foods/pizza.png" },
  { name: "สปาเกตตี้คาโบนารา", calories: 400, image: "/foods/spaghetti-carbonara.png" },
  { name: "เบอร์ริโต", calories: 290, image: "/foods/burrito.png" },
  { name: "ซูชิ (1 คำ)", calories: 40, image: "/foods/sushi.png" },
  { name: "สเต็กเนื้อ (100 กรัม)", calories: 25, image: "/foods/beef-steak.png" },
  { name: "นาโชส์ (1 ถุงเล็ก)", calories: 150, image: "/foods/nachos.png" },
  { name: "ไก่ย่างบาร์บีคิว (1 ชิ้น)", calories: 250, image: "/foods/bbq-chicken.png" },
  { name: "ข้าวผัดญี่ปุ่น", calories: 280, image: "/foods/japanese-fried-rice.png" },
];

const drinkFoods = [
  { name: "น้ำเปล่า", calories: 0, image: "/foods/water.png" },
  { name: "น้ำส้มคั้น", calories: 100, image: "/foods/orange-juice.png" },
  { name: "โค้ก", calories: 150, image: "/foods/coke.png" },
  { name: "อเมริกาโน่", calories: 10, image: "/foods/americano.png" },
  { name: "น้ำมะนาว", calories: 90, image: "/foods/lemonade.png" },
  { name: "น้ำแตงโมปั่น", calories: 250, image: "/foods/watermelon-smoothie.png" },
  { name: "นมสดเย็น", calories: 370, image: "/foods/cold-milk.png" },
  { name: "ชานมไข่มุก", calories: 450, image: "/foods/bubble-tea.png" },
];

const fruitVeggies = [
  { name: "กล้วย (1 ผล)", calories: 105, image: "/foods/banana.png" },
  { name: "แตงโม (1 ชิ้น)", calories: 30, image: "/foods/watermelon.png" },
  { name: "แอปเปิ้ล (1 ลูก)", calories: 90, image: "/foods/apple.png" },
  { name: "มะม่วงสุก (1 ผล)", calories: 135, image: "/foods/mango.png" },
  { name: "สับปะรด (1 ชิ้น)", calories: 45, image: "/foods/pineapple.png" },
  { name: "ลำไย (1 ลูก)", calories: 46, image: "/foods/longan.png" },
  { name: "เงาะ (1 ลูก)", calories: 85, image: "/foods/rambutan.png" },
  { name: "ลูกพลับ (1 ผล)", calories: 89, image: "/foods/persimmon.png" },
];

export default function FoodsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState('');
  const cartRef = useRef(null);
  const bannerScrollRef = useRef(null);
  const router = useRouter();

  const banners = ['/banner2.jpg', '/banner1.jpg', '/S__9256971.jpg', '/S__36593668.jpg'];

  // Banner infinite scroll setup
  useEffect(() => {
    const scrollContainer = bannerScrollRef.current;
    if (!scrollContainer) return;

    // Handle seamless loop when user scrolls
    const handleScroll = () => {
      if (!scrollContainer) return;
      
      const itemWidth = 332; // 320px width + 12px gap
      const totalWidth = itemWidth * banners.length;
      
      // When scrolled past the first set, jump to second set
      if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft = totalWidth;
      }
      // When scrolled past the second set, jump back to first set
      else if (scrollContainer.scrollLeft >= totalWidth * 2) {
        scrollContainer.scrollLeft = totalWidth;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Start in the middle position
    const itemWidth = 332;
    scrollContainer.scrollLeft = itemWidth * banners.length;

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [banners.length]);

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setCartCount(cartItems.reduce((sum, it) => sum + (Number(it.qty) || 0), 0));
  }, [cartItems]);

  const persist = (next) => {
    setCartItems(next);
    localStorage.setItem('cartItems', JSON.stringify(next));
  };

  const filteredSavory = useMemo(
    () => savoryFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredSweets = useMemo(
    () => sweetFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredSnacks = useMemo(
    () => snackFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredVegan = useMemo(
    () => veganFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredForeign = useMemo(
    () => foreignFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredDrinks = useMemo(
    () => drinkFoods.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredFruitVeggies = useMemo(
    () => fruitVeggies.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  
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

  return (
    <div className={styles.page}>
      <Header title="บันทึกอาหาร" cartoonImage="/8.png" />

      <div className={styles.searchWrap}>
        <div className={styles.searchPill}>
          <Image src="/search.png" alt="ค้นหา" width={23} height={23} />
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href="/line/food/cart">
            <Image src="/character.png" alt="character" width={26} height={26} />
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

      {/* Banner */}
      <div className={styles.foodBannerScroll} ref={bannerScrollRef}>
        <div className={styles.foodBannerTrack}>
          {[...banners, ...banners, ...banners].map((banner, idx) => (
            <Image 
              key={idx}
              src={banner} 
              alt="banner" 
              width={320} 
              height={160} 
              className={styles.foodBannerImg}
              onClick={() => {
                setSelectedBanner(banner);
                setShowBannerModal(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div 
          className={styles.bannerModal}
          onClick={() => setShowBannerModal(false)}
        >
          <div className={styles.bannerModalContent}>
            <Image 
              src={selectedBanner} 
              alt="banner" 
              width={800} 
              height={400} 
              className={styles.bannerModalImg}
            />
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>อาหารคาว</h3>
        </div>
        <CartIcon ref={cartRef} count={cartCount} onClick={() => setShowSheet(true)} />
      </div>
      <FoodGrid foods={filteredSavory} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>อาหารหวาน</h3>
        </div>
      </div>
      <FoodGrid foods={filteredSweets} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>ของว่าง</h3>
        </div>
      </div>
      <FoodGrid foods={filteredSnacks} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>อาหารเจ</h3>
        </div>
      </div>
      <FoodGrid foods={filteredVegan} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>อาหารต่างประเทศ</h3>
        </div>
      </div>
      <FoodGrid foods={filteredForeign} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>เครื่องดื่ม</h3>
        </div>
      </div>
      <FoodGrid foods={filteredDrinks} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

      <div className={styles.tabs}>
        <div className={styles.tabLeft}>
          <h3 className={styles.sectionTitle}>ผักและผลไม้</h3>
        </div>
      </div>
      <FoodGrid foods={filteredFruitVeggies} onAdd={addToCart} layout="horizontal" cartRef={cartRef} />

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
          onSave={async () => {
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
                    uid: auth.currentUser?.uid,
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
          }}
          isSaving={isSaving}
        />
      )}

      <FoodFooter />
      <BottomMenu />
    </div>
  );
}
