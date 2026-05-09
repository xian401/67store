import { useRef } from 'react';
import './Receipt.css';
import { FiPrinter, FiDownload, FiX, FiRefreshCw } from 'react-icons/fi';

export default function Receipt({ 
  items, subtotal, discountAmount, tax, total, 
  customerName, paymentMethod, orderNumber, date, 
  onClose, onNewOrder 
}) {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const win = window.open('', '', 'width=320,height=600');
    win.document.write(`
      <html><head><title>Receipt #${orderNumber}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; background: white; color: #000; }
        .receipt-print { width: 280px; margin: 0 auto; }
        .receipt-print h2 { text-align:center; font-size: 16px; margin-bottom: 4px; }
        .receipt-print .tagline { text-align:center; font-size: 10px; color: #666; margin-bottom: 12px; }
        .receipt-print .divider { border-top: 1px dashed #999; margin: 8px 0; }
        .receipt-print .row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px; }
        .receipt-print .row.bold { font-weight: bold; font-size: 13px; }
        .receipt-print .item-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; }
        .receipt-print .item-name { max-width: 160px; }
        .receipt-print .center { text-align: center; }
        .receipt-print .footer { text-align: center; font-size: 10px; color: #666; margin-top: 12px; }
      </style></head><body>
      <div class="receipt-print">
        <h2>6SEVEN STORE</h2>
        <p class="tagline">Your Daily Store</p>
        <div class="divider"></div>
        <div class="row"><span>Order #</span><span>${orderNumber}</span></div>
        <div class="row"><span>Date</span><span>${date}</span></div>
        ${customerName ? `<div class="row"><span>Customer</span><span>${customerName}</span></div>` : ''}
        <div class="row"><span>Payment</span><span>${paymentMethod.toUpperCase()}</span></div>
        <div class="divider"></div>
        ${items.map(i => `<div class="item-row"><span class="item-name">${i.qty}x ${i.name}</span><span>₱${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
        <div class="divider"></div>
        <div class="row"><span>Subtotal</span><span>₱${subtotal.toFixed(2)}</span></div>
        ${discountAmount > 0 ? `<div class="row"><span>Discount</span><span>-₱${discountAmount.toFixed(2)}</span></div>` : ''}
        <div class="row"><span>VAT (12%)</span><span>₱${tax.toFixed(2)}</span></div>
        <div class="divider"></div>
        <div class="row bold"><span>TOTAL</span><span>₱${total.toFixed(2)}</span></div>
        <div class="divider"></div>
        <p class="footer">Thank you for your order!<br/>Please present this receipt at the counter.</p>
      </div></body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleDownload = () => {
    const text = [
      '=============================',
      '      6SEVEN STORE',
      '      Your Daily Store',
      '=============================',
      `Order #: ${orderNumber}`,
      `Date: ${date}`,
      customerName ? `Customer: ${customerName}` : null,
      `Payment: ${paymentMethod.toUpperCase()}`,
      '-----------------------------',
      ...items.map(i => `${i.qty}x ${i.name.padEnd(18)} ₱${(i.price * i.qty).toFixed(2)}`),
      '-----------------------------',
      `Subtotal:            ₱${subtotal.toFixed(2)}`,
      discountAmount > 0 ? `Discount:           -₱${discountAmount.toFixed(2)}` : null,
      `VAT (12%):           ₱${tax.toFixed(2)}`,
      '=============================',
      `TOTAL:               ₱${total.toFixed(2)}`,
      '=============================',
      '',
      '   Thank you for your order!',
      ' Present this at the counter.',
    ].filter(Boolean).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={e => e.stopPropagation()}>
        <button className="receipt-close" onClick={onClose}><FiX size={18} /></button>

        <div className="receipt-paper" ref={receiptRef}>
          <div className="receipt-header-section fintech">

            <h2 className="receipt-brand">6SEVEN STORE</h2>
            <p className="receipt-tagline">Your Daily Store</p>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-meta">
            <div className="receipt-meta-row">
              <span>Order #</span>
              <span className="mono">{orderNumber}</span>
            </div>
            <div className="receipt-meta-row">
              <span>Date</span>
              <span className="mono">{date}</span>
            </div>
            {customerName && (
              <div className="receipt-meta-row">
                <span>Customer</span>
                <span className="mono">{customerName}</span>
              </div>
            )}
            <div className="receipt-meta-row">
              <span>Payment</span>
              <span className="mono">{paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-items-list">
            {items.map(item => (
              <div key={item.id} className="receipt-item-row">
                <div className="receipt-item-detail">
                  <span className="receipt-item-qty">{item.qty}x</span>
                  <span>{item.name}</span>
                </div>
                <span className="mono">₱{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Subtotal</span>
              <span className="mono">₱{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="receipt-total-row discount">
                <span>Discount</span>
                <span className="mono">-₱{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="receipt-total-row">
              <span>VAT (12%)</span>
              <span className="mono">₱{tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-divider thick" />

          <div className="receipt-grand-total">
            <span>TOTAL</span>
            <span className="mono">₱{total.toFixed(2)}</span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-footer-text">
            <p>Thank you for your order!</p>
            <p className="small">Please present this receipt at the counter.</p>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="receipt-action-btn print" onClick={handlePrint}>
            <FiPrinter size={16} /> Print
          </button>
          <button className="receipt-action-btn download" onClick={handleDownload}>
            <FiDownload size={16} /> Download
          </button>
          <button className="receipt-action-btn new-order" onClick={onNewOrder}>
            <FiRefreshCw size={16} /> New Order
          </button>
        </div>
      </div>
    </div>
  );
}
