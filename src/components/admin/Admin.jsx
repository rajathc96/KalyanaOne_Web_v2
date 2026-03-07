import { useState, useEffect } from 'react';
import './Admin.css';
import { toast } from 'react-toastify';
import API_URL from '../../../config';
import { clientAuth } from '../../../firebase';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected

    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    useEffect(() => {
        // Fetch users for admin review
        fetchPendingUsers();
    }, [filter]);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const token = await clientAuth.currentUser.getIdToken();
            // Replace with your actual API endpoint
            const response = await fetch(`${API_URL}/api/admin/users/?status=${filter}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data?.error || 'Failed to approve user');
                return;
            }
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        setApproveLoading(true);
        try {
            const token = await clientAuth.currentUser.getIdToken();
            const response = await fetch(`${API_URL}/api/admin/users/approve-selfie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ verifyId: userId }),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                toast.error(data?.error || 'Failed to approve user');
                return;
            }

            setUsers(users.filter(user => user.uid !== userId));
            toast.success('User approved successfully!');
        } catch (error) {
            console.error('Error approving user:', error);
            toast.error('Failed to approve user');
        }
        finally {
            setApproveLoading(false);
        }
    };

    const handleReject = async (userId) => {
        try {
            const token = await clientAuth.currentUser.getIdToken();
            const response = await fetch(`${API_URL}/api/admin/users/reject-selfie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ verifyId: userId }),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                toast.error(data?.error || 'Failed to approve user');
                return;
            }
            setUsers(users.filter(user => user.uid !== userId));
            toast.success('User rejected successfully!');
        } catch (error) {
            console.error('Error rejecting user:', error);
            toast.error('Failed to reject user');
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard - User Verification</h1>

            {/* Filter Buttons */}
            <div className='admin-content'>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending {filter === 'pending' && `(${users.length})`}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved {filter === 'approved' && `(${users.length})`}
                    </button>
                    <button
                        className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected {filter === 'rejected' && `(${users.length})`}
                    </button>
                </div>

                {/* Users Grid */}
                {users.length === 0 ? (
                    <div className="no-users">No users to display</div>
                ) : (
                    <div className="users-grid">
                        {users.map((user) => (
                            <div key={user.uid} className="user-card">
                                {/* User Info */}
                                <div className="user-info">
                                    <h3>{user.displayDetails?.name || 'No Name'}</h3>
                                    {/* <p className="user-email">{user.displayDetails?.email || 'No Email'}</p> */}
                                    <p className="user-id">ID: {user.uid}</p>
                                    <div className="user-status">
                                        <span className={`status-badge ${user.isVerified ? 'verified' : user.isInProgress ? 'in-progress' : 'pending'}`}>
                                            {user.isVerified ? '✓ Verified' : user.isInProgress ? '⏳ In Progress' : '⏸ Pending'}
                                        </span>
                                    </div>
                                </div>

                                {/* Photos Container */}
                                <div className="photos-container">
                                    {/* Selfie Photo */}
                                    <div className="photo-wrapper">
                                        <label className="photo-label">Selfie</label>
                                        <div className="photo-frame selfie-frame">
                                            {user.selfieUrl ? (
                                                <img
                                                    src={user.selfieUrl}
                                                    alt="User Selfie"
                                                    className="photo"
                                                />
                                            ) : (
                                                <div className="no-photo">No Selfie</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Photo */}
                                    <div className="photo-wrapper">
                                        <label className="photo-label">Profile Photo</label>
                                        <div className="photo-frame profile-frame">
                                            {user.displayDetails?.profilePic ? (
                                                <img
                                                    src={user.displayDetails.profilePic}
                                                    alt="User Profile"
                                                    className="photo"
                                                />
                                            ) : (
                                                <div className="no-photo">No Photo</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    <button
                                        className="btn approve-btn"
                                        onClick={() => handleApprove(user.uid)}
                                        disabled={user.isVerified || approveLoading}
                                    >
                                        {approveLoading ? 'Approving...' : '✓ Approve'}
                                    </button>
                                    <button
                                        className="btn reject-btn"
                                        onClick={() => handleReject(user.uid)}
                                        disabled={rejectLoading}
                                    >
                                        {rejectLoading ? 'Rejecting...' : '✕ Reject'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
