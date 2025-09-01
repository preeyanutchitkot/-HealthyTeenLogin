import React from "react";
import Image from "next/image";

export default function FoodGrid({ foods, onAdd }) {
  return (
    <div className="food-grid">
      {foods.map((food) => (
        <div className="food-item" key={food.name}>
          <Image src={food.image} alt={food.name} width={100} height={100} />
          <div className="name">{food.name}</div>
          <div className="calories">{food.calories} แคลอรี่</div>
          <button className="add" onClick={() => onAdd(food)}>+</button>
        </div>
      ))}
    </div>
  );
}
