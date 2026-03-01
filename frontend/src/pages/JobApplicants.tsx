import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/axios';

interface Applicant {
    id: number;
    status: string;
    coverLetter: string;
    employerReply?: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        resume?: {
            url: string;
        };
    };
}

export const JobApplicants = () => {
    const { id } = useParams<{ id: string }>();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editStates, setEditStates] = useState<Record<number, { status: string; reply: string }>>({});

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    const fetchApplicants = async () => {
        try {
            const { data } = await api.get(`/applications/job/${id}`);
            setApplicants(data);
        } catch (err: any) {
            console.error('Failed to load applicants', err);
            setError(err.response?.data?.message || 'Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (app: Applicant) => {
        const payload = editStates[app.id] || { status: app.status, reply: app.employerReply || '' };
        try {
            await api.patch(`/applications/${app.id}/status`, { status: payload.status, employerReply: payload.reply });
            setApplicants(applicants.map(a =>
                a.id === app.id ? { ...a, status: payload.status, employerReply: payload.reply } : a
            ));
            alert('อัปเดตข้อมูลเรียบร้อยแล้ว');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    const handleEditChange = (app: Applicant, field: 'status' | 'reply', value: string) => {
        setEditStates(prev => ({
            ...prev,
            [app.id]: {
                ...(prev[app.id] || { status: app.status, reply: app.employerReply || '' }),
                [field]: value
            }
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SHORTLISTED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'INTERVIEW': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'HIRED': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // PENDING
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading applicants...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <Link to="/dashboard" className="text-primary-600 hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors mb-2">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Job Applicants</h1>
                    <p className="text-gray-600 mt-1">Review and manage candidates for this position.</p>
                </div>
            </div>

            {applicants.length === 0 ? (
                <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500 text-lg">No one has applied for this job yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map(applicant => (
                        <div key={applicant.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex flex-col gap-6">
                                {/* Top: Applicant Info */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {applicant.user.firstName} {applicant.user.lastName}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(applicant.status)}`}>
                                            {applicant.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{applicant.user.email} • Applied on {new Date(applicant.createdAt).toLocaleDateString()}</p>

                                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h4>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{applicant.coverLetter || "No cover letter provided."}</p>
                                    </div>

                                    {applicant.user.resume?.url ? (
                                        <a
                                            href={`http://localhost:3000${applicant.user.resume.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            View Resume (PDF)
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-500 italic">No resume attached</span>
                                    )}
                                </div>

                                {/* Bottom: Update Status & Reply */}
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Update Status</label>
                                            <select
                                                value={editStates[applicant.id]?.status || applicant.status}
                                                onChange={(e) => handleEditChange(applicant, 'status', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black text-sm py-2"
                                            >
                                                <option value="PENDING">Pending (รอพิจารณา)</option>
                                                <option value="SHORTLISTED">Shortlisted (ผ่านรอบแรก)</option>
                                                <option value="INTERVIEW">Interview (นัดสัมภาษณ์)</option>
                                                <option value="HIRED">Hired (รับเข้าทำงาน)</option>
                                                <option value="REJECTED">Rejected (ปฏิเสธ)</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Message to Applicant</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Type a specific message or feedback for the applicant (optional)..."
                                                value={editStates[applicant.id]?.reply ?? (applicant.employerReply || '')}
                                                onChange={(e) => handleEditChange(applicant, 'reply', e.target.value)}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black text-sm py-2 px-3 resize-y min-h-[120px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={() => handleUpdate(applicant)}
                                            className="bg-black hover:bg-gray-800 text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
