'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';


const sweetFoods = [
  { name: 'ทับทิมกรอบ', calories: 200, image: '/foods/tub-tim-krob.png' },
  { name: 'ขนมชั้น', calories: 220, image: '/foods/khanom-chan.png' },
  { name: 'บัวลอย', calories: 240, image: '/foods/bua-loi.png' },
  { name: 'ข้าวเหนียวมะม่วง', calories: 330, image: '/foods/khao-niew-mamuang.png' },
  { name: 'ลูกชุบ', calories: 150, image: '/foods/look-chup.png' },
  { name: 'เครปเค้ก', calories: 350, image: '/foods/crepe-cake.png' },
  { name: 'พายสัปปะรด', calories: 270, image: '/foods/pineapple-pie.png' },
  { name: 'ชีสเค้ก', calories: 400, image: '/foods/cheesecake.png' },
  { name: 'ทองหยิบ', calories: 210, image: '/foods/thong-yip.png' },
  { name: 'ฝอยทอง', calories: 180, image: '/foods/foi-thong.png' },
  { name: 'วุ้นกะทิ', calories: 150, image: '/foods/woon-kati.png' },
  { name: 'เค้กช็อกโกแลต', calories: 450, image: '/foods/chocolate-cake.png' },
  { name: 'บราวนี่', calories: 400, image: '/foods/brownie.png' },
  { name: 'ขนมปังสังขยา', calories: 250, image: '/foods/khanom-pang-sangkaya.png' },
  { name: 'โรตีใส่นม', calories: 350, image: '/foods/roti-sai-nom.png' },
  { name: 'โรตีโอวัลติน', calories: 370, image: '/foods/roti-ovaltine.png' },
  { name: 'เค้กกล้วยหอม', calories: 280, image: '/foods/banana-cake.png' },
  { name: 'ขนมต้ม', calories: 200, image: '/foods/khanom-tom.png' },
  { name: 'ขนมกล้วย', calories: 220, image: '/foods/khanom-kluai.png' },
  { name: 'ขนมถ้วย', calories: 150, image: '/foods/khanom-tuay.png' }
];

export default function SweetPage() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState(sweetFoods);
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
          <button className="active">อาหารหวาน</button>
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
