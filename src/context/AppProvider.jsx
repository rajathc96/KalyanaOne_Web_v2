import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { clientAuth } from '../../firebase';
import { AppContext } from './AppContext';

function convertInchesToHeight(inches) {
  if (!inches) return '';
  if (isNaN(Number(inches))) return inches;
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
}

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [globalData, setGlobalData] = useState({});
  const [isAppReady, setIsAppReady] = useState(false);
  const [isEarlyAccessAvailable, setIsEarlyAccessAvailable] = useState(false);

  const fetchUserData = async (tokenResult) => {
    try {
      const res = await fetch(`${API_URL}/api/user/get-all-data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          try {
            localStorage.clear();
            await signOut(clientAuth);
            return navigate('/login', { replace: true });
          } catch {
            // Intentionally ignore sign-out errors and still navigate to login.
          }
        }
        return;
      }
      console.log('Fetched user data:', data);

      setGlobalData({
        isUserVerified: tokenResult.claims?.verified || false,
        isUserSelfieVerified: tokenResult.claims?.selfieVerified || false,
        isPremiumUser: tokenResult.claims?.role === 'premium',
        interestAndRequestSentCount: Number(data?.interestAndRequestCount?.totalCount) || 0,
        interestAndRequestLimit: Number(data?.interestAndRequestCount?.limit) || 0,
        ...data,
        basicDetails: {
          ...data.basicDetails,
          height: convertInchesToHeight(data?.basicDetails?.height),
        },
        horoscopeDetails: {
          ...data.horoscopeDetails,
          dateOfBirth: data.horoscopeDetails?.dateOfBirth.split('-').reverse().join('-'),
        },
      });

      setIsAppReady(true);
    } catch {
      // Intentionally ignore fetch errors and show fallback empty state.
    }
  };

  // Listen for auth changes and fetch data or redirect as needed.
  useEffect(() => {
    setGlobalData({});
    const unsubscribe = clientAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        if (window.location.pathname !== '/terms-and-conditions' &&
          window.location.pathname !== '/privacy-policy' &&
          window.location.pathname !== '/child-safety-and-protection-policy' &&
          !window.location.pathname.startsWith('/refund-policy') &&
          !window.location.pathname.startsWith('/help') &&
          !window.location.pathname.startsWith('/user-agreement') &&
          !window.location.pathname.startsWith('/support') &&
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/signup' &&
          window.location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      } else if ((await user.getIdTokenResult()).claims?.profileNotCreated) {
        navigate('/details', { replace: true });
      } else {
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims?.profileNotCreated) return;
        if (tokenResult.claims?.admin === true) {
          setGlobalData({ admin: true });
          return;
        }
        if (tokenResult.claims?.earlyAccessAvailable === true) setIsEarlyAccessAvailable(true);
        await fetchUserData(tokenResult);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <AppContext.Provider value={{ globalData, setGlobalData, isAppReady, isEarlyAccessAvailable, setIsEarlyAccessAvailable }}>
      {children}
    </AppContext.Provider>
  );
}
