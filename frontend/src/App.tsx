import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { JobBoard } from './pages/JobBoard';
import { JobDetail } from './pages/JobDetail';
import { JobApplicants } from './pages/JobApplicants';
import { Community } from './pages/Community';
import { PostDetail } from './pages/PostDetail';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user, logout } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple inline nav for testing initially */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/"><span className="font-bold text-xl text-primary-600">JobsDB Pro</span></a>
              <div className="flex items-center gap-4">
                <a href="/jobs" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Find Jobs</a>
                <a href="/community" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Community</a>
                {user ? (
                  <>
                    <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Dashboard</a>
                    <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Logout</button>
                  </>
                ) : (
                  <a href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign in</a>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/:id/applicants" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <JobApplicants />
              </ProtectedRoute>
            } />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
