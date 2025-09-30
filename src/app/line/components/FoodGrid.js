// components/FoodGrid.jsx
import React from 'react';
import Image from 'next/image';
import styles from './FoodGrid.module.css';

export default function FoodGrid({ foods, onAdd, layout = 'horizontal' }) {
  const gridClass =
    layout === 'grid' ? styles.foodGridVertical : styles.foodGridHorizontal;

  return (
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
          <button className={styles.add} onClick={() => onAdd(food)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
}
