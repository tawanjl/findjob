import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/axios';

interface CompanyData {
    id: number;
    name: string;
    description: string;
    website: string;
    address: string;
    logoUrl?: string;
    bannerUrl?: string;
    jobs: Job[];
}

interface Job {
    id: number;
    title: string;
    jobType: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    active: boolean;
    createdAt: string;
}

export const CompanyProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        api.get(`/company/${id}`)
            .then(res => setCompany(res.data))
            .catch(() => setError('ไม่พบข้อมูลบริษัทนี้'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <div className="text-gray-400 text-center">
                <div className="text-5xl mb-3 animate-pulse"></div>
                <p className="text-sm">กำลังโหลด...</p>
            </div>
        </div>
    );

    if (error || !company) return (
        <div className="text-center py-24">
            <div className="text-5xl mb-4"></div>
            <p className="text-red-500 font-medium mb-3">{error || 'ไม่พบข้อมูล'}</p>
            <Link to="/jobs" className="text-sm text-gray-600 hover:text-black font-medium underline">← กลับไปหน้างาน</Link>
        </div>
    );

    const activeJobs = company.jobs?.filter(j => j.active) ?? [];
    const fmtSalary = (min?: number, max?: number) => {
        if (!min && !max) return null;
        if (min && max) return `฿${min.toLocaleString()} – ฿${max.toLocaleString()}`;
        if (min) return `฿${min.toLocaleString()}+`;
        return `ถึง ฿${max!.toLocaleString()}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-5">

            {/* Back link */}
            <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับไปหน้างาน
            </Link>

            {/* ── Hero Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                    {company.bannerUrl && (
                        <img src={company.bannerUrl.startsWith('http') ? company.bannerUrl : `http://localhost:3000${company.bannerUrl}`} alt="banner" className="w-full h-full object-cover" />
                    )}
                    {/* Overlay gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="px-6 pb-6">
                    {/* Logo row — pulls up slightly to overlap banner */}
                    <div className="flex items-end justify-between -mt-10 relative z-10">
                        <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                            {company.logoUrl
                                ? <img src={company.logoUrl.startsWith('http') ? company.logoUrl : `http://localhost:3000${company.logoUrl}`} alt="logo" className="w-full h-full object-cover" />
                                : <span className="text-3xl font-bold text-gray-300">{company.name[0]}</span>}
                        </div>
                        {/* Open jobs badge */}
                        <div className="mb-1 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            {activeJobs.length} ตำแหน่งที่เปิดรับ
                        </div>
                    </div>

                    {/* Company name + meta */}
                    <div className="mt-3">
                        <h1 className="text-2xl font-extrabold text-gray-900">{company.name}</h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            {company.address && (
                                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                    {company.address}
                                </span>
                            )}
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                    {company.website}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {company.description && (
                        <div className="mt-5 pt-5 border-t border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">เกี่ยวกับบริษัท</h2>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{company.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Job Listings ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        ตำแหน่งงานที่เปิดรับ
                    </h2>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {activeJobs.length} ตำแหน่ง
                    </span>
                </div>

                {activeJobs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-4xl mb-3"></p>
                        <p className="text-sm">ไม่มีตำแหน่งงานที่เปิดรับในขณะนี้</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeJobs.map(job => (
                            <Link
                                key={job.id}
                                to={`/jobs/${job.id}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group bg-white"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Small company logo repeated for each job */}
                                    <div className="w-10 h-10 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {company.logoUrl
                                            ? <img src={company.logoUrl.startsWith('http') ? company.logoUrl : `http://localhost:3000${company.logoUrl}`} alt="logo" className="w-full h-full object-cover" />
                                            : <span className="text-base font-bold text-gray-300">{company.name[0]}</span>}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-black leading-snug">{job.title}</h3>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">{job.jobType}</span>
                                            {job.location && (
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{job.location}</span>
                                            )}
                                            {fmtSalary(job.salaryMin, job.salaryMax) && (
                                                <span className="text-xs bg-green-50 px-2 py-0.5 rounded-full text-green-700 font-semibold border border-green-100">
                                                    {fmtSalary(job.salaryMin, job.salaryMax)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:text-right flex-shrink-0 pl-13">
                                    <p className="text-xs text-gray-400">
                                        {new Date(job.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-blue-600 font-semibold mt-0.5 group-hover:underline">ดูรายละเอียด →</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
