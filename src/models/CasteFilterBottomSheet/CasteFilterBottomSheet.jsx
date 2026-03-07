const CasteFilterBottomSheet = ({ visible, onClose, filter, setFilter }) => {

    const filters = [
        { label: "All", value: "all" },
        { label: "Veerashaiva Lingayath", value: "LGY" },
        { label: "Valmiki", value: "VLM" },
        { label: "Brahmin", value: "BRM" },
        { label: "Vokkaliga", value: "VKG" },
        { label: "Kuruba", value: "KRB" },
        { label: "Lamani", value: "LMN" }
    ];

    return (
        <div className={`right-sheet-backdrop ${visible ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`right-sheet-container ${visible ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
                style={{ bottom: "-40px" }}
            >
                {/* <div className="bottom-sheet-header"></div> */}
                <div className="matches-bottom-sheet-content">
                    <h2 className="matches-bottom-sheet-title">Filter by Caste</h2>
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

export default CasteFilterBottomSheet;
