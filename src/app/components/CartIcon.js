'use client';
import Image from 'next/image';
import { useCart } from './cart/CartContext';

export default function CartIcon({ onClick }) {
  const { count } = useCart();
  return (
    <div className="cart" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Image src="/Shopping.png" alt="cart" width={16} height={16} /> {count}
      <style jsx>{`
        .cart { display:flex; align-items:center; font-size:14px; color:#3abb47; gap:4px; }
      `}</style>
    </div>
  );
}
