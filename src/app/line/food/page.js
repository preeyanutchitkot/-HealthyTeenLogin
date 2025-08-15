'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import BottomMenu from '../components/menu';

const categories = [
  { name: 'อาหารคาว', icon: '/icons/savory.png' },
  { name: 'อาหารหวาน', icon: '/icons/sweet.png' },
  { name: 'ของว่าง', icon: '/icons/snack.png' },
  { name: 'อาหารคลีน', icon: '/icons/clean.png' },
  { name: 'อาหารเจ', icon: '/icons/Jfood.png' },
  { name: 'อาหารต่างประเทศ', icon: '/icons/Foreign.png' },
  { name: 'เครื่องดื่ม', icon: '/icons/drink.png' },
  { name: 'เครื่องดื่มแอลกอฮอล์', icon: '/icons/alcohol.png' },
  { name: 'ผักและผลไม้', icon: '/icons/fruit.png' },
  { name: 'เนื้อสัตว์', icon: '/icons/meat.png' },
  { name: 'ซอสและเครื่องปรุง', icon: '/icons/sauce.png' },
];

// เส้นทางสำหรับแต่ละหมวด (แก้ให้ตรงกับโครง routes ของโปรเจกต์)
const categoryPathMap = {
  'อาหารคาว': '/foods/savory',
  'อาหารหวาน': '/foods/sweet',
  'ของว่าง': '/foods/snack',
  'อาหารคลีน': '/foods/clean',
  'อาหารเจ': '/foods/j-veg',
  'อาหารต่างประเทศ': '/foods/foreign',
  'เครื่องดื่ม': '/foods/drinks',
  'เครื่องดื่มแอลกอฮอล์': '/foods/alcohol',
  'ผักและผลไม้': '/foods/produce',
  'เนื้อสัตว์': '/foods/meat',
  'ซอสและเครื่องปรุง': '/foods/condiments',
};

const savoryFoods = [
  // ตัวอย่าง: { name: 'ข้าวผัดหมู', calories: 400, image: '/foods/fried-rice.png' },
];

const sweetFoods = [
  // ตัวอย่าง: { name: 'บัวลอย', calories: 250, image: '/foods/boiloy.png' },
];

export default function FoodLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const handleAdd = () => setCartCount((prev) => prev + 1);

  const filterFoods = (foods) =>
    foods.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // รวมเมนูทั้งหมดไว้ค้นหาในอนาคต (ถ้าต้องการ)
  const allFoods = useMemo(() => [...savoryFoods, ...sweetFoods], []);

  return (
    <div className="page">
      <div className="topbar">
        <Link href="/line/home" className="back-btn" aria-label="ย้อนกลับ" />
        <h1>บันทึกอาหาร</h1>
        <Image src="/pig-icon.png" alt="icon" width={30} height={30} />
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="ค้นหาเมนู…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="ค้นหาเมนูอาหาร"
        />
        <Link className="cart" href="/cart" aria-label="ตะกร้าอาหาร">
          <Image src="/icons/cart.png" alt="cart" width={18} height={18} />
          {cartCount}
        </Link>
      </div>

      {/* แถบหมวดหมู่: คลิกแล้วไปหน้าหมวดตาม path map */}
      <nav className="category-scroll" aria-label="หมวดหมู่อาหาร">
        {categories.map((c) => {
          const href = categoryPathMap[c.name] ?? '#';
          return (
            <Link key={c.name} href={href} className="category-item">
              <div className="category-icon">
                <Image src={c.icon} alt={c.name} width={40} height={40} />
              </div>
              <span>{c.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* แบนเนอร์ (เลื่อนแนวนอน + responsive) */}
      <div className="banner-wrapper" aria-label="โปรโมชัน">
        <div className="banner-scroll">
          <div className="banner">
            <Image src="/banners/100kcal.png" alt="100 kcal tips" fill sizes="(max-width: 768px) 90vw, 600px" />
          </div>
          <div className="banner">
            <Image src="/banners/banner2.png" alt="banner2" fill sizes="(max-width: 768px) 90vw, 600px" />
          </div>
          <div className="banner">
            <Image src="/banners/banner3.png" alt="banner3" fill sizes="(max-width: 768px) 90vw, 600px" />
          </div>
        </div>
      </div>

      {/* Section: อาหารคาว */}
      <section className="section">
        <h2>อาหารคาว</h2>
        <div className="food-grid">
          {filterFoods(savoryFoods).map((f) => (
            <article key={f.name} className="food-item">
              {/* คลิกการ์ดไปหน้ารายละเอียดเมนู */}
              <Link href={`/food/${encodeURIComponent(f.name)}`} className="food-link" aria-label={`ดูรายละเอียด ${f.name}`}>
                <div className="thumb">
                  <Image src={f.image} alt={f.name} fill sizes="(max-width: 768px) 35vw, 180px" />
                </div>
                <div className="food-name">{f.name}</div>
                <div className="cal">{f.calories} แคลอรี่</div>
              </Link>
              <button className="add-btn" onClick={handleAdd} aria-label={`เพิ่ม ${f.name} ลงตะกร้า`}>+</button>
            </article>
          ))}
        </div>
      </section>

      {/* Section: อาหารหวาน */}
      <section className="section">
        <h2>อาหารหวาน</h2>
        <div className="food-grid">
          {filterFoods(sweetFoods).map((f) => (
            <article key={f.name} className="food-item">
              <Link href={`/food/${encodeURIComponent(f.name)}`} className="food-link" aria-label={`ดูรายละเอียด ${f.name}`}>
                <div className="thumb">
                  <Image src={f.image} alt={f.name} fill sizes="(max-width: 768px) 35vw, 180px" />
                </div>
                <div className="food-name">{f.name}</div>
                <div className="cal">{f.calories} แคลอรี่</div>
              </Link>
              <button className="add-btn" onClick={handleAdd} aria-label={`เพิ่ม ${f.name} ลงตะกร้า`}>+</button>
            </article>
          ))}
        </div>
      </section>

      <BottomMenu />

      <style jsx>{`
        :root{
          --brand:#3abb47;
          --bg:#f3fdf1;
          --card:#ffffff;
          --text:#1f2937;
          --muted:#64748b;
          --shadow:0 1px 6px rgba(0,0,0,.1);
          --radius:14px;
          --maxw:1100px;
        }

        .page{
          background:var(--bg);
          min-height:100svh;
          padding-bottom:88px;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .topbar{
          width:100%;
          max-width:var(--maxw);
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:12px 16px;
          background:var(--brand);
          color:#fff;
          position:sticky;
          top:0;
          z-index:20;
        }

        .back-btn{
          width:28px; height:28px; border-radius:999px; background:rgba(255,255,255,.2);
          display:inline-block;
        }

        .search-box{
          width:100%;
          max-width:var(--maxw);
          display:flex; align-items:center; gap:10px;
          padding:12px 16px;
          background:var(--brand);
        }
        .search-box input{
          flex:1; padding:12px 16px; border-radius:999px; border:1px solid #e5e7eb;
          font-size:clamp(14px,2vw,16px);
        }
        .cart{
          display:flex; align-items:center; gap:6px;
          background:#fff; color:var(--brand); font-weight:700;
          padding:8px 12px; border-radius:999px; box-shadow:var(--shadow);
        }

        .category-scroll{
          width:100%; max-width:var(--maxw);
          display:flex; gap:16px; overflow-x:auto; padding:12px 16px; background:#f7fff3;
          scroll-snap-type:x mandatory;
        }
        .category-item{
          min-width:88px; scroll-snap-align:center;
          display:flex; flex-direction:column; align-items:center; gap:6px;
          text-align:center; font-size:12px; color:var(--text); text-decoration:none;
        }
        .category-icon{
          width:52px; height:52px; background:#fff; border-radius:12px; box-shadow:var(--shadow);
          display:grid; place-items:center;
        }

        .banner-wrapper{ width:100%; max-width:var(--maxw); overflow-x:auto; margin:12px 0; }
        .banner-scroll{ display:flex; gap:12px; padding:0 16px; }
        .banner{
          position:relative; width:min(90vw, 600px); height:110px; border-radius:16px; overflow:hidden; background:#e5ffe9; box-shadow:var(--shadow);
          flex:0 0 auto;
        }

        .section{ width:100%; max-width:var(--maxw); padding:8px 16px; }
        .section h2{
          color:var(--brand); font-size:clamp(16px,2.6vw,18px); margin:8px 0 12px;
        }

        /* Responsive Grid: auto-fit ปรับจำนวนคอลัมน์ตามจอ */
        .food-grid{
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap:12px;
        }
        @media (min-width:480px){
          .food-grid{ gap:14px; }
        }
        @media (min-width:768px){
          .food-grid{ grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:16px; }
        }

        .food-item{
          background:var(--card); border-radius:var(--radius); padding:10px; position:relative; box-shadow:var(--shadow);
          display:flex; flex-direction:column; align-items:center; gap:6px;
        }
        .food-link{ text-decoration:none; color:inherit; width:100%; display:flex; flex-direction:column; align-items:center; gap:6px; }
        .thumb{ position:relative; width:100%; height:110px; border-radius:12px; overflow:hidden; background:#f0fdf4; }
        .food-name{ font-size:clamp(13px,2.2vw,14px); font-weight:600; text-align:center; line-height:1.2; min-height:2.4em; }
        .cal{ color:var(--brand); font-weight:700; font-size:clamp(12px,2vw,13px); }

        .add-btn{
          position:absolute; bottom:10px; right:10px;
          border:none; background:var(--brand); color:#fff; width:28px; height:28px; border-radius:999px; font-size:18px;
          display:grid; place-items:center; cursor:pointer;
        }

        /* Desktop spacing */
        @media (min-width:1024px){
          .topbar, .search-box{ border-radius:0 0 16px 16px; }
          .section{ padding:16px; }
          .banner{ height:140px; }
        }
      `}</style>
    </div>
  );
}
