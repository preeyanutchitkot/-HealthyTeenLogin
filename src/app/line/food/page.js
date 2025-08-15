'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

const savoryFoods = [
  //{ name: 'ข้าวผัดหมู', calories: 400, image: '/foods/fried-rice.png' },
  //{ name: 'ต้มยำกุ้ง', calories: 150, image: '/foods/tomyam.png' },
//  { name: 'แกงเขียวหวานไก่', calories: 300, image: '/foods/green-curry.png' },
];

const sweetFoods = [
//  { name: 'บัวลอย', calories: 250, image: '/foods/boiloy.png' },
//  { name: 'ไอศกรีม', calories: 180, image: '/foods/icecream.png' },
//  { name: 'ช็อกโกแลต', calories: 300, image: '/foods/chocolate.png' },
];

export default function FoodLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const handleAdd = () => {
    setCartCount((prev) => prev + 1);
  };

  const filterFoods = (foods) =>
    foods.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page">
      <div className="topbar">
        <Link href="/line/home" className="back-btn"></Link>
        <h1>บันทึกอาหาร</h1>
        <Image src="/pig-icon.png" alt="icon" width={30} height={30} />
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="ค้นหา"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="cart">
          <Image src="/icons/cart.png" alt="cart" width={18} height={18} />
          {cartCount}
        </div>
      </div>

      <div className="category-scroll">
        {categories.map((c) => (
          <div key={c.name} className="category-item">
            <Image src={c.icon} alt={c.name} width={40} height={40} />
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      <div className="banner-wrapper">
        <div className="banner-scroll">
          <Image src="/banners/100kcal.png" alt="banner1" width={320} height={100} />
          <Image src="/banners/banner2.png" alt="banner2" width={320} height={100} />
          <Image src="/banners/banner3.png" alt="banner3" width={320} height={100} />
        </div>
      </div>

      <div className="section">
        <h2>อาหารคาว</h2>
        <div className="food-grid">
          {filterFoods(savoryFoods).map((f) => (
            <div key={f.name} className="food-item">
              <Image src={f.image} alt={f.name} width={80} height={80} />
              <div className="food-name">{f.name}</div>
              <div className="cal">{f.calories} แคลอรี่</div>
              <button className="add-btn" onClick={handleAdd}>+</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>อาหารหวาน</h2>
        <div className="food-grid">
          {filterFoods(sweetFoods).map((f) => (
            <div key={f.name} className="food-item">
              <Image src={f.image} alt={f.name} width={80} height={80} />
              <div className="food-name">{f.name}</div>
              <div className="cal">{f.calories} แคลอรี่</div>
              <button className="add-btn" onClick={handleAdd}>+</button>
            </div>
          ))}
        </div>
      </div>

      <BottomMenu />

      <style jsx>{`
        .page {
          background: #f3fdf1;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #3abb47;
          color: white;
        }

        .search-box {
          background: white;
          display: flex;
          align-items: center;
          padding: 10px 16px;
          gap: 10px;
          background: #3abb47;
        }

        .search-box input {
          flex: 1;
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid #ccc;
        }

        .cart {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #3abb47;
          font-weight: bold;
        }

        .category-scroll {
          display: flex;
          overflow-x: auto;
          padding: 12px 16px;
          gap: 16px;
          background: #f7fff3;
        }

        .category-item {
          text-align: center;
          font-size: 12px;
        }

        .banner-wrapper {
          overflow-x: auto;
          margin: 16px 0;
        }

        .banner-scroll {
          display: flex;
          gap: 12px;
          padding: 0 16px;
        }

        .section {
          margin: 12px 16px;
        }

        .section h2 {
          font-size: 16px;
          margin-bottom: 8px;
          color: #3abb47;
        }

        .food-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .food-item {
          background: white;
          border-radius: 12px;
          padding: 8px;
          width: 100px;
          text-align: center;
          position: relative;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        }

        .food-name {
          font-size: 13px;
          font-weight: 500;
          margin-top: 4px;
        }

        .cal {
          color: #3abb47;
          font-weight: bold;
          font-size: 13px;
        }

        .add-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          border: none;
          background: #3abb47;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
