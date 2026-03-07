import { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon } from "react-feather";
import { useNavigate } from 'react-router-dom';
import { clientAuth } from '../../../firebase';
import img1 from "../../assets/barchart.svg";
import inviteLogo from "../../assets/icons/invite_logo.svg";
import { AppContext } from '../../context/AppContext';
import Info from './Info';
import Photos from './Photos';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { globalData } = useContext(AppContext);
  const [showName, setShowName] = useState(false);

  const handleShare = async () => {
    const shareText = `Hello,

You’re invited to join KalyanaOne, a community-based matrimony platform built for individuals who are serious about marriage.

KalyanaOne focuses on genuine profiles, a simple experience, and a respectful, family-friendly approach without spam, pressure, or unwanted follow-ups.

As an early member, you can create an account and explore premium features free for 3 months.

👉 Create your account here:
`;

    const shareData = {
      title: "KalyanaOne Invitation",
      text: shareText,
      url: `https://kalyanaone.com`,
    };

    if (navigator.canShare) {
      try {
        await navigator.share(shareData);
      } catch (error) { }
    } else {
      const fullMessage = `${shareData.text}\n${shareData.url}`;
      try {
        await navigator.clipboard.writeText(fullMessage);
      } catch (error) { }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.querySelector('.profile-scroll-wrapper')?.scrollTop;
      if (scrollTop > 20) {
        setShowName(true);
      } else {
        setShowName(false);
      }
    };

    const scrollContainer = document.querySelector('.profile-scroll-wrapper');
    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`outer-photos-header ${showName ? 'border' : ''}`}>
        <div className='outer-photos-header-top'>
          <ArrowLeft className='back-arrow' onClick={() => navigate(-1)} />
          <p className='user-profile-id'>{showName && `${globalData?.name.slice(0, 8).trim() || "Unknown"} •`} {clientAuth?.currentUser?.uid}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
          <img src={inviteLogo} alt="Invite" className="header-icon-img" onClick={handleShare} />
          <img src={img1} alt="Icon 1" className="header-icon-img" onClick={() => navigate("/insights")} />
          <SettingsIcon
            className="header-icon-img"
            onClick={() => navigate("/settings")}
            color="#696969"
          />
        </div>
      </div>
      <div className="profile">
        <div className="profile-scroll-wrapper">
          <div className='profile-container'>

            <div className="photos-container">
              <Photos profileData={globalData} />
            </div>
            <div className="info-container">
              <Info profileData={globalData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
