import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../../../config";
import { clientAuth } from "../../../../../firebase";
import UpdateLoader from "../../../../models/UpdateLoader/UpdateLoader";
import "./Details.css";
import YesNoModal from "../../../../models/YesNoModal/YesNoModal";

const options = [
  "Myself",
  "My Son",
  "My Daughter",
  "My Brother",
  "My Sister",
  "My Friend",
];

const Accountfor = ({ onNext, onSkipNext, setPerson }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAccountForPress = async (item) => {
    if (!clientAuth?.currentUser) {
      setErrorMessage("You are not logged in. Please log in to continue.");
      setIsErrorPopupVisible(true);
      return navigate("/login");
    }
    setSelected(item);
    try {
      const res = await fetch(`${API_URL}/auth/account-for`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ accountFor: item }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      if (item === "Myself") {
        setPerson("your");
        onNext();
      }
      else if (item === "My Friend") {
        setPerson("your friend");
        onNext();
      }
      else {
        setPerson(item === "My Son" ? "your son" : item === "My Daughter" ? "your daughter" : item === "My Brother" ? "your brother" : "your sister");
        onSkipNext();
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setSelected('');
    }
  }

  return (
    <div className="accountfor-options">
      {options.map((option, idx) => (
        <button
          key={idx}
          className="accountfor-btn"
          onClick={handleAccountForPress.bind(null, option)}
        >
          {selected === option ?
            <div
              className="account-for-content"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              {option}
              <UpdateLoader color="#d9d9d9" />
            </div>
            :
            option
          }
        </button>
      ))}
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

export default Accountfor;
