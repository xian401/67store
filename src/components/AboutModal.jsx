import { useState } from 'react';
import './AboutModal.css';
import { FiX, FiGithub, FiMail, FiCode, FiCoffee } from 'react-icons/fi';
import DonationModal from './DonationModal';

export default function AboutModal({ isOpen, onClose }) {
  const [showDonation, setShowDonation] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-modal animate-in" onClick={e => e.stopPropagation()}>
        <div className="about-header">
          <div className="about-logo">67</div>
          <div className="about-header-actions">
            <button className="coffee-top-btn" onClick={() => setShowDonation(true)} title="Buy me a coffee">
              <FiCoffee />
            </button>
            <button className="about-close" onClick={onClose}><FiX /></button>
          </div>
        </div>
        
        <div className="about-body">
          <div className="about-title-group">
            <h2>6Seven Store</h2>
            <p className="version">Version 2.4.0 (Stable)</p>
          </div>
          
          <div className="about-section">
            <h3>Developer</h3>
            <div className="dev-card">
              <div className="dev-info">
                <p className="dev-name">Christian Achera</p>
                <p className="dev-title">Lead Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Mission</h3>
            <p>Empowering local sari-sari stores and small retail businesses with professional-grade digital tools, simplifying receipt generation and inventory management through a modern fintech experience.</p>
          </div>

          <div className="about-socials">
            <div className="social-item">
              <FiCode /> <span>React 18 + Vite</span>
            </div>
            <div className="social-item">
              <FiMail /> <span>chanzue500@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="about-footer">
          &copy; 2026 E-Resibo Tech. All rights reserved.
        </div>
      </div>

      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
    </div>
  );
}
