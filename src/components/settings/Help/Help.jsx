import { useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../../../config';
import { clientAuth } from '../../../../firebase';
import UpdateLoader from '../../../models/UpdateLoader/UpdateLoader';
import YesNoModal from '../../../models/YesNoModal/YesNoModal';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");

  const handleHelp = async () => {
    if (!message.trim()) return;
    if (isLoading) return;
    if (message.length < 10) {
      setErrorPopupMessage("Please provide more details (at least 10 characters).");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");
      const res = await fetch(`${API_URL}/api/complain/help`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "Failed to send your message. Please try again later.");

      setMessage("");
      setSuccessPopupMessage(data?.message || "Your message has been sent successfully!");
      setIsSuccessPopupVisible(true);
    } catch (error) {
      setErrorPopupMessage(error?.message || "An error occurred while sending your message. Please try again later.");
      setIsErrorPopupVisible(true);
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Help</p>
        </div>
      </div>
      <div className="help-wrapper">
        <div className='desktop-only'>
          <h2 className="account-title">Help</h2>
        </div>
        <p className="help-subtext">Let us know what help you need.</p>
        <div>
          <textarea
            className="help-textarea"
            placeholder="Enter details here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleHelp}
            disabled={isLoading || !message.trim()}
            className="submit-btn">
            {isLoading ? <UpdateLoader /> : "Submit"}
          </button>
        </div>
      </div>

      <YesNoModal
        show={isErrorPopupVisible}
        heading="Error"
        data={errorPopupMessage}
        buttonText="OK"
        onClose={() => setIsErrorPopupVisible(false)}
      />
      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data={successPopupMessage}
        buttonText="Ok"
      />
    </>
  );
};

export default Help;
