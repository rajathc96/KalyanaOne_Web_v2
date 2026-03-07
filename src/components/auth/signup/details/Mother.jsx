import { useState } from 'react';
import { toast } from 'react-toastify';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import YesNoModal from '../../../../models/YesNoModal/YesNoModal';

const languages = [
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Marathi',
  'Konkani',
  'Hindi',
  'Bengali'
];

const Mother = ({ onNext, viewportHeight }) => {
  const [selected, setSelected] = useState('');
  const [customLang, setCustomLang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectLanguage = async (language) => {
    if (!language || language.trim() === '') {
      setErrorMessage("Please select or enter a mother tongue");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/mother-tongue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ motherTongue: language }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="inside-detail-container"
      style={{ height: viewportHeight - 160 }}>
      <div className="inside-detail-subcontainer">

        <div className="accountfor-options">
          {selected !== 'Others' && languages.map((lang) => (
            <button
              key={lang}
              className={`accountfor-btn ${selected === lang ? 'active' : ''}`}
              onClick={() => setSelected(lang)}
            >
              {lang}
            </button>
          ))}

          {selected === 'Others' && (
            <input
              type="text"
              autoFocus
              className="accountfor-btn"
              placeholder="Enter your mother tongue"
              value={customLang}
              onChange={(e) => setCustomLang(e.target.value)}
            />
          )}

          <button
            className={`accountfor-btn ${selected === "Others" ? 'active' : ''}`}
            onClick={() => setSelected(selected === "Others" ? "" : "Others")}
          >
            {selected === "Others" ? "Cancel" : "Others"}
          </button>

        </div>
      </div>

      <button
        className="get-started-btn"
        disabled={isLoading}
        onClick={handleSelectLanguage.bind(this, selected === 'Others' ? customLang : selected)}
      >
        {isLoading ?
          <UpdateLoader color="#fff" />
          :
          "Continue"
        }
      </button>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default Mother;
