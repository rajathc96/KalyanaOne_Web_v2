import { useState } from 'react';
import arrowDown from '../../../assets/icons/arrowdown.svg';
import FloatingSelect from '../FloatingSelect';
import { manglikstatus, nakshatras, rashis } from '../../../data/searchFilters';

function HoroscopeDetails({ horoscopeDetails, setHoroscopeDetails, globalData, arrowUp, setIsChanged }) {
    const [show, setShow] = useState(true);
    return (
        <div className="partner-preference-section">
            <p>
                Horoscope details{" "}
                <img onClick={() => setShow(!show)} src={show ? arrowUp : arrowDown} alt="dropdown arrow" />
            </p>
            {show && (
                <div className="input-group">
                    <FloatingSelect
                        label="Nakshatra"
                        value={horoscopeDetails.nakshatra}
                        onChange={(value) => {
                            setHoroscopeDetails({ ...horoscopeDetails, nakshatra: value });
                            setIsChanged(true);
                        }}
                        options={nakshatras}
                    />
                    <FloatingSelect
                        label="Rashi"
                        value={horoscopeDetails.rashi}
                        onChange={(value) => {
                            setHoroscopeDetails({ ...horoscopeDetails, rashi: value });
                            setIsChanged(true);
                        }}
                        options={rashis}
                    />
                    <FloatingSelect
                        label="Manglik Status"
                        value={horoscopeDetails.manglikStatus}
                        onChange={(value) => {
                            setHoroscopeDetails({ ...horoscopeDetails, manglikStatus: value });
                            setIsChanged(true);
                        }}
                        options={manglikstatus}
                    />
                </div>
            )}
        </div>
    )
}

export default HoroscopeDetails