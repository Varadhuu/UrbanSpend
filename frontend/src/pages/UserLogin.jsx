import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lock, Mail, ArrowRight, Zap, Target, Globe } from 'lucide-react';

const UserLogin = () => {
  const [email, setEmail] = useState('varadharajan@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard/business');
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <div 
        className="w-full max-w-5xl mx-auto my-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative transition-transform duration-500 hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/10 group/card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Left Side - Dynamic Branding */}
        <div className="hidden lg:flex lg:w-5/12 relative p-12 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 text-white dark:from-indigo-900 dark:via-blue-900 dark:to-slate-900">
            {/* Dynamic Abstract Background Elements */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div className={`absolute top-[-20%] left-[-20%] w-[40rem] h-[40rem] bg-blue-500/30 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 ease-out ${isHovered ? 'scale-110 translate-x-10' : 'scale-100'}`}></div>
            <div className={`absolute bottom-[-10%] right-[-20%] w-[35rem] h-[35rem] bg-indigo-400/30 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 ease-out delay-75 ${isHovered ? 'scale-110 -translate-y-10' : 'scale-100'}`}></div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl border border-white/20 transform group-hover/card:rotate-3 transition-transform duration-500">
                    <TrendingUp className="text-white w-8 h-8" />
                </div>
                <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
                    Opportunity meets <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Intelligence.</span>
                </h1>
                <p className="text-blue-100/90 text-lg max-w-md font-medium leading-relaxed">
                    Join thousands of visionary entrepreneurs leveraging AI to pinpoint the perfect location and maximize ROI.
                </p>

                <div className="mt-12 space-y-5">
                    <div className="flex items-center gap-4 text-blue-50/90 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit transform transition-transform duration-500 hover:translate-x-2">
                        <div className="p-2 bg-blue-500/20 rounded-xl"><Zap className="w-5 h-5 text-blue-200" /></div>
                        <span className="font-medium text-sm">Real-time market saturation indexing</span>
                    </div>
                    <div className="flex items-center gap-4 text-blue-50/90 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit transform transition-transform duration-500 delay-75 hover:translate-x-2">
                        <div className="p-2 bg-indigo-500/20 rounded-xl"><Target className="w-5 h-5 text-indigo-200" /></div>
                        <span className="font-medium text-sm">Competitor sentiment analysis</span>
                    </div>
                    <div className="flex items-center gap-4 text-blue-50/90 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit transform transition-transform duration-500 delay-150 hover:translate-x-2">
                        <div className="p-2 bg-sky-500/20 rounded-xl"><Globe className="w-5 h-5 text-sky-200" /></div>
                        <span className="font-medium text-sm">Billion-point demographic scoring</span>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 flex items-center gap-4 text-blue-200/60 text-sm font-semibold tracking-wide uppercase mt-12">
                <span>UrbanSpend AI Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50"></span>
                <span>v1.0.0</span>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 xl:px-24 flex flex-col justify-center relative bg-white/40 dark:bg-slate-900/40">
            {/* Mobile-only header elements */}
            <div className="flex lg:hidden flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40 mb-5 relative">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse delay-75"></div>
                    <TrendingUp className="text-white w-8 h-8 relative z-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Log in to your business dashboard</p>
            </div>

            <div className="hidden lg:block mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Sign in</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back to your UrbanSpend dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto lg:mx-0 lg:max-w-md w-full">
                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Email Address
                    </label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-600/50 rounded-2xl bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold shadow-sm"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Password
                    </label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-600/50 rounded-2xl bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center mt-4 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-600/20 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all group-btn hover:-translate-y-1 active:translate-y-0"
                >
                    Access Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
            </form>
            
            <div className="mt-10 text-center lg:text-left lg:max-w-md w-full mx-auto md:mx-0">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    New to UrbanSpend?{' '}
                    <a href="#" className="font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Request enterprise access
                    </a>
                </p>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
