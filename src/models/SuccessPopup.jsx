
const SuccessPopup = ({ show, onClose, heading, data, onYes }) => {
  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-sheet-header">
          {/* {img && <img src={img} alt="img" className="popup-sheet-image" />} */}
          <div style={{ marginTop: '20px' }}>
            <p className="popup-sheet-title">{heading}</p>
            <p className="popup-sheet-text">
              {data}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', gap: '20px', marginTop: '20px' }}>
          <button className="popup-sheet-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-sheet-yes-btn" onClick={onYes}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
