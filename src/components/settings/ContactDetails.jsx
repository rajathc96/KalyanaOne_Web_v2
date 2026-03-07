import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config";
import { clientAuth } from "../../../firebase";
import { AppContext } from "../../context/AppContext";
import UpdateLoader from "../../models/UpdateLoader/UpdateLoader";
import "./ContactDetails.css";
import FloatingInput from "./FloatingInput";
import YesNoModal from "../../models/YesNoModal/YesNoModal";

const ContactDetails = () => {
  const { globalData, setGlobalData } = useContext(AppContext);
  const navigate = useNavigate();
  const [altContact, setAltContact] = useState("");
  const phoneFormat = /^[6-9][0-9]{9}$/;
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  useEffect(() => {
    if (globalData?.contactDetails?.altContact) {
      setAltContact(globalData.contactDetails.altContact);
    }
  }, [globalData?.contactDetails]);

  const handleAltContactChange = async () => {
    if (!altContact.match(phoneFormat)) {
      setErrorMessage("Please enter a valid phone number.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (altContact === clientAuth?.currentUser?.phoneNumber?.slice(3, 13)) {
      setErrorMessage("Alternative contact number cannot be the same as the primary contact number.");
      setIsErrorPopupVisible(true);
      return;
    }

    if (altContact === globalData?.contactDetails?.altContact) {
      setErrorMessage("No changes made to alternative contact number.");
      setIsErrorPopupVisible(true);
      return;
    }

    setIsButtonLoading(true);
    try {
      const token = await clientAuth?.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");
      const res = await fetch(`${API_URL}/auth/update-alt-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ altContact }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "Something went wrong. Please try again.");
        
      setGlobalData(prevData => ({
        ...prevData,
        contactDetails: {
          ...prevData.contactDetails,
          altContact: altContact
        }
      }));
      setIsSuccessPopupVisible(true);
    }
    catch (error) {
      setErrorMessage(error.message || "An error occured. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setIsButtonLoading(false);
    }
  }

  return (
    <>
      <div className="mobile-only">
        <div className='headers-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='header-title'>Contact Details</p>
        </div>
      </div>
      <div className="contact-details-wrapper">
        <div className='desktop-only'>
          <h2 className="account-title">Contact Details</h2>
        </div>
        <div className="input-group input">
          <FloatingInput
            placeholder="Primary contact number"
            value={clientAuth?.currentUser?.phoneNumber ? "+91 - " + clientAuth?.currentUser?.phoneNumber.slice(3, 13) : ""}
            disabled={true}
          />

          <FloatingInput
            placeholder="Alternative contact number"
            value={altContact}
            onChange={(e) => setAltContact(e.target.value)}
          />

          <FloatingInput
            placeholder="Email address"
            value={clientAuth?.currentUser?.email || ""}
            disabled={true}
          />
        </div>
        <button
          className="save-button"
          onClick={handleAltContactChange}
          disabled={isButtonLoading || altContact.trim() === ""}
          style={{ opacity: isButtonLoading || altContact.trim() === "" ? 0.6 : 1 }}
        >
          {isButtonLoading ? <UpdateLoader /> : "Save"}
        </button>
      </div>
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        data={errorMessage}
        buttonText="Ok"
      />
      <YesNoModal
        show={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        heading="Success"
        data="Alternative contact number updated successfully!"
        buttonText="Ok"
      />

    </>
  );
};

export default ContactDetails;
