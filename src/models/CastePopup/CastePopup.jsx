import { clientAuth } from "../../../firebase";

const castes = [
    { id: "LGY", name: "Veerashaiva Lingayath" },
    { id: "VKG", name: "Vokkaliga" },
    { id: "BRM", name: "Brahmin" },
    { id: "VLM", name: "Valmiki" },
    { id: "KRB", name: "Kuruba" },
    { id: "LMN", name: "Lamani" },
];

const CastePopup = ({ show, onClose }) => {
    const caste = castes.find(c => c.id === clientAuth?.currentUser?.uid.split("").slice(1, 4).join(""));
    const isSmall = window.innerWidth < 370;

    return (
        <div className={`popup-sheet-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
            <div
                className={`popup-sheet-container ${show ? 'slide-up' : 'slide-down'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup-sheet-header">
                    <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            marginBottom: '10px',
                            color: '#FF025B'
                        }}>
                            {caste?.id}
                        </p>
                        <p style={{
                            fontSize: '22px',
                            fontWeight: '500',
                            marginBottom: '20px',
                        }}>
                            {caste ? caste.name : ""} Profiles
                        </p>
                        <p style={{
                            color: "#696969",
                            letterSpacing: 0.2,
                            fontSize: isSmall ? '15px' : '16px',
                        }}>
                            This platform shows profiles from the {caste && caste.name + " "}community and its subcastes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CastePopup;
