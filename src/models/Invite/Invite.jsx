import { useState } from "react";
import { Link2 } from "react-feather";
import inviteLogo from "../../assets/icons/invite_logo_blue.svg";

const Invite = ({ show, onClose }) => {
    const isSmall = window.innerWidth < 370;
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        setCopied(false);
        navigator.clipboard.writeText("https://kalyanaone.com").then(() => {
            setCopied(true);
        }).catch((err) => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
                style={{ padding: "15px" }}
            >
                <div className="popup-sheet-header">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '20px',
                        gap: '15px',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <img
                            src={inviteLogo}
                            alt="Invite"
                            style={{
                                width: "45px",
                                height: "45px",
                            }}
                        />
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '500',
                        }}>
                            Invite to KalyanaOne
                        </p>
                        <p style={{
                            color: "#696969",
                            letterSpacing: 0.2,
                            fontSize: isSmall ? '14px' : '16px',
                            textAlign: 'center',
                            marginTop: '-5px'
                        }}>
                            Invite a friend or a family member
                        </p>
                        <button
                            className="verify-popup-btn"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                fontWeight: "500",
                            }}
                            onClick={() => handleShare()}>
                            <Link2 /> {copied ? "Copied!" : "Copy invite link"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invite;
