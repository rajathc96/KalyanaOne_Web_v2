import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import filterIcon from "../../assets/icons/sliders.svg";
import verifiedIcon from "../../assets/icons/verified.svg";
import neutralFaceAnimation from "../../assets/emojis/neutral-face.json";
import getMatchBreakdown from "../../clientFunctions/getMatch";
import { AppContext } from "../../context/AppContext";
import SearchFilter from "../../models/SearchFilter/SearchFilter";
import { DATA_CACHE_KEY } from "../home/Home";
import Lists from "../home/Lists";
import { CalculateScore } from "../home/NewlyJoined";
import NewlyJoinedSkeleton from "../home/NewlyJoinedSkeleton";
import "./Search.css";
import VerifiedPopup from "../../models/VerifiedPopup/VerifiedPopup";
import Lottie from "lottie-react";
import Skeleton from "react-loading-skeleton";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

function Search() {
  const { globalData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const [results, setResults] = useState([]);
  const [profileIds, setProfileIds] = useState([]);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isVerifiedPopupVisible, setIsVerifiedPopupVisible] = useState(false);
  const [preferenceToggle, setPreferenceToggle] = useState(!true);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Add this function to filter profile IDs based on input

  const [filters, setFilters] = useState({
    // Basic Details
    ageFrom: "",
    ageTo: "",
    heightFrom: "",
    heightTo: "",
    maritalStatus: "",
    location: [],
    language: [],

    // Caste Details
    caste: "",
    subCaste: [],

    // Education & Career
    highestQualification: [],
    occupation: [],
    company: [],
    annualIncome: "",
    annualIncomeFrom: "",
    annualIncomeTo: "",
    workLocation: [],

    // Personal Details
    weightFrom: "",
    weightTo: "",
    physicalStatus: "",
    foodHabit: "",
    drinking: "",
    smoking: "",

    // Family Details
    familyStatus: "",
    familyType: "",

    // Horoscope Details
    rashi: "",
    nakshatra: "",
    manglikStatus: "",
  });

  const handleSearch = async () => {
    if (!isFilterChanged) return;

    if (preferenceToggle) {
      const tokenResult = await clientAuth?.currentUser?.getIdTokenResult();
      const isPremiumUser = tokenResult.claims?.role === "premium";
      if (!isPremiumUser) return;

      const cached = localStorage.getItem(DATA_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        const results = await Promise.all(
          data.map(async (item) => {
            const breakdown = await getMatchBreakdown(
              item?.partnerPreference,
              globalData
            );
            return breakdown.matchedScore !== 0
              ? { ...item, uid: item.uid }
              : null;
          })
        );
        setResults(results.filter((item) => item !== null));
      }
      return;
    }

    if (
      (!filters.ageFrom && filters.ageTo) ||
      (!filters.ageTo && filters.ageFrom)
    ) {
      setErrorMessage("Age range is required.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (filters.ageFrom && filters.ageTo && filters.ageFrom > filters.ageTo) {
      setErrorMessage("Age 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (
      (!filters.heightFrom && filters.heightTo) ||
      (!filters.heightTo && filters.heightFrom)
    ) {
      setErrorMessage("Height range is required.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (
      filters.heightFrom &&
      filters.heightTo &&
      filters.heightFrom > filters.heightTo
    ) {
      setErrorMessage("Height 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (
      (!filters.weightFrom && filters.weightTo) ||
      (!filters.weightTo && filters.weightFrom)
    ) {
      setErrorMessage("Weight range is required.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (
      filters.weightFrom &&
      filters.weightTo &&
      filters.weightFrom > filters.weightTo
    ) {
      setErrorMessage("Weight 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (!filters.annualIncomeFrom && filters.annualIncomeTo) {
      setErrorMessage("Annual income 'From' value is required when 'To' value is provided.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (
      filters.annualIncomeFrom &&
      filters.annualIncomeTo &&
      filters.annualIncomeFrom > filters.annualIncomeTo
    ) {
      setErrorMessage("Annual income 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsSearchLoading(true);

    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(ua);

    try {
      const res = await fetch(
        isMobile ? `${API_URL}/api/search` : `${API_URL}/api/web/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await clientAuth.currentUser?.getIdToken()}`,
          },
          body: JSON.stringify({ userPreference: filters }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch search results. Please try again.");
      }

      if (data.users && data.users.length > 0) {
        setResults(data.users);
      } else {
        setResults([]);
      }
    } catch (error) {
      setResults([]);
      setErrorMessage(error?.message || "An error occurred while searching. Please try again.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsFilterChanged(false);
      setIsSearchLoading(false);
    }
  };

  const getSuggestions = (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    const filtered = profileIds
      .filter((id) => id.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5); // Limit to 5 suggestions
    setSuggestions(filtered);
  };

  const fetchProfileIds = async () => {
    const tokenResult = await clientAuth?.currentUser?.getIdTokenResult();
    const isPremiumUser = tokenResult.claims?.role === "premium";
    if (!isPremiumUser) return;

    const cached = localStorage.getItem(DATA_CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      const results = await Promise.all(
        data.map(async (item) => {
          const breakdown = await getMatchBreakdown(
            item?.partnerPreference,
            globalData
          );
          return breakdown.matchedScore !== 0
            ? { ...item, uid: item.uid }
            : null;
        })
      );
      setResults(results.filter((item) => item !== null));
    }

    try {
      const res = await fetch(`${API_URL}/api/profile-ids`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResult.token}`,
        }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileIds(data.profileIds || []);
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchProfileIds();
  }, []);

  return (
    <div className="search-wrapper">
      <div className="mobile-only">
        <div className="logo" >
          <span className="logo-text">Search</span>
        </div>
      </div>
      <div
        className="search-tabs"
        style={{
          gap: "10px",
          pointerEvents: `${globalData?.isPremiumUser ? "auto" : "none"}`,
        }}
      >
        <div
          className="search-input-container"
          style={{ position: "relative", width: "100%" }}
        >
          <input
            className="search-input"
            placeholder="Search by profile ID"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              getSuggestions(e.target.value);
            }}
          />
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchInput(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <img
          src={filterIcon}
          alt="filter"
          className="filter-icon-inside"
          onClick={() => setShowFilter(!showFilter)}
        />
      </div>
      {globalData.isPremiumUser && (
        <>
          <h3 className="suggested-heading desktop-only">
            Suggested profiles for you
          </h3>
          <h2
            className="suggested-heading mobile-only"
            style={{ marginTop: "45px" }}
          >
            Profile matches for you
          </h2>
        </>
      )}

      {!globalData?.isPremiumUser ? (
        <div className="search-upgrade-prompt">
          <div className="upgrade-prompt-content">
            <div style={{ fontSize: 36 }}>
              <Lottie
                animationData={neutralFaceAnimation}
                loop
                autoplay
                style={{ width: 80, height: 80 }}
              />
            </div>
            <div className="upgrade-prompt-text">
              Search is a premium feature. Profile search is available for Premium members only.
            </div>
            <button
              className="upgrade-btn"
              style={{ width: "100%", margin: 0 }}
              onClick={() => navigate("/premium")}
            >
              Upgrade to premium
            </button>
          </div>
        </div>
      ) : isSearchLoading ? (
        <>
          <div className="desktop-only">
            <NewlyJoinedSkeleton />
          </div>
          <div className="mobile-only">
            <Skeleton count={10} height={70} style={{ marginTop: 18 }} />
          </div>
        </>
      ) : (
        <div className="search-profiles">
          <div className="desktop-only">
            {results.length > 0 ?
              <div className="profiles-grid">
                {results.map((profile) => (
                  <div key={profile.uid} className="profile-card desktop-only">
                    <div className="profile-image-container">
                      <img
                        src={profile.profilePic}
                        alt={profile.name}
                        className="profile-image"
                        onClick={() => navigate(`/other-profile/${profile.uid}`)}
                      />
                    </div>
                    <div className="profile-info">
                      <div className="profile-header">
                        <span
                          style={{ cursor: "pointer" }}
                          className="profile-id"
                          onClick={() => navigate(`/other-profile/${profile.uid}`)}>
                          {profile.uid}
                          {profile?.isVerified && (
                            <img
                              src={verifiedIcon}
                              alt="Verified"
                              className="verified-badge"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsVerifiedPopupVisible(true);
                              }}
                            />
                          )}
                        </span>
                        {<CalculateScore item={profile} />}
                      </div>
                      <div
                        className="profile-details"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/other-profile/${profile.uid}`)}
                      >
                        {profile.age} Yrs,{" "}
                        {profile.occupation?.length > 16
                          ? profile.occupation.slice(0, 16) + "... "
                          : profile.occupation + ", "}
                        {profile.location?.length > 10
                          ? profile.location.slice(0, 8) + ".."
                          : profile.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="no-results">
                No profiles found matching your criteria.
              </div>
            }
          </div>
          <div className="mobile-only" style={{ width: "100%" }}>
            {results.length > 0 ?
              <Lists data={results} />
              :
              <div className="no-results">
                No profiles found matching your criteria.
              </div>
            }
          </div>
        </div>
      )}

      <SearchFilter
        show={showFilter}
        onClose={() => {
          setShowFilter(false);
          handleSearch();
        }}
        filters={filters}
        setFilters={setFilters}
        setIsFilterChanged={setIsFilterChanged}
        preferenceToggle={preferenceToggle}
        setPreferenceToggle={setPreferenceToggle}
      />

      <VerifiedPopup
        show={isVerifiedPopupVisible}
        onClose={() => setIsVerifiedPopupVisible(false)}
      />

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
        
      />

    </div>
  );
}

export default Search;
