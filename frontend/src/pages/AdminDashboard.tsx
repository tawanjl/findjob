import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface Stats {
    totalJobs: number;
    totalUsers: number;
    employerCount: number;
    seekerCount: number;
    totalApplications: number;
    pendingEmployerCount: number;
}

interface Employer {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    approvalStatus: string;
    createdAt: string;
    employerPhone?: string;
    companyNameRequest?: string;
    businessType?: string;
    employerNote?: string;
}

export const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [pendingEmployers, setPendingEmployers] = useState<Employer[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'employers'>('overview');
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);

    const fetchStats = () => {
        api.get('/admin/statistics').then(res => setStats(res.data));
    };

    const fetchPendingEmployers = () => {
        api.get('/admin/employers/pending').then(res => setPendingEmployers(res.data));
    };

    useEffect(() => {
        fetchStats();
        fetchPendingEmployers();
    }, []);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleApprove = async (id: number, name: string) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/employers/${id}/approve`);
            showSuccess(`อนุมัติ ${name} เรียบร้อยแล้ว`);
            fetchPendingEmployers();
            fetchStats();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number, name: string) => {
        if (!window.confirm(`ยืนยันการปฏิเสธบัญชีของ ${name}?`)) return;
        setActionLoading(id);
        try {
            await api.patch(`/admin/employers/${id}/reject`);
            showSuccess(`ปฏิเสธ ${name} เรียบร้อยแล้ว`);
            fetchPendingEmployers();
            fetchStats();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">แผงควบคุม Admin</h2>
                    {stats && stats.pendingEmployerCount > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            ⏳ รออนุมัติ {stats.pendingEmployerCount} บัญชี
                        </span>
                    )}
                </div>

                {/* Success toast */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
                        ✅ {successMessage}
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            ภาพรวม
                        </button>
                        <button
                            onClick={() => setActiveTab('employers')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'employers'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            อนุมัตินายจ้าง
                            {stats && stats.pendingEmployerCount > 0 && (
                                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {stats.pendingEmployerCount}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">ผู้ใช้งานทั้งหมด</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                                <p className="text-xs text-gray-500 mt-2">
                                    ผู้หางาน {stats.seekerCount} / นายจ้าง {stats.employerCount}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">งานทั้งหมด</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalJobs}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">การสมัครงานทั้งหมด</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalApplications}</dd>
                            </div>
                        </div>
                        <div className="bg-amber-50 overflow-hidden shadow rounded-lg border border-amber-200">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-amber-700 truncate">นายจ้างรออนุมัติ</dt>
                                <dd className="mt-1 text-3xl font-semibold text-amber-800">{stats.pendingEmployerCount}</dd>
                                <button
                                    onClick={() => setActiveTab('employers')}
                                    className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-medium underline"
                                >
                                    จัดการ →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Employer Approval Tab */}
                {activeTab === 'employers' && (
                    <div className="bg-white shadow rounded-lg border border-gray-100">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                นายจ้างที่รอการอนุมัติ
                            </h3>

                            {pendingEmployers.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">ไม่มีนายจ้างรออนุมัติในขณะนี้</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล / เบอร์</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อบริษัท</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทธุรกิจ</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingEmployers.map(employer => (
                                                <tr key={employer.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm flex-shrink-0">
                                                                {employer.firstName?.[0] || employer.email[0].toUpperCase()}
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {employer.firstName} {employer.lastName}
                                                                </p>
                                                                {employer.employerNote && (
                                                                    <p className="text-xs text-gray-400 max-w-[160px] truncate" title={employer.employerNote}>
                                                                        {employer.employerNote}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <p className="text-sm text-gray-700">{employer.email}</p>
                                                        {employer.employerPhone && (
                                                            <p className="text-xs text-gray-500 mt-0.5"> {employer.employerPhone}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <p className="text-sm text-gray-900 font-medium">{employer.companyNameRequest || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {employer.businessType ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                                {employer.businessType}
                                                            </span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(employer.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={() => setSelectedEmployer(employer)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                            >
                                                                🔍 รายละเอียด
                                                            </button>
                                                            <button
                                                                onClick={() => handleApprove(employer.id, `${employer.firstName} ${employer.lastName}`)}
                                                                disabled={actionLoading === employer.id}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === employer.id ? '...' : '✓ อนุมัติ'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(employer.id, `${employer.firstName} ${employer.lastName}`)}
                                                                disabled={actionLoading === employer.id}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === employer.id ? '...' : '✕ ปฏิเสธ'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {selectedEmployer && (() => {
                const emp = selectedEmployer;
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEmployer(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold text-lg">
                                        {emp.firstName?.[0] || emp.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg leading-tight">{emp.firstName} {emp.lastName}</h3>
                                        <p className="text-gray-300 text-sm">นายจ้างรออนุมัติ</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEmployer(null)} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">✕</button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-500 mb-1">อีเมล</p>
                                        <p className="text-sm text-gray-900 font-medium break-all">{emp.email}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-500 mb-1">เบอร์ติดต่อ</p>
                                        <p className="text-sm text-gray-900 font-medium">{emp.employerPhone || '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-500 mb-1">ชื่อบริษัท</p>
                                        <p className="text-sm text-gray-900 font-medium">{emp.companyNameRequest || '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs font-medium text-gray-500 mb-1">ประเภทธุรกิจ</p>
                                        {emp.businessType
                                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{emp.businessType}</span>
                                            : <p className="text-sm text-gray-400">-</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-medium text-gray-500 mb-1">วันที่สมัคร</p>
                                    <p className="text-sm text-gray-900">{formatDate(emp.createdAt)}</p>
                                </div>

                                {emp.employerNote && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <p className="text-xs font-medium text-amber-700 mb-1">หมายเหตุ / ข้อมูลเพิ่มเติม</p>
                                        <p className="text-sm text-amber-900 whitespace-pre-wrap">{emp.employerNote}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer actions */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button
                                    onClick={() => { handleApprove(emp.id, `${emp.firstName} ${emp.lastName}`); setSelectedEmployer(null); }}
                                    disabled={actionLoading === emp.id}
                                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    ✓ อนุมัติบัญชีนี้
                                </button>
                                <button
                                    onClick={() => { handleReject(emp.id, `${emp.firstName} ${emp.lastName}`); setSelectedEmployer(null); }}
                                    disabled={actionLoading === emp.id}
                                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    ✕ ปฏิเสธบัญชีนี้
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};
