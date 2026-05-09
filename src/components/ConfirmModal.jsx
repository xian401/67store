import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel, type = 'warning' }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal animate-in" onClick={e => e.stopPropagation()}>
        <div className={`confirm-icon-box ${type}`}>
          {type === 'warning' ? '⚠️' : '❓'}
        </div>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className={`confirm-yes ${type}`} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
