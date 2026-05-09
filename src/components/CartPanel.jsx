import { useState, useEffect } from 'react';
import './CartPanel.css';
import { FiX, FiMinus, FiPlus, FiTrash2, FiUser, FiCreditCard, FiPercent, FiAlertCircle } from 'react-icons/fi';

export default function CartPanel({ 
  items, subtotal, tax, total, discountAmount, discountType, setDiscountType, customDiscount, setCustomDiscount,
  updateQty, removeItem, clearCart, onCheckout, open, onClose 
}) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  // Auto-clear error when customer starts typing or changes method
  useEffect(() => {
    if (customerName || paymentMethod !== 'utang') {
      setError('');
    }
  }, [customerName, paymentMethod]);

  const handleCheckout = () => {
    if (paymentMethod === 'utang' && !customerName.trim()) {
      setError('Customer name is required for Utang (Credit) transactions.');
      return;
    }
    
    onCheckout({ customerName: customerName.trim(), paymentMethod });
    setCustomerName(''); 
    setPaymentMethod('cash');
    setError('');
  };

  return (
    <>
      <div className={`cart-overlay ${open ? 'active' : ''}`} onClick={onClose} />
      <aside className={`cart-panel ${open ? 'active' : ''}`}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="cart-close" onClick={onClose}><FiX size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <p className="cart-empty-sub">Tap items from the menu to add</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-left">
                    <span className="cart-item-emoji">{item.emoji}</span>
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <div className="cart-item-meta">
                        <span className="price">₱{item.price.toFixed(2)}</span>
                        <span className="stock">Stock: {item.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1, item.stock)}><FiMinus size={13} /></button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1, item.stock)}><FiPlus size={13} /></button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id)}><FiTrash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-fintech-options">
              {/* Customer Input Section */}
              <div className={`fintech-input-group ${error ? 'has-error' : ''}`}>
                <div className="fintech-label">
                  <FiUser className="label-icon" />
                  <span>Customer Details</span>
                  {paymentMethod === 'utang' && <span className="required-badge">Required</span>}
                </div>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Enter customer name..." 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="fintech-input"
                  />
                  {error && <div className="input-error-msg"><FiAlertCircle /> {error}</div>}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="fintech-section">
                <div className="fintech-label">
                  <FiCreditCard className="label-icon" />
                  <span>Payment Method</span>
                </div>
                <div className="payment-pills">
                  <button 
                    className={`pay-pill cash ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    Cash
                  </button>
                  <button 
                    className={`pay-pill gcash ${paymentMethod === 'gcash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('gcash')}
                  >
                    GCash
                  </button>
                  <button 
                    className={`pay-pill maya ${paymentMethod === 'maya' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('maya')}
                  >
                    Maya
                  </button>
                  <button 
                    className={`pay-pill utang ${paymentMethod === 'utang' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('utang')}
                  >
                    Utang
                  </button>
                </div>
              </div>

              {/* Discounts Section */}
              <div className="fintech-section">
                <div className="fintech-label">
                  <FiPercent className="label-icon" />
                  <span>Available Discounts</span>
                </div>
                <div className="discount-pills">
                  <button className={`disc-pill ${discountType === 'none' ? 'active' : ''}`} onClick={() => setDiscountType('none')}>None</button>
                  <button className={`disc-pill ${discountType === 'senior' ? 'active' : ''}`} onClick={() => setDiscountType('senior')}>Senior</button>
                  <button className={`disc-pill ${discountType === 'pwd' ? 'active' : ''}`} onClick={() => setDiscountType('pwd')}>PWD</button>
                  <button className={`disc-pill ${discountType === 'suki' ? 'active' : ''}`} onClick={() => {
                    const amt = prompt('Suki Discount Amount (₱):', customDiscount);
                    if (amt !== null) {
                      setCustomDiscount(Number(amt));
                      setDiscountType('suki');
                    }
                  }}>Suki</button>
                </div>
              </div>
            </div>

            <div className="cart-footer">
              <div className="summary-card">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-line discount">
                    <span>{discountType.toUpperCase()} Discount</span>
                    <span>-₱{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>VAT (12%)</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-line grand-total">
                  <span>Payable Amount</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button className="checkout-btn-fintech" onClick={handleCheckout}>
                  {paymentMethod === 'utang' ? 'Confirm Utang' : 'Generate Receipt'}
                </button>
                <button className="cart-clear-minimal" onClick={clearCart}>
                  <FiTrash2 /> Clear Order
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
