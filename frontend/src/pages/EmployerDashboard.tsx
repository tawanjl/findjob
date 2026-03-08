import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';

// ── CompanyForm ต้องอยู่นอก EmployerDashboard ──
// ถ้าอยู่ข้างใน React จะสร้าง component ใหม่ทุก render → input เสีย focus
const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent';

interface CompanyFormProps {
    companyForm: { name: string; description: string; website: string; address: string };
    setCompanyForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; website: string; address: string }>>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel: string;
}

const CompanyForm = ({ companyForm, setCompanyForm, onSubmit, onCancel, submitLabel }: CompanyFormProps) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท *</label>
                <input required className={inputCls} value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" className={inputCls} value={companyForm.website} onChange={e => setCompanyForm(p => ({ ...p, website: e.target.value }))} placeholder="https://company.com" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่บริษัท</label>
            <input className={inputCls} value={companyForm.address} onChange={e => setCompanyForm(p => ({ ...p, address: e.target.value }))} placeholder="เลขที่, ถนน, จังหวัด" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดบริษัท *</label>
            <textarea required rows={4} className={inputCls} value={companyForm.description} onChange={e => setCompanyForm(p => ({ ...p, description: e.target.value }))} placeholder="เล่าเกี่ยวกับบริษัท สินค้า/บริการ วัฒนธรรมองค์กร..." />
        </div>
        <div className="flex gap-3">
            <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">{submitLabel}</button>
            <button type="button" onClick={onCancel} className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">ยกเลิก</button>
        </div>
    </form>
);

interface CompanyProfile {
    id: number;
    name: string;
    description: string;
    website: string;
    address: string;
    logoUrl?: string;
    bannerUrl?: string;
}

interface Stats {
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
}

export const EmployerDashboard = () => {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [companyForm, setCompanyForm] = useState({ name: '', description: '', website: '', address: '' });

    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [bannerUploadError, setBannerUploadError] = useState('');

    const [jobs, setJobs] = useState<any[]>([]);
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [editingJobId, setEditingJobId] = useState<number | null>(null);
    const [saveMsg, setSaveMsg] = useState('');
    const [newJob, setNewJob] = useState({
        title: '', description: '', requirements: '', location: '',
        jobType: 'Full-time', salaryMin: '', salaryMax: '', experience: '', active: true,
    });

    useEffect(() => {
        fetchProfile();
        fetchJobs();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/company/my-profile');
            setProfile(res.data);
            if (res.data) {
                setCompanyForm({
                    name: res.data.name ?? '',
                    description: res.data.description ?? '',
                    website: res.data.website ?? '',
                    address: res.data.address ?? '',
                });
            }
        } catch { setProfile(null); }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/company/my-stats');
            setStats(res.data);
        } catch { }
    };

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/my-jobs');
            setJobs(res.data);
        } catch (error) { console.error('Failed to fetch jobs', error); }
    };

    const showSuccess = (msg: string) => {
        setSaveMsg(msg);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/company', companyForm);
            setIsCreatingProfile(false);
            fetchProfile(); fetchStats();
        } catch { alert('สร้างโปรไฟล์ไม่สำเร็จ'); }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch('/company', companyForm);
            setIsEditingProfile(false);
            fetchProfile();
            showSuccess('บันทึกข้อมูลบริษัทเรียบร้อยแล้ว ✅');
        } catch { alert('แก้ไขโปรไฟล์ไม่สำเร็จ'); }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const formData = new FormData(); formData.append('file', file);
        setIsUploading(true); setUploadError('');
        try { await api.post('/company/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); fetchProfile(); }
        catch (err: any) { setUploadError(err.response?.data?.message || 'Upload failed'); }
        finally { setIsUploading(false); }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const formData = new FormData(); formData.append('file', file);
        setIsUploadingBanner(true); setBannerUploadError('');
        try { await api.post('/company/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); fetchProfile(); }
        catch (err: any) { setBannerUploadError(err.response?.data?.message || 'Upload failed'); }
        finally { setIsUploadingBanner(false); }
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...newJob, salaryMin: newJob.salaryMin ? Number(newJob.salaryMin) : undefined, salaryMax: newJob.salaryMax ? Number(newJob.salaryMax) : undefined };
            if (editingJobId) await api.patch(`/jobs/${editingJobId}`, payload);
            else await api.post('/jobs', payload);
            setIsPostingJob(false); setEditingJobId(null);
            setNewJob({ title: '', description: '', requirements: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', experience: '', active: true });
            fetchJobs(); fetchStats();
            showSuccess(editingJobId ? 'อัปเดตงานเรียบร้อยแล้ว ✅' : 'ลงประกาศงานสำเร็จ ✅');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            alert('บันทึกงานไม่สำเร็จ: ' + (Array.isArray(msg) ? msg.join(', ') : (msg || 'เกิดข้อผิดพลาด')));
        }
    };

    const handleEditClick = (job: any) => {
        setEditingJobId(job.id);
        setNewJob({ title: job.title || '', description: job.description || '', requirements: job.requirements || '', location: job.location || '', jobType: job.jobType || 'Full-time', salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '', experience: job.experience || '', active: job.active !== undefined ? job.active : true });
        setIsPostingJob(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (!window.confirm('ยืนยันการลบประกาศงานนี้?')) return;
        try { await api.delete(`/jobs/${id}`); fetchJobs(); fetchStats(); }
        catch { alert('ลบงานไม่สำเร็จ'); }
    };


    return (
        <div className="space-y-6">

            {/* Success Toast */}
            {saveMsg && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
                    {saveMsg}
                </div>
            )}

            {/* --------  STATS SECTION  -------- */}
            {profile && stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'งานทั้งหมด', value: stats.totalJobs, color: 'bg-white text-black' },
                        { label: 'งานที่เปิดรับ', value: stats.activeJobs, color: 'bg-white text-black' },
                        { label: 'ใบสมัครทั้งหมด', value: stats.totalApplications, color: 'bg-white text-black' },
                        { label: 'รอตรวจสอบ', value: stats.pendingApplications, color: 'bg-white text-black' },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.color} rounded-xl p-4 border border-opacity-30`}>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* --------  COMPANY PROFILE  -------- */}
            <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
                {profile ? (
                    <>
                        {/* Banner */}
                        <div className="relative w-full h-40 bg-gradient-to-r from-gray-700 to-gray-900">
                            {profile.bannerUrl && (
                                <img src={profile.bannerUrl.startsWith('http') ? profile.bannerUrl : `http://localhost:3000${profile.bannerUrl}`} alt="banner" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute bottom-3 right-3 flex gap-2 z-20">
                                <input type="file" id="banner-upload" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleBannerUpload} disabled={isUploadingBanner} />
                                <label htmlFor="banner-upload" className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-md bg-white text-gray-800 border hover:bg-gray-50 flex items-center gap-1">
                                    {isUploadingBanner ? 'Uploading...' : 'เปลี่ยน Cover'}
                                </label>
                                {bannerUploadError && <p className="text-red-500 text-xs bg-white px-2 py-1 rounded shadow">{bannerUploadError}</p>}
                            </div>
                        </div>

                        {/* Profile body */}
                        <div className="px-6 pb-6">
                            {/* Row 1: Logo and Actions */}
                            <div className="flex justify-between items-start pt-4 relative z-10">
                                <div className="flex flex-col items-center gap-1.5 -mt-14">
                                    <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg bg-white overflow-hidden flex items-center justify-center">
                                        {profile.logoUrl
                                            ? <img src={profile.logoUrl.startsWith('http') ? profile.logoUrl : `http://localhost:3000${profile.logoUrl}`} alt="logo" className="w-full h-full object-cover" />
                                            : <span className="text-2xl font-bold text-gray-400">{profile.name[0]}</span>}
                                    </div>
                                    <input type="file" id="logo-upload" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleLogoUpload} />
                                    <label htmlFor="logo-upload" className="cursor-pointer text-xs font-medium px-2.5 py-1 border rounded-lg bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap">
                                        {isUploading ? '...' : 'เปลี่ยน Logo'}
                                    </label>
                                    {uploadError && <p className="text-red-500 text-xs text-center">{uploadError}</p>}
                                </div>
                                {/* Action buttons aligned to top-right */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/company/${profile.id}`}
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm font-medium"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        โปรไฟล์สาธารณะ
                                    </Link>
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap shadow-sm font-medium"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        แก้ไขข้อมูล
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Company name + meta — safely below banner */}
                            <div className="mt-3">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">{profile.name}</h3>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                    {profile.address && <span className="text-sm text-gray-500">📍 {profile.address}</span>}
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                            🔗 {profile.website}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {profile.description && (
                                <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100 whitespace-pre-wrap leading-relaxed">
                                    {profile.description}
                                </p>
                            )}

                            {/* Edit form */}
                            {isEditingProfile && (
                                <div className="mt-6 border-t pt-5">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-4">แก้ไขข้อมูลบริษัท</h4>
                                    <CompanyForm
                                        companyForm={companyForm}
                                        setCompanyForm={setCompanyForm}
                                        onSubmit={handleUpdateProfile}
                                        onCancel={() => setIsEditingProfile(false)}
                                        submitLabel="บันทึก"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : isCreatingProfile ? (
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-4">สร้างโปรไฟล์บริษัท</h3>
                        <CompanyForm
                            companyForm={companyForm}
                            setCompanyForm={setCompanyForm}
                            onSubmit={handleCreateProfile}
                            onCancel={() => setIsCreatingProfile(false)}
                            submitLabel="สร้างโปรไฟล์"
                        />
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-3">🏢</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">ยังไม่มีโปรไฟล์บริษัท</h3>
                        <p className="text-sm text-gray-500 mb-4">กรุณาสร้างโปรไฟล์บริษัทก่อนเพื่อลงประกาศงาน</p>
                        <button onClick={() => setIsCreatingProfile(true)} className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                            + สร้างโปรไฟล์บริษัท
                        </button>
                    </div>
                )}
            </div>

            {/* --------  JOB POSTINGS  -------- */}
            {profile && (
                <div className="bg-white shadow rounded-xl border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-gray-900">ประกาศงาน</h2>
                        {!isPostingJob && (
                            <button
                                onClick={() => { setEditingJobId(null); setNewJob({ title: '', description: '', requirements: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', experience: '', active: true }); setIsPostingJob(true); }}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                + ลงประกาศงานใหม่
                            </button>
                        )}
                    </div>

                    {isPostingJob ? (
                        <form onSubmit={handlePostJob} className="space-y-4 border-t pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อตำแหน่งงาน *</label>
                                <input required className={inputCls} value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="เช่น Senior Software Engineer" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดงาน *</label>
                                <textarea required rows={4} className={inputCls} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="หน้าที่รับผิดชอบ, สิ่งที่จะได้ทำในตำแหน่งนี้..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">คุณสมบัติผู้สมัคร</label>
                                <textarea rows={4} className={inputCls} value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} placeholder="- วุฒิการศึกษา, ประสบการณ์, ทักษะที่ต้องการ&#10;- เช่น: ปริญญาตรีสาขาคอมพิวเตอร์ หรือสาขาที่เกี่ยวข้อง&#10;- มีประสบการณ์ด้าน..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ที่ตั้ง</label>
                                    <input className={inputCls} value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="กรุงเทพ, Remote..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน</label>
                                    <select className={inputCls} value={newJob.jobType} onChange={e => setNewJob({ ...newJob, jobType: e.target.value })}>
                                        <option>Full-time</option><option>Part-time</option><option>Remote</option><option>Contract</option><option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">เงินเดือนขั้นต่ำ (บาท)</label>
                                    <input type="number" className={inputCls} value={newJob.salaryMin} onChange={e => setNewJob({ ...newJob, salaryMin: e.target.value })} placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">เงินเดือนสูงสุด (บาท)</label>
                                    <input type="number" className={inputCls} value={newJob.salaryMax} onChange={e => setNewJob({ ...newJob, salaryMax: e.target.value })} placeholder="ไม่ระบุ" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ประสบการณ์ที่ต้องการ</label>
                                    <input className={inputCls} value={newJob.experience} onChange={e => setNewJob({ ...newJob, experience: e.target.value })} placeholder="เช่น 1-3 ปี, ไม่จำกัด, มีประสบการณ์จะพิจารณาเป็นพิเศษ" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border">
                                <input type="checkbox" id="job-active" checked={newJob.active} onChange={e => setNewJob({ ...newJob, active: e.target.checked })} className="w-4 h-4" />
                                <label htmlFor="job-active" className="text-sm text-gray-700 cursor-pointer">
                                    สถานะ: {newJob.active ? <span className="text-green-600 font-semibold">เปิดรับสมัคร</span> : <span className="text-red-500 font-semibold">ปิดรับสมัคร</span>}
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">{editingJobId ? 'อัปเดตงาน' : 'ลงประกาศ'}</button>
                                <button type="button" onClick={() => { setIsPostingJob(false); setEditingJobId(null); }} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">ยกเลิก</button>
                            </div>
                        </form>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-4xl mb-2"></div>
                            <p className="text-sm">ยังไม่มีประกาศงาน</p>
                            <button onClick={() => setIsPostingJob(true)} className="mt-3 text-sm text-black font-medium hover:underline">+ ลงประกาศงานแรกของคุณ</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jobs.map(job => (
                                <div key={job.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4 items-center min-w-0">
                                        <div className="w-12 h-12 rounded-lg border bg-white flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                                            {profile?.logoUrl
                                                ? <img src={profile.logoUrl.startsWith('http') ? profile.logoUrl : `http://localhost:3000${profile.logoUrl}`} alt="logo" className="w-full h-full object-cover" />
                                                : <span className="text-lg font-bold text-gray-300">{profile.name[0]}</span>}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {job.active ? 'เปิดรับ' : 'ปิดรับ'}
                                                </span>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{job.jobType}</span>
                                                {job.location && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{job.location}</span>}
                                                {(job.salaryMin || job.salaryMax) && (
                                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                                        {job.salaryMin?.toLocaleString()}{job.salaryMax ? `–${job.salaryMax?.toLocaleString()}` : '+'} บาท
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                                        <Link to={`/employer/jobs/${job.id}/applicants`} className="flex-1 md:flex-none text-center text-xs font-medium px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                            ดูผู้สมัคร
                                        </Link>
                                        <button onClick={() => handleEditClick(job)} className="flex-1 md:flex-none text-center text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">แก้ไข</button>
                                        <button onClick={() => handleDeleteClick(job.id)} className="flex-1 md:flex-none text-center text-xs font-medium px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">ลบ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
