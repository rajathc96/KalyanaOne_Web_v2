import { useState } from 'react';
import './AccountSettings.css';

import { signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, Eye, EyeOff } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../config';
import { clientAuth } from '../../../firebase';
import deactivateIcon from '../../assets/icons/deactivate.svg'; // red X icon
import deleteIcon from '../../assets/icons/delete.svg'; // trash icon
import handleLogout from '../../clientFunctions/logout';
import DeleteAccount from '../../models/DeleteAccount/DeleteAccount';
import UpdateLoader from '../../models/UpdateLoader/UpdateLoader';
import YesNoModal from '../../models/YesNoModal/YesNoModal';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
  const [isDeactivateLoading, setIsDeactivateLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const handleLogoutClick = async () => {
    setIsLogoutLoading(true);
    await handleLogout();
    setIsLogoutLoading(false);
  };


  const handleDeactivateAccount = async () => {
    setIsDeactivateModalVisible(false);
    setIsDeactivateLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/auth/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        await handleLogout();
      }
      else {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error?.message || "Failed to deactivate account. Please try again later.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsDeactivateLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setErrorMessage("Please fill in both password fields.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage("New password cannot be the same as current password.");
      setIsErrorPopupVisible(true);
      return;
    }

    const uid = clientAuth?.currentUser?.uid;
    if (!uid) {
      setErrorMessage("User not authenticated.");
      setIsErrorPopupVisible(true);
      return;
    }

    const email = clientAuth?.currentUser?.email;
    if (!email) {
      setErrorMessage("User email not found.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsPasswordUpdating(true);
    try {
      const newSignIn = await signInWithEmailAndPassword(
        clientAuth,
        email,
        currentPassword
      );
      if (!newSignIn) {
        setErrorMessage("Current password is incorrect.");
        setIsErrorPopupVisible(true);
        return;
      }

      if (newSignIn.user.uid !== uid || !newSignIn.user.email) {
        setErrorMessage("User re-authentication failed.");
        setIsErrorPopupVisible(true);
        return;
      }

      const token = await newSignIn.user.getIdToken();
      const res = await fetch(`${API_URL}/auth/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "Something went wrong. Please try again.");
        
      if (!data?.customToken)
        throw new Error("Something went wrong. Please try again.");

      try {
        await signInWithCustomToken(clientAuth, data.customToken);
        setIsSuccessPopupVisible(true);
        setCurrentPassword('');
        setNewPassword('');
      }
      catch (error) {
        setErrorMessage("Password updated but re-login failed. Please login again.");
        setIsErrorPopupVisible(true);
      }

    } catch (error) {
      const errorCode = error?.code;
      if (errorCode === 'auth/invalid-email' || errorCode === 'auth/missing-email')
        setErrorMessage("Invalid request. Please try again.");
      else if (errorCode === 'auth/wrong-password')
        setErrorMessage("Invalid Password");
      else if (errorCode === 'auth/invalid-credential')
        setErrorMessage("Invalid Password");
      else if (errorCode === 'auth/missing-password')
        setErrorMessage("Please enter a password.");
      else
        setErrorMessage(error?.message || "An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
      return;
    }
    finally {
      setIsPasswordUpdating(false);
    }
  }

  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Account Settings</p>
        </div>
      </div>
      <div className="account-settings-wrapper">
        <div>
          <div className='desktop-only'>
            <h2 className="account-title">Account settings</h2>
          </div>
          <div className="login-credentials">
            <p className="section-heading">Login credentials</p>
            <input
              type="text"
              value={"+91 - " + (clientAuth?.currentUser?.phoneNumber ? clientAuth?.currentUser?.phoneNumber?.slice(3) : "")}
              disabled
            />
            <input
              type="email"
              disabled
              value={clientAuth?.currentUser?.email || ""}
            />
          </div>

          <div className="login-credentials">
            <p className="section-heading">Change password</p>

            <div className="password-wrapper">
              <input
                type={currentPasswordVisible ? "text" : "password"}
                placeholder="Current password"
                className="login-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}>
                {!currentPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <div className="password-wrapper">
              <input
                type={newPasswordVisible ? "text" : "password"}
                placeholder="New password"
                className="login-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                {!newPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button
            className="save-btn add-photos-btn"
            style={{
              fontSize: "16px",
              width: "100%",
              opacity: currentPassword.trim() === "" || newPassword.trim() === "" || currentPassword === newPassword ? 0.6 : 1
            }}
            onClick={handleUpdatePassword}
            disabled={isPasswordUpdating || currentPassword.trim() === "" || newPassword.trim() === "" || currentPassword === newPassword}
          >
            {isPasswordUpdating ?
              <UpdateLoader size={20} /> :
              "Update Password"}
          </button>

          <button
            className="logout-btn"
            onClick={() => setIsLogoutPopupOpen(true)}
          >
            <span>Logout</span>
          </button>
        </div>

        <div className="deactivate-section">
          <button className="deactivate-btn" onClick={() => setIsDeactivateModalVisible(true)}>
            <img src={deactivateIcon} alt="deactivate" />
            Deactivate account
          </button>

          <button className="delete-btn" onClick={() => setIsDeleteModalVisible(true)}>
            <img src={deleteIcon} alt="delete" />
            Delete account
          </button>
        </div>
      </div>

      <YesNoModal
        show={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
        heading="Logout"
        data="Are you sure you want to logout?"
        onYes={handleLogoutClick}
        buttonText={isLogoutLoading ? <UpdateLoader /> : "Yes"}
        loading={isLogoutLoading}
      />

      <YesNoModal
        show={isDeactivateModalVisible}
        onClose={() => setIsDeactivateModalVisible(false)}
        heading={`Taking a break?\nYour profile will be hidden`}
        data="Login to reactivate and view others"
        onYes={handleDeactivateAccount}
        onlyYes={true}
        buttonText="Deactivate"
        loading={isDeactivateLoading}
      />

      <DeleteAccount
        show={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      />

      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />

      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading='Success'
        data={"Password updated successfully!"}
        buttonText="Ok"
      />

    </>
  );
};

export default AccountSettings;
