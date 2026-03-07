import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import arrowUp from "../../../assets/icons/arrowup.svg";
import convertHeightToInches from "../../../clientFunctions/convertHeightToInches";
import getPercentage from "../../../clientFunctions/getPercentage";
import { AppContext } from "../../../context/AppContext";
import ProgressBar from "../../../models/ProgressBar";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import BasicDetails from "./BasicDetails";
import CasteDetails from "./CasteDetails";
import EducationCareer from "./EducationCareer";
import FamilyDetails from "./FamilyDetails";
import HoroscopeDetails from "./HoroscopeDetails";
import PersonalDetails from "./PersonalDetails";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { globalData, setGlobalData } = useContext(AppContext);

  const [basicDetails, setBasicDetails] = useState({});
  const [casteDetails, setCasteDetails] = useState({});
  const [educationCareer, setEducationCareer] = useState({});
  const [personalDetails, setPersonalDetails] = useState({});
  const [familyDetails, setFamilyDetails] = useState({});
  const [horoscopeDetails, setHoroscopeDetails] = useState({});

  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isChanged, setIsChanged] = useState(false);

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const filledPercentage = getPercentage(
        basicDetails,
        casteDetails,
        educationCareer,
        personalDetails,
        familyDetails,
        horoscopeDetails
      );

      let start = 0;
      let end = filledPercentage;
      let duration = 800; // ms
      let increment = end > start ? 1 : -1;
      let stepTime = Math.abs(Math.floor(duration / (end - start || 1)));

      setPercentage(start);

      if (start === end) return;

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        setPercentage(current);
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, 1000);
  }, [horoscopeDetails]);

  useEffect(() => {
    if (!globalData.partnerPreference) return;

    const partnerPreference = globalData.partnerPreference;

    setBasicDetails({
      ageFrom: String(partnerPreference?.ageFrom) || "",
      ageTo: String(partnerPreference?.ageTo) || "",
      heightFrom: convertHeightToInches(partnerPreference?.heightFrom) || "",
      heightTo: convertHeightToInches(partnerPreference?.heightTo) || "",
      maritalStatus: partnerPreference?.maritalStatus || "Any",
      location: partnerPreference?.location || [],
      language: partnerPreference?.language || [],
    });

    setCasteDetails({
      caste: partnerPreference?.caste || "",
      subCaste: partnerPreference?.subCaste || []
    });

    setEducationCareer({
      highestQualification: partnerPreference?.highestQualification || [],
      occupation: partnerPreference?.occupation || [],
      // company: partnerPreference?.company || [],
      annualIncome: partnerPreference?.annualIncome || "",
      annualIncomeFrom: partnerPreference?.annualIncomeFrom || "",
      annualIncomeTo: partnerPreference?.annualIncomeTo || "",
      workLocation: partnerPreference?.workLocation || [],
    });

    setPersonalDetails({
      weightFrom: partnerPreference?.weightFrom || "",
      weightTo: partnerPreference?.weightTo || "",
      physicalStatus: partnerPreference?.physicalStatus || "Any",
      foodHabit: partnerPreference?.foodHabit || "Any",
      drinking: partnerPreference?.drinking || "Any",
      smoking: partnerPreference?.smoking || "Any",
    });

    setFamilyDetails({
      familyStatus: partnerPreference?.familyStatus || "Any",
      familyType: partnerPreference?.familyType || "Any",
    });

    setHoroscopeDetails({
      rashi: partnerPreference?.rashi || "Any",
      nakshatra: partnerPreference?.nakshatra || "Any",
      manglikStatus: partnerPreference?.manglikStatus || "Any",
    });

    setIsLoading(false);
  }, [globalData]);

  const [loading, setLoading] = useState(false);

  const handleSavePreferences = async () => {
    if (loading || !isChanged) return;
    if (Number(basicDetails?.ageFrom) > Number(basicDetails?.ageTo)) {
      setErrorMessage("Age 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (educationCareer?.annualIncomeFrom > educationCareer?.annualIncomeTo) {
      setErrorMessage("Annual income 'From' value cannot be greater than 'To' value.");
      setIsErrorPopupVisible(true);
      return;
    }
    
    const updatedData = {
      ...basicDetails,
      ...casteDetails,
      ...educationCareer,
      ...personalDetails,
      ...familyDetails,
      ...horoscopeDetails,
    };

    const token = await clientAuth?.currentUser?.getIdToken();
    if (!token) {
      setErrorMessage("You are not authenticated. Please log in again.");
      setIsErrorPopupVisible(true);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/settings/edit-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updatedData: updatedData }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "Failed to update preference. Please try again later.");

      setGlobalData((prev) => ({
        ...prev,
        partnerPreference: updatedData,
      }));

      setSuccessPopupVisible(true);
      setIsChanged(false);
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred while updating your preference. Please try again later.");
      setIsErrorPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.querySelector('.edit-profile-details')?.scrollTop;
      if (scrollTop > 10) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }
    };

    const scrollContainer = document.querySelector('.edit-profile-details');
    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <div className="mobile-only">
        <div className={`mobile-headers-top ${showBorder ? "bordered" : ""}`}>
          <div className="headers-top">
            <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
            <p className='header-title'>Partner Preference</p>
          </div>
          <div className="save-button-container">
            <button
              onClick={handleSavePreferences}
              className="save-btn"
              disabled={loading || !isChanged}
              style={{ opacity: isChanged ? 1 : 0.6 }}
            >
              {loading ? <UpdateLoader /> : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="edit-profile-details">
        <div className="desktop-only">
          <div className="edit-profile-header">
            <h2 className="account-title">Partner Preference</h2>
            <button
              className="save-btn"
              onClick={handleSavePreferences}
              disabled={loading || !isChanged}
              style={{ opacity: isChanged ? 1 : 0.6 }}
            >
              {loading ? <UpdateLoader /> : "Save"}
            </button>
          </div>
        </div>

        <div className="edit-profile-form" style={{ paddingBottom: "30px" }}>
          {isLoading ?
            <Skeleton count={10} height={60} style={{ marginTop: "12px" }} />
            :
            <>
              <ProgressBar percentage={percentage} />
              <span className="progress-text">Your preference is {percentage}% completed</span>

              <BasicDetails
                basicDetails={basicDetails}
                setBasicDetails={setBasicDetails}
                arrowUp={arrowUp}
                globalData={globalData}
                setIsChanged={setIsChanged}
              />
              <CasteDetails
                casteDetails={casteDetails}
                setCasteDetails={setCasteDetails}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />
              <PersonalDetails
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />
              <EducationCareer
                educationCareer={educationCareer}
                setEducationCareer={setEducationCareer}
                arrowUp={arrowUp}
                globalData={globalData}
                setIsChanged={setIsChanged}
              />

              <FamilyDetails
                familyDetails={familyDetails}
                setFamilyDetails={setFamilyDetails}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />

              <HoroscopeDetails
                horoscopeDetails={horoscopeDetails}
                setHoroscopeDetails={setHoroscopeDetails}
                globalData={globalData}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />

            </>}
        </div>
      </div>
      <YesNoModal
        show={successPopupVisible}
        onClose={() => setSuccessPopupVisible(false)}
        heading="Success"
        data="Partner preference updated successfully."
        buttonText="Ok"
        showCancel={false}
      />
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />
    </>
  );
};

export default EditProfile;
