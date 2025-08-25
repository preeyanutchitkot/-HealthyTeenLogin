'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BottomMenu from '../../components/menu';
import CartIcon from '../../components/CartIcon';
import CategoryBar from '../../components/CategoryBar';

const snackFoods = [
  { name: 'ขนมครก', calories: 180, image: '/foods/khanom-khrok.png' },
  { name: 'หมูปิ้ง (3 ไม้)', calories: 250, image: '/foods/moo-ping-3.png' },
  { name: 'ลูกชิ้นปิ้ง (5 ลูก)', calories: 120, image: '/foods/look-chin-ping-5.png' },
  { name: 'เฉาก๊วย', calories: 120, image: '/foods/chao-kuai.png' },
  { name: 'ไข่ตุ๋น', calories: 120, image: '/foods/kai-tun.png' },
  { name: 'ข้าวโพดปิ้ง', calories: 100, image: '/foods/khao-phot-ping.png' },
  { name: 'กล้วยทอด', calories: 250, image: '/foods/kluai-thot.png' },
  { name: 'มันทอด', calories: 150, image: '/foods/man-thot.png' },
  { name: 'ถั่วทอด', calories: 200, image: '/foods/thua-thot.png' },
  { name: 'เกี๊ยวทอด', calories: 190, image: '/foods/kiao-thot.png' },
  { name: 'ปลาเส้นทอดกรอบ', calories: 140, image: '/foods/pla-sen-thot-krop.png' },
  { name: 'ทอดมันปลากราย', calories: 220, image: '/foods/thot-man-pla-krai.png' },
  { name: 'แหนมหม้อ', calories: 180, image: '/foods/naem-mor.png' },
  { name: 'ปอเปี๊ยะทอด', calories: 200, image: '/foods/por-pia-thot.png' },
  { name: 'ไส้กรอกอีสาน', calories: 250, image: '/foods/sai-krok-isan.png' },
  { name: 'หอยทอด', calories: 300, image: '/foods/hoi-thot.png' },
  { name: 'ข้าวเกรียบปากหม้อ', calories: 200, image: '/foods/khao-kriap-pak-mor.png' },
  { name: 'เต้าหู้ทอด', calories: 120, image: '/foods/tao-hu-thot.png' },
  { name: 'ลูกเดือยต้ม', calories: 100, image: '/foods/look-dueai-tom.png' },
  { name: 'ปลาหมึกบด', calories: 150, image: '/foods/pla-muek-bot.png' },
  { name: 'มันฝรั่งทอดกรอบ (1 ถุง)', calories: 150, image: '/foods/potato-chips.png' },
  { name: 'ป๊อปคอร์น (1 ถ้วย)', calories: 55, image: '/foods/popcorn.png' },
  { name: 'ขนมปังโฮลวีต (1 แผ่น)', calories: 70, image: '/foods/whole-wheat-bread.png' },
  { name: 'โยเกิร์ตผลไม้ (1 ถ้วย)', calories: 120, image: '/foods/fruit-yogurt.png' },
  { name: 'คุกกี้เนย (1 ชิ้น)', calories: 150, image: '/foods/butter-cookie.png' },
  { name: 'ข้าวเกรียบกุ้ง (1 แผ่น)', calories: 60, image: '/foods/shrimp-cracker.png' },
  { name: 'ขนมปังกรอบ', calories: 100, image: '/foods/crispy-bread.png' },
  { name: 'มะพร้าวอบแห้ง (1 ถุง)', calories: 200, image: '/foods/dried-coconut.png' },
  { name: 'ถั่วลิสงอบกรอบ (1 ถุง)', calories: 180, image: '/foods/roasted-peanut.png' },
  { name: 'อัลมอนด์ (10 เม็ด)', calories: 100, image: '/foods/almond.png' },
  { name: 'เวเฟอร์ช็อกโกแลต', calories: 180, image: '/foods/chocolate-wafer.png' },
  { name: 'แครกเกอร์ (1 แผ่น)', calories: 60, image: '/foods/cracker.png' },
  { name: 'นมข้นหวาน (1 ช้อนโต๊ะ)', calories: 50, image: '/foods/sweetened-condensed-milk.png' },
  { name: 'ชีสสติ๊ก (1 ชิ้น)', calories: 80, image: '/foods/cheese-stick.png' },
  { name: 'ไอศกรีมวานิลลา (1 สกู๊ป)', calories: 130, image: '/foods/vanilla-ice-cream.png' },
  { name: 'บะหมี่กึ่งสำเร็จรูป', calories: 300, image: '/foods/instant-noodle.png' },
  { name: 'กุนเชียง (1 ชิ้น)', calories: 150, image: '/foods/chinese-sausage.png' },
  { name: 'เนยถั่ว (1 ช้อนโต๊ะ)', calories: 90, image: '/foods/peanut-butter.png' },
  { name: 'โยเกิร์ตรสธรรมชาติ', calories: 100, image: '/foods/plain-yogurt.png' },
  { name: 'แยมโรล (1 ชิ้น)', calories: 120, image: '/foods/jam-roll.png' }
];


export default function SavoryPage() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState(snackFoods);
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

       <CategoryBar
            categories={[
              { name: "อาหารคาว", icon: "/food1.png" },
              { name: "อาหารหวาน", icon: "/food2.png" },
              { name: "ของว่าง", icon: "/food4.png" },
              { name: "อาหารเจ", icon: "/jfood7.png" },
              { name: "อาหารต่างประเทศ", icon: "/food5.png" },
              { name: "เครื่องดื่ม", icon: "/food3.png" },
              { name: "เครื่องดื่มแอลกอฮอล์", icon: "/food8.png" },
              { name: "ผักและผลไม้", icon: "/food6.png" },
              { name: "เนื้อสัตว์", icon: "/food9.png" },
              { name: "ซอสและเครื่องปรุง", icon: "/food10.png" },
            ]}
            categoryPathMap={{
              อาหารคาว: "/line/food/savory",
              อาหารหวาน: "/line/food/sweet",
              ของว่าง: "/line/food/snack",
              อาหารเจ: "/line/food/J",
              อาหารต่างประเทศ: "/line/food/Foreign",
              เครื่องดื่ม: "/line/food/drink",
              เครื่องดื่มแอลกอฮอล์: "/line/food/alcohol",
              ผักและผลไม้: "/line/food/fruit",
              เนื้อสัตว์: "/line/food/meat",
              ซอสและเครื่องปรุง: "/line/food/sauce",
            }}
          />


      <div className="tabs">
        <div className="tab-left">
          <button className="active">อาหารคลีน</button>
          <button className="add-new" onClick={() => setShowModal(true)}>+ เพิ่มเมนูใหม่</button>
        </div>
  <CartIcon count={cartCount} />
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
