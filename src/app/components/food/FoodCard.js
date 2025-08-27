'use client';
import Image from 'next/image';

export default function FoodCard({ food, onAdd }) {
  return (
    <div className="food-item">
      <Image src={food.image} alt={food.name} width={80} height={80} />
      <div className="name">{food.name}</div>
      <div className="calories">{food.calories} แคลอรี่</div>
      <button className="add" onClick={() => onAdd?.(food)}>+</button>

      <style jsx>{`
        .food-item{background:#fff;border-radius:12px;text-align:center;padding:8px;position:relative;box-shadow:0 1px 4px rgba(0,0,0,.1)}
        .name{font-size:14px;font-weight:700;margin-top:6px}
        .calories{font-size:12px;color:#555}
        .add{position:absolute;bottom:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#3abb47;color:#fff;border:none;font-size:18px}
      `}</style>
    </div>
  );
}
