import './RightSheet.css';

const RightSheet = ({ show, onClose }) => {
  return (
    <div className={`right-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`right-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="right-sheet-header"></div>
        <img src="your_image.jpg" alt="meal" className="right-sheet-image" />
        <h2 className="right-sheet-title">Your Meal is Coming</h2>
        <p className="right-sheet-text">
          Your food is on its way and will arrive soon! Sit back and get ready to enjoy your meal.
        </p>
        <button className="right-sheet-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default RightSheet;
