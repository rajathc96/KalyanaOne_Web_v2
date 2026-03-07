import { useContext, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/x.svg";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import FloatingMultipleSelect from "../../components/settings/FloatingMultipleSelect";
import FloatingSelect from "../../components/settings/FloatingSelect";
import casteNames from "../../data/casteNames";
import { AppContext } from "../../context/AppContext";
import {
  drinkinghabits,
  familystatus,
  familytype,
  foodhabits,
  heightOptions,
  incomeRanges,
  languages,
  manglikstatus,
  maritalstatus,
  nakshatras,
  physicalstatus,
  rashis,
  smokinghabits,
  weights as weight,
} from "../../data/searchFilters";
import PartnerQualificationSelection from "../PartnerQualificationSelection/PartnerQualificationSelection";
import PartnerOccupationSelection from "../PartnerOccupationSelection/PartnerOccupationSelection";
import FloatingMultiplesCitySelect from "../../components/settings/FloatingMultiplesCitySelect";
import { Switch } from "../Switch/Switch";

const SearchData = ({ onClose, filters, setFilters, setIsFilterChanged, preferenceToggle, setPreferenceToggle }) => {
  const { globalData } = useContext(AppContext);
  const [showPartnerQualification, setShowPartnerQualification] = useState(false);
  const [showPartnerOccupation, setShowPartnerOccupation] = useState(false);

  // const [preferenceToggle, setPreferenceToggle] = useState(!true);
  const [subCastes, setSubCastes] = useState([]);
  const [isSubCasteLoading, setIsSubCasteLoading] = useState(false);

  const ageOptions = Array.from({ length: 60 - 17 }, (_, i) => (i + (globalData?.gender === "Male" ? 18 : 21)).toString());

  const getSubCasteData = async () => {
    if (!filters.caste || filters.caste === "Any") return;
    setSubCastes([]);
    try {
      setIsSubCasteLoading(true);
      const token = await clientAuth?.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/api/user/subcastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ caste: filters.caste })
      });
      const data = await res.json();
      if (res.ok) {
        setSubCastes(data);
      }
    }
    catch (error) { }
    finally {
      setIsSubCasteLoading(false);
    }
  }

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subCaste: [],
    }));
    getSubCasteData();
  }, [filters.caste]);

  return (
    <>
      <div className="search-filter-header">
        <h3 style={{ fontWeight: "500" }} >Search filters</h3>
        <img
          src={closeIcon}
          alt="close"
          onClick={onClose}
          className="close-btn"
        />
      </div>
      <div className="notification-item" style={{ width: "99%", marginBottom: "15px" }}>
        <p className="notification-heading">
          Filter based on your preference
        </p>
        <Switch
          id="matchesSwitch"
          onChange={() => setPreferenceToggle((prev) => {
            setIsFilterChanged(true);
            return !prev;
          })}
        />
      </div>
      {preferenceToggle ?
        <div className="search-filter-panel">
          <div className="filter-section" style={{ textAlign: "center", fontSize: "16px", color: "#000", marginTop: "50%" }}>
            Filters are now applied based on<br /> your partner preference<br /><br />
            <p style={{ fontSize: "14px", color: "#555", fontWeight: "400" }}>
              Disable the toggle to set filters manually
            </p>
          </div>
        </div>
        :
        <div className="search-filter-panel">
          <div className="filter-section">
            <div className="filter-row">
              <FloatingSelect
                label="Age From"
                value={filters.ageFrom}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, ageFrom: value })
                }}
                options={ageOptions}
                width={"160px"}
              />
              <FloatingSelect
                label="Age To"
                value={filters.ageTo}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, ageTo: value })
                }}
                options={ageOptions}
                width={"160px"}
              />
            </div>
          </div>

          {/* Height */}
          <div className="filter-section">
            <div className="filter-row">
              <FloatingSelect
                label="Height From"
                value={filters.heightFrom}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, heightFrom: value })
                }}
                options={heightOptions}
                width={"160px"}
              />
              <FloatingSelect
                label="Height To"
                value={filters.heightTo}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, heightTo: value })
                }}
                options={heightOptions}
                width={"160px"}
              />
            </div>
          </div>

          {/* Subcaste */}
          <div className="filter-section">
            <FloatingSelect
              label="Marital Status"
              value={filters.maritalStatus}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, maritalStatus: value })
              }}
              options={maritalstatus}
              width={"333px"}
            />
          </div>

          <div className="filter-section">
            <FloatingMultiplesCitySelect
              label="Living In"
              value={filters.location}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, location: value })
              }}
            />
          </div>

          <div className="filter-section">
            <FloatingMultipleSelect
              placeholder="Language"
              value={filters.language}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, language: value })
              }}
              options={languages}
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Caste"
              value={filters.caste}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, caste: value })
              }}
              options={["Any", ...casteNames]}
              width={"333px"}
            />
          </div>

          {filters.caste && filters.caste !== "Any" && <div className="filter-section">
            <FloatingMultipleSelect
              placeholder="Sub Caste"
              value={filters.subCaste}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, subCaste: value })
              }}
              options={subCastes}
              loading={isSubCasteLoading}
              allowCustomInput={true}
            />
          </div>}

          <div className="filter-section">
            <FloatingMultipleSelect
              placeholder="Highest qualification"
              value={filters.highestQualification}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, highestQualification: value })
              }}
              disabled={true}
              onDisabledClick={() => setShowPartnerQualification(true)}
            />
          </div>

          <div className="filter-section">
            <FloatingMultipleSelect
              placeholder="Occupation"
              value={filters.occupation}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, occupation: value })
              }}
              disabled={true}
              onDisabledClick={() => setShowPartnerOccupation(true)}
            />
          </div>

          {/* <div className="filter-section">
            <FloatingSelect
              label="Company"
              value={filters.company}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, company: value })
              }}
              options={company}
              width="333px"
            />
          </div> */}

          <div className="filter-section">
            <FloatingSelect
              label="Annual Income"
              value={filters.annualIncome}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({
                  ...filters,
                  annualIncome: value,
                  annualIncomeFrom: incomeRanges.find(item => item.label === value)?.from,
                  annualIncomeTo: incomeRanges.find(item => item.label === value)?.to,
                })
              }}
              options={incomeRanges.map(item => item.label)}
            />
          </div>

          <div className="filter-section">
            <p style={{ fontWeight: "500", marginBottom: "8px" }}>Weight</p>
            <div className="filter-row">
              <FloatingSelect
                label="From"
                value={filters.weightFrom}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, weightFrom: value })
                }}
                options={weight}
                width="160px"
              />
              <FloatingSelect
                label="To"
                value={filters.weightTo}
                onChange={(value) => {
                  setIsFilterChanged(true);
                  setFilters({ ...filters, weightTo: value })
                }}
                options={weight}
                width="160px"
              />
            </div>
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Physical Status"
              value={filters.physicalStatus}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, physicalStatus: value })
              }}
              options={physicalstatus}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Food Habits"
              value={filters.foodHabit}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, foodHabit: value })
              }}
              options={foodhabits}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Smoking"
              value={filters.smoking}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, smoking: value })
              }}
              options={smokinghabits}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Drinking"
              value={filters.drinking}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, drinking: value })
              }}
              options={drinkinghabits}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Family Type"
              value={filters.familyType}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, familyType: value })
              }}
              options={familytype}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Family Status"
              value={filters.familyStatus}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, familyStatus: value })
              }}
              options={familystatus}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Nakshatra"
              value={filters.nakshatra}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, nakshatra: value })
              }}
              options={nakshatras}
              width="333px"
            />
          </div>

          <div className="filter-section">
            <FloatingSelect
              label="Rashi"
              value={filters.rashi}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, rashi: value })
              }}
              options={rashis}
              width="333px"
            />
          </div>

          <div className="filter-section" style={{ marginBottom: 0 }}>
            <FloatingSelect
              label="Manglik Status (Dosha)"
              value={filters.manglikStatus}
              onChange={(value) => {
                setIsFilterChanged(true);
                setFilters({ ...filters, manglikStatus: value })
              }}
              options={manglikstatus}
              width="333px"
            />
          </div>
          <PartnerQualificationSelection
            show={showPartnerQualification}
            onClose={() => setShowPartnerQualification(false)}
            setEducationCareer={(value) => {
              setIsFilterChanged(true);
              setFilters(value)
            }}
            educationCareer={filters}
          />
          <PartnerOccupationSelection
            show={showPartnerOccupation}
            onClose={() => setShowPartnerOccupation(false)}
            setEducationCareer={(value) => {
              setIsFilterChanged(true);
              setFilters(value)
            }}
            educationCareer={filters}
          />
        </div>}
    </>
  );
};

export default SearchData;
