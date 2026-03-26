import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, BarChart3, Settings, LogOut, Lightbulb, TrendingUp } from 'lucide-react';

const UserDashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navItems = [
    { name: 'My Business', path: '/dashboard/business', icon: Briefcase },
    { name: 'Analytics & Growth', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: Lightbulb },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-transparent rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
              VR
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Varadha Rajan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tech Haven Inc.</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area for Dashboard */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-transparent">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
