import { useState } from 'react';
import './LoginScreen.css';
import { FiLock, FiCheck } from 'react-icons/fi';

export default function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const CORRECT_PIN = "2004"; // You can change this or we can make it configurable

  const handleNumber = (num) => {
    if (pin.length < 4) {
      setError(false);
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => setPin('');

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      onLogin();
    } else {
      setError(true);
      setPin('');
      // Shake animation effect
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="login-overlay">
      <div className={`login-card animate-in ${error ? 'shake' : ''}`}>
        <div className="login-header">
          <div className="lock-icon-box">
            <FiLock />
          </div>
          <h2>Admin Access</h2>
          <p>Please enter your 4-digit security PIN</p>
        </div>

        <div className="pin-display">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`pin-dot ${pin.length > i ? 'active' : ''}`}></div>
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleNumber(num.toString())}>{num}</button>
          ))}
          <button onClick={handleClear} className="clear">C</button>
          <button onClick={() => handleNumber("0")}>0</button>
          <button onClick={handleSubmit} className="submit">
            <FiCheck />
          </button>
        </div>
        
        {error && <div className="login-error">Incorrect PIN. Try again.</div>}
      </div>
      
      <div className="login-footer">
        6Seven Store Admin Terminal
      </div>
    </div>
  );
}
