import { useState } from 'react';
import arrowDown from "../../../assets/icons/arrowdown.svg";
import FloatingInput from '../FloatingInput';

function SocialMediaDetails({ socialMediaDetails, setSocialMediaDetails, arrowUp, setIsChanged }) {
    const [show, setShow] = useState(true);
    return (
        <div className="partner-preference-section">
            <p>
                Social media details{" "}
                <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
            {show && (
                <div className="input-group">
                    <FloatingInput
                        placeholder="Instagram"
                        value={socialMediaDetails.instagram}
                        onChange={(e) => {
                            setSocialMediaDetails({ ...socialMediaDetails, instagram: e.target.value });
                            setIsChanged(true);
                        }}
                    />
                    <FloatingInput
                        placeholder="Facebook"
                        value={socialMediaDetails.facebook}
                        onChange={(e) => {
                            setSocialMediaDetails({ ...socialMediaDetails, facebook: e.target.value });
                            setIsChanged(true);
                        }}
                    />

                    <FloatingInput
                        placeholder="LinkedIn"
                        value={socialMediaDetails.linkedin}
                        onChange={(e) => {
                            setSocialMediaDetails({ ...socialMediaDetails, linkedin: e.target.value });
                            setIsChanged(true);
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default SocialMediaDetails