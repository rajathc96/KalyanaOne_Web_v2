import { useNavigate } from "react-router-dom";
import mail from '../../assets/icons/mail2.svg';
import "./MessagePremiumPopup.css";

const MessagePremiumPopup = ({ show, onClose, name }) => {
    const navigate = useNavigate();

    return (
        <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='premium-message-popup'>
                    <div className="popup-sheet-image-container">
                    <img src={mail} alt="mail" className="popup-sheet-image" />
                    </div>
                    <p className="popup-sheet-title">
                        {`To message ${name},\nUpgrade your membership\n\n`}
                    </p>
                    <p className="popup-sheet-text">
                        Benefits of Premium Membership
                    </p>

                    <p className="popup-sheet-text">
                        • Send unlimited personalised messages{"\n"}
                        • Access 100% verified mobile numbers to call{"\n"}
                        • View their horoscope{"\n"}
                        • Chat with prospects directly{"\n"}
                        • Priority over free members in search results
                    </p>
                    <button
                        className="upgrade-btn"
                        style={{ width: '100%' }}
                        onClick={() => navigate("/premium")}>
                        Upgrade to premium
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagePremiumPopup;
