
const ShortlistRemove = ({ show, onClose, img, heading, data, onYes }) => {
  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {img && <img src={img} alt="img" className="popup-sheet-image" />}
        <p className="popup-sheet-title">{heading}</p>
        <p className="popup-sheet-text">
          {data}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button className="popup-sheet-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-sheet-yes-btn" onClick={onYes}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortlistRemove;