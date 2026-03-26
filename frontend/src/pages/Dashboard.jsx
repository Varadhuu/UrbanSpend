import React, { useState, useEffect } from 'react';
import { getAreas } from '../api';
import LocationAnalysis from '../components/LocationAnalysis';
import RecommendationEngine from '../components/RecommendationEngine';
import WhatIfSimulator from '../components/WhatIfSimulator';
import Chatbot from '../components/Chatbot';
import { MapPin } from 'lucide-react';

function Dashboard() {
    const [areas, setAreas] = useState([]);
    const [globalArea, setGlobalArea] = useState('');

    useEffect(() => {
        getAreas().then(res => {
            setAreas(res);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8 mt-8">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-6 border border-blue-200 dark:border-blue-800/50 shadow-sm relative group">
                    AI-Powered Insights
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                    Business Opportunity <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                        Intelligence
                    </span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
                    Analyze locations, discover profitable ventures, and simulate your business success with billions of AI-driven data points.
                </p>

                {/* Global Area Selector */}
                <div className="max-w-xl mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/5 dark:shadow-indigo-500/5 transition-all">
                    <label className="flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 gap-2">
                        <MapPin className="text-blue-500 w-5 h-5" /> Target Area Selection
                    </label>
                    <select
                        value={globalArea}
                        onChange={(e) => setGlobalArea(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-slate-800 dark:text-white text-lg appearance-none cursor-pointer text-center"
                    >
                        <option value="">-- Select a Location Globally --</option>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <LocationAnalysis globalArea={globalArea} />
                    <WhatIfSimulator globalArea={globalArea} />
                </div>

                <div className="space-y-8">
                    <RecommendationEngine globalArea={globalArea} />
                    <Chatbot />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
