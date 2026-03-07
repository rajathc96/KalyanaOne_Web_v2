import Lottie from "lottie-react";
import UpdateLoader from "../UpdateLoader/UpdateLoader";

const YesNoModal = ({
  show,
  onClose,
  img,
  lottie,
  heading = "Error",
  data,
  onYes,
  onlyYes = false,
  showCancel = true,
  buttonText = "Yes",
  loading = false
}) => {
  return (
    <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={loading ? null : onClose}>
      <div
        className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
        style={{ padding: "30px"}}
        onClick={(e) => e.stopPropagation()}
      >
        {img && <img src={img} alt="img" className="popup-sheet-image" />}
        {lottie &&
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: '15px' }}>
            <Lottie
              animationData={lottie}
              loop
              autoplay
              style={{ width: 80, height: 80 }}
            />
          </div>
        }
        {onlyYes ? <p
          className="popup-sheet-title"
          style={{ textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3, fontSize: '18px', fontWeight: '500', marginTop: '15px' }}
        >
          {heading}
        </p> :
          <p className="popup-sheet-title">{heading}</p>
        }
        {onlyYes ?
          <p
            className="popup-sheet-text"
            style={{ textAlign: 'center', margin: '10px 25px 25px' }}
          >
            {data}
          </p>
          :
          <p className="popup-sheet-text">
            {data}
          </p>
        }
        {onlyYes ?
          <button
            className="popup-sheet-yes-btn"
            style={{ width: '100%', borderRadius: '20px', fontSize: '16px' }}
            onClick={loading ? null : onYes}>
            {loading ? <UpdateLoader /> : buttonText}
          </button>
          :
          <div style={{ display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '20px' }}>
            <button
              className="popup-sheet-cancel-btn"
              onClick={loading ? null : onClose}
              style={{ display: showCancel ? 'block' : 'none' }}
            >
              Cancel
            </button>
            <button className="popup-sheet-yes-btn" onClick={loading ? null : onYes ? onYes : onClose}>
              {loading ? <UpdateLoader /> : buttonText}
            </button>
          </div>}
      </div>
    </div>
  );
};

export default YesNoModal;