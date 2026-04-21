import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    User,
    Activity,
    Lightbulb,
    Code,
    Calendar,
    Loader2,
    ArrowRight,
    LogOut,
    ChevronRight,
    Sparkles
} from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                // Not authenticated, redirect to login
                navigate("/login");
                return;
            }

            try {
                const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
                const response = await axios.get(`${API}/api/users/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                setError("Failed to load dashboard data. Please try logging in again.");
                if (err.response && err.response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 font-sans">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 font-sans text-center px-4">
                <div className="max-w-md p-8 bg-red-950/20 border border-red-500/30 rounded-3xl backdrop-blur-xl">
                    <h2 className="mb-4 text-2xl font-black text-red-400 tracking-tight">Authentication Error</h2>
                    <p className="mb-8 text-slate-300">{error}</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-4 text-sm font-bold text-black uppercase transition-all bg-red-500 rounded-xl hover:bg-red-400 active:scale-95"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { userInfo, myIdeas, myImplementations } = data;

    // Formatting date helper
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 lg:px-12">
                
                {/* HEADER / PROFILE OVERVIEW */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16"
                >
                    <div className="flex items-center gap-6">
                        {/* Avatar Block */}
                        <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-900 shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-400/30">
                            <span className="text-4xl font-black text-emerald-100 uppercase tracking-tighter">
                                {userInfo.name ? userInfo.name.substring(0, 2) : "US"}
                            </span>
                        </div>
                        
                        <div>
                            <span className="inline-flex items-center px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase border rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                Engineer Dashboard
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{userInfo.name}</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-400 font-mono">
                                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {userInfo.email}</span>
                                <span className="opacity-40 hidden sm:inline">•</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {formatDate(userInfo.joinedAt)}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 text-sm font-bold transition-all border rounded-xl text-slate-300 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 active:scale-95 group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </motion.div>

                {/* KPI METRICS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="p-8 border bg-slate-900/50 backdrop-blur-md rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/20 transition-all" />
                        <Lightbulb className="w-8 h-8 text-emerald-400 mb-6" />
                        <p className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-1">Total Ideas Created</p>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-white tracking-tighter">{userInfo.totalIdeasCreated}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-8 border bg-slate-900/50 backdrop-blur-md rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/20 transition-all" />
                        <Code className="w-8 h-8 text-blue-400 mb-6" />
                        <p className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-1">Implementations</p>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-white tracking-tighter">{userInfo.totalImplementationsSubmitted}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="p-8 border bg-slate-900/50 backdrop-blur-md rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[80px] group-hover:bg-violet-500/20 transition-all" />
                        <Activity className="w-8 h-8 text-violet-400 mb-6" />
                        <p className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-1">Total Engagement</p>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-white tracking-tighter">
                                {myIdeas.reduce((acc, curr) => acc + curr.totalUpvotes, 0)}
                            </span>
                            <span className="pb-1 text-sm font-bold text-violet-400">Upvotes Earned</span>
                        </div>
                    </motion.div>
                </div>

                {/* MAIN CONTENT SPLIT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* IDEAS COLUMN */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                My Blueprints
                            </h3>
                            <button className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-1 group">
                                View All 
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                        
                        {myIdeas.length === 0 ? (
                            <div className="p-12 border border-dashed rounded-[2rem] border-white/10 flex flex-col items-center justify-center text-center bg-slate-900/20">
                                <Lightbulb className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-400 mb-4">You haven't architected any ideas yet.</p>
                                <button className="px-6 py-3 font-bold text-black transition-all bg-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105">
                                    Draft New Idea
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myIdeas.map((idea) => (
                                    <motion.div 
                                        key={idea.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="p-6 border bg-slate-900/60 backdrop-blur-md rounded-3xl border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col cursor-pointer shadow-lg"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{idea.title}</h4>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                                idea.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                                idea.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                                {idea.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">
                                            {idea.description}
                                        </p>
                                        <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between font-mono text-xs">
                                            <span className="text-slate-500 truncate max-w-[60%]">{idea.techStack}</span>
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> {idea.totalUpvotes}</span>
                                                <span className="flex items-center gap-1.5"><Code className="w-3 h-3 text-blue-500" /> {idea.implementationCount}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* IMPLEMENTATIONS COLUMN */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <Code className="w-5 h-5 text-blue-400" />
                                Active Implementations
                            </h3>
                        </div>

                        {myImplementations.length === 0 ? (
                            <div className="p-12 border border-dashed rounded-[2rem] border-white/10 flex flex-col items-center justify-center text-center bg-slate-900/20">
                                <Code className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-400 mb-4">You haven't submitted any implementations yet.</p>
                                <button className="px-6 py-3 font-bold text-black transition-all bg-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 hover:bg-emerald-400">
                                    Explore Ideas to Build
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myImplementations.map((impl) => (
                                    <div key={impl.id} className="p-6 border bg-slate-900/60 backdrop-blur-md rounded-3xl border-white/5">
                                        <h4 className="text-lg font-bold text-white mb-2">{impl.repoUrl || 'Repository Submitted'}</h4>
                                        <p className="text-sm text-slate-400">Associated with Idea #{impl.ideaId}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
