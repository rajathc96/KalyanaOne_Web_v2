import { useState } from 'react';
import { toast } from 'react-toastify';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import YesNoModal from '../../../../models/YesNoModal/YesNoModal';

const Gender = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenderSelection = async (gender) => {
    setSelectedGender(gender);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/gender`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ gender })
      });
      const responseData = await res.json();

      if (!res.ok) {
        setErrorMessage(responseData?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext(gender);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsLoading(false);
      setSelectedGender(null);
    }
  }

  return (
    <div className="accountfor-options">
      <button className="accountfor-btn" onClick={() => handleGenderSelection('Male')}>Male{isLoading && selectedGender === 'Male' && <>&nbsp; <UpdateLoader /></>}</button>
      <button className="accountfor-btn" onClick={() => handleGenderSelection('Female')}>Female{isLoading && selectedGender === 'Female' && <>&nbsp; <UpdateLoader /></>}</button>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default Gender;
