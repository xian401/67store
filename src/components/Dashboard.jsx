import { useState } from 'react';
import './Dashboard.css';
import { 
  FiArrowLeft, FiTrash2, FiClock, FiCheckCircle, FiDollarSign, 
  FiBox, FiUsers, FiShoppingBag, FiCreditCard, FiActivity, FiPlus, FiX 
} from 'react-icons/fi';

export default function Dashboard({ 
  sales, products, onBack, onUpdateUtang, onClearSales, onResetInventory, onAddProduct, onDeleteProduct 
}) {
  const [activeTab, setActiveTab] = useState('sales'); // sales, utang, inventory
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [newP, setNewP] = useState({ name: '', price: '', category: 'General', stock: 50, emoji: '📦' });

  const stats = {
    totalRevenue: sales.reduce((sum, s) => sum + s.total, 0),
    totalOrders: sales.length,
    totalUtang: sales.filter(s => s.paymentMethod === 'utang' && s.paymentStatus === 'unpaid')
                     .reduce((sum, s) => sum + s.total, 0),
    lowStock: products.filter(p => p.stock <= 5).length
  };

  const utangOrders = sales.filter(s => s.paymentMethod === 'utang');
  const uniqueCategories = ['General', ...new Set(products.map(p => p.category))];

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newP.name || !newP.price) return;

    onAddProduct({
      ...newP,
      id: Date.now(),
      price: parseFloat(newP.price),
      stock: parseInt(newP.stock)
    });

    setNewP({ name: '', price: '', category: 'General', stock: 50, emoji: '📦' });
    setShowAddForm(false);
  };

  return (
    <div className="dash-v2">
      <header className="dash-v2-header">
        <div className="header-left">
          <button className="dash-back-btn" onClick={onBack}>
            <FiArrowLeft /> <span>Back to Store</span>
          </button>
          <h1>Store Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="live-indicator">
            <span className="dot"></span>
            Live Updates
          </div>
        </div>
      </header>

      <div className="dash-stats-row">
        <div className="dash-stat-card revenue">
          <div className="stat-icon-bg"><FiDollarSign /></div>
          <div className="stat-content">
            <span className="label">Total Revenue</span>
            <span className="value">₱{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="dash-stat-card utang">
          <div className="stat-icon-bg"><FiClock /></div>
          <div className="stat-content">
            <span className="label">Total Credit (Utang)</span>
            <span className="value">₱{stats.totalUtang.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="dash-stat-card inventory">
          <div className="stat-icon-bg"><FiBox /></div>
          <div className="stat-content">
            <span className="label">Low Stock Alerts</span>
            <span className="value">{stats.lowStock} <small>Items</small></span>
          </div>
        </div>
        <div className="dash-stat-card orders">
          <div className="stat-icon-bg"><FiShoppingBag /></div>
          <div className="stat-content">
            <span className="label">Total Transactions</span>
            <span className="value">{stats.totalOrders}</span>
          </div>
        </div>
      </div>

      <nav className="dash-nav">
        <button className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
          <FiActivity /> Sales History
        </button>
        <button className={`nav-item ${activeTab === 'utang' ? 'active' : ''}`} onClick={() => setActiveTab('utang')}>
          <FiUsers /> Utang Ledger
        </button>
        <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <FiBox /> Live Inventory
        </button>
      </nav>

      <main className="dash-main-content">
        {activeTab === 'sales' && (
          <div className="dash-view-panel animate-in">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Recent Transactions</h3>
                <p>Showing all orders from current session</p>
              </div>
              <button className="panel-action-btn danger" onClick={onClearSales}>
                <FiTrash2 /> Clear All Records
              </button>
            </div>
            
            {sales.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-circle"><FiShoppingBag /></div>
                <h4>No Sales Yet</h4>
                <p>Transactions will appear here once you generate receipts.</p>
              </div>
            ) : (
              <div className="dash-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.id}>
                        <td className="mono">#{s.orderNumber}</td>
                        <td className="customer-cell">{s.customerName || 'Walk-in Customer'}</td>
                        <td className="mono-bold">₱{s.total.toFixed(2)}</td>
                        <td>
                          <span className="pay-badge" data-method={s.paymentMethod}>
                            <FiCreditCard size={10} /> {s.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td className="time-cell">{formatDate(s.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'utang' && (
          <div className="dash-view-panel animate-in">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Utang Ledger</h3>
                <p>Monitor and manage customer credits</p>
              </div>
            </div>
            
            {utangOrders.length === 0 ? (
              <div className="dash-empty-state">
                <div className="empty-circle"><FiUsers /></div>
                <h4>Clean Ledger</h4>
                <p>No active credit records found in history.</p>
              </div>
            ) : (
              <div className="dash-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Balance Due</th>
                      <th>Transaction Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utangOrders.map(s => (
                      <tr key={s.id}>
                        <td className="customer-cell">{s.customerName}</td>
                        <td className="mono-bold danger">₱{s.total.toFixed(2)}</td>
                        <td className="time-cell">{formatDate(s.date)}</td>
                        <td>
                          <span className={`status-pill ${s.paymentStatus}`}>
                            {s.paymentStatus === 'paid' ? <FiCheckCircle /> : <FiClock />}
                            {s.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {s.paymentStatus === 'unpaid' && (
                            <button className="mark-paid-btn" onClick={() => onUpdateUtang(s.id, 'paid')}>
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="dash-view-panel animate-in">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Live Inventory Status</h3>
                <p>Track stock levels and product pricing</p>
              </div>
              <div className="panel-actions">
                <button className="panel-action-btn primary" onClick={() => setShowAddForm(true)}>
                  <FiPlus /> New Product
                </button>
              </div>
            </div>

            {showAddForm && (
              <div className="add-product-form-container animate-in">
                <form className="add-product-form" onSubmit={handleAddSubmit}>
                  <div className="form-header">
                    <h4>Add New Product</h4>
                    <button type="button" onClick={() => setShowAddForm(false)} className="close-form"><FiX /></button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Kopiko Brown" 
                        value={newP.name}
                        onChange={e => setNewP({...newP, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (₱)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={newP.price}
                        onChange={e => setNewP({...newP, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={newP.category}
                        onChange={e => setNewP({...newP, category: e.target.value})}
                      >
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="Custom">+ Add New Category</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Initial Stock</label>
                      <input 
                        type="number" 
                        value={newP.stock}
                        onChange={e => setNewP({...newP, stock: e.target.value})}
                      />
                    </div>
                    <div className="form-group emoji-group">
                      <label>Icon (Emoji)</label>
                      <input 
                        type="text" 
                        value={newP.emoji}
                        onChange={e => setNewP({...newP, emoji: e.target.value})}
                        maxLength="2"
                      />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="submit" className="save-btn">Add to Inventory</button>
                  </div>
                </form>
              </div>
            )}

            <div className="dash-table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Product Item</th>
                    <th>Category</th>
                    <th>Retail Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="product-cell">
                        <span className="emoji-icon">{p.emoji}</span>
                        <span>{p.name}</span>
                      </td>
                      <td><span className="cat-badge">{p.category}</span></td>
                      <td className="mono">₱{p.price.toFixed(2)}</td>
                      <td className="mono-bold">{p.stock}</td>
                      <td>
                        <span className="stock-condition" data-stock={p.stock === 0 ? 'none' : p.stock <= 5 ? 'low' : 'good'}>
                          {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <button className="delete-row-btn-text" onClick={() => onDeleteProduct(p.id)}>
                          <FiTrash2 size={12} /> <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
