import { useEffect, useState } from 'react';
import { clientAuth } from '../../../../../firebase';
import backIcon from "../../../../assets/icons/back.svg";
import Accountfor from './Accountfor';
import Caste from './Caste';
import CountryState from './CountryState';
import "./Details.css";
import District from './District';
import Gender from './Gender';
import Income from './Income';
import Job from './Job';
import Marital from './Marital';
import Mother from './Mother';
import PersonalDetails from './PersonalDetails';
import Qualification from './Qualification';
import Success from './Success';
import Upload from './Upload';

const Detail = () => {
  const [step, setStep] = useState('account');
  const [isSkipped, setIsSkipped] = useState(false);
  const [person, setPerson] = useState('your');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState({
    countryCode: "IN",
    isoCode: "KA"
  });

  const goTo = (nextStep) => setStep(nextStep);

  const checkUser = async () => {
    const user = clientAuth.currentUser;
    if (user) {
      const tokenResult = await user.getIdTokenResult();
      if (!tokenResult.claims?.profileNotCreated) {
        window.location.href = '/';
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);


  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleHeading = () => {
    if (step === 'account') return 'To whom is this account for?';
    if (step === 'gender') return `Select ${person === "your" ? "your" : `${person}'s`} gender`;
    if (step === 'personal') return `Enter ${person === "your" ? "your" : `${person}'s`} personal details`;
    if (step === 'country') return `Select ${person === "your" ? "your" : `${person}'s`} country and state`;
    if (step === 'district') return `Select ${person === "your" ? "your" : `${person}'s`} district and native place`;
    if (step === 'mother') return `Select ${person === "your" ? "your" : `${person}'s`} mother tongue`;
    if (step === 'marital') return `Select ${person === "your" ? "your" : `${person}'s`} marital status`;
    if (step === 'caste') return `Select ${person === "your" ? "your" : `${person}'s`} caste`;
    if (step === 'qualification') return `Select ${person === "your" ? "your" : `${person}'s`} highest qualification`;
    if (step === 'job') return `Select ${person === "your" ? "your" : `${person}'s`} occupation`;
    if (step === 'income') return `Enter ${person === "your" ? "your" : `${person}'s`} annual income`;
    if (step === 'upload') return `Upload photos`;
    if (step === 'success') return "";
    return '';
  }

  const handleBack = () => {
    if (step === 'account') return;
    if (step === 'gender') return goTo('account');
    if (step === 'personal') return isSkipped ? goTo('account') : goTo('gender');
    if (step === 'country') return goTo('personal');
    if (step === 'district') return goTo('country');
    if (step === 'mother') return goTo('district');
    if (step === 'marital') return goTo('mother');
    if (step === 'caste') return goTo('marital');
    if (step === 'qualification') return goTo('caste');
    if (step === 'job') return goTo('qualification');
    if (step === 'income') return goTo('job');
    if (step === 'upload') return goTo('income');
    if (step === 'success') return;
    return;
  }

  return (
    <div className="accountfor-container">
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div className="accountfor-title">
          {step !== 'success' && step !== 'account' && <img src={backIcon} alt="Back" onClick={handleBack} />}
          <h4>{handleHeading()}</h4>
        </div>

        {step === 'account' && (
          <Accountfor
            onNext={() => {
              setIsSkipped(false);
              goTo('gender');
            }}
            onSkipNext={() => {
              setIsSkipped(true);
              goTo('personal');
            }}
            setPerson={setPerson}
          />
        )}
        {step === 'gender' && (
          <Gender
            onNext={() => goTo('personal')}
            person={person}
          />
        )}
        {step === 'personal' && (
          <PersonalDetails
            onNext={() => goTo('country')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'country' && (
          <CountryState
            onNext={() => goTo('district')}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'district' && (
          <District
            onNext={() => goTo('mother')}
            selectedState={selectedState}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'mother' && (
          <Mother
            onNext={() => goTo('marital')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'marital' && (
          <Marital
            onNext={() => goTo('caste')}
          />
        )}
        {step === 'caste' && (
          <Caste
            onNext={() => goTo('qualification')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'qualification' && (
          <Qualification
            onNext={() => goTo('job')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'job' && (
          <Job
            onNext={() => goTo('income')}
          />
        )}
        {step === 'income' && (
          <Income
            onNext={() => goTo('upload')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'upload' && (
          <Upload
            onNext={() => goTo('success')}
            viewportHeight={viewportHeight}
          />
        )}
        {step === 'success' &&
          <Success
            person={person}
            viewportHeight={viewportHeight}
          />}
      </div>
    </div>
  );
};

export default Detail;
