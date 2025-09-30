import Image from 'next/image';

export default function CartIcon({ count = 0, onClick }) {
  return (
    <div
      className="cart"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <Image src="/Shopping.png" alt="cart" width={16} height={16} /> {count}
      <style jsx>{`
        .cart {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #3abb47;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
