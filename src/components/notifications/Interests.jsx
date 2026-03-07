import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import Profiles from './Profiles';

const filters = ["Sent", "Received", "Accepted", "Declined"];

function Interests({ data, setNotificationsData, getNotifications }) {
    const [activeFilter, setActiveFilter] = useState("Sent");

    const [sentData, setSentData] = useState([]);
    const [receivedData, setReceivedData] = useState([]);
    const [acceptedData, setAcceptedData] = useState([]);
    const [declineData, setDeclineData] = useState([]);

    useEffect(() => {
        const sentData = data.filter(item => item.subType === "sent" && item.status === "pending");
        setSentData(sentData);
        const receivedData = data.filter(item => item.subType === "received" && item.status === "pending");
        setReceivedData(receivedData);
        const acceptedData = data.filter(item => item.status === "accepted");
        setAcceptedData(acceptedData);
        const declineData = data.filter(item => item.subType === "sent" && item.status === "declined");
        setDeclineData(declineData);
    }, [data]);

    return (
        <>
            <div className="notification-filters">
                {filters.map((filter, idx) => (
                    <button
                        key={idx}
                        className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <Profiles
                data={activeFilter === "Sent" ? sentData :
                    activeFilter === "Received" ? receivedData :
                        activeFilter === "Accepted" ? acceptedData :
                            declineData
                }
                type={activeFilter}
                isInterests={true}
                setNotificationsData={setNotificationsData}
                getNotifications={getNotifications}
            />

        </>
    )
}

export default Interests