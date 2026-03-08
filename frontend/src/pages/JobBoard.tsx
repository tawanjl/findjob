import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
    company: {
        name: string;
        logoUrl?: string;
    };
}

export const JobBoard = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('title') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [jobType, setJobType] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (keyword) params.title = keyword;
            if (location) params.location = location;
            if (jobType) params.jobType = jobType;
            if (minSalary) params.minSalary = minSalary;

            const { data } = await api.get('/jobs', {
                params
            });
            // Filter to only show active jobs on the public job board
            const activeJobs = data.filter((job: Job) => job.active !== false);
            setJobs(activeJobs);

            if (user && user.role === 'USER') {
                const bookmarksRes = await api.get('/bookmarks/ids');
                setSavedJobIds(bookmarksRes.data);
            }
        } catch (e) {
            console.error('Failed to load jobs', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []); // Initial load

    const handleApply = async (jobId: number) => {
        try {
            await api.post('/applications', { jobId, coverLetter: 'I am interested in this position!' });
            alert('Application successful!');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to apply');
        }
    };

    const handleToggleBookmark = async (jobId: number) => {
        const isSaved = savedJobIds.includes(jobId);
        try {
            if (isSaved) {
                await api.delete(`/bookmarks/${jobId}`);
                setSavedJobIds(prev => prev.filter(id => id !== jobId));
            } else {
                await api.post(`/bookmarks/${jobId}`);
                setSavedJobIds(prev => [...prev, jobId]);
            }
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to update bookmark');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">ค้นหางานที่ใช่สำหรับคุณ</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="ชื่อตำแหน่ง, คีย์เวิร์ด, หรือบริษัท..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="เมืองหรือสถานที่..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    {/* Advanced Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                        >
                            <option value="">ประเภทงาน</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                        <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden px-4">
                            <span className="text-gray-500 mr-2 whitespace-nowrap">Min Salary ฿</span>
                            <input
                                type="number"
                                placeholder="e.g. 50000"
                                className="w-full py-2 border-none focus:ring-0 outline-none"
                                value={minSalary}
                                onChange={(e) => setMinSalary(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={fetchJobs}
                            className="px-8 py-2 bg-black text-white font-medium rounded-md hover:bg-black shadow-sm"
                        >
                            ค้นหางาน
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">ไม่พบตำแหน่งงานที่ตรงกับเกณฑ์การค้นหาของคุณ</p>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border bg-gray-50 flex items-center justify-center mt-1">
                                        {job.company.logoUrl ? (
                                            <img
                                                src={job.company.logoUrl.startsWith('http') ? job.company.logoUrl : `http://localhost:3000${job.company.logoUrl}`}
                                                alt={job.company.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No Logo</span>
                                        )}
                                    </div>
                                    <div>
                                        <Link to={`/jobs/${job.id}`}>
                                            <h3 className="text-xl font-bold text-black hover:underline cursor-pointer">{job.title}</h3>
                                        </Link>
                                        <p className="text-gray-900 font-medium mb-2">{job.company.name}</p>
                                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                                            {job.location && <span className="bg-gray-100 px-2 py-1 rounded"> {job.location}</span>}
                                            <span className="bg-gray-100 px-2 py-1 rounded"> {job.jobType}</span>
                                            {job.experience && <span className="bg-gray-100 px-2 py-1 rounded"> {job.experience} ปี</span>}
                                            {job.salaryMin && job.salaryMax && (
                                                <span className="bg-gray-100 px-2 py-1 rounded"> ฿{job.salaryMin.toLocaleString()} - ฿{job.salaryMax.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0 ml-4">
                                    {user ? (
                                        user.role === 'USER' ? (
                                            <div className="flex gap-2 w-full mb-2">
                                                <button
                                                    onClick={() => handleToggleBookmark(job.id)}
                                                    title={savedJobIds.includes(job.id) ? "Remove bookmark" : "Save this job"}
                                                    className={`flex items-center justify-center p-2 rounded-md transition-colors ${savedJobIds.includes(job.id) ? 'bg-black text-white hover:bg-black' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                >
                                                    <svg className="w-6 h-6" fill={savedJobIds.includes(job.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleApply(job.id)}
                                                    className="flex-1 bg-primary-600 outline-none text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700"
                                                >
                                                    สมัครงาน
                                                </button>
                                            </div>
                                        ) : null // Employers or Admin can't apply to jobs here. 
                                    ) : (
                                        <a href="/login" className="bg-primary-600 outline-none text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 w-full text-center mb-2">
                                            เข้าสู่ระบบเพื่อสมัครงาน
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
