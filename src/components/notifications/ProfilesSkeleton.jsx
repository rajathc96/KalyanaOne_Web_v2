import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';

function ProfilesSkeleton({ }) {

    return (
        <>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item} className="notification-card">
                    <div className="list-header">
                        <Skeleton circle={true} height={50} width={50} />
                        <div className="list-info">
                            <p className="list-name">
                                <Skeleton width={100} />
                            </p>
                            <p className="list-subtext">
                                <Skeleton width={200} />
                            </p>
                        </div>
                    </div>
                    <Skeleton
                        height={12}
                        width={"90%"}
                        style={{
                            marginTop: 5,
                            marginLeft: 2
                        }}
                    />
                </div>
            ))
            }
        </>
    )
}

export default ProfilesSkeleton;