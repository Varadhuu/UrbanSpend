import React, { useState, useEffect } from 'react';
import { getAreas, fetchLocationAnalysis } from '../api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { MapPin, Users, Building, Activity, DollarSign, Star, ThumbsDown, Target } from 'lucide-react';

export default function LocationAnalysis({ globalArea }) {
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (globalArea !== undefined && globalArea !== '') {
            setSelectedArea(globalArea);
        }
    }, [globalArea]);

    useEffect(() => {
        getAreas().then(res => setAreas(res)).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedArea) {
            setLoading(true);
            fetchLocationAnalysis(selectedArea)
                .then(res => setData(res))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [selectedArea]);

    const radarData = data ? [
        { subject: 'Traffic', A: data.demand_score, fullMark: 100 },
        { subject: 'Competition', A: data.competition_score * 10, fullMark: 100 },
        { subject: 'Saturation', A: data.market_saturation_index === 'Oversaturated' ? 80 : 30, fullMark: 100 },
        { subject: 'Income Level', A: data.income_level / 2000, fullMark: 100 }, // Normalized
        { subject: 'Rent Cost', A: data.rent_sqft / 2, fullMark: 100 },
    ] : [];

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white dark:border-slate-700/50 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 hover:-translate-y-1 group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapPin className="text-blue-500 w-5 h-5" /> Location Analysis
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Discover metrics for a specific area</p>
                </div>


            </div>

            {globalArea === undefined && (
                <div className="mb-6">
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Select an Area</option>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            )}

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : data ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 font-medium"><Users className="w-4 h-4 text-blue-500" /> Population</div>
                            <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{data.population.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 font-medium"><DollarSign className="w-4 h-4 text-emerald-500" /> Avg Income</div>
                            <div className="text-3xl font-extrabold text-slate-800 dark:text-white">₹{data.income_level.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 font-medium"><Building className="w-4 h-4 text-indigo-500" /> Businesses</div>
                            <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{data.total_existing_businesses}</div>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 font-medium"><Activity className="w-4 h-4 text-purple-500" /> Tier</div>
                            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">{data.cluster_tier}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-72 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 flex flex-col hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300">Top Growth Categories</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.top_growing_categories} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="growth_metric" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-72 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#cbd5e1" strokeOpacity={0.3} />
                                    <PolarAngleAxis dataKey="subject" fontSize={11} tick={{ fill: '#64748b' }} />
                                    <Radar name="Metrics" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {data.competitor_sentiment && (
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Target className="w-5 h-5 text-rose-500" /> Competitor Sentiment Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-4xl font-extrabold text-amber-500 flex items-center gap-1 mb-2">
                                        {data.competitor_sentiment.average_rating} <Star className="w-6 h-6 fill-amber-500" />
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Average Rating</div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                                        <div className="flex items-start gap-3">
                                            <ThumbsDown className="w-5 h-5 text-rose-500 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Top Local Complaint</h4>
                                                <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{data.competitor_sentiment.top_complaint}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed font-medium text-center md:text-left">
                                            "{data.competitor_sentiment.review_summary}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                    <MapPin className="w-8 h-8 mb-2 opacity-50" />
                    <p>Select an area to view detailed intelligence</p>
                </div>
            )}
        </div>
    );
}
