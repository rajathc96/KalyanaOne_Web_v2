import { useState } from 'react';
import { toast } from 'react-toastify';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import './Details.css';
import YesNoModal from '../../../../models/YesNoModal/YesNoModal';

const qualifications = [
  '10th Standard',
  '12th Standard',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  "Don't wish to specify"
];

const Qualification = ({ onNext, viewportHeight }) => {
  const [selectedQualification, setSelectedQualification] = useState('');
  const [customQualification, setCustomQualification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQualificationSelection = async () => {
    const qualification = selectedQualification === 'Others' ? customQualification : selectedQualification;

    if (!qualification || qualification.trim() === '') {
      setErrorMessage("Please select or enter a qualification");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/qualification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ qualification }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    }
    catch (error) {
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
          {selectedQualification !== 'Others' && qualifications.map((qual) => (
            <button
              key={qual}
              className={`accountfor-btn ${selectedQualification === qual ? 'active' : ''}`}
              onClick={() => setSelectedQualification(qual)}
            >
              {qual}
            </button>
          ))}

          {selectedQualification === 'Others' && (
            <input
              type="text"
              autoFocus
              className="accountfor-btn"
              placeholder="Enter your qualification"
              value={customQualification}
              onChange={(e) => setCustomQualification(e.target.value)}
            />
          )}

          <button
            className={`accountfor-btn ${selectedQualification === "Others" ? 'active' : ''}`}
            onClick={() => setSelectedQualification(selectedQualification === "Others" ? "" : "Others")}
          >
            {selectedQualification === "Others" ? "Cancel" : "Others"}
          </button>

        </div>
      </div>

      <button
        className="get-started-btn"
        disabled={isLoading}
        onClick={handleQualificationSelection}
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

export default Qualification;
