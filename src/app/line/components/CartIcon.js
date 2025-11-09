import Image from 'next/image';
import { forwardRef } from 'react';

const CartIcon = forwardRef(({ count = 0, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className="cart"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <Image src="/Shopping.png" alt="cart" width={28} height={28} />
      <span className="count-badge">{count}</span>
      <style jsx>{`
        .cart {
          display: flex;
          align-items: center;
          font-size: 14px;
          gap: 4px;
          position: relative;
        }
        .count-badge {
          background: #ff4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
});

CartIcon.displayName = 'CartIcon';

export default CartIcon;
