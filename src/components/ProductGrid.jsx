import './ProductGrid.css';
import { FiPlus } from 'react-icons/fi';

export default function ProductGrid({ products, onAdd }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <button
          key={p.id}
          className="product-card animate-in"
          style={{ animationDelay: `${i * 0.03}s` }}
          onClick={() => onAdd(p)}
        >
          <div className="product-emoji">{p.emoji}</div>
          <div className="product-info">
            <span className="product-name">{p.name}</span>
            <span className="product-price">₱{p.price.toFixed(2)}</span>
            <span className="product-stock-label">{p.stock}/{p.maxStock || 200}</span>
          </div>
          <div className="product-add">
            <FiPlus size={16} />
          </div>
        </button>
      ))}
    </div>
  );
}
