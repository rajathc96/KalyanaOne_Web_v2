import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import './Details.css';
import YesNoModal from '../../../../models/YesNoModal/YesNoModal';

const options = ['Never married', 'Divorced', 'Widowed'];

const Marital = ({ onBack, onNext, person }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMaritalStatus = async (status) => {
    setSelected(status);

    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) {
        setErrorMessage("User not authenticated. Please log in again.");
        setIsErrorPopupVisible(true);
        return navigate('/login');
      }

      const res = await fetch(`${API_URL}/auth/marital-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ maritalStatus: status }),
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
      setSelected('');
    }
  }

  return (
    <div className="accountfor-options">
      {options.map((option) => (
        <button
          key={option}
          className="accountfor-btn"
          onClick={() => handleMaritalStatus(option)}
        >
          {selected === option ?
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              {option}
              <UpdateLoader />
            </div>
            :
            option
          }
        </button>

      ))}
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default Marital;
