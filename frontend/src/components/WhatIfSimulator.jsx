import React, { useState, useEffect } from 'react';
import { getAreas, getCategories, fetchWhatIf, generateBusinessPlan } from '../api';
import { Settings2, Calculator, ArrowRight, FileText } from 'lucide-react';
import BusinessPlanModal from './BusinessPlanModal';

export default function WhatIfSimulator({ globalArea }) {
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ area: '', budget: 100000, category: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (globalArea !== undefined) {
            setForm(prev => ({ ...prev, area: globalArea }));
        }
    }, [globalArea]);

    // Business Plan State
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [planContent, setPlanContent] = useState(null);
    const [planLoading, setPlanLoading] = useState(false);

    useEffect(() => {
        getAreas().then(res => setAreas(res)).catch(console.error);
        getCategories().then(res => setCategories(res)).catch(console.error);
    }, []);

    const simulate = async () => {
        if (!form.area || !form.category) return;
        setLoading(true);
        try {
            const data = await fetchWhatIf(form.area, form.budget, form.category);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!form.area || !form.category) return;
        setIsPlanModalOpen(true);
        setPlanLoading(true);
        try {
            const data = await generateBusinessPlan(form.area, form.budget, form.category);
            setPlanContent(data.plan_content);
        } catch (err) {
            console.error(err);
            setPlanContent("Failed to generate the business plan. Please try again.");
        } finally {
            setPlanLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white dark:border-slate-700/50 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 hover:-translate-y-1 relative group cursor-default">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <Settings2 className="text-emerald-500 w-5 h-5" /> What-If Simulator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                            Investment Amount (₹) <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{form.budget.toLocaleString()}</span>
                        </label>
                        <input
                            type="number"
                            min="10000" max="1000000" step="10000"
                            value={form.budget}
                            onChange={(e) => {
                                setForm({ ...form, budget: Number(e.target.value) });
                                if (form.area && form.category) setTimeout(simulate, 300);
                            }}
                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        {globalArea === undefined && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Area</label>
                                <select
                                    value={form.area}
                                    onChange={(e) => {
                                        setForm({ ...form, area: e.target.value });
                                        if (e.target.value && form.category) setTimeout(simulate, 300);
                                    }}
                                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                >
                                    <option value="">Select Area</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
                            <select
                                value={form.category}
                                onChange={(e) => {
                                    setForm({ ...form, category: e.target.value });
                                    if (form.area && e.target.value) setTimeout(simulate, 300);
                                }}
                                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                            >
                                <option value="">Select Business Type</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    {loading ? (
                        <div className="h-full flex items-center justify-center"><Calculator className="w-8 h-8 animate-pulse text-emerald-500" /></div>
                    ) : result ? (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-[1.5rem] p-6 border border-emerald-100 dark:border-emerald-800/30 shadow-[inset_0_2px_15px_rgba(0,0,0,0.02)] animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 border-b border-emerald-200/50 dark:border-emerald-800/50 pb-3">Simulation Results</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">Risk Score</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{result.risk_score}/100</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">Projected ROI</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{result.expected_roi_months} Months</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">Profitability Index</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{result.profitability_index}</span>
                                </div>
                                {result.warning_message && (
                                    <div className="mt-5 text-sm p-3.5 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                                        {result.warning_message}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleGeneratePlan}
                                className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                            >
                                <FileText className="w-5 h-5" /> Generate Business Plan
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-[1.5rem] bg-slate-50/50 dark:bg-slate-800/20">
                            <ArrowRight className="w-8 h-8 mb-3 opacity-40" />
                            <p className="text-sm font-medium">Select parameters to simulate</p>
                        </div>
                    )}
                </div>
            </div>

            <BusinessPlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                planContent={planContent}
                loading={planLoading}
            />
        </div>
    );
}
