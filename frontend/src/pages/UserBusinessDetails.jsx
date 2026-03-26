import React, { useState } from 'react';
import { Building2, MapPin, Users, Target, Activity, CheckCircle2, Save, X } from 'lucide-react';

const UserBusinessDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [businessData, setBusinessData] = useState({
    name: "Tech Haven Analytics",
    industry: "SaaS & Data Services",
    location: "Downtown Innovation District",
    established: "2023",
    teamSize: "12 Employees",
    coreFocus: "B2B Predictive Modeling",
    status: "Active - Scaling Phase",
  });

  const [formData, setFormData] = useState({ ...businessData });

  const handleSave = () => {
    setBusinessData({ ...formData });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({ ...businessData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage your core business intelligence parameters.</p>
        </div>
        {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl font-medium transition-all shadow-sm"
            >
              Edit Details
            </button>
        ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 font-medium transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Info Card */}
        <div className={`lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border ${isEditing ? 'border-blue-400 dark:border-blue-500/50 shadow-blue-500/10' : 'border-slate-200 dark:border-slate-700/50'} p-6 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-6">
            <div className="flex items-center space-x-5 w-full">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        placeholder="Business Name"
                    />
                ) : (
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{businessData.name}</h2>
                )}
                
                <div className="mt-2">
                    {isEditing ? (
                        <select 
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-300"
                        >
                            <option>Active - Scaling Phase</option>
                            <option>Active - Stable</option>
                            <option>Planning Phase</option>
                            <option>Pre-Launch</option>
                        </select>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {businessData.status}
                        </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center tracking-wide uppercase">
                <Target className="w-4 h-4 mr-2 text-indigo-500" /> Industry
              </span>
              {isEditing ? (
                  <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all" />
              ) : (
                  <span className="text-slate-900 dark:text-white font-semibold text-lg">{businessData.industry}</span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center tracking-wide uppercase">
                <MapPin className="w-4 h-4 mr-2 text-rose-500" /> Primary Location
              </span>
              {isEditing ? (
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all" />
              ) : (
                  <span className="text-slate-900 dark:text-white font-semibold text-lg">{businessData.location}</span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center tracking-wide uppercase">
                <Users className="w-4 h-4 mr-2 text-sky-500" /> Team Size
              </span>
              {isEditing ? (
                  <input type="text" name="teamSize" value={formData.teamSize} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all" />
              ) : (
                  <span className="text-slate-900 dark:text-white font-semibold text-lg">{businessData.teamSize}</span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center tracking-wide uppercase">
                <Activity className="w-4 h-4 mr-2 text-emerald-500" /> Core Focus
              </span>
              {isEditing ? (
                  <input type="text" name="coreFocus" value={formData.coreFocus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all" />
              ) : (
                  <span className="text-slate-900 dark:text-white font-semibold text-lg">{businessData.coreFocus}</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats / Checklist */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 flex flex-col">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/50">Compliance & Setup</h3>
          <div className="flex-1 space-y-5">
            <div className="flex items-start space-x-3 group cursor-default">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Business Registration</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Verified and up to date</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group cursor-default">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Tax Documentation</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Filed for 2025</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group cursor-default">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Banking Connected</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Stripe & Chase connected</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group cursor-default opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Update Insurance Info</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 text-amber-500">Pending renewal required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBusinessDetails;
