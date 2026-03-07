import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import arrowUp from "../../../assets/icons/arrowup.svg";
import getPercentage from "../../../clientFunctions/getPercentage";
import { AppContext } from "../../../context/AppContext";
import ProgressBar from "../../../models/ProgressBar";
import UpdateLoader from "../../../models/UpdateLoader/UpdateLoader";
import YesNoModal from "../../../models/YesNoModal/YesNoModal";
import BasicDetails from "./BasicDetails";
import CasteDetails from "./CasteDetails";
import "./EditProfile.css";
import EducationCareer from "./EducationCareer";
import FamilyDetails from "./FamilyDetails";
import HoroscopeDetails from "./HoroscopeDetails";
import PersonalDetails from "./PersonalDetails";
import SocialMediaDetails from "./SocialMediaDetails";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { globalData, setGlobalData } = useContext(AppContext);

  const [about, setAbout] = useState("");
  const [basicDetails, setBasicDetails] = useState([]);
  const [casteDetails, setCasteDetails] = useState([]);
  const [educationCareer, setEducationCareer] = useState([]);
  const [personalDetails, setPersonalDetails] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]);
  const [horoscopeDetails, setHoroscopeDetails] = useState([]);
  const [socialMediaDetails, setSocialMediaDetails] = useState([]);

  const [isChanged, setIsChanged] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!globalData.basicDetails) return;

    setAbout(globalData?.about || "");

    setBasicDetails({
      name: globalData?.name || "",
      height: globalData?.basicDetails?.height || "",
      maritalStatus: globalData?.basicDetails?.maritalStatus || "",
      location: globalData?.basicDetails?.location || "",
      motherTongue: globalData?.basicDetails?.motherTongue || "",
      gender: globalData?.gender || "",
    });

    setCasteDetails({
      subCaste: globalData?.casteDetails?.subCaste || "",
    });

    setEducationCareer({
      highestQualification:
        globalData?.educationCareer?.highestQualification || "",
      college: globalData?.educationCareer?.college || "",
      occupation: globalData?.educationCareer?.occupation || "",
      company: globalData?.educationCareer?.company || "",
      annualIncome: String(globalData?.educationCareer?.annualIncome) || "",
      workLocation: globalData?.educationCareer?.workLocation || "",
    });

    setPersonalDetails({
      weight: globalData?.personalDetails?.weight || "",
      physicalStatus: globalData?.personalDetails?.physicalStatus || "",
      foodHabit: globalData?.personalDetails?.foodHabit || "",
      drinking: globalData?.personalDetails?.drinking || "",
      smoking: globalData?.personalDetails?.smoking || "",
    });

    setFamilyDetails({
      fatherName: globalData?.familyDetails?.fatherName || "",
      fatherOccupation: globalData?.familyDetails?.fatherOccupation || "",
      motherName: globalData?.familyDetails?.motherName || "",
      motherOccupation: globalData?.familyDetails?.motherOccupation || "",
      familyType: globalData?.familyDetails?.familyType || "",
      familyValue: globalData?.familyDetails?.familyValue || "",
      familyStatus: globalData?.familyDetails?.familyStatus || "",
      nativePlace: globalData?.familyDetails?.nativePlace || "",
      noOfBrothers:
        globalData?.familyDetails?.noOfBrothers === "None"
          ? 0
          : isNaN(globalData?.familyDetails?.noOfBrothers)
            ? ""
            : Number(globalData?.familyDetails?.noOfBrothers),
      noOfMarriedBrothers: isNaN(globalData?.familyDetails?.noOfBrothers)
        ? 0
        : globalData?.familyDetails?.noOfMarriedBrothers || 0,
      noOfSisters:
        globalData?.familyDetails?.noOfSisters === "None"
          ? 0
          : isNaN(globalData?.familyDetails?.noOfSisters)
            ? ""
            : Number(globalData?.familyDetails?.noOfSisters),
      noOfMarriedSisters: isNaN(globalData?.familyDetails?.noOfSisters)
        ? 0
        : globalData?.familyDetails?.noOfMarriedSisters || 0,
    });

    setHoroscopeDetails({
      timeOfBirth: globalData?.horoscopeDetails?.timeOfBirth || "",
      placeOfBirth: globalData?.horoscopeDetails?.placeOfBirth || "",
      countryOfBirth: globalData?.horoscopeDetails?.countryOfBirth || "",
      stateOfBirth: globalData?.horoscopeDetails?.stateOfBirth || "",
      rashi: globalData?.horoscopeDetails?.rashi || "",
      nakshatra: globalData?.horoscopeDetails?.nakshatra || "",
      manglikStatus: globalData?.horoscopeDetails?.manglikStatus || "",
      bedagu: globalData?.horoscopeDetails?.bedagu || "",
      gothra: globalData?.horoscopeDetails?.gothra || "",
    });

    setSocialMediaDetails({
      instagram: globalData?.socialMediaDetails?.instagram?.startsWith(
        "https://"
      )
        ? globalData?.socialMediaDetails?.instagram
        : "https://www.instagram.com/",
      linkedin: globalData?.socialMediaDetails?.linkedin?.startsWith("https://")
        ? globalData?.socialMediaDetails?.linkedin
        : "https://www.linkedin.com/",
    });

    setTimeout(() => {
      const filledPercentage = getPercentage(
        globalData.about,
        globalData.basicDetails,
        globalData.casteDetails,
        globalData.educationCareer,
        globalData.personalDetails,
        globalData.familyDetails,
        globalData.horoscopeDetails,
        globalData.socialMediaDetails
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

    }, 500);

    setIsLoading(false);
  }, [globalData]);

  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (loading || !isChanged) return;
    setLoading(true);
    const updatedData = {
      name: basicDetails.name,
      gender: globalData.gender,
      about: about,
      basicDetails: basicDetails,
      casteDetails: casteDetails,
      educationCareer: educationCareer,
      personalDetails: personalDetails,
      horoscopeDetails: horoscopeDetails,
      familyDetails: familyDetails,
      socialMediaDetails: socialMediaDetails,
    };

    try {
      const res = await fetch(`${API_URL}/api/user/settings/edit-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ updatedData: updatedData }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Failed to update profile. Please try again later.");

      setGlobalData((prev) => ({
        ...prev,
        ...updatedData,
        basicDetails: {
          ...updatedData.basicDetails,
          age: prev.basicDetails.age, // force keep old age
        },
        casteDetails: {
          ...prev.casteDetails,
          ...updatedData.casteDetails,
          caste: prev.casteDetails.caste, // force keep old caste
        },
        horoscopeDetails: {
          ...prev.horoscopeDetails,
          ...updatedData.horoscopeDetails,
          dateOfBirth: prev.horoscopeDetails.dateOfBirth, // force keep old date of birth
        },
      }));

      setSuccessPopupVisible(true);
      setIsChanged(false);
    } catch (error) {
      setErrorMessage(error?.message || "An error occurred while updating your profile. Please try again later.");
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

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="mobile-only">
        <div className={`mobile-headers-top ${showBorder ? "bordered" : ""}`}>
          <div className="headers-top">
            <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
            <p className="header-title">Edit Profile</p>
          </div>
          <div className="save-button-container">
            <button
              className="save-btn"
              onClick={handleSaveProfile}
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
          <div className={`edit-profile-header ${showBorder ? "bordered" : ""}`}>
            <h2 className="account-title">Edit Profile</h2>
            <button
              className="save-btn"
              onClick={handleSaveProfile}
              disabled={loading || !isChanged}
              style={{ opacity: isChanged ? 1 : 0.6 }}
            >
              {loading ? <UpdateLoader /> : "Save"}
            </button>
          </div>
        </div>

        <div className="edit-profile-form">
          {isLoading ? (
            <Skeleton count={10} height={60} style={{ marginTop: "12px" }} />
          ) : (
            <>
              <ProgressBar percentage={percentage} />
              <span className="progress-text">
                Your Profile are {percentage}% completed
              </span>
              <p style={{ marginTop: "16px" }}>About you</p>
              <div className="textarea-wrapper">
                <textarea
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                    setIsChanged(true);
                  }}
                  placeholder="Brief description about you"
                  className="textarea-box"
                  rows={4}
                />
                <p className="word-count" style={{ marginTop: "4px" }}>
                  {about.split(" ").filter(Boolean).length}/400 words limit
                </p>
              </div>

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
                globalData={globalData}
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

              <PersonalDetails
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />

              <FamilyDetails
                familyDetails={familyDetails}
                setFamilyDetails={setFamilyDetails}
                arrowUp={arrowUp}
                globalData={globalData}
                setIsChanged={setIsChanged}
              />

              <HoroscopeDetails
                horoscopeDetails={horoscopeDetails}
                setHoroscopeDetails={setHoroscopeDetails}
                globalData={globalData}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />

              <SocialMediaDetails
                socialMediaDetails={socialMediaDetails}
                setSocialMediaDetails={setSocialMediaDetails}
                arrowUp={arrowUp}
                setIsChanged={setIsChanged}
              />
            </>
          )}
        </div>
      </div>
      <YesNoModal
        show={successPopupVisible}
        onClose={() => setSuccessPopupVisible(false)}
        heading="Success"
        data="Profile updated successfully."
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
