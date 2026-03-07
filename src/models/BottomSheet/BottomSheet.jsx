
const BottomSheet = ({ show, onClose }) => {
  return (
    <div className={`bottom-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`bottom-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-header"></div>
        <img src="your_image.jpg" alt="meal" className="bottom-sheet-image" />
        <h2 className="bottom-sheet-title">Your Meal is Coming</h2>
        <p className="bottom-sheet-text">
          Your food is on its way and will arrive soon! Sit back and get ready to enjoy your meal.
        </p>
        <button className="bottom-sheet-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default BottomSheet;
