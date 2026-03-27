import React, { useState, useEffect } from 'react';
import { getAreas } from '../api';
import LocationAnalysis from '../components/LocationAnalysis';
import RecommendationEngine from '../components/RecommendationEngine';
import WhatIfSimulator from '../components/WhatIfSimulator';
import Chatbot from '../components/Chatbot';

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
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Analysis Location</p>
                    <select
                        value={globalArea || ''}
                        onChange={(e) => setGlobalArea(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
                    >
                        <option value="">Select an Area to Analyze (All Locations)</option>
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
