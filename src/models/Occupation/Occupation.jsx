import { useState } from "react";
// import "./LargeSelection.css";
import { occupationsSections } from "../../data/occupationdata";

const Occupation = ({
  show,
  onClose,
  onSelect,
  setEducationCareer,
  educationCareer,
//   occupation,
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const handleSelect = (value) => {
    onSelect?.(value);
    onClose();
  };

  const handleOtherAdd = () => {
    if (otherValue.trim()) {
      handleSelect(otherValue.trim());
      setOtherValue("");
      setShowOtherInput(false);
    }
  };

  return (
    <div
      className={`right-sheet-backdrop ${show ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className={`right-sheet-container ${show ? "slide-up" : "slide-down"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="selection-wrapper">
          {/* Scrollable content */}
          <div className="selection-list">
            <p>Choose Occupation</p>
            {occupationsSections.map((section, i) => (
              <div key={i} className="selection-section">
                <h4>{section.title}</h4>
                {section.data.map((item, j) => (
                  <div
                    key={j}
                    className="selection-item"
                    onClick={() => {
                      setEducationCareer({
                        ...educationCareer,
                        occupation: item,
                      });
                      onClose();
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Sticky footer */}
          {!showOtherInput ? (
            <div className="selection-footer">
              <button
                className="footer-btn"
                onClick={() => setShowOtherInput(true)}
              >
                Others
              </button>
              <button className="done-btn" onClick={onClose}>
                Done
              </button>
            </div>
          ) : (
            <div className="selection-footer other-footer">
              <div className="other-input-row">
                <input
                  type="text"
                  placeholder="Enter other..."
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                />
                <button className="add-btn" onClick={handleOtherAdd}>
                  Add
                </button>
              </div>
              <button
                className="cancel-btn"
                onClick={() => setShowOtherInput(false)}
              >
                Cancel
              </button>
              <button className="done-btn" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Occupation;
