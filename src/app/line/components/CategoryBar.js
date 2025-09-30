import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './CategoryBar.css';

export default function CategoryBar({ categories = [], categoryPathMap = {}, backgroundColor = '#ffffff' }) {
  return (
    <div className="category-bar" style={{ backgroundColor }}>
      {categories.map((cat, i) => (
        <Link href={categoryPathMap[cat.name] || '#'} key={i} className="category-item">
          <div className="category-thumb">
            <Image src={cat.icon} alt={cat.name} width={56} height={56} />
          </div>
          <span className="category-label">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
