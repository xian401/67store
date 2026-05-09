import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo-container">
          <span className="logo-text">67</span>
          <div className="loading-shimmer"></div>
        </div>
        <h1 className="loading-title">6Seven Store</h1>
        <p className="loading-subtitle">Your Daily Store</p>
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
      
      <div className="loading-footer">
        Developed by Christian Achera
      </div>
    </div>
  );
}
