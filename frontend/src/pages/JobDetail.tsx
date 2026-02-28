import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

interface Job {
    id: number;
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    jobType: string;
    experience?: string;
    active: boolean;
    createdAt: string;
    company: {
        name: string;
        description?: string;
        logoUrl?: string;
        bannerUrl?: string;
        website?: string;
        address?: string;
    };
}

export const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (err: any) {
                console.error('Failed to load job details', err);
                setError(err.response?.data?.message || 'Job not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    const handleApply = async () => {
        if (!job) return;
        try {
            await api.post('/applications', { jobId: job.id, coverLetter: 'I am interested in this position!' });
            alert('Application successful!');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading job details...</div>;
    }

    if (error || !job) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-lg mb-4">{error || 'Job not found'}</p>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-800 font-medium underline">
                    Return to Job Board
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/jobs" className="inline-flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Jobs
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {job.company.bannerUrl && (
                    <div className="w-full h-48 sm:h-64 bg-gray-100 overflow-hidden border-b border-gray-200">
                        <img
                            src={`http://localhost:3000${job.company.bannerUrl}`}
                            alt={`${job.company.name} banner`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className={`p-8 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${job.company.bannerUrl ? 'relative' : ''}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
                        <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-white border-4 border-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md ${job.company.bannerUrl ? '-mt-16 sm:-mt-20 relative z-10' : ''}`}>
                            {job.company.logoUrl ? (
                                <img
                                    src={`http://localhost:3000${job.company.logoUrl}`}
                                    alt={`${job.company.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                            )}
                        </div>
                        <div className={`flex-1 pt-2 sm:pt-0 ${job.company.bannerUrl ? 'mt-0 sm:mt-4' : ''}`}>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{job.title}</h1>
                            <p className="text-xl text-primary-600 font-medium">{job.company.name}</p>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                        {user ? (
                            user.role === 'USER' ? (
                                <button
                                    onClick={handleApply}
                                    disabled={!job.active}
                                    className={`w-full md:w-auto px-8 py-3 rounded-md font-bold text-lg shadow-sm transition-colors ${job.active ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {job.active ? 'Apply Now' : 'Closed'}
                                </button>
                            ) : (
                                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded border text-center">
                                    Employers cannot apply
                                </div>
                            )
                        ) : (
                            <Link to="/login" className="block w-full text-center bg-black text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-800 shadow-sm transition-colors">
                                Login to Apply
                            </Link>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                            <p className="font-semibold text-gray-900">{job.location || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Job Type</p>
                            <p className="font-semibold text-gray-900">{job.jobType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Experience</p>
                            <p className="font-semibold text-gray-900">{job.experience || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Salary</p>
                            <p className="font-semibold text-gray-900">
                                {job.salaryMin && job.salaryMax
                                    ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}`
                                    : 'Not disclosed'}
                            </p>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Job Description</h2>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {job.description}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company.name}</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {job.company.description || 'No company description available.'}
                        </p>
                        {job.company.website && (
                            <div className="mt-4">
                                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium hover:underline inline-flex items-center">
                                    Visit Website
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                        {job.company.address && (
                            <div className="mt-2 text-gray-600 flex items-start">
                                <span className="mr-2">📍</span>
                                <span>{job.company.address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
