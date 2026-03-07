import { useState } from 'react';
import arrowDown from '../../../assets/icons/arrowdown.svg';
import FloatingSelect from '../FloatingSelect';
import { familystatus, familytype } from '../../../data/searchFilters';

function FamilyDetails({ familyDetails, setFamilyDetails, arrowUp, setIsChanged }) {
	const [show, setShow] =useState(true);
	return (
		<div className="partner-preference-section">
			<p>
				Family details{" "}
				   <img onClick={()=>setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
			</p>
			{show && (
			<div className="input-group">
				<FloatingSelect
					label="Family type"
					value={familyDetails.familyType}
					onChange={(value) => {
						setFamilyDetails({ ...familyDetails, familyType: value });
						setIsChanged(true);
					}}
					options={familytype}
				/>
				<FloatingSelect
					label="Family status"
					value={familyDetails.familyStatus}
					onChange={(value) => {
						setFamilyDetails({ ...familyDetails, familyStatus: value });
						setIsChanged(true);
					}}
					options={familystatus}
				/>
			</div>
			)}
		</div>
	)
}

export default FamilyDetails