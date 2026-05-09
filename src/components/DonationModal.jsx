import './DonationModal.css';
import { FiX, FiCoffee } from 'react-icons/fi';

export default function DonationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="donation-overlay" onClick={onClose}>
      <div className="donation-modal animate-in" onClick={e => e.stopPropagation()}>
        <div className="donation-header">
          <FiCoffee className="donation-icon" />
          <h3>Buy Me A Coffee</h3>
          <button className="donation-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="donation-body">
          <img src="/gcash.jpg" alt="GCash QR" className="donation-qr" />
          <p>Scan to buy me a coffee</p>
          <div className="gcash-label">GCash Payment</div>
        </div>
      </div>
    </div>
  );
}
