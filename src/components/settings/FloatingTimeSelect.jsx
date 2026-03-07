import { useEffect, useRef, useState } from "react";
import FloatingInput from "./FloatingInput";

const FloatingTimeSelect = ({ label, onChange, value }) => {
  const [step, setStep] = useState(""); // ampm, hour, minute
  const [selectedAMPM, setSelectedAMPM] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const ampmOptions = ["AM", "PM"];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59

  const handleAMPMSelect = (ampm) => {
    setSelectedAMPM(ampm);
    setStep("hour");
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    setStep("minute");
  };

  const handleMinuteSelect = (minute) => {
    const formattedMinute = minute.toString().padStart(2, "0");
    const formattedTime = `${selectedHour}:${formattedMinute} ${selectedAMPM}`;
    onChange(formattedTime);
    setStep("done");
  };

  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setStep("hidden");
      }
    };

    // Use pointerdown to cover mouse/touch/pen input. Keep touchstart as fallback.
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const renderOptions = () => {
    if (step === "hidden" || step === "done") {
      return null; // Don't render options if hidden or done
    }

    switch (step) {
      case "ampm":
        return (
          <>
            <div className="select-label">Select AM/PM</div>
            <div className="options-container visible">
              {ampmOptions.map((ampm) => (
                <div
                  key={ampm}
                  className="option"
                  onClick={() => handleAMPMSelect(ampm)}
                >
                  {ampm}
                </div>
              ))}
            </div>
          </>
        );

      case "hour":
        return (
          <>
            <div className="select-label">Select Hour</div>
            <div className="options-container visible">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="option"
                  onClick={() => handleHourSelect(hour)}
                >
                  {hour}
                </div>
              ))}
            </div>
          </>
        );

      case "minute":
        return (
          <>
            <div className="select-label">Select Minute</div>
            <div className="options-container visible">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className="option"
                  onClick={() => handleMinuteSelect(minute)}
                >
                  {minute.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="floating-selects" style={{ width: "100%" }}>
      <FloatingInput
        value={value || ""}
        placeholder={label}
        onClick={() => {
          setStep("ampm");
          setSelectedAMPM("");
          setSelectedHour("");
        }}
      />
      {renderOptions()}
    </div>
  );
};

export default FloatingTimeSelect;
