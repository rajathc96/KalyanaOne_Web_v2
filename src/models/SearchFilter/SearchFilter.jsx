import SearchData from "./SearchData";

const SearchFilter = ({ show, onClose, filters, setFilters, setIsFilterChanged, preferenceToggle, setPreferenceToggle }) => {
  return (
    <div className={`right-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className={`right-sheet-container ${show ? 'slide-up' : 'slide-down'} search-filter`}
        onClick={(e) => e.stopPropagation()}
      >
        <SearchData
          onClose={onClose}
          filters={filters}
          setFilters={setFilters}
          setIsFilterChanged={setIsFilterChanged}
          preferenceToggle={preferenceToggle}
          setPreferenceToggle={setPreferenceToggle}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
