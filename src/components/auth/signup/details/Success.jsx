import confetti from 'canvas-confetti';
import { signInWithCustomToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../../config';
import { clientAuth } from '../../../../../firebase';
import UpdateLoader from '../../../../models/UpdateLoader/UpdateLoader';
import Lottie from 'lottie-react';
import smileyAnimation from '../../../../assets/emojis/smile-with-big-eyes.json';

const Success = ({ person, viewportHeight }) => {
  const navigate = useNavigate();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleCelebrate = () => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleCreateProfile = async () => {
    setIsCreatingProfile(true);
    setIsError(null);
    try {
      const response = await fetch(`${API_URL}/auth/create-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        setIsError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setIsCreatingProfile(false);
      handleCelebrate();
      await signInWithCustomToken(clientAuth, data.token);
    } catch (error) {
      setIsError("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    handleCreateProfile();
  }, []);

  return (
    <div className="inside-detail-container"
      style={{ height: viewportHeight - 150, maxWidth: '370px' }}
    >
      <div className="inside-detail-subcontainer">
        {
          isError ?
            <h2 className="success-title" style={{ color: 'red' }}>{isError}</h2>
            :
            <>
              <h2 className="success-title">🎉 {person === "your" ? "Your" : `${person.toUpperCase()}'s`} account is{""}
                {isCreatingProfile ? " being created..." : " created successfully!"}</h2>
              <p style={{ textAlign: 'center' }}>
                <Lottie
                  animationData={smileyAnimation}
                  loop
                  autoplay
                  style={{ width: 80, height: 80 }}
                />
              </p>
            </>
        }
      </div>
      <button
        className="get-started-btn"
        onClick={() => navigate('/')}
        disabled={isCreatingProfile || isError}
      >
        {isError ?
          "Try Again"
          :
          isCreatingProfile ?
            <UpdateLoader color="#fff" />
            :
            "Continue"
        }
      </button>
    </div>
  );
};

export default Success;
