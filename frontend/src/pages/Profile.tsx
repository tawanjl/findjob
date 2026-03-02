import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import type { User } from '../store/authStore';

// ---- Types ----
interface Profile {
    id: number; email: string; firstName: string; lastName: string; phone: string;
    bio: string; location: string; desiredJobTitle: string; expectedSalary: number;
    avatarUrl: string; portfolioUrl: string; linkedinUrl: string; availableFrom: string;
    workExperiences: WorkExp[]; educations: Edu[];
}
interface WorkExp {
    id: number; company: string; position: string; startDate: string;
    endDate: string | null; isCurrent: boolean; description: string;
}
interface Edu {
    id: number; institution: string; degree: string; fieldOfStudy: string;
    startYear: number; endYear: number | null; isCurrent: boolean;
}

// ---- Helpers ----
const emptyWork: Omit<WorkExp, 'id'> = { company: '', position: '', startDate: '', endDate: null, isCurrent: false, description: '' };
const emptyEdu: Omit<Edu, 'id'> = { institution: '', degree: '', fieldOfStudy: '', startYear: new Date().getFullYear(), endYear: null, isCurrent: false };

const calcCompletion = (p: Profile | null): number => {
    if (!p) return 0;
    const fields = [p.firstName, p.lastName, p.phone, p.bio, p.location,
    p.desiredJobTitle, p.expectedSalary, p.avatarUrl, p.portfolioUrl, p.linkedinUrl];
    const filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
    const hasWork = (p.workExperiences?.length ?? 0) > 0 ? 1 : 0;
    const hasEdu = (p.educations?.length ?? 0) > 0 ? 1 : 0;
    return Math.round(((filled + hasWork + hasEdu) / 12) * 100);
};

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' }) : '';

// ---- Component ----
export const Profile = () => {
    const { user, setAuth, token } = useAuthStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [tab, setTab] = useState<'info' | 'work' | 'edu'>('info');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [form, setForm] = useState<Partial<Profile>>({});
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarMsg, setAvatarMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Work Experience modal state
    const [workForm, setWorkForm] = useState<Omit<WorkExp, 'id'>>(emptyWork);
    const [editWorkId, setEditWorkId] = useState<number | null>(null);
    const [showWorkForm, setShowWorkForm] = useState(false);

    // Education modal state
    const [eduForm, setEduForm] = useState<Omit<Edu, 'id'>>(emptyEdu);
    const [editEduId, setEditEduId] = useState<number | null>(null);
    const [showEduForm, setShowEduForm] = useState(false);

    const fetchProfile = () => {
        api.get('/users/profile').then(res => {
            setProfile(res.data);
            setForm({
                firstName: res.data.firstName, lastName: res.data.lastName, phone: res.data.phone,
                bio: res.data.bio, location: res.data.location, desiredJobTitle: res.data.desiredJobTitle,
                expectedSalary: res.data.expectedSalary, avatarUrl: res.data.avatarUrl,
                portfolioUrl: res.data.portfolioUrl, linkedinUrl: res.data.linkedinUrl,
                availableFrom: res.data.availableFrom,
            });
        });
    };

    useEffect(() => { fetchProfile(); }, []);

    const completion = calcCompletion(profile);

    const handleSaveInfo = async () => {
        setSaving(true);
        try {
            // Filter out empty strings and invalid numbers to prevent backend validation errors
            const payload: any = { ...form };
            Object.keys(payload).forEach(key => {
                if (payload[key] === '' || payload[key] === null) {
                    delete payload[key];
                }
            });
            if (payload.expectedSalary === 0 || isNaN(payload.expectedSalary)) {
                delete payload.expectedSalary;
            }

            await api.patch('/users/profile', payload);
            setSaveMsg('บันทึกข้อมูลเรียบร้อยแล้ว ✅');

            // Sync with authStore for Dashboard greeting
            if (user && token) {
                const updatedUser: User = {
                    ...user,
                    firstName: payload.firstName || user.firstName,
                    lastName: payload.lastName || user.lastName
                };
                setAuth(updatedUser, token);
            }

            fetchProfile();
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setSaveMsg(Array.isArray(msg) ? msg[0] : (msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่'));
        } finally { setSaving(false); }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setAvatarUploading(true);
        setAvatarMsg(null);
        try {
            const { data } = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(p => ({ ...p, avatarUrl: data.avatarUrl }));
            setProfile(prev => prev ? { ...prev, avatarUrl: `http://localhost:3000${data.avatarUrl}` } : prev);

            // Sync avatar with authStore if needed (though not currently used in greeting)
            if (user && token) {
                setAuth({ ...user }, token);
            }

            setAvatarMsg({ type: 'success', text: 'อัปโหลดรูปโปรไฟล์สำเร็จแล้ว! 🎉' });
            setTimeout(() => setAvatarMsg(null), 4000);
        } catch (err: any) {
            setAvatarMsg({ type: 'error', text: err.response?.data?.message || 'อัปโหลดไม่สำเร็จ' });
            setTimeout(() => setAvatarMsg(null), 4000);
        } finally {
            setAvatarUploading(false);
        }
    };

    // WorkExp CRUD
    const openNewWork = () => { setWorkForm(emptyWork); setEditWorkId(null); setShowWorkForm(true); };
    const openEditWork = (w: WorkExp) => { setWorkForm({ ...w }); setEditWorkId(w.id); setShowWorkForm(true); };
    const saveWork = async () => {
        if (editWorkId) await api.put(`/work-experience/${editWorkId}`, workForm);
        else await api.post('/work-experience', workForm);
        setShowWorkForm(false); fetchProfile();
    };
    const deleteWork = async (id: number) => {
        if (!confirm('ลบข้อมูลนี้?')) return;
        await api.delete(`/work-experience/${id}`); fetchProfile();
    };

    // Education CRUD
    const openNewEdu = () => { setEduForm(emptyEdu); setEditEduId(null); setShowEduForm(true); };
    const openEditEdu = (e: Edu) => { setEduForm({ ...e }); setEditEduId(e.id); setShowEduForm(true); };
    const saveEdu = async () => {
        const payload = {
            institution: eduForm.institution,
            degree: eduForm.degree,
            fieldOfStudy: eduForm.fieldOfStudy || undefined,
            startYear: Number(eduForm.startYear),
            endYear: eduForm.endYear ? Number(eduForm.endYear) : undefined,
            isCurrent: eduForm.isCurrent,
        };
        try {
            if (editEduId) await api.put(`/education/${editEduId}`, payload);
            else await api.post('/education', payload);
            setShowEduForm(false); fetchProfile();
        } catch (err: any) {
            const msg = err.response?.data?.message;
            alert('บันทึกไม่สำเร็จ: ' + (Array.isArray(msg) ? msg.join(', ') : msg ?? 'unknown error'));
        }
    };
    const deleteEdu = async (id: number) => {
        if (!confirm('ลบข้อมูลนี้?')) return;
        await api.delete(`/education/${id}`); fetchProfile();
    };

    const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent';
    const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
    const tabs: { key: typeof tab; label: string }[] = [
        { key: 'info', label: '👤 ข้อมูลส่วนตัว' },
        { key: 'work', label: '💼 ประสบการณ์งาน' },
        { key: 'edu', label: '🎓 การศึกษา' },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
                        {profile?.avatarUrl
                            ? <img
                                src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:3000${profile.avatarUrl}`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                            : (profile?.firstName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h1>
                        <p className="text-sm text-gray-500">{profile?.desiredJobTitle || 'ยังไม่ได้ระบุตำแหน่งที่ต้องการ'}</p>
                        <p className="text-xs text-gray-400">{profile?.location || 'ยังไม่ได้ระบุที่อยู่'}</p>
                    </div>
                </div>

                {/* Completion Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>ความสมบูรณ์ของโปรไฟล์</span>
                        <span className="font-semibold text-black">{completion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completion}%`, background: completion < 50 ? '#f59e0b' : completion < 80 ? '#3b82f6' : '#10b981' }}
                        />
                    </div>
                    {completion < 100 && (
                        <p className="text-xs text-gray-400 mt-1">
                            กรอกข้อมูลให้ครบเพื่อให้นายจ้างค้นพบคุณได้ง่ายขึ้น
                        </p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow border border-gray-100">
                <div className="border-b border-gray-100 px-6">
                    <nav className="flex gap-6">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                                {t.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* ---- Tab: ข้อมูลส่วนตัว ---- */}
                    {tab === 'info' && (
                        <div className="space-y-4">
                            {saveMsg && <div className="text-sm text-center py-2 px-4 rounded-lg bg-green-50 border border-green-200 text-green-800">{saveMsg}</div>}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>ชื่อ</label>
                                    <input className={inputCls} value={form.firstName ?? ''} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelCls}>นามสกุล</label>
                                    <input className={inputCls} value={form.lastName ?? ''} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>เบอร์โทรศัพท์</label>
                                    <input className={inputCls} value={form.phone ?? ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0812345678" />
                                </div>
                                <div>
                                    <label className={labelCls}>ที่อยู่ / จังหวัด</label>
                                    <input className={inputCls} value={form.location ?? ''} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="กรุงเทพมหานคร" />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>แนะนำตัว (Bio)</label>
                                <textarea rows={3} className={inputCls} value={form.bio ?? ''} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="เล่าเกี่ยวกับตัวเองสั้นๆ..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>ตำแหน่งที่ต้องการ</label>
                                    <input className={inputCls} value={form.desiredJobTitle ?? ''} onChange={e => setForm(p => ({ ...p, desiredJobTitle: e.target.value }))} placeholder="Frontend Developer" />
                                </div>
                                <div>
                                    <label className={labelCls}>เงินเดือนที่คาดหวัง (บาท/เดือน)</label>
                                    <input type="number" className={inputCls} min="0" value={form.expectedSalary ?? ''} onChange={e => setForm(p => ({ ...p, expectedSalary: e.target.value ? +e.target.value : undefined }))} placeholder="30000" />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>พร้อมเริ่มงานวันที่</label>
                                <input type="date" className={inputCls} value={form.availableFrom ? form.availableFrom.split('T')[0] : ''} onChange={e => setForm(p => ({ ...p, availableFrom: e.target.value }))} />
                            </div>

                            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 gap-4">
                                <p className="text-sm font-medium text-gray-600">🔗 ลิงก์โปรไฟล์</p>
                                <div>
                                    <label className={labelCls}>LinkedIn URL</label>
                                    <input className={inputCls} value={form.linkedinUrl ?? ''} onChange={e => setForm(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/yourname" />
                                </div>
                                <div>
                                    <label className={labelCls}>Portfolio / GitHub URL</label>
                                    <input className={inputCls} value={form.portfolioUrl ?? ''} onChange={e => setForm(p => ({ ...p, portfolioUrl: e.target.value }))} placeholder="https://github.com/yourname" />
                                </div>
                                <div>
                                    <label className={labelCls}>รูปโปรไฟล์ (URL)</label>
                                    {avatarMsg && (
                                        <div className={`mb-2 px-3 py-2 rounded-lg text-xs font-medium border ${avatarMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                                            }`}>{avatarMsg.text}</div>
                                    )}
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 group-hover:border-gray-600 bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0 transition-colors">
                                            {form.avatarUrl
                                                ? <img src={form.avatarUrl.startsWith('http') ? form.avatarUrl : `http://localhost:3000${form.avatarUrl}`} alt="avatar" className="w-full h-full object-cover" />
                                                : <span className="text-2xl">{avatarUploading ? '⏳' : '📷'}</span>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                                                {avatarUploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกรูป'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP สูงสุด 5MB</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button onClick={handleSaveInfo} disabled={saving}
                                className="w-full py-2.5 text-sm font-semibold rounded-lg text-white bg-black hover:bg-black/80 transition-colors disabled:opacity-60">
                                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    )}

                    {/* ---- Tab: ประสบการณ์งาน ---- */}
                    {tab === 'work' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">ประสบการณ์การทำงาน</h3>
                                <button onClick={openNewWork} className="text-sm px-3 py-1.5 bg-black text-white rounded-lg hover:bg-black/80 transition-colors">+ เพิ่ม</button>
                            </div>

                            {(profile?.workExperiences ?? []).length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <p className="text-3xl mb-2">💼</p>
                                    ยังไม่มีข้อมูลประสบการณ์
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {profile!.workExperiences.map(w => (
                                        <div key={w.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{w.position}</p>
                                                    <p className="text-sm text-gray-600">{w.company}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {fmtDate(w.startDate)} – {w.isCurrent ? 'ปัจจุบัน' : fmtDate(w.endDate ?? '')}
                                                    </p>
                                                    {w.description && <p className="text-sm text-gray-500 mt-2">{w.description}</p>}
                                                </div>
                                                <div className="flex gap-2 ml-4 flex-shrink-0">
                                                    <button onClick={() => openEditWork(w)} className="text-xs text-blue-600 hover:underline">แก้ไข</button>
                                                    <button onClick={() => deleteWork(w.id)} className="text-xs text-red-500 hover:underline">ลบ</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Work Form Modal */}
                            {showWorkForm && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
                                        <h4 className="font-bold text-lg">{editWorkId ? 'แก้ไข' : 'เพิ่ม'}ประสบการณ์งาน</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelCls}>บริษัท *</label>
                                                <input className={inputCls} value={workForm.company} onChange={e => setWorkForm(p => ({ ...p, company: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>ตำแหน่ง *</label>
                                                <input className={inputCls} value={workForm.position} onChange={e => setWorkForm(p => ({ ...p, position: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>วันที่เริ่ม *</label>
                                                <input type="date" className={inputCls} value={workForm.startDate} onChange={e => setWorkForm(p => ({ ...p, startDate: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>วันที่สิ้นสุด</label>
                                                <input type="date" className={inputCls} disabled={workForm.isCurrent} value={workForm.endDate ?? ''} onChange={e => setWorkForm(p => ({ ...p, endDate: e.target.value }))} />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={workForm.isCurrent} onChange={e => setWorkForm(p => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? null : p.endDate }))} />
                                            ทำงานที่นี่อยู่ในปัจจุบัน
                                        </label>
                                        <div>
                                            <label className={labelCls}>รายละเอียดงาน</label>
                                            <textarea rows={3} className={inputCls} value={workForm.description} onChange={e => setWorkForm(p => ({ ...p, description: e.target.value }))} placeholder="เล่าสิ่งที่รับผิดชอบ..." />
                                        </div>
                                        <div className="flex gap-2 justify-end pt-2">
                                            <button onClick={() => setShowWorkForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">ยกเลิก</button>
                                            <button onClick={saveWork} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80">บันทึก</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ---- Tab: การศึกษา ---- */}
                    {tab === 'edu' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">ประวัติการศึกษา</h3>
                                <button onClick={openNewEdu} className="text-sm px-3 py-1.5 bg-black text-white rounded-lg hover:bg-black/80 transition-colors">+ เพิ่ม</button>
                            </div>

                            {(profile?.educations ?? []).length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <p className="text-3xl mb-2">🎓</p>
                                    ยังไม่มีข้อมูลการศึกษา
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {profile!.educations.map(e => (
                                        <div key={e.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{e.institution}</p>
                                                    <p className="text-sm text-gray-600">{e.degree}{e.fieldOfStudy ? ` – ${e.fieldOfStudy}` : ''}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {e.startYear} – {e.isCurrent ? 'ปัจจุบัน' : e.endYear}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4 flex-shrink-0">
                                                    <button onClick={() => openEditEdu(e)} className="text-xs text-blue-600 hover:underline">แก้ไข</button>
                                                    <button onClick={() => deleteEdu(e.id)} className="text-xs text-red-500 hover:underline">ลบ</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Education Form Modal */}
                            {showEduForm && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
                                        <h4 className="font-bold text-lg">{editEduId ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลการศึกษา</h4>
                                        <div>
                                            <label className={labelCls}>สถาบันการศึกษา *</label>
                                            <input className={inputCls} value={eduForm.institution} onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))} placeholder="มหาวิทยาลัย..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelCls}>ระดับการศึกษา *</label>
                                                <input className={inputCls} value={eduForm.degree} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} placeholder="ปริญญาตรี" />
                                            </div>
                                            <div>
                                                <label className={labelCls}>สาขาวิชา</label>
                                                <input className={inputCls} value={eduForm.fieldOfStudy} onChange={e => setEduForm(p => ({ ...p, fieldOfStudy: e.target.value }))} placeholder="วิศวกรรมซอฟต์แวร์" />
                                            </div>
                                            <div>
                                                <label className={labelCls}>ปีที่เริ่มศึกษา *</label>
                                                <input type="number" className={inputCls} value={eduForm.startYear} onChange={e => setEduForm(p => ({ ...p, startYear: +e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>ปีที่จบการศึกษา</label>
                                                <input type="number" className={inputCls} disabled={eduForm.isCurrent} value={eduForm.endYear ?? ''} onChange={e => setEduForm(p => ({ ...p, endYear: +e.target.value }))} />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={eduForm.isCurrent} onChange={e => setEduForm(p => ({ ...p, isCurrent: e.target.checked, endYear: e.target.checked ? null : p.endYear }))} />
                                            กำลังศึกษาอยู่ในปัจจุบัน
                                        </label>
                                        <div className="flex gap-2 justify-end pt-2">
                                            <button onClick={() => setShowEduForm(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">ยกเลิก</button>
                                            <button onClick={saveEdu} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80">บันทึก</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
