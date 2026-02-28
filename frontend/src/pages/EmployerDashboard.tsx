import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';

interface Profile {
    name: string;
    description: string;
    logoUrl?: string;
    bannerUrl?: string;
}

export const EmployerDashboard = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [bannerUploadError, setBannerUploadError] = useState('');

    const [jobs, setJobs] = useState<any[]>([]);
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [editingJobId, setEditingJobId] = useState<number | null>(null);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        salaryMin: '',
        salaryMax: '',
        experience: '',
        active: true,
    });

    useEffect(() => {
        fetchProfile();
        fetchJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/company/my-profile');
            setProfile(res.data);
        } catch (error) {
            setProfile(null);
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs?includeInactive=true');
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        }
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/company', {
                name: companyName,
                description: companyDescription
            });
            setIsCreatingProfile(false);
            fetchProfile();
        } catch (error) {
            console.error('Failed to create profile', error);
            alert('Failed to create profile. Please try again.');
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setUploadError('');

        try {
            await api.post('/company/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProfile(); // Refresh profile to get the new logo URL
        } catch (error: any) {
            console.error('Failed to upload logo', error);
            setUploadError(error.response?.data?.message || 'Failed to upload logo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploadingBanner(true);
        setBannerUploadError('');

        try {
            await api.post('/company/banner', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProfile(); // Refresh profile to get the new banner URL
        } catch (error: any) {
            console.error('Failed to upload banner', error);
            setBannerUploadError(error.response?.data?.message || 'Failed to upload banner');
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...newJob,
                salaryMin: newJob.salaryMin ? Number(newJob.salaryMin) : undefined,
                salaryMax: newJob.salaryMax ? Number(newJob.salaryMax) : undefined,
            };

            if (editingJobId) {
                await api.patch(`/jobs/${editingJobId}`, payload);
            } else {
                await api.post('/jobs', payload);
            }

            setIsPostingJob(false);
            setEditingJobId(null);
            setNewJob({
                title: '',
                description: '',
                location: '',
                jobType: 'Full-time',
                salaryMin: '',
                salaryMax: '',
                experience: '',
                active: true,
            });
            fetchJobs();
        } catch (error) {
            console.error('Failed to save job', error);
            alert('Failed to save job. Please try again.');
        }
    };

    const handleEditClick = (job: any) => {
        setEditingJobId(job.id);
        setNewJob({
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            jobType: job.jobType || 'Full-time',
            salaryMin: job.salaryMin || '',
            salaryMax: job.salaryMax || '',
            experience: job.experience || '',
            active: job.active !== undefined ? job.active : true,
        });
        setIsPostingJob(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            fetchJobs();
        } catch (error) {
            console.error('Failed to delete job', error);
            alert('Failed to delete job. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Employer Dashboard</h2>
                {profile ? (
                    <div className="flex flex-col gap-6">
                        {/* Banner Section */}
                        <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-lg overflow-hidden border">
                            {profile.bannerUrl ? (
                                <img
                                    src={`http://localhost:3000${profile.bannerUrl}`}
                                    alt={`${profile.name} banner`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    No Banner Image
                                </div>
                            )}

                            <div className="absolute bottom-4 right-4 z-20">
                                <input
                                    type="file"
                                    id="banner-upload"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={handleBannerUpload}
                                    disabled={isUploadingBanner}
                                />
                                <label
                                    htmlFor="banner-upload"
                                    className={`cursor-pointer text-xs font-medium px-4 py-2 rounded-md shadow transition-colors flex items-center gap-2 ${isUploadingBanner ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {isUploadingBanner ? 'Uploading...' : 'Change Cover'}
                                </label>
                                {bannerUploadError && <p className="text-red-500 text-xs mt-1 absolute right-0 bg-white p-1 rounded shadow-sm">{bannerUploadError}</p>}
                            </div>
                        </div>

                        {/* Profile Info Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 px-4 -mt-16 sm:-mt-20 relative z-10">
                            <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                {profile.logoUrl ? (
                                    <img
                                        src={`http://localhost:3000${profile.logoUrl}`}
                                        alt={`${profile.name} logo`}
                                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border-4 border-white shadow-sm bg-white"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-md border-4 border-white flex items-center justify-center text-gray-400 shadow-sm">
                                        No Logo
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className={`cursor-pointer text-xs font-medium px-3 py-1.5 border rounded-md transition-colors ${isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'}`}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload Logo'}
                                    </label>
                                </div>
                                {uploadError && <p className="text-red-500 text-xs text-center max-w-[100px]">{uploadError}</p>}
                            </div>

                            <div className="flex-1 pb-4 sm:pb-0 sm:mb-8 pt-12 sm:pt-0">
                                <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{profile.description || 'No description provided'}</p>
                            </div>
                        </div>
                    </div>
                ) : isCreatingProfile ? (
                    <form onSubmit={handleCreateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={3}
                                required
                                value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                            >
                                Save Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreatingProfile(false)}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    You haven't set up your company profile yet. You need to create one before posting jobs.
                                </p>
                                <button
                                    onClick={() => setIsCreatingProfile(true)}
                                    className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 border border-yellow-800 px-3 py-1 rounded transition-colors"
                                >
                                    Create Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {
                profile && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Job Postings</h2>
                            {!isPostingJob && (
                                <button
                                    onClick={() => {
                                        setEditingJobId(null);
                                        setNewJob({ title: '', description: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', experience: '', active: true });
                                        setIsPostingJob(true);
                                    }}
                                    className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors"
                                >
                                    Post New Job
                                </button>
                            )}
                        </div>

                        {isPostingJob ? (
                            <form onSubmit={handlePostJob} className="space-y-4 border-t pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="e.g. Senior Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={newJob.description}
                                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="Describe the role, responsibilities, and requirements"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            value={newJob.location}
                                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            placeholder="e.g. Remote, Bangkok"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                        <select
                                            value={newJob.jobType}
                                            onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Minimum Salary</label>
                                        <input
                                            type="number"
                                            value={newJob.salaryMin}
                                            onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Maximum Salary</label>
                                        <input
                                            type="number"
                                            value={newJob.salaryMax}
                                            onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <input
                                        type="checkbox"
                                        id="job-active-status"
                                        checked={newJob.active}
                                        onChange={(e) => setNewJob({ ...newJob, active: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="job-active-status" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        Status: {newJob.active ? <span className="text-green-600 font-bold">Active (Accepting applications)</span> : <span className="text-red-500 font-bold">Closed</span>}
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        {editingJobId ? 'Update Job' : 'Publish Job'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPostingJob(false);
                                            setEditingJobId(null);
                                        }}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {jobs.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-4">
                                        <p className="text-gray-500 italic mb-2">No jobs posted yet.</p>
                                        <button
                                            onClick={() => setIsPostingJob(true)}
                                            className="text-primary-600 font-medium hover:underline text-sm"
                                        >
                                            Create your first job posting
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 mt-4">
                                        {jobs.map((job) => (
                                            <div key={job.id} className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors gap-4">
                                                <div className="flex gap-4 items-center">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border bg-white flex items-center justify-center shadow-sm">
                                                        {profile?.logoUrl ? (
                                                            <img
                                                                src={`http://localhost:3000${profile.logoUrl}`}
                                                                alt={`${profile.name} logo`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 text-[10px]">No Logo</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg leading-tight">{job.title}</h4>
                                                        <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-1.5 items-center">
                                                            <span className={`px-2 py-0.5 rounded font-medium ${job.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {job.active ? 'Active' : 'Closed'}
                                                            </span>
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-600">{job.jobType}</span>
                                                            {job.location && (
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-600">{job.location}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 self-start md:self-auto w-full md:w-auto">
                                                    <Link to={`/employer/jobs/${job.id}/applicants`} className="flex-1 md:flex-none text-center bg-gray-900 text-white hover:bg-gray-700 text-sm font-medium px-3 py-1.5 rounded transition-colors shadow-sm">View Applicants</Link>
                                                    <button onClick={() => handleEditClick(job)} className="flex-1 md:flex-none text-center text-primary-600 hover:text-primary-800 text-sm font-medium px-3 py-1.5 border border-primary-200 rounded hover:bg-primary-50 transition-colors">Edit</button>
                                                    <button onClick={() => handleDeleteClick(job.id)} className="flex-1 md:flex-none text-center text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 transition-colors">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
};
