"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import BottomMenu from "../components/menu";

const categories = [
  { name: "อาหารคาว", icon: "/icons/savory.png" },
  { name: "อาหารหวาน", icon: "/icons/sweet.png" },
  { name: "ของว่าง", icon: "/icons/snack.png" },
  { name: "อาหารเจ", icon: "/icons/Jfood.png" },
  { name: "อาหารต่างประเทศ", icon: "/icons/Foreign.png" },
  { name: "เครื่องดื่ม", icon: "/icons/drink.png" },
  { name: "เครื่องดื่มแอลกอฮอล์", icon: "/icons/alcohol.png" },
  { name: "ผักและผลไม้", icon: "/icons/fruit.png" },
  { name: "เนื้อสัตว์", icon: "/icons/meat.png" },
  { name: "ซอสและเครื่องปรุง", icon: "/icons/sauce.png" },
];

const categoryPathMap = {
  อาหารคาว: "food/savory",
  อาหารหวาน: "food/sweet",
  ของว่าง: "food/snack",
  อาหารเจ: "food/J",
  อาหารต่างประเทศ: "food/foreign",
  เครื่องดื่ม: "food/drink",
  เครื่องดื่มแอลกอฮอล์: "food/alcohol",
  ผักและผลไม้: "foods/fruit",
  เนื้อสัตว์: "food/meat",
  ซอสและเครื่องปรุง: "food/sauce",
};

// อาหารคาว
const savoryFoods = [];

// อาหารหวาน
const sweetFoods = [];

// ของว่าง
const snackFoods = [];

// อาหารเจ
const JFoods = [];

// อาหารต่างประเทศ
const foreignFoods = [];

// เครื่องดื่ม
const drinkMenus = [];

// เครื่องดื่มแอลกอฮอล์
const alcohols = [];

// ผักและผลไม้
const fruitMenus = [];

// เนื้อสัตว์
const meatFoods = [];

// ซอสและเครื่องปรุง
const sauce = [];

export default function FoodLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const handleAdd = () => setCartCount((prev) => prev + 1);

  const filterFoods = (foods) =>
    foods.filter((f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const allFoods = useMemo(
    () => [
      ...savoryFoods,
      ...sweetFoods,
      ...snackFoods,
      ...JFoods,
      ...foreignFoods,
      ...drinkMenus,
      ...alcohols,
      ...fruitMenus,
      ...meatFoods,
      ...sauce,
    ],
    []
  );
  return (
    <div className="page">
      {/* Topbar */}
      <div className="topbar">
        <Link href="/line/home" className="back-btn" aria-label="ย้อนกลับ" />
        <h1>บันทึกอาหาร</h1>
        <Link href="/cart" className="cart" aria-label="ตะกร้าอาหาร">
          <Image src="/icons/cart.png" alt="cart" width={18} height={18} />
          <span aria-live="polite">{cartCount}</span>
        </Link>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <div className="search-box" role="search">
          <input
            type="text"
            placeholder="ค้นหาเมนู…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="ค้นหาเมนูอาหาร"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="categories" aria-label="หมวดหมู่อาหาร">
        <div className="category-scroll">
          {categories.map((c) => {
            const href = categoryPathMap[c.name] ?? "#";
            return (
              <Link key={c.name} href={href} className="category-item">
                <Image src={c.icon} alt={c.name} width={40} height={40} />
                <div>{c.name}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Banner */}
      <div className="banner-scroll" aria-label="โปรโมชัน">
        <div className="banner">
          <Image
            src="/banners/100kcal.png"
            alt="100 kcal"
            fill
            sizes="(max-width: 768px) 80vw, 250px"
            priority
          />
        </div>
        <div className="banner">
          <Image
            src="/banners/banner2.png"
            alt="banner2"
            fill
            sizes="(max-width: 768px) 80vw, 250px"
          />
        </div>
        <div className="banner">
          <Image
            src="/banners/banner3.png"
            alt="banner3"
            fill
            sizes="(max-width: 768px) 80vw, 250px"
          />
        </div>
      </div>

      {[
        { title: "อาหารคาว", data: savoryFoods },
        { title: "อาหารหวาน", data: sweetFoods },
        { title: "ของว่าง", data: snackFoods },
        { title: "อาหารเจ", data: JFoods },
        { title: "อาหารต่างประเทศ", data: foreignFoods },
        { title: "เครื่องดื่ม", data: drinkMenus },
        { title: "เครื่องดื่มแอลกอฮอล์", data: alcohols },
        { title: "ผักและผลไม้", data: fruitMenus },
        { title: "เนื้อสัตว์", data: meatFoods },
        { title: "ซอสและเครื่องปรุง", data: sauce },
      ].map(({ title, data }) => (
        <div className="section" key={title}>
          <h2>{title}</h2>

          <div className="food-grid">
            {filterFoods(data).map((f) => (
              <div key={`${title}-${f.name}`} className="food-item">
                <Link
                  href={`/food/${encodeURIComponent(f.name)}`}
                  className="food-link"
                  aria-label={`ดูรายละเอียด ${f.name}`}
                >
                  <div className="thumb">
                    <Image src={f.image} alt={f.name} fill sizes="120px" />
                  </div>
                  <div className="name">{f.name}</div>
                  <div className="calories">{f.calories} แคลอรี่</div>
                </Link>

                <button
                  className="add"
                  onClick={handleAdd}
                  aria-label={`เพิ่ม ${f.name} ลงตะกร้า`}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <BottomMenu />

      <style jsx>{`
        .page {
          background: #f3fdf1;
          min-height: 100vh;
          font-family: "Noto Sans Thai", sans-serif;
          padding-bottom: 80px;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #3abb47;
          color: #fff;
          padding: 12px 16px;
        }
        .topbar h1 {
          font-size: 18px;
          font-weight: bold;
        }
        .back-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          display: inline-block;
        }
        .cart {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-weight: 700;
          text-decoration: none;
        }

        .search-wrapper {
          background: #3abb47;
          padding: 8px 16px;
        }
        .search-box {
          background: #fff;
          border-radius: 999px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-box input {
          border: none;
          outline: none;
          flex: 1;
          background: transparent;
        }
        .categories {
          background: #f7fff3;
          padding: 12px 0;
        }

        .category-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 0 16px;
          scroll-snap-type: x mandatory; /* เลื่อนแล้วล็อกตำแหน่ง */
        }

        .category-item {
          flex: 0 0 auto;
          text-align: center;
          font-size: 12px;
          color: #1f2937;
          text-decoration: none;
          scroll-snap-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .category-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .category-icon {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          background: white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          transition: background 0.3s ease;
        }

        .category-item.active .category-icon {
          background: #3abb47; /* active color */
        }

        .category-item.active {
          color: #3abb47;
          font-weight: bold;
        }

        .banner-scroll {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          overflow-x: auto;
        }
        .banner {
          position: relative;
          width: 250px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          flex: 0 0 auto;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .section {
          padding: 0 16px 8px;
        }
        .section h2 {
          color: #3abb47;
          font-size: 16px;
          margin: 6px 0 8px;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (min-width: 768px) {
          .food-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .food-item {
          background: #fff;
          border-radius: 12px;
          text-align: center;
          padding: 8px;
          position: relative;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }
        .food-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .thumb {
          position: relative;
          width: 100%;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          background: #f0fdf4;
        }
        .name {
          font-size: 14px;
          font-weight: 700;
          margin-top: 6px;
        }
        .calories {
          font-size: 12px;
          color: #555;
        }
        .add {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3abb47;
          color: #fff;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
