import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../../../config';
import { clientAuth } from '../../../../firebase';
import { Switch } from '../../../models/Switch/Switch';
import './PrivacySettings.css';
import YesNoModal from '../../../models/YesNoModal/YesNoModal';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [photoVisibleToAll, setPhotoVisibleToAll] = useState(true);
  const [horoscopeVisibleToAll, setHoroscopeVisibleToAll] = useState(true);
  const [contactVisibleToAll, setContactVisibleToAll] = useState(true);

  const fetchPrivacySettings = async () => {
    setIsLoading(true);

    try {
      const token = await clientAuth?.currentUser?.getIdToken();

      const response = await fetch(`${API_URL}/api/user/settings/privacy`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) 
        throw new Error(data.error || "Failed to fetch privacy settings");

      setPhotoVisibleToAll(data?.photoVisibleToAll ?? true);
      setHoroscopeVisibleToAll(data?.horoscopeVisibleToAll ?? true);
      setContactVisibleToAll(data?.contactVisibleToAll ?? true);

    } catch (error) {
      setErrorMessage(error?.message || "Failed to load privacy settings. Please try again later.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const handleToggleChange = async (type) => {
    try {
      const value = type === "photoVisibleToAll" ? !photoVisibleToAll : type === "horoscopeVisibleToAll" ? !horoscopeVisibleToAll : !contactVisibleToAll;

      switch (type) {
        case "photoVisibleToAll":
          setPhotoVisibleToAll((prev) => !prev);
          break;
        case "horoscopeVisibleToAll":
          setHoroscopeVisibleToAll((prev) => !prev);
          break;
        case "contactVisibleToAll":
          setContactVisibleToAll((prev) => !prev);
          break;
        default:
          return;
      }
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");
      const response = await fetch(`${API_URL}/api/user/settings/privacy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: type, value: value }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to update privacy setting ${type}`);
      }

    }
    catch (error) {
      switch (type) {
        case "photoVisibleToAll":
          setPhotoVisibleToAll((prev) => !prev);
          break;
        case "horoscopeVisibleToAll":
          setHoroscopeVisibleToAll((prev) => !prev);
          break;
        case "contactVisibleToAll":
          setContactVisibleToAll((prev) => !prev);
          break;
        default:
          return;
      }
      setErrorMessage(error?.message || `Failed to update privacy setting ${type}. Please try again later.`);
      setIsErrorPopupVisible(true);
    }
  }

  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Privacy Settings</p>
        </div>
      </div>
      <div className="privacy-settings-wrapper">
        <div className='desktop-only'>
          <h2 className="account-title">Privacy settings</h2>
        </div>

        {/* <div className="privacy-section">
          <p className="privacy-subtitle">Photos visibility</p>
          <hr />

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to all (recommended)</p>
              <p className="option-subtext">Visible to free and paid users</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="photoVisibilitySwitch"
                  checked={photoVisibleToAll}
                  onChange={() => handleToggleChange("photoVisibleToAll")}
                />}
            </div>
          </div>

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to members I give access to</p>
              <p className="option-subtext">Visible to people who requests to see photos</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="photoVisibilitySwitch"
                  checked={!photoVisibleToAll}
                  onChange={() => handleToggleChange("photoVisibleToAll")}
                />}
            </div>
          </div>
        </div> */}

        {/* Section: Horoscope */}
        <div className="privacy-section">
          <p className="privacy-subtitle">Horoscope visibility</p>
          {/* <hr /> */}

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to all (Premium members)</p>
              <p className="option-subtext">Only paid members can view your horoscope</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="horoscopeVisibilitySwitch"
                  checked={horoscopeVisibleToAll}
                  onChange={() => handleToggleChange("horoscopeVisibleToAll")}
                />}
            </div>
          </div>

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to members I give access to</p>
              <p className="option-subtext">Visible to people who requests to view</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="horoscopeVisibilitySwitch"
                  checked={!horoscopeVisibleToAll}
                  onChange={() => handleToggleChange("horoscopeVisibleToAll")}
                />}
            </div>
          </div>
        </div>

        {/* Section: Contact */}
        <div className="privacy-section">
          <p className="privacy-subtitle">Contact details visibility</p>
          {/* <hr /> */}

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to all (Premium members)</p>
              <p className="option-subtext">Only paid members can view your contact details</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="contactVisibilitySwitch"
                  checked={contactVisibleToAll}
                  onChange={() => handleToggleChange("contactVisibleToAll")}
                />}
            </div>
          </div>

          <div className="privacy-option">
            <div>
              <p className="option-title">Visible to members I give access to</p>
              <p className="option-subtext">Visible to people who requests to view</p>
            </div>
            <div>
              {isLoading ?
                <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
                :
                <Switch
                  id="contactVisibilitySwitch"
                  checked={!contactVisibleToAll}
                  onChange={() => handleToggleChange("contactVisibleToAll")}
                />}
            </div>
          </div>
        </div>
      </div>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />
    </>
  );
};

export default PrivacySettings;
