import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, MapPin, TrendingUp, HelpCircle, MessageSquare } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import UserLogin from './pages/UserLogin';
import UserDashboardLayout from './pages/UserDashboardLayout';
import UserBusinessDetails from './pages/UserBusinessDetails';
import UserAnalytics from './pages/UserAnalytics';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen text-slate-900 dark:text-slate-50 font-inter flex flex-col transition-colors duration-200">

        {/* Navigation Bar */}
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  UrbanSpend
                </span>
              </div>

              <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
                <Link to="/" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-500/20">
                  Sign In
                </Link>
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-full p-1 bg-slate-100/50 dark:bg-slate-900/50">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`px-3 py-1 rounded-full transition-all ${!darkMode ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`px-3 py-1 rounded-full transition-all ${darkMode ? 'bg-slate-800 shadow-sm text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route path="business" element={<UserBusinessDetails />} />
              <Route path="analytics" element={<UserAnalytics />} />
              <Route path="recommendations" element={<div className="p-8 text-center text-slate-500">Recommendations content...</div>} />
              <Route path="settings" element={<div className="p-8 text-center text-slate-500">Settings content...</div>} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
