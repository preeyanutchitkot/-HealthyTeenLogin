'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const JFoods = [
 { name: 'เต้าหู้ทอด', calories: 100, image: '/foods/fried-tofu.png' },
  { name: 'ผัดหมี่เจ', calories: 250, image: '/foods/vegetarian-fried-noodle.png' },
  { name: 'ข้าวผัดเจ', calories: 300, image: '/foods/vegetarian-fried-rice.png' },
  { name: 'แกงเขียวหวานเจ', calories: 180, image: '/foods/vegetarian-green-curry.png' },
  { name: 'ซาลาเปาไส้เผือก', calories: 180, image: '/foods/taro-steamed-bun.png' },
  { name: 'ปอเปี๊ยะสดเจ', calories: 120, image: '/foods/vegetarian-fresh-spring-roll.png' },
  { name: 'ต้มจับฉ่ายเจ', calories: 90, image: '/foods/vegetarian-mixed-vegetable-soup.png' },
  { name: 'เห็ดทอดเจ', calories: 150, image: '/foods/vegetarian-fried-mushroom.png' },
  { name: 'แกงส้มผักรวมเจ', calories: 100, image: '/foods/vegetarian-sour-curry.png' },
  { name: 'เต้าหู้ยัดไส้เจ', calories: 130, image: '/foods/vegetarian-stuffed-tofu.png' },
  { name: 'กะหล่ำปลีผัดเจ', calories: 110, image: '/foods/vegetarian-fried-cabbage.png' },
  { name: 'แกงจืดวุ้นเส้นเจ', calories: 80, image: '/foods/vegetarian-clear-soup-vermicelli.png' },
  { name: 'ยำวุ้นเส้นเจ', calories: 140, image: '/foods/vegetarian-vermicelli-salad.png' },
  { name: 'ฟักทองผัดเจ', calories: 120, image: '/foods/vegetarian-fried-pumpkin.png' },
  { name: 'เต้าหู้ต้มซีอิ๊วเจ', calories: 90, image: '/foods/vegetarian-braised-tofu-soy-sauce.png' },
  { name: 'ข้าวเหนียวเปียกเจ', calories: 200, image: '/foods/vegetarian-sticky-rice-dessert.png' },
  { name: 'เผือกทอดเจ', calories: 180, image: '/foods/vegetarian-fried-taro.png' },
  { name: 'หมี่ซั่วผัดเจ', calories: 220, image: '/foods/vegetarian-fried-mee-sua.png' },
  { name: 'แกงกะหรี่เจ', calories: 200, image: '/foods/vegetarian-curry.png' },
  { name: 'ก๋วยเตี๋ยวหลอดเจ', calories: 150, image: '/foods/vegetarian-steamed-rice-noodle-roll.png' }
];


export default function SavoryPage() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState(JFoods);
  const [showModal, setShowModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => setCartCount((prev) => prev + 1);

  const handleAddNewFood = async () => {
    if (!newFoodName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/estimate-calories', {
        method: 'POST',
        body: JSON.stringify({ name: newFoodName }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.calories) {
        setFoods(prev => [...prev, {
          name: newFoodName,
          calories: data.calories,
          image: '/foods/default.png'
        }]);
        setShowModal(false);
        setNewFoodName('');
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการประเมินแคลอรี่');
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">
      <div className="topbar">
        <Link href="/line/home" className="back-btn"></Link>
        <h1>บันทึกอาหาร</h1>
        <Image src="/pig-icon.png" alt="icon" width={30} height={30} />
      </div>

      <div className="search-wrapper">
        <div className="search-box">
          <Image src="/icons/search.png" alt="search" width={20} height={20} />
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Image src="/icons/character.png" alt="char" width={24} height={24} />
        </div>
      </div>

      <div className="categories">
        <div className="category-scroll">
          {['อาหารคาว', 'อาหารหวาน', 'เครื่องดื่ม', 'ผลไม้', 'ของว่าง', 'อาหารคลีน'].map((cat, idx) => (
            <div className="category-item" key={idx}>
              <Image src={`/icons/${['savory','sweet','drink','fruit','snack','clean'][idx]}.png`} width={40} height={40} alt={cat} />
              <div>{cat}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        <div className="tab-left">
          <button className="active">ของว่าง</button>
          <button className="add-new" onClick={() => setShowModal(true)}>+ เพิ่มเมนูใหม่</button>
        </div>
        <div className="cart">
          <Image src="/icons/cart.png" alt="cart" width={16} height={16} /> {cartCount}
        </div>
      </div>

      <div className="food-grid">
        {filteredFoods.map((f, i) => (
          <div key={i} className="food-item">
            <Image src={f.image} alt={f.name} width={80} height={80} />
            <div className="name">{f.name}</div>
            <div className="calories">{f.calories} แคลอรี่</div>
            <button className="add" onClick={handleAdd}>+</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>เพิ่มเมนูใหม่</h3>
            <input
              placeholder="ชื่ออาหาร"
              value={newFoodName}
              onChange={(e) => setNewFoodName(e.target.value)}
            />
            <button onClick={handleAddNewFood} disabled={loading}>
              {loading ? 'กำลังประเมิน...' : 'บันทึก'}
            </button>
            <button onClick={() => setShowModal(false)}>ยกเลิก</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          background: #f3fdf1;
          min-height: 100vh;
          font-family: 'Noto Sans Thai', sans-serif;
          padding-bottom: 80px;
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #3abb47;
          color: white;
          padding: 12px 16px;
        }
        .topbar h1 {
          font-size: 18px;
          font-weight: bold;
        }
        .search-wrapper {
          background: #3abb47;
          padding: 0 16px;
          padding-top: 8px;
        }
        .search-box {
          background: white;
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
        }
        .categories {
          background: #f7fff3;
          padding: 12px 0;
        }
        .category-scroll {
          display: flex;
          overflow-x: auto;
          padding: 0 16px;
          gap: 12px;
        }
        .category-item {
          text-align: center;
          font-size: 12px;
        }
        .tabs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 10px 16px;
        }
        .tab-left {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .tabs button {
          background: #e8f8e3;
          border: none;
          border-radius: 12px;
          padding: 6px 16px;
          color: #3abb47;
          font-weight: bold;
        }
        .tabs .active {
          background: #3abb47;
          color: white;
        }
        .add-new {
          background: transparent;
          color: #3abb47;
          font-size: 14px;
        }
        .cart {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #3abb47;
          gap: 4px;
        }
        .food-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 16px;
        }
        .food-item {
          background: white;
          border-radius: 12px;
          text-align: center;
          padding: 8px;
          position: relative;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .name {
          font-size: 14px;
          font-weight: bold;
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
          color: white;
          border: none;
          font-size: 18px;
        }
        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex; justify-content: center; align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 80%;
        }
        .modal-content input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .modal-content button {
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: #3abb47;
          color: white;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
