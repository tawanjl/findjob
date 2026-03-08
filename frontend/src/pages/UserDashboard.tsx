import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { getImageUrl } from '../lib/url';
import { useAuthStore } from '../store/authStore';

interface Application {
    id: number;
    status: string;
    createdAt: string;
    employerReply?: string;
    job: {
        id: number;
        title: string;
        company: { name: string };
    };
}

interface Bookmark {
    id: number;
    createdAt: string;
    job: {
        id: number;
        title: string;
        company: { name: string };
    };
}

const statusConfig: Record<string, { label: string; cls: string; icon: string }> = {
    PENDING: { label: 'รอพิจารณา', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⏳' },
    REVIEWING: { label: 'กำลังพิจารณา', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🔍' },
    ACCEPTED: { label: 'ผ่านการคัดเลือก', cls: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
    REJECTED: { label: 'ไม่ผ่านการคัดเลือก', cls: 'bg-red-50 text-red-600 border-red-200', icon: '❌' },
};

export const UserDashboard = () => {
    const { user } = useAuthStore();
    const [profileData, setProfileData] = useState<{ firstName?: string; lastName?: string; avatarUrl?: string } | null>(null);
    const [resume, setResume] = useState<{ id: string; url: string } | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [loadingBookmarks, setLoadingBookmarks] = useState(true);
    const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        api.get('/users/profile').then(res => setProfileData(res.data)).catch(() => { });
        api.get('/resume').then(res => setResume(res.data)).catch(() => setResume(null));
        api.get('/applications/my-applications')
            .then(res => setApplications(res.data))
            .catch(err => console.error('Failed to load applications:', err))
            .finally(() => setLoadingApps(false));
        api.get('/bookmarks')
            .then(res => setBookmarks(res.data))
            .catch(err => console.error('Failed to load bookmarks:', err))
            .finally(() => setLoadingBookmarks(false));
    }, []);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { data } = await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setResume(data);
            setUploadMsg({ type: 'success', text: 'อัปโหลด Resume สำเร็จแล้ว! 🎉' });
            setTimeout(() => setUploadMsg(null), 4000);
        } catch (error: any) {
            setUploadMsg({ type: 'error', text: error.response?.data?.message || 'อัปโหลดไม่สำเร็จ' });
            setTimeout(() => setUploadMsg(null), 4000);
        }
    };

    const handleRemoveBookmark = async (jobId: number) => {
        try {
            await api.delete(`/bookmarks/${jobId}`);
            setBookmarks(prev => prev.filter(b => b.job.id !== jobId));
        } catch (error) {
            console.error('Failed to remove bookmark', error);
        }
    };

    const displayName = profileData?.firstName
        ? `${profileData.firstName} ${profileData.lastName ?? ''}`.trim()
        : user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email ?? '';
    const initials = (profileData?.firstName?.[0] ?? user?.firstName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();
    const avatarSrc = profileData?.avatarUrl
        ? getImageUrl(profileData.avatarUrl)
        : null;

    const statsCards = [
        { label: 'สมัครงานแล้ว', value: applications.length, color: 'bg-white text-gray-700 border-gray-100' },
        { label: 'ผ่านการคัดเลือก', value: applications.filter(a => a.status === 'ACCEPTED').length, color: 'bg-white text-gray-700 border-gray-100' },
        { label: 'งานที่บันทึก', value: bookmarks.length, color: 'bg-white text-gray-700 border-gray-100' },
        { label: 'รอพิจารณา', value: applications.filter(a => a.status === 'PENDING').length, color: 'bg-white text-gray-700 border-gray-100' },
    ];

    return (
        <div className="space-y-6">

            {/* ── Profile Hero ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Top gradient bar */}
                <div className="h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700" />
                <div className="px-6 pb-6">
                    {/* Avatar row */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
                        <div className="flex items-end gap-4">
                            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gray-900 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                                    : initials}
                            </div>
                            <div className="pt-12">
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">{displayName}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <Link
                            to="/profile"
                            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            แก้ไขโปรไฟล์
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statsCards.map(card => (
                    <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <div className="text-xs font-medium mt-0.5 opacity-80">{card.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Resume Section ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Resume / CV</h2>
                    {resume && (
                        <a
                            href={`http://localhost:3000${resume.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                            ดู Resume ปัจจุบัน →
                        </a>
                    )}
                </div>

                {/* Upload Message */}
                {uploadMsg && (
                    <div className={`mb-3 px-4 py-3 rounded-xl text-sm font-medium border ${uploadMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {uploadMsg.text}
                    </div>
                )}

                <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors ${resume ? 'border-green-300 bg-green-50 hover:bg-green-100' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                    <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                    <div className="text-3xl">{resume ? '✅' : '📤'}</div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">{resume ? 'Resume อัปโหลดแล้ว' : 'อัปโหลด Resume ของคุณ'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{resume ? 'คลิกเพื่ออัปโหลดใหม่ (PDF เท่านั้น, สูงสุด 5MB)' : 'คลิกเพื่อเลือกไฟล์ PDF (สูงสุด 5MB)'}</p>
                    </div>
                </label>
            </div>

            {/* ── Applications Section ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">งานที่สมัครแล้ว</h2>
                {loadingApps ? (
                    <div className="text-center py-8 text-gray-400 text-sm">กำลังโหลด...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-4xl mb-3">🗂️</div>
                        <p className="text-gray-500 text-sm mb-3">ยังไม่ได้สมัครงานใด</p>
                        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-gray-900 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
                            ค้นหางาน →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {applications.map(app => {
                            const st = statusConfig[app.status] ?? { label: app.status, cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: '•' };
                            return (
                                <div key={app.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                                        💼
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                                            <div>
                                                <Link to={`/jobs/${app.job.id}`} className="font-semibold text-gray-900 hover:text-blue-600 truncate block text-sm">
                                                    {app.job.title}
                                                </Link>
                                                <p className="text-xs text-gray-500 truncate">{app.job.company.name}</p>
                                            </div>
                                            {/* Status badge */}
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${st.cls}`}>
                                                {st.icon} {st.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">สมัครเมื่อ {new Date(app.createdAt).toLocaleDateString('th-TH')}</p>

                                        {/* Employer Reply */}
                                        {app.employerReply && (
                                            <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-blue-800 mb-1">💬 ข้อความจากนายจ้าง:</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.employerReply}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Saved Jobs Section ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">งานที่บันทึกไว้</h2>
                {loadingBookmarks ? (
                    <div className="text-center py-8 text-gray-400 text-sm">กำลังโหลด...</div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-4xl mb-3">🔖</div>
                        <p className="text-gray-500 text-sm mb-3">ยังไม่มีงานที่บันทึกไว้</p>
                        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-gray-900 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
                            ค้นหางาน →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bookmarks.map(bookmark => (
                            <div key={bookmark.id} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                                    🏢
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/jobs/${bookmark.job.id}`} className="font-semibold text-gray-900 hover:text-blue-600 truncate block text-sm">
                                        {bookmark.job.title}
                                    </Link>
                                    <p className="text-xs text-gray-500 truncate">{bookmark.job.company.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">บันทึกเมื่อ {new Date(bookmark.createdAt).toLocaleDateString('th-TH')}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.job.id)}
                                    title="ลบ bookmark"
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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
