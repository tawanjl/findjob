import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState<'error' | 'warning'>('error');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore(state => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setAuth(data.user, data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            // 403 = บัญชีรอการอนุมัติ หรือ ถูกปฏิเสธ
            if (status === 403) {
                setErrorType('warning');
                setError(message || 'บัญชีของคุณยังไม่ได้รับอนุญาตให้เข้าสู่ระบบ');
            } else {
                setErrorType('error');
                setError(message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน');
            }
        } finally {
            setLoading(false);
        }
    };

    const errorBannerClass = errorType === 'warning'
        ? 'text-amber-800 text-center text-sm bg-amber-50 border border-amber-200 rounded-md p-3'
        : 'text-red-600 text-center text-sm bg-red-50 border border-red-200 rounded-md p-3';

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                        เข้าสู่ระบบ
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className={errorBannerClass}>{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">อีเมล</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="อีเมล"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">รหัสผ่าน</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="รหัสผ่าน"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <a href="/register" className="font-medium text-black hover:text-black/70">
                            ยังไม่มีบัญชี? สมัครสมาชิก
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};
