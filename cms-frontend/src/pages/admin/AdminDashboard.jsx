import React, { useState } from 'react';
import AdminUsers from '../../components/admin/adminUsers';
import AdminCheckCourses from '../../components/admin/AdminCheckCourses';
import AdminCheckInstructor from '../../components/admin/AdminCheckInstructor';
import Overview from './AdminComponents/Overview';
import Payments from './AdminComponents/Payments';
import Reviews from './AdminComponents/Reviews';

const tabItems = [
  { key: "overview", label: "overview showe", icon: "OV" },
  { key: 'users', label: 'User Management', icon: '👤' },
  { key: 'courses', label: 'Course Management', icon: '📚' },
  { key: 'Payments', label: "Payment Management", icon: "PAY" },
  { key: "Review", label: "Review Management", icon: "RE" }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'instructors':
        return <AdminCheckInstructor />;
      case 'courses':
        return <AdminCheckCourses />;
      case 'overview':
        return <Overview/>
      case 'Payments':
        return <Payments/>
      case 'Review' :
        return <Reviews/>      
      case 'users':
      default:
        return <AdminUsers />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside
          className={`flex flex-col border-r border-gray-700 bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'
            }`}
        >
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-4">
            <div
              className={`overflow-hidden transition-all ${isSidebarOpen ? 'opacity-100' : 'hidden'
                }`}
            >
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Management</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="rounded-md bg-gray-800 px-2 py-2 text-sm text-gray-100 transition hover:bg-gray-700"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? '⟨' : '⟩'}
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-200 hover:bg-gray-800'
                    }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-800 text-base">
                    {tab.icon}
                  </span>
                  <span
                    className={`truncate transition-all ${isSidebarOpen ? 'opacity-100' : 'hidden'
                      }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              Manage users, instructors, and courses from one place.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">{renderContent()}</div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
