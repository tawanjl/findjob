import React, { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface Stats {
    totalJobs: number;
    totalUsers: number;
    employerCount: number;
    seekerCount: number;
    totalApplications: number;
}

export const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        api.get('/admin/statistics')
            .then(res => setStats(res.data));
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Overview</h2>

            {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                            <p className="text-xs text-gray-500 mt-2">{stats.seekerCount} Seekers / {stats.employerCount} Employers</p>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalJobs}</dd>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalApplications}</dd>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
