import { City } from "country-state-city"
import { useEffect, useState } from 'react'
import arrowDown from '../../../assets/icons/arrowdown.svg'
import generateHeightsArray from '../../../clientFunctions/heightOptions'
import { languages, maritalstatus } from '../../../data/data'
import FloatingCitySelect from '../FloatingCitySelect'
import FloatingInput from '../FloatingInput'
import FloatingInputSelect from '../FloatingInputSelect'
import FloatingSelect from '../FloatingSelect'

function BasicDetails({ basicDetails, setBasicDetails, arrowUp, globalData, setIsChanged }) {
    const [show, setShow] = useState(true);

    const heightOptions = generateHeightsArray();

    return (
        <div className="partner-preference-section">
            <p>
                Basic details{" "}
                <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
            {show && (
                <div className="input-group">
                    <FloatingInput
                        placeholder="Full name"
                        value={basicDetails.name}
                        onChange={(e) => {
                            setBasicDetails({ ...basicDetails, name: e.target.value });
                            setIsChanged(true);
                        }}
                    />
                    <FloatingInput
                        placeholder="Age (Cannot be changed)"
                        value={globalData.basicDetails?.age?.toString()}
                        disabled={true}
                    />
                    <FloatingSelect
                        label="Height"
                        value={basicDetails.height}
                        onChange={(value) => {
                            setBasicDetails({ ...basicDetails, height: value });
                            setIsChanged(true);
                        }}
                        options={heightOptions}
                    />
                    <FloatingSelect
                        label="Marital Status"
                        value={basicDetails.maritalStatus}
                        onChange={(value) => {
                            setBasicDetails({ ...basicDetails, maritalStatus: value });
                            setIsChanged(true);
                        }}
                        options={maritalstatus}
                    />
                    <FloatingCitySelect
                        label="Living In"
                        value={basicDetails.location}
                        onChange={(value) => {
                            setBasicDetails({ ...basicDetails, location: value });
                            setIsChanged(true);
                        }}
                    />
                    <FloatingInputSelect
                        label="Language"
                        value={basicDetails.motherTongue}
                        onChange={(value) => {
                            setBasicDetails({ ...basicDetails, motherTongue: value });
                            setIsChanged(true);
                        }}
                        options={languages}
                        allowCustomInput={true}
                    />
                    <FloatingInput
                        placeholder="Gender (Cannot be changed)"
                        value={basicDetails.gender}
                        disabled={true}
                    />
                </div>
            )}
        </div>
    )
}

export default BasicDetails