import './HistorySidebar.css';
import { FiX, FiChevronRight, FiCalendar, FiUser, FiCreditCard } from 'react-icons/fi';

export default function HistorySidebar({ sales, open, onClose, onViewReceipt }) {
  // Sort sales by date descending (newest first)
  const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <div className={`history-overlay ${open ? 'active' : ''}`} onClick={onClose} />
      <aside className={`history-sidebar ${open ? 'active' : ''}`}>
        <div className="history-header">
          <div className="history-header-title">
            <FiCalendar />
            <h2>Recent Receipts</h2>
          </div>
          <button className="history-close" onClick={onClose}><FiX size={20} /></button>
        </div>

        <div className="history-list">
          {sortedSales.length === 0 ? (
            <div className="history-empty">
              <span className="empty-icon">📂</span>
              <p>No receipts found</p>
              <p className="empty-sub">Generated receipts will appear here</p>
            </div>
          ) : (
            sortedSales.map((sale) => (
              <div key={sale.id} className="history-card" onClick={() => onViewReceipt(sale)}>
                <div className="history-card-top">
                  <span className="order-num">#{sale.orderNumber}</span>
                  <span className="order-date">{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="history-card-main">
                  <div className="history-card-row">
                    <FiUser size={12} />
                    <span>{sale.customerName || 'Walk-in Customer'}</span>
                  </div>
                  <div className="history-card-row">
                    <FiCreditCard size={12} />
                    <span className="payment-tag" data-type={sale.paymentMethod}>{sale.paymentMethod.toUpperCase()}</span>
                  </div>
                </div>

                <div className="history-card-bottom">
                  <span className="order-total">₱{sale.total.toFixed(2)}</span>
                  <FiChevronRight className="view-arrow" />
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
