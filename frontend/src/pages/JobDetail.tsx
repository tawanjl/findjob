import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

interface Job {
    id: number;
    title: string;
    description: string;
    requirements?: string;
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

    // Modal + result state
    const [showConfirm, setShowConfirm] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);

                // ถ้า login เป็น USER ให้เช็คว่าเคยสมัครไปแล้วหรือยัง
                if (user?.role === 'USER') {
                    try {
                        const { data: checkData } = await api.get(`/applications/check/${id}`);
                        setApplied(checkData.applied);
                    } catch {
                        // ถ้า endpoint ไม่ตอบสนอง ก็ไม่ต้อง block การโหลดหน้า
                    }
                }
            } catch (err: any) {
                console.error('Failed to load job details', err);
                setError(err.response?.data?.message || 'Job not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, user]);

    const showToastMsg = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleApply = async () => {
        if (!job) return;
        if (!coverLetter.trim()) {
            showToastMsg('error', 'กรุณากรอก Cover Letter ก่อนสมัครงาน');
            return;
        }
        setApplying(true);
        try {
            await api.post('/applications', { jobId: job.id, coverLetter: coverLetter.trim() });
            setApplied(true);
            setShowConfirm(false);
            setCoverLetter('');
            showToastMsg('success', 'สมัครงานสำเร็จแล้ว! บริษัทจะติดต่อกลับหาคุณเร็วๆ นี้');
        } catch (e: any) {
            setShowConfirm(false);
            showToastMsg('error', e.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setApplying(false);
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

            {/* ── Toast Notification ── */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '24px', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 9999,
                    minWidth: '320px', maxWidth: '480px',
                    animation: 'slideDown 0.3s ease',
                }}>
                    <style>{`
                        @keyframes slideDown {
                            from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
                            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                        }
                    `}</style>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px 20px', borderRadius: '14px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        border: `1px solid ${toast.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                        background: toast.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                        color: toast.type === 'success' ? '#166534' : '#991B1B',
                    }}>
                        <span style={{ fontSize: '22px' }}>{toast.type === 'success' ? '✅' : '❌'}</span>
                        <span style={{ fontWeight: 500, fontSize: '14px', flex: 1 }}>{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '18px', lineHeight: 1 }}
                        >✕</button>
                    </div>
                </div>
            )}

            {/* ── Confirmation Modal ── */}
            {showConfirm && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => { if (!applying) { setShowConfirm(false); setCoverLetter(''); } }}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />

                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative', background: 'white', borderRadius: '20px',
                            padding: '36px', maxWidth: '440px', width: '90%',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                            animation: 'popIn 0.25s ease',
                        }}
                    >
                        <style>{`
                            @keyframes popIn {
                                from { opacity: 0; transform: scale(0.92); }
                                to   { opacity: 1; transform: scale(1); }
                            }
                        `}</style>

                        {/* Icon */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '30px',
                            }}>📋</div>
                        </div>

                        {/* Title */}
                        <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                            ยืนยันการสมัครงาน
                        </h2>
                        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
                            คุณต้องการสมัครตำแหน่ง<br />
                            <strong style={{ color: '#111827', fontSize: '16px' }}>"{job.title}"</strong><br />
                            ที่บริษัท <strong style={{ color: '#111827' }}>{job.company.name}</strong> ใช่หรือไม่?
                        </p>

                        {/* Job Mini Card */}
                        <div style={{
                            background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px',
                            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '8px',
                                background: '#E5E7EB', flexShrink: 0, overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {job.company.logoUrl ? (
                                    <img src={`http://localhost:3000${job.company.logoUrl}`} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '20px' }}>🏢</span>
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, color: '#111827', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                                <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>
                                    {job.company.name}{job.location ? ` • ${job.location}` : ''}
                                </p>
                            </div>
                            <span style={{
                                background: '#DCFCE7', color: '#166534', fontSize: '11px',
                                fontWeight: 600, padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                            }}>{job.jobType}</span>
                        </div>

                        {/* Cover Letter */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', fontSize: '14px', marginBottom: '8px' }}>
                                Cover Letter <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="แนะนำตัวเองและบอกเหตุผลที่คุณสนใจตำแหน่งนี้..."
                                rows={5}
                                disabled={applying}
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                                    border: `1.5px solid ${coverLetter.trim() ? '#D1D5DB' : '#E5E7EB'}`,
                                    fontSize: '14px', color: '#111827', lineHeight: 1.6,
                                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                                    background: applying ? '#F9FAFB' : 'white',
                                    transition: 'border-color 0.15s',
                                    fontFamily: 'inherit',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#6B7280'}
                                onBlur={(e) => e.currentTarget.style.borderColor = coverLetter.trim() ? '#D1D5DB' : '#E5E7EB'}
                            />
                            <p style={{ textAlign: 'right', fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
                                {coverLetter.length} ตัวอักษร
                            </p>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => { setShowConfirm(false); setCoverLetter(''); }}
                                disabled={applying}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    border: '1.5px solid #E5E7EB', background: 'white', color: '#374151',
                                    fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                }}
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    background: applying ? '#9CA3AF' : '#111827',
                                    color: 'white', fontWeight: 700, fontSize: '15px',
                                    cursor: applying ? 'not-allowed' : 'pointer', border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}
                            >
                                {applying ? (
                                    <>
                                        <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        กำลังส่ง...
                                    </>
                                ) : 'ยืนยันการสมัครงาน'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
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
                                    onClick={() => !applied && setShowConfirm(true)}
                                    disabled={!job.active || applied}
                                    className={`w-full md:w-auto px-8 py-3 rounded-md font-bold text-lg shadow-sm transition-colors ${applied
                                        ? 'bg-green-600 text-white cursor-default'
                                        : job.active
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {applied ? '✓ สมัครแล้ว' : job.active ? 'สมัครเลย' : 'ปิดรับสมัคร'}
                                </button>
                            ) : (
                                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded border text-center">
                                    นายจ้างไม่สามารถสมัครงานได้
                                </div>
                            )
                        ) : (
                            <Link to="/login" className="block w-full text-center bg-black text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-800 shadow-sm transition-colors">
                                เข้าสู่ระบบเพื่อสมัครงาน
                            </Link>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">สถานที่ทำงาน</p>
                            <p className="font-semibold text-gray-900">{job.location || 'ไม่ระบุ'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">ประเภทงาน</p>
                            <p className="font-semibold text-gray-900">{job.jobType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">ประสบการณ์</p>
                            <p className="font-semibold text-gray-900">{job.experience || 'ไม่ระบุ'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">เงินเดือน</p>
                            <p className="font-semibold text-gray-900">
                                {job.salaryMin && job.salaryMax
                                    ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}`
                                    : 'ไม่ระบุ'}
                            </p>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">รายละเอียดงาน</h2>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {job.description}
                        </div>
                    </div>

                    {job.requirements && (
                        <div className="prose max-w-none mt-8 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">คุณสมบัติผู้สมัคร</h2>
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {job.requirements}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company.name}</h2>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {job.company.description || 'No company description available.'}
                        </p>
                        {job.company.website && (
                            <div className="mt-4">
                                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium hover:underline inline-flex items-center">
                                    เยี่ยมชมเว็บไซต์
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                        {job.company.address && (
                            <div className="mt-2 text-gray-600 flex items-start">
                                <span className="mr-2">ที่อยู่</span>
                                <span>{job.company.address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
