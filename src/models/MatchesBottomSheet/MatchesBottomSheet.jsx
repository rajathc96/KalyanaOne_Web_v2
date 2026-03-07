import "./MatchesBottomSheet.css";

const MatchesBottomSheet = ({ visible, onClose, filter, setFilter }) => {

    const filters = [
        { label: "All", value: "all" },
        { label: "Age", value: "age" },
        { label: "Height", value: "height" },
        { label: "Income", value: "annualIncome" },
        { label: "Occupation", value: "occupation" },
        { label: "Living In", value: "location" },
        { label: "Education", value: "highestQualification" },
    ];

    return (
        <div className={`right-sheet-backdrop ${visible ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`right-sheet-container ${visible ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet-header"></div>
                <div className="matches-bottom-sheet-content">
                    <h2 className="matches-bottom-sheet-title">Filter based on your partner preferences</h2>
                    <div className="filter-options">
                        {filters.map((option) => (
                            <button
                                key={option.value}
                                className={`filter-option ${filter === option.value ? 'active' : ''}`}
                                onClick={() => setFilter(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchesBottomSheet;
