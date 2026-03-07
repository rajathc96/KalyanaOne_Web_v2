import { useState, useEffect, useRef } from "react";
import "./FloatingDateSelect.css";
// import FloatInput from '../FloatInput';
import FloatingInput from "../settings/FloatingInput";

const FloatingDateSelect = ({ label, onChange, value }) => {
  const [step, setStep] = useState(""); // year, month, date
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setStep("month");
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setStep("date");
  };

  const handleDateSelect = (date) => {
    const formattedDate = `${(date).toString().padStart(2, "0")}-${(selectedMonth).toString().padStart(2, "0")}-${selectedYear}`;
    onChange(formattedDate);
    // setStep("year");
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

  // ...existing code...

  const renderOptions = () => {
    if (step === "hidden" || step === "done") {
      return null; // Don't render options if hidden or done
    }

    switch (step) {
      case "year":
        return (
          <>
            <div className="select-label">Select Year</div>
            <div className="options-container visible">
              {years.map((year) => (
                <div
                  key={year}
                  className="option"
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          </>
        );

      case "month":
        return (
          <>
            <div className="select-label">Select Month</div>
            <div className="options-container visible">
              {months.map((month) => (
                <div
                  key={month}
                  className="option"
                  onClick={() => handleMonthSelect(month)}
                >
                  {new Date(2000, month - 1, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </div>
              ))}
            </div>
          </>
        );

      case "date":
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
          <>
            <div className="select-label">Select Date</div>
            <div className="options-container visible">
              {dates.map((date) => (
                <div
                  key={date}
                  className="option"
                  onClick={() => {
                    handleDateSelect(date);
                    setStep("done"); // Hide options after date selection
                  }}
                >
                  {date}
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
    <div ref={containerRef} className="floating-selects">
      <FloatingInput
        value={value || ""}
        placeholder="Date of Birth"
        onClick={() => {
          setStep("year"); // Reset to year selection when input is clicked
          setSelectedYear("");
          setSelectedMonth("");
        }}
      />
      <label>{label}</label>
      {renderOptions()}
    </div>
  );
};

export default FloatingDateSelect;
