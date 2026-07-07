import React, { useState } from 'react';
import AdminUsers from '../../components/admin/adminUsers';
import AdminCheckCourses from '../../components/admin/AdminCheckCourses';
import AdminCheckInstructor from '../../components/admin/AdminCheckInstructor';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your platform, users, and content</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'instructors'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Instructor Management
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Course Management
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'instructors' && <AdminCheckInstructor />}
          {activeTab === 'courses' && <AdminCheckCourses />}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
