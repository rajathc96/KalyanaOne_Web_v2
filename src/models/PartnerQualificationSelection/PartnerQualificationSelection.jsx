import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../RightSheet/RightSheet.css";
import checkcircle1 from "../../assets/icons/check_circle1.svg";
import { qualificationsSections } from "../../data/occupationdata";
const PartnerQualificationSelection = ({
  show,
  onClose,
  onSelect,
  setEducationCareer,
  educationCareer,
}) => {
  const [tempSelected, setTempSelected] = useState(
    educationCareer?.highestQualification || []
  );
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [limitMessage, setLimitMessage] = useState("");

  useEffect(() => {
    if (show) {
      setTempSelected(educationCareer?.highestQualification || []);
      setLimitMessage("");
    }
  }, [show, educationCareer]);

  useEffect(() => {
    if (tempSelected.length < 10 && limitMessage) {
      setLimitMessage("");
    }
  }, [tempSelected, limitMessage]);

  const toggleSelect = (item) => {
    setTempSelected((prev) => {
      if (!prev.includes(item) && prev.length >= 10) {
        setLimitMessage("You can select up to 10 qualifications.");
        return prev;
      }
      return prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item];
    });
  };

  const handleDone = () => {
    setEducationCareer({
      ...educationCareer,
      highestQualification: tempSelected,
    });
    onSelect?.(tempSelected);
    onClose();
  };

  //   const handleCancel = () => {
  //     setTempSelected(educationCareer?.highestQualification || []);
  //     onClose();
  //   };

  const handleOtherAdd = () => {
    if (otherValue.trim()) {
      if (tempSelected.length >= 10) {
        setLimitMessage("You can select up to 10 qualifications.");
        return;
      }
      setTempSelected((prev) => [...prev, otherValue.trim()]);
      setOtherValue("");
      setShowOtherInput(false);
      setLimitMessage("");
    }
  };

  const content = (
    <div
      className={`right-sheet-backdrop ${show ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className={`right-sheet-container ${show ? "slide-up" : "slide-down"}`}
        onClick={(e) => e.stopPropagation()}
        style={{ bottom: "-30px" }}
      >
        <p style={{ marginTop: limitMessage ? "1px" : "10px", marginBottom: limitMessage ? "2px" : "10px", fontSize: "18px" }}>Choose Qualification</p>
        {limitMessage && (
          <div style={{ color: "#d9534f", fontSize: "12px", marginTop: "2px", marginBottom: "2px" }}>
            {limitMessage}
          </div>
        )}
        <div className="selection-wrapper">
          {/* Selected tags preview */}
          {tempSelected.length > 0 && (
            <div className="selected-tags">
              {tempSelected.map((item, idx) => (
                <span key={idx} className="tag">
                  {item}<button type="button" className="remove-btn" onClick={() => toggleSelect(item)}>×</button>
                </span>
              ))}
            </div>
          )}

          {/* Scrollable list */}
          <div className="selection-list">
            {qualificationsSections.map((section, i) => (
              <div key={i} className="selection-section">
                <h4 style={{fontWeight: "500"}}>{section.title}</h4>
                {section.data.map((item, j) => {
                  const isSelected = tempSelected.includes(item);
                  return (
                    <div
                      key={j}
                      className={`selection-item ${isSelected ? "selected" : ""
                        }`}
                      onClick={() => toggleSelect(item)}
                    >
                      <span>{item}</span>
                      {isSelected && (
                        <img
                          src={checkcircle1}
                          alt="selected"
                        />
                      )}
                    </div>
                  );
                })}
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
              {/* <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button> */}
              <button className="done-btn" onClick={handleDone}>
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
              <button className="done-btn" onClick={handleDone}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default PartnerQualificationSelection;
