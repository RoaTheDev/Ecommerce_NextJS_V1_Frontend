// app/dashboard/page.tsx
'use client';

import React from 'react';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import {useCustomerProfile} from '@/lib/queries/useAuthQueries';

export default function DashboardPage() {
    const currentUser = useAuthStore(state => state.currentUser);
    const logout = useAuthStore(state => state.logout);

    const {data: profile, isLoading} = useCustomerProfile(currentUser?.customerId);

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    return (
        <main className="container mx-auto py-10">
            <div className="dashboard-container">
                <h1>Welcome, {currentUser?.displayName || 'User'}!</h1>

                {profile && (
                    <div className="profile-info">
                        <h2>Your Profile</h2>
                        <div className="info-card">
                            <div className="info-row">
                                <span className="label">Name:</span>
                                <span>{profile.firstName} {profile.middleName} {profile.lastName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Email:</span>
                                <span>{profile.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Phone:</span>
                                <span>{profile.phoneNumber}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Date of Birth:</span>
                                <span>{new Date(profile.dob).toLocaleDateString()}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Gender:</span>
                                <span>{profile.gender}</span>
                            </div>
                        </div>
                    </div>
                )}

                <button className="logout-button" onClick={logout}>
                    Logout
                </button>
            </div>
        </main>
    );
}