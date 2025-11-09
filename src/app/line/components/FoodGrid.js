// components/FoodGrid.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './FoodGrid.module.css';

export default function FoodGrid({ foods, onAdd, layout = 'horizontal', cartRef }) {
  const [flyingNumbers, setFlyingNumbers] = useState([]);

  const gridClass =
    layout === 'grid' ? styles.foodGridVertical : styles.foodGridHorizontal;

  const handleAdd = (food, event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // หาตำแหน่งของไอคอนตะกร้า
    let targetX = window.innerWidth - 50;
    let targetY = 150;
    
    if (cartRef?.current) {
      const cartRect = cartRef.current.getBoundingClientRect();
      targetX = cartRect.left + cartRect.width / 2;
      targetY = cartRect.top + cartRect.height / 2;
    }
    
    // สร้างตัวเลข +1 ที่จะบิน
    const id = Date.now() + Math.random();
    setFlyingNumbers((prev) => [
      ...prev,
      {
        id,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        endX: targetX,
        endY: targetY,
      },
    ]);

    // ลบตัวเลขหลังแอนิเมชันเสร็จ
    setTimeout(() => {
      setFlyingNumbers((prev) => prev.filter((num) => num.id !== id));
    }, 800);

    onAdd(food);
  };

  return (
    <>
      <div className={gridClass}>
        {foods.map((food, i) => (
          <div className={styles.foodItem} key={food.id ?? `${food.name}-${i}`}>
            <Image
              src={food.image}
              alt={food.name}
              width={100}
              height={100}
              className={styles.foodImg}
            />
            <div className={styles.name}>{food.name}</div>
            <div className={styles.calories}>{food.calories} แคลอรี่</div>
            <button className={styles.add} onClick={(e) => handleAdd(food, e)}>
              +
            </button>
          </div>
        ))}
      </div>

      {/* Flying numbers animation */}
      {flyingNumbers.map((num) => (
        <div
          key={num.id}
          className={styles.flyingNumber}
          style={{
            '--start-x': `${num.startX}px`,
            '--start-y': `${num.startY}px`,
            '--end-x': `${num.endX}px`,
            '--end-y': `${num.endY}px`,
            left: num.startX,
            top: num.startY,
          }}
        >
          +1
        </div>
      ))}
    </>
  );
}
