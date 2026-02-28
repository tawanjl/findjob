import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';

interface Application {
    id: number;
    status: string;
    createdAt: string;
    job: {
        id: number;
        title: string;
        company: {
            name: string;
        };
    };
}

interface Bookmark {
    id: number;
    createdAt: string;
    job: {
        id: number;
        title: string;
        company: {
            name: string;
        };
    };
}

export const UserDashboard = () => {
    const [resume, setResume] = useState<{ id: string, url: string } | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [loadingBookmarks, setLoadingBookmarks] = useState(true);

    useEffect(() => {
        api.get('/resume')
            .then(res => setResume(res.data))
            .catch(() => setResume(null));

        // Fetch applications
        api.get('/applications/my-applications')
            .then(res => {
                setApplications(res.data);
            })
            .catch(err => console.error("Failed to load applications:", err))
            .finally(() => setLoadingApps(false));

        // Fetch bookmarks
        api.get('/bookmarks')
            .then(res => {
                setBookmarks(res.data);
            })
            .catch(err => console.error("Failed to load bookmarks:", err))
            .finally(() => setLoadingBookmarks(false));
    }, []);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResume(data);
            alert('Resume uploaded successfully!');
        } catch (error: any) {
            console.error('Failed to upload resume', error);
            alert(error.response?.data?.message || 'Failed to upload resume');
        }
    };

    const handleRemoveBookmark = async (jobId: number) => {
        try {
            await api.delete(`/bookmarks/${jobId}`);
            setBookmarks(prev => prev.filter(b => b.job.id !== jobId));
        } catch (error) {
            console.error("Failed to remove bookmark", error);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'REVIEWING': return 'bg-blue-100 text-blue-800';
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800'; // PENDING
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 mb-6 gap-4">
                <h2 className="text-xl font-bold mb-4">Your Profile</h2>
                {resume ? (
                    <p className="text-green-600 font-medium">✅ Resume uploaded</p>
                ) : (
                    <p className="text-yellow-600">⚠️ No resume uploaded. Please upload a PDF to apply for jobs.</p>
                )}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload new resume (PDF only, max 5MB)</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Your Applications</h2>
                {loadingApps ? (
                    <p className="text-gray-500 italic">Loading your applications...</p>
                ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                        <Link to="/jobs" className="text-primary-600 font-medium hover:underline">Browse open jobs</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600">
                                            <Link to={`/jobs/${app.job.id}`} className="hover:underline">{app.job.title}</Link>
                                        </h3>
                                        <p className="text-gray-600">{app.job.company.name}</p>
                                        <p className="text-xs text-gray-400 mt-2">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Saved Jobs</h2>
                {loadingBookmarks ? (
                    <p className="text-gray-500 italic">Loading your saved jobs...</p>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't saved any jobs yet.</p>
                        <Link to="/jobs" className="text-primary-600 font-medium hover:underline">Browse open jobs</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookmarks.map(bookmark => (
                            <div key={bookmark.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600">
                                        <Link to={`/jobs/${bookmark.job.id}`} className="hover:underline">{bookmark.job.title}</Link>
                                    </h3>
                                    <p className="text-gray-600">{bookmark.job.company.name}</p>
                                    <p className="text-xs text-gray-400 mt-2">Saved on {new Date(bookmark.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.job.id)}
                                    title="Remove bookmark"
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
