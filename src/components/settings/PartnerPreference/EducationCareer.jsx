import { useState } from 'react';
import arrowDown from '../../../assets/icons/arrowdown.svg';
import { incomeRanges } from '../../../data/data';
import PartnerOccupationSelection from '../../../models/PartnerOccupationSelection/PartnerOccupationSelection';
import FloatingMultiplesCitySelect from '../FloatingMultiplesCitySelect';
import FloatingSelect from '../FloatingSelect';
import FloatingMultipleSelect from '../FloatingMultipleSelect';
import PartnerQualificationSelection from '../../../models/PartnerQualificationSelection/PartnerQualificationSelection';

function EducationCareer({ educationCareer, setEducationCareer, arrowUp, setIsChanged, globalData }) {
    const [show, setShow] = useState(true);
    const [showPartnerSelection, setShowPartnerSelection] = useState(false);
    const [showPartnerOccupation, setShowPartnerOccupation] = useState(false);

    return (
        <div className="partner-preference-section">
            <p>
                Education & Career details{" "}
                <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
            {show && (
                <div className="input-group">
                    <FloatingMultipleSelect
                        placeholder="Highest qualification"
                        value={educationCareer.highestQualification}
                        onChange={(value) => {
                            setEducationCareer({ ...educationCareer, highestQualification: value });
                            setIsChanged(true);
                        }}
                        disabled={true}
                        onDisabledClick={() => setShowPartnerSelection(true)}
                    />
                    <FloatingMultipleSelect
                        placeholder="Occupation"
                        value={educationCareer.occupation}
                        onChange={(value) => {
                            setEducationCareer({ ...educationCareer, occupation: value });
                            setIsChanged(true);
                        }}
                        disabled={true}
                        onDisabledClick={() => setShowPartnerOccupation(true)}
                    />
                    <FloatingSelect
                        label="Annual Income"
                        value={educationCareer.annualIncome}
                        onChange={(value) => {
                            setEducationCareer({
                                ...educationCareer,
                                annualIncome: value,
                                annualIncomeFrom: incomeRanges.find(item => item.label === value)?.from,
                                annualIncomeTo: incomeRanges.find(item => item.label === value)?.to,
                            })
                            setIsChanged(true);
                        }}
                        options={incomeRanges.map(range => range.label)}
                    />
                    <FloatingMultiplesCitySelect
                        label="Working location"
                        value={educationCareer.workLocation}
                        onChange={(value) => {
                            setEducationCareer({ ...educationCareer, workLocation: value });
                            setIsChanged(true);
                        }}
                    />
                </div>

            )}
            <PartnerQualificationSelection
                show={showPartnerSelection}
                onClose={() => setShowPartnerSelection(false)}
                setEducationCareer={setEducationCareer}
                educationCareer={educationCareer}
            />
            <PartnerOccupationSelection
                show={showPartnerOccupation}
                onClose={() => setShowPartnerOccupation(false)}
                setEducationCareer={setEducationCareer}
                educationCareer={educationCareer}
            />
        </div>
    )
}

export default EducationCareer