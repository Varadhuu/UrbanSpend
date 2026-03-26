import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Zap, Loader2, BarChart4, CheckCircle2 } from 'lucide-react';

const UserAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Mock data for analytics growth problems and things they could change or improve
  const analyticsData = {
    revenueGrowth: "+12.4%",
    customerAcquisitionCost: "$45.20",
    cacTrend: "up", // representing a problem area
    churnRate: "4.2%",
    churnTrend: "up" // representing another problem area
  };

  const problems = [
    {
      id: 1,
      title: "Rising Customer Acquisition Cost (CAC)",
      description: "Your CAC has increased by 18% over the last quarter, primarily driven by underperforming ad campaigns in the downtown demographic.",
      severity: "High",
    },
    {
      id: 2,
      title: "Slight Increase in Churn Rate",
      description: "Monthly recurring churn increased from 3.1% to 4.2%. Feedback indicates missing integration features.",
      severity: "Medium",
    }
  ];

  const improvements = [
    {
      id: 1,
      title: "Optimize Ad Targeting",
      action: "Shift 30% of ad spend from downtown general demographic to highly targeted suburban micro-campaigns based on UrbanSpend demographic data.",
      impact: "Expected to reduce CAC by ~15%."
    },
    {
      id: 2,
      title: "Implement Automated Onboarding",
      action: "Set up a 7-day email onboarding sequence to help new customers understand the platform faster, reducing early drop-offs.",
      impact: "Projected to improve retention by 5-8%."
    },
    {
      id: 3,
      title: "Introduce Referral Program",
      action: "Incentivize your current highly engaged users with a one-month credit for successful referrals.",
      impact: "Creates a low-CAC acquisition channel."
    }
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
        setIsAnalyzing(false);
        setHasAnalyzed(true);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analytics & Growth</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Identify growth bottlenecks and discover actionable AI improvements.</p>
        </div>
        {!hasAnalyzed ? (
            <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
            {isAnalyzing ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Billions of Data Points...</span>
                </>
            ) : (
                <>
                    <Zap className="w-5 h-5 text-blue-100" />
                    <span>Run Deep AI Analysis</span>
                </>
            )}
            </button>
        ) : (
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800/50">
                <CheckCircle2 className="w-5 h-5" />
                <span>Analysis Complete</span>
            </div>
        )}
      </div>

      {hasAnalyzed ? (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500 fill-mode-both">
              {/* KPI Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <p className="text-sm font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">Revenue Growth (MoM)</p>
                  <div className="flex items-center mt-3">
                    <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{analyticsData.revenueGrowth}</h3>
                    <span className="ml-3 flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-4 h-4 mr-1 stroke-[3]" /> Good
                    </span>
                  </div>
                </div>
                
                <div className="bg-rose-50/80 dark:bg-rose-900/10 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-rose-100 dark:border-rose-900/30 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <p className="text-sm font-bold tracking-wide uppercase text-slate-600 dark:text-slate-400">Avg. CAC</p>
                  <div className="flex items-center mt-3">
                    <h3 className="text-4xl font-extrabold text-rose-700 dark:text-rose-400">{analyticsData.customerAcquisitionCost}</h3>
                    <span className="ml-3 flex items-center text-sm font-bold text-rose-600 dark:text-rose-500 bg-rose-200 dark:bg-rose-900/50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-4 h-4 mr-1 stroke-[3]" /> +18%
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50/80 dark:bg-amber-900/10 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-amber-900/30 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <p className="text-sm font-bold tracking-wide uppercase text-slate-600 dark:text-slate-400">Churn Rate</p>
                  <div className="flex items-center mt-3">
                    <h3 className="text-4xl font-extrabold text-amber-700 dark:text-amber-400">{analyticsData.churnRate}</h3>
                    <span className="ml-3 flex items-center text-sm font-bold text-amber-600 dark:text-amber-500 bg-amber-200 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-4 h-4 mr-1 stroke-[3]" /> +1.1%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Identified Problems */}
                <div className="space-y-5">
                  <div className="flex items-center space-x-3 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl w-fit border border-rose-100 dark:border-rose-900/30">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <h2 className="text-xl font-extrabold text-rose-900 dark:text-rose-300">Growth Bottlenecks</h2>
                  </div>
                  <div className="space-y-4">
                    {problems.map(problem => (
                      <div key={problem.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-[1.5rem] border-l-[6px] border-rose-500 shadow-sm transition-all hover:translate-x-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{problem.title}</h3>
                          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                            {problem.severity} Priority
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">{problem.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Improvements */}
                <div className="space-y-5">
                  <div className="flex items-center space-x-3 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl w-fit border border-indigo-100 dark:border-indigo-900/30">
                    <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300">AI Recommended Actions</h2>
                  </div>
                  <div className="space-y-4">
                    {improvements.map(improvement => (
                      <div key={improvement.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-[1.5rem] border border-indigo-100 dark:border-indigo-800/40 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{improvement.title}</h3>
                        <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-4">{improvement.action}</p>
                        <div className="bg-white/70 dark:bg-slate-900/50 rounded-xl p-3 border border-indigo-50 dark:border-indigo-800/20 shadow-inner">
                          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" /> {improvement.impact}
                          </p>
                        </div>
                        <button className="mt-5 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20 group">
                          Implement Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </div>
      ) : (
          <div className="h-96 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/30">
              <BarChart4 className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">No Analysis Found</h3>
              <p className="text-slate-400 dark:text-slate-500 font-medium text-center max-w-sm">
                  Click the 'Run Deep AI Analysis' button above to generate granular insights into your bottlenecks and growth opportunities.
              </p>
          </div>
      )}
    </div>
  );
};

export default UserAnalytics;
