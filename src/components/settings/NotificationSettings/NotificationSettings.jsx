import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../../../config';
import { clientAuth } from '../../../../firebase';
import { Switch } from '../../../models/Switch/Switch';
import './NotificationSettings.css';
import YesNoModal from '../../../models/YesNoModal/YesNoModal';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [toggles, setToggles] = useState({
    interest: true,
    request: true,
    matches: true,
    email: true,
  });

  const fetchNotificationSettings = async () => {
    setIsLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/user/settings/notification`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch notification settings");

      if (data.length === 0)
        return;

      setToggles(data);
    } catch (error) {
      setErrorMessage(error?.message || "Failed to load notification settings. Please try again later.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const handleToggle = async (id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");
      const response = await fetch(`${API_URL}/api/user/settings/notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: id, value: !toggles[id] }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Failed to update privacy setting ${id}`);
    }
    catch (error) {
      setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
      setErrorMessage(error?.message || "An error occured. Please try again.");
      setIsErrorPopupVisible(true);
    }
  };


  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Notification Settings</p>
        </div>
      </div>
      <div className="notification-wrapper">
        <div className='desktop-only'>
          <h2 className="account-title">Notification settings</h2>
        </div>
        <div className="notification-item">
          <div>
            <p className="notification-heading">Interest accepted / declined</p>
            <p className="notification-subtext">Notify when someone accepted your interest</p>
          </div>
          <div>
            {isLoading ?
              <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
              :
              <Switch
                id="interestSwitch"
                checked={toggles.interest}
                onChange={() => handleToggle('interest')}
              />}
          </div>
        </div>

        <div className="notification-item">
          <div>
            <p className="notification-heading">Request accepted / declined</p>
            <p className="notification-subtext">Notify when someone accepted your request</p>
          </div>
          <div>
            {isLoading ?
              <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
              :
              <Switch
                id="requestSwitch"
                checked={toggles.request}
                onChange={() => handleToggle('request')}
              />}
          </div>
        </div>

        <div className="notification-item">
          <div>
            <p className="notification-heading">Matches</p>
            <p className="notification-subtext">
              Notify newly added profiles matches your profile
            </p>
          </div>
          <div>
            {isLoading ?
              <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
              :
              <Switch
                id="matchesSwitch"
                checked={toggles.matches}
                onChange={() => handleToggle('matches')}
              />}
          </div>
        </div>

        <div className="notification-item">
          <div>
            <p className="notification-heading">Email notification</p>
            <p className="notification-subtext">
              Notify updates through email service
            </p>
          </div>
          <div>
            {isLoading ?
              <Skeleton width={40} height={24} style={{ borderRadius: '12px' }} />
              :
              <Switch
                id="emailSwitch"
                checked={toggles.email}
                onChange={() => handleToggle('email')}
              />}
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

export default NotificationSettings;
