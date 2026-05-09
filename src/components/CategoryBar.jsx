import './CategoryBar.css';

export default function CategoryBar({ categories, active, onSelect }) {
  return (
    <div className="category-bar">
      <button
        className={`cat-chip ${active === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        <span className="cat-emoji">📋</span>
        <span>All</span>
      </button>
      {categories.map(c => (
        <button
          key={c.id}
          className={`cat-chip ${active === c.id ? 'active' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          <span className="cat-emoji">{c.icon}</span>
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
