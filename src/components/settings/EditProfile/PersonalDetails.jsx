import { useState } from 'react';
import arrowDown from '../../../assets/icons/arrowdown.svg';
import FloatingSelect from '../FloatingSelect';
import { drinkinghabits, foodhabits, physicalstatus, smokinghabits, weights } from '../../../data/data';

function PersonalDetails({ personalDetails, setPersonalDetails, arrowUp, setIsChanged }) {
    const [show, setShow] = useState(true);
    return (
        <div className="partner-preference-section">
            <p>
                Personal details{" "}
                   <img onClick={()=>setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
             {show && (
            <div className="input-group">
                <FloatingSelect
                    label="Weight (in kg)"
                    value={personalDetails.weight}
                    onChange={(value) => {
                        setPersonalDetails({ ...personalDetails, weight: value });
                        setIsChanged(true);
                    }}
                    options={weights}
                />
                <FloatingSelect
                    label="Physical Status"
                    value={personalDetails.physicalStatus}
                    onChange={(value) => {
                        setPersonalDetails({ ...personalDetails, physicalStatus: value });
                        setIsChanged(true);
                    }}
                    options={physicalstatus}
                />
                <FloatingSelect
                    label="Food habit"
                    value={personalDetails.foodHabit}
                    onChange={(value) => {
                        setPersonalDetails({ ...personalDetails, foodHabit: value });
                        setIsChanged(true);
                    }}
                    options={foodhabits}
                />
                <FloatingSelect
                    label="Smoking"
                    value={personalDetails.smoking}
                    onChange={(value) => {
                        setPersonalDetails({ ...personalDetails, smoking: value });
                        setIsChanged(true);
                    }}
                    options={smokinghabits}
                />
                <FloatingSelect
                    label="Drinking"
                    value={personalDetails.drinking}
                    onChange={(value) => {
                        setPersonalDetails({ ...personalDetails, drinking: value });
                        setIsChanged(true);
                    }}
                    options={drinkinghabits}
                />
            </div>
             )}
        </div>
    )
}

export default PersonalDetails