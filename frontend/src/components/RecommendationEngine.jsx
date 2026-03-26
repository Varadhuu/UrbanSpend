import React, { useState, useEffect } from 'react';
import { getAreas, getCategories, fetchRecommendation } from '../api';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RecommendationEngine({ globalArea }) {
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({ area: '', budget: 50000, category: 'Any' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (globalArea !== undefined) {
            setForm(prev => ({ ...prev, area: globalArea }));
        }
    }, [globalArea]);

    useEffect(() => {
        getAreas().then(res => setAreas(res)).catch(console.error);
        getCategories().then(res => setCategories(res)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.area) return;
        setLoading(true);
        try {
            const data = await fetchRecommendation(form.area, form.budget, form.category);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white dark:border-slate-700/50 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 hover:-translate-y-1 relative group cursor-default">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <Sparkles className="text-indigo-500 w-5 h-5" /> Recommendation Engine
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {globalArea === undefined && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Area</label>
                        <select
                            required
                            value={form.area}
                            onChange={(e) => setForm({ ...form, area: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                        >
                            <option value="">Select Area</option>
                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget (₹)</label>
                        <input
                            type="number"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category (Optional)</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                        >
                            <option value="Any">Any Category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !form.area}
                    className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                    {loading ? 'Analyzing Neural Networks...' : 'Generate Recommendation'}
                </button>
            </form>

            {result && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/30 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Recommended Business</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{result.recommended_business_type}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Risk Score</span>
                            <span className={`font-semibold ${result.risk_score > 60 ? 'text-orange-500' : 'text-emerald-500'}`}>{result.risk_score.toFixed(1)}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2">
                            <div className={`h-1.5 rounded-full ${result.risk_score > 60 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${result.risk_score}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Profitability Index</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{result.profitability_index.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Expected ROI</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{result.expected_roi_months.toFixed(1)} Months</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 1Y Growth Prediction</span>
                            <span className="font-semibold text-green-500">+{result.predicted_1_year_growth.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
