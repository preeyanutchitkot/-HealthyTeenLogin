'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BottomMenu from '../../../components/menu';


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
  { name: 'น้ำเสาวรส', calories: 70, image: '/foods/passion-fruit-juice.png' },
  { name: 'น้ำฝรั่ง', calories: 85, image: '/foods/guava-juice.png' },
  { name: 'น้ำบลูเบอร์รี่', calories: 100, image: '/foods/blueberry-juice.png' },
  { name: 'น้ำสับปะรด', calories: 85, image: '/foods/pineapple-juice.png' },
  { name: 'น้ำมะเขือเทศ', calories: 40, image: '/foods/tomato-juice.png' },
  { name: 'นมถั่วเหลือง', calories: 130, image: '/foods/soy-milk.png' },
  { name: 'ชามะนาวเย็น', calories: 150, image: '/foods/lemon-iced-tea.png' },
  { name: 'ชาดำเย็น', calories: 90, image: '/foods/iced-black-tea.png' },
  { name: 'น้ำลิ้นจี่', calories: 120, image: '/foods/lychee-juice.png' },
  { name: 'น้ำแตงโม', calories: 50, image: '/foods/watermelon-juice.png' },
  { name: 'สมูทตี้มะม่วง', calories: 180, image: '/foods/mango-smoothie.png' },
  { name: 'น้ำกล้วยปั่น', calories: 200, image: '/foods/banana-smoothie.png' },
  { name: 'สมูทตี้กีวี', calories: 160, image: '/foods/kiwi-smoothie.png' },
  { name: 'น้ำแครนเบอร์รี่', calories: 110, image: '/foods/cranberry-juice.png' },
  { name: 'ชามัทฉะลาเต้เย็น', calories: 230, image: '/foods/iced-matcha-latte.png' },
  { name: 'มิลค์เชคช็อกโกแลต', calories: 350, image: '/foods/chocolate-milkshake.png' },
  { name: 'มิลค์เชควานิลลา', calories: 320, image: '/foods/vanilla-milkshake.png' },
  { name: 'น้ำมะตูมเย็น', calories: 120, image: '/foods/iced-bael-fruit-tea.png' },
  { name: 'น้ำเก๊กฮวยเย็น', calories: 100, image: '/foods/iced-chrysanthemum-tea.png' },
  { name: 'น้ำอัญชันมะนาว', calories: 90, image: '/foods/butterfly-pea-lemon.png' },
  { name: 'ชาพีชเย็น', calories: 140, image: '/foods/iced-peach-tea.png' },
  { name: 'น้ำแครอท', calories: 50, image: '/foods/carrot-juice.png' },
  { name: 'น้ำผักผลไม้รวม', calories: 70, image: '/foods/mixed-fruit-vegetable-juice.png' },
  { name: 'สมูทตี้เขียว', calories: 100, image: '/foods/green-smoothie.png' },
  { name: 'น้ำมะพร้าวสด', calories: 45, image: '/foods/fresh-coconut-water.png' },
  { name: 'น้ำอ้อยสด', calories: 150, image: '/foods/sugarcane-juice.png' },
  { name: 'น้ำมะนาว', calories: 30, image: '/foods/lemonade.png' },
  { name: 'ชาเขียวไม่ใส่น้ำตาล', calories: 0, image: '/foods/unsweetened-green-tea.png' },
  { name: 'น้ำขิง', calories: 60, image: '/foods/ginger-tea.png' },
  { name: 'น้ำทับทิม', calories: 80, image: '/foods/pomegranate-juice.png' },
  { name: 'น้ำแตงโมปั่น', calories: 90, image: '/foods/watermelon-smoothie.png' },
  { name: 'น้ำมะม่วงปั่น', calories: 150, image: '/foods/mango-smoothie.png' },
  { name: 'น้ำเสาวรส', calories: 60, image: '/foods/passion-fruit-juice.png' },
  { name: 'นมอัลมอนด์', calories: 50, image: '/foods/almond-milk.png' },
  { name: 'นมถั่วเหลือง', calories: 90, image: '/foods/soy-milk.png' },
  { name: 'น้ำส้มคั้น', calories: 120, image: '/foods/orange-juice.png' },
  { name: 'น้ำฝรั่ง', calories: 100, image: '/foods/guava-juice.png' },
  { name: 'น้ำองุ่น', calories: 150, image: '/foods/grape-juice.png' },
  { name: 'สมูทตี้มิกซ์เบอร์รี่', calories: 120, image: '/foods/mixed-berry-smoothie.png' },
  { name: 'น้ำมะขาม', calories: 80, image: '/foods/tamarind-juice.png' },
  { name: 'น้ำแอปเปิ้ล', calories: 90, image: '/foods/apple-juice.png' }
];

export default function SavoryPage() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState(drinkMenus);
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
          <button className="active">เครื่องดื่ม</button>
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
      <BottomMenu />

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
