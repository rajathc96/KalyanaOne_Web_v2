import { useEffect, useState } from 'react';
import API_URL from '../../../../config';
import { clientAuth } from '../../../../firebase';
import arrowDown from '../../../assets/icons/arrowdown.svg';
import FloatingInput from '../FloatingInput';
import FloatingInputSelect from '../FloatingInputSelect';

function CasteDetails({ casteDetails, setCasteDetails, globalData, arrowUp, setIsChanged }) {
    const [show, setShow] = useState(true);

    const [subCasteList, setSubCasteList] = useState([]);

    const getSubCasteData = async () => {
        const token = await clientAuth?.currentUser?.getIdToken();
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/user/subcastes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ caste: globalData.casteDetails?.caste }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubCasteList(data);
            }
        }
        catch (error) { }
    }

    useEffect(() => {
        getSubCasteData();
    }, [globalData.casteDetails?.caste]);

    return (
        <div className="partner-preference-section">
            <p>
                Caste & Subcaste{" "}
                <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
            {show && (
                <div className="input-group">
                    <FloatingInput
                        placeholder="Religion (Cannot be changed)"
                        value={"Hindu"}
                        disabled={true}
                    />
                    <FloatingInput
                        placeholder="Caste (Cannot be changed)"
                        value={globalData?.casteDetails?.caste || ""}
                        disabled={true}
                    />
                    <FloatingInputSelect
                        label="Subcaste"
                        value={casteDetails.subCaste}
                        onChange={(value) => {
                            setCasteDetails({ ...casteDetails, subCaste: value });
                            setIsChanged(true);
                        }}
                        options={subCasteList}
                        allowCustomInput={true}
                    />
                </div>
            )}
        </div>
    )
}

export default CasteDetails