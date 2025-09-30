// components/FoodGrid.jsx
import React from "react";
import Image from "next/image";

export default function FoodGrid({ foods, onAdd }) {
  return (
    <div className="food-grid">
      {foods.map((food, i) => (
        // ถ้ามี id ให้ใช้ id, ถ้าไม่มี fallback เป็น name+index (unique)
        <div className="food-item" key={food.id ?? `${food.name}-${i}`}>
          <Image src={food.image} alt={food.name} width={100} height={100} />
          <div className="name">{food.name}</div>
          <div className="calories">{food.calories} แคลอรี่</div>
          <button className="add" onClick={() => onAdd(food)}>+</button>
        </div>
      ))}
    </div>
  );
}
