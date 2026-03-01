import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/axios';

const BUSINESS_TYPES = ['IT / เทคโนโลยี', 'การเงิน / ธนาคาร', 'การผลิต / โรงงาน', 'ค้าปลีก / ค้าส่ง', 'บริการ / ท่องเที่ยว', 'สุขภาพ / การแพทย์', 'การศึกษา', 'อื่นๆ'];

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<'USER' | 'EMPLOYER'>('USER');
    // Employer extra fields
    const [employerPhone, setEmployerPhone] = useState('');
    const [companyNameRequest, setCompanyNameRequest] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [employerNote, setEmployerNote] = useState('');

    const [error, setError] = useState('');
    const [pendingApproval, setPendingApproval] = useState(false);
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore(state => state.setAuth);
    const navigate = useNavigate();

    const inputCls = 'appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload: any = { email, password, firstName, lastName, role };
            if (role === 'EMPLOYER') {
                payload.employerPhone = employerPhone;
                payload.companyNameRequest = companyNameRequest;
                payload.businessType = businessType;
                if (employerNote) payload.employerNote = employerNote;
            }
            const { data } = await api.post('/auth/register', payload);

            if (data.pending) {
                setPendingApproval(true);
                return;
            }

            setAuth(data.user, data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    if (pendingApproval) {
        return (
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100">
                        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">บัญชีอยู่ระหว่างการตรวจสอบ</h2>
                        <p className="mt-3 text-sm text-gray-600">
                            ขอบคุณที่สมัครสมาชิก! บัญชีนายจ้างของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            เมื่อได้รับการอนุมัติแล้ว คุณจะสามารถเข้าสู่ระบบได้ทันที
                        </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                        <p className="text-sm text-amber-800 font-medium">อีเมลที่ลงทะเบียน: {email}</p>
                        {companyNameRequest && (
                            <p className="text-sm text-amber-700 mt-1">บริษัท: {companyNameRequest}</p>
                        )}
                    </div>
                    <a
                        href="/"
                        className="inline-block w-full py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-black/80 transition-all shadow-md"
                    >
                        กลับหน้าหลัก
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">สมัครสมาชิก</h2>
                    <p className="text-center text-sm text-gray-500 mt-1">เลือกประเภทบัญชีของคุณ</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Role selector */}
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setRole('USER')}
                            className={`py-3 text-sm font-semibold rounded-xl text-center transition-all border-2 ${role === 'USER' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                            ผู้หางาน
                        </button>
                        <button type="button" onClick={() => setRole('EMPLOYER')}
                            className={`py-3 text-sm font-semibold rounded-xl text-center transition-all border-2 ${role === 'EMPLOYER' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                            นายจ้าง
                        </button>
                    </div>

                    {role === 'EMPLOYER' && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                            <strong>หมายเหตุ:</strong> บัญชีนายจ้างต้องรอการอนุมัติจากผู้ดูแลระบบก่อนจึงจะสามารถเข้าสู่ระบบได้
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600 text-center text-sm bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
                    )}

                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อ *</label>
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} placeholder="ชื่อ" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">นามสกุล *</label>
                            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} placeholder="นามสกุล" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">อีเมล *</label>
                        <input name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="example@email.com" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">รหัสผ่าน * (อย่างน้อย 6 ตัวอักษร)</label>
                        <input name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
                    </div>

                    {/* Employer extra fields */}
                    {role === 'EMPLOYER' && (
                        <div className="space-y-4 border-t border-gray-100 pt-4">
                            <p className="text-sm font-semibold text-gray-700">ข้อมูลสำหรับนายจ้าง</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อบริษัท *</label>
                                    <input type="text" required value={companyNameRequest} onChange={e => setCompanyNameRequest(e.target.value)} className={inputCls} placeholder="ชื่อบริษัท" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">เบอร์ติดต่อ *</label>
                                    <input type="tel" required value={employerPhone} onChange={e => setEmployerPhone(e.target.value)} className={inputCls} placeholder="เบอร์ติดต่อ" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">ประเภทธุรกิจ *</label>
                                <select required value={businessType} onChange={e => setBusinessType(e.target.value)} className={inputCls}>
                                    <option value="">-- เลือกประเภทธุรกิจ --</option>
                                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">หมายเหตุ / ข้อมูลเพิ่มเติม (ไม่บังคับ)</label>
                                <textarea rows={3} value={employerNote} onChange={e => setEmployerNote(e.target.value)} className={inputCls} placeholder="ข้อมูลเพิ่มเติมที่ต้องการแจ้งให้ Admin ทราบ..." />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-black hover:bg-black/80 focus:outline-none transition-all shadow-md disabled:opacity-60">
                        {loading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
                    </button>

                    <div className="text-sm text-center">
                        <a href="/login" className="font-medium text-black hover:text-black/70">
                            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};
