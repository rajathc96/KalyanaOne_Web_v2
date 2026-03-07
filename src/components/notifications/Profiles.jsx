import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import convertHeightToInches from '../../clientFunctions/convertHeightToInches';
import Received from './Received';
import Sent from './Sent';
import { useNavigate } from 'react-router-dom';

export const ProfileSkeleton = ({ image }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div style={{ position: 'relative', height: 50 }}>
            {isLoading && <Skeleton circle={true} height={50} width={50} />}
            <img
                src={image}
                alt="Profile"
                className="avatar"
                loading="lazy"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    )
}

function Profiles({ data, type, isInterests, setNotificationsData, getNotifications }) {
    const navigate = useNavigate();

    return (
        <>
            {data && data.length !== 0
                ?
                data.map((item) => (
                    <div key={item.uid} className="notification-card">
                        <div className="list-header">
                            <ProfileSkeleton image={item?.displayDetails?.profilePic} />
                            <div className="list-info" onClick={() => navigate(`/other-profile/${item.uid}`)}>
                                <p className="list-name">
                                    {item?.displayDetails?.name}
                                </p>
                                <p className="list-subtext">
                                    {item?.displayDetails?.age} Yrs, {convertHeightToInches(item?.displayDetails?.height) + ", "}
                                    {item?.displayDetails?.location?.length > 10
                                        ? item?.displayDetails?.location.slice(0, 8) + ".."
                                        : item?.displayDetails?.location}
                                </p>
                            </div>
                        </div>
                        {item.subType === "sent" && <Sent item={item} setNotificationsData={setNotificationsData} />}
                        {item.subType === "received" && <Received item={item} getNotifications={getNotifications} />}
                    </div>
                ))
                :
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p className="no-notifications" style={{ color: '#696969' }}>
                        {type === "Sent"
                            ? `You haven't sent any ${isInterests ? "interests" : "requests"}`
                            : type === "Received"
                                ? `You haven't received any ${isInterests ? "interests" : "requests"}`
                                : type === "Accepted"
                                    ? `You have no accepted ${isInterests ? "interests" : "requests"}`
                                    : type === "Declined"
                                        ? `You have no declined ${isInterests ? "interests" : "requests"}`
                                        : "You have no notifications yet"
                        }
                    </p>
                </div>
            }
        </>
    )
}

export default Profiles;