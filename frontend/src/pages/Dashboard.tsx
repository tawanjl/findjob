
import { useAuthStore } from '../store/authStore';
import { UserDashboard } from './UserDashboard';
import { EmployerDashboard } from './EmployerDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <div>
            <div className="mb-8 flex justify-between items-end border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.firstName || user.email}
                    </h1>
                    <p className="text-gray-600 mt-1 capitalize text-sm">{user.role.toLowerCase()} Account</p>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Sign Out
                </button>
            </div>

            {user.role === 'USER' && <UserDashboard />}
            {user.role === 'EMPLOYER' && <EmployerDashboard />}
            {user.role === 'ADMIN' && <AdminDashboard />}
        </div>
    );
};
