import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';

interface Job {
    id: number;
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    jobType: string;
    active: boolean;
    company: {
        name: string;
        logoUrl?: string;
    };
}

export const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch latest active jobs for the homepage
        api.get('/jobs')
            .then(res => {
                const activeJobs = res.data.filter((job: Job) => job.active !== false);
                // Just take the first 4 for the homepage feed
                setFeaturedJobs(activeJobs.slice(0, 4));
            })
            .catch(err => console.error("Failed to load featured jobs:", err))
            .finally(() => setLoadingJobs(false));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append('title', keyword);
        if (location) params.append('location', location);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* HERO SECTION */}
            <section className="relative bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 p-8 md:p-16 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50 pointer-events-none"></div>
                <div className="relative max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        หางานที่ใช่กับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">
                            JOBS
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ค้นพบโอกาสงานที่ใช่สำหรับคุณ
                    </p>

                    {/* Quick Search Bar */}
                    <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-lg border border-gray-200 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4">
                            <svg className="w-5 h-5 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input
                                type="text"
                                placeholder="ชื่อตำแหน่ง, คีย์เวิร์ด, หรือบริษัท..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3"
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="hidden sm:block w-px bg-gray-200 my-2"></div>
                        <div className="flex-1 flex items-center px-4 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0">
                            <svg className="w-5 h-5 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <input
                                type="text"
                                placeholder="เมืองหรือสถานที่..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-black hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 sm:mt-0">
                            ค้นหางาน
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
                        <span>ค้นหายอดนิยม:</span>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors" onClick={() => navigate('/jobs?title=designer')}>Designer</span>
                            <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors" onClick={() => navigate('/jobs?title=developer')}>Developer</span>
                            <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors" onClick={() => navigate('/jobs?title=manager')}>Manager</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED JOBS SECTION */}
            <section className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">ตำแหน่งงานแนะนำ</h2>
                        <p className="text-gray-500 mt-2">ค้นพบโอกาสงานที่ใช่สำหรับคุณ</p>
                    </div>
                    <Link to="/jobs" className="text-primary-600 font-medium hover:text-primary-700 hidden sm:block">
                        ดูตำแหน่งงานทั้งหมด &rarr;
                    </Link>
                </div>

                {loadingJobs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-gray-50 rounded-2xl h-64 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredJobs.map(job => (
                            <Link key={job.id} to={`/jobs/${job.id}`} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col h-full">
                                <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-2 mb-4 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                    {job.company.logoUrl ? (
                                        <img src={`http://localhost:3000${job.company.logoUrl}`} alt={job.company.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-300">{job.company.name.charAt(0)}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">{job.company.name}</p>

                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md">{job.jobType}</span>
                                        {job.location && <span className="ml-2 bg-gray-50 text-gray-600 px-2 py-1 rounded-md truncate">{job.location}</span>}
                                    </div>
                                    {(job.salaryMin || job.salaryMax) && (
                                        <p className="font-semibold text-gray-900 mt-2">
                                            {job.salaryMin && <span>฿{job.salaryMin.toLocaleString()}</span>}
                                            {job.salaryMin && job.salaryMax && <span> - </span>}
                                            {job.salaryMax && <span>฿{job.salaryMax.toLocaleString()}</span>}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <div className="mt-8 text-center sm:hidden">
                    <Link to="/jobs" className="text-primary-600 font-medium hover:text-primary-700">
                        ดูงานทั้งหมด &rarr;
                    </Link>
                </div>
            </section>

            {/* TOP COMPANIES SECTION */}
            <section className="bg-gray-50 rounded-3xl py-12 px-8 max-w-7xl mx-auto w-full text-center border border-gray-100">
                <p className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-8">ได้รับความไว้วางใจจากบริษัทที่กำลังเติบโตทั่วโลก</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Static logos for demonstration */}
                    <div className="text-2xl font-black text-gray-800 tracking-tighter">Acme Corp</div>
                    <div className="text-2xl font-black text-blue-800 tracking-tighter italic">GlobalTech</div>
                    <div className="text-2xl font-black text-green-800">EcoSystems</div>
                    <div className="text-2xl font-black text-purple-800 tracking-widest uppercase">Nexus</div>
                    <div className="text-2xl font-black text-orange-800 font-serif">Pioneer</div>
                </div>
            </section>
        </div>
    );
};
