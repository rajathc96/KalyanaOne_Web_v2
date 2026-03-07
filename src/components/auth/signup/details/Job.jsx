import { useState } from 'react';
import { toast } from 'react-toastify';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import './Details.css';
import YesNoModal from '../../../../models/YesNoModal/YesNoModal';

const jobs = [
  'Self Employed',
  'Private sector',
  'Government Sector',
  'Business',
  'Agriculture',
  'Not working',
  "Don't wish to specify"
];

const Job = ({ onNext }) => {
  const [selected, setSelected] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleJobSelection = async (jobType) => {
    setSelected(jobType);

    const token = await clientAuth?.currentUser?.getIdToken();
    if (!token) {
      setErrorMessage("User not authenticated. Please log in again.");
      setIsErrorPopupVisible(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job: jobType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsErrorPopupVisible(true);
        return;
      }

      onNext();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsErrorPopupVisible(true);
    }
    finally {
      setSelected('');
    }
  };

  return (
    <div className="accountfor-options">
      {jobs.map((job) => (
        <button
          key={job}
          className="accountfor-btn"
          onClick={() => handleJobSelection(job)}
        >
          {selected === job ?
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              {job}
              <UpdateLoader />
            </div>
            :
            job
          }
        </button>
      ))}
      <YesNoModal
        show={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        heading="Error"
        data={errorMessage}
        buttonText="Ok"
        
      />
    </div>
  );
};

export default Job;
