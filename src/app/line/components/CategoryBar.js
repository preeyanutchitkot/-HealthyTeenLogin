import Image from "next/image";
import Link from "next/link";

export default function CategoryBar({ categories, categoryPathMap, active, onClick }) {
  return (
    <div className="categories" aria-label="หมวดหมู่อาหาร">
      <div className="category-scroll">
        {categories.map((c) => {
          const href = categoryPathMap[c.name] ?? "#";
          return (
            <Link key={c.name} href={href} className={`category-item${active === c.name ? " active" : ""}`} onClick={onClick}>
              <div className="category-icon">
                <Image src={c.icon} alt={c.name} width={60} height={44} style={{ objectFit: 'contain', background: 'transparent' }} />
              </div>
              <div className="category-label">{c.name}</div>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        .category-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 0 16px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .category-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .category-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          font-size: 12px;
          color: #1f2937;
          text-decoration: none !important;
          scroll-snap-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .category-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        .category-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          margin-top: 10px;
          box-shadow: none;
          transition: background 0.3s ease;
        }
        .category-item.active .category-icon {
          background: transparent;
        }
        .category-label {
          font-size: 11px;
          color: #111;
          margin-top: -4px;
          text-align: center;
          text-decoration: none !important;
          width: 100%;
        }
        .category-item, .category-item:visited, .category-item:active, .category-item:focus, .category-item:hover,
        .category-item *, .category-label, .category-label *, .category-item:link, .category-item:focus-visible {
          text-decoration: none !important;
          box-shadow: none !important;
        }
        .category-item.active {
          color: #3abb47;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
