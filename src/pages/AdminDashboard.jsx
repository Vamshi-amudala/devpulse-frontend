import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Lightbulb,
    Code,
    Zap,
    TrendingUp,
    Trash2,
    ShieldAlert,
    LogOut,
    CheckCircle2,
    Star,
    Award
} from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    const fetchAdminData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await axios.get(`${API}/api/admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
        } catch (err) {
            setError("Failed to load admin dashboard. You might not have the required permissions.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                // Not authorized or invalid token
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [navigate]);

    const handleDeleteUser = async (userId, userName) => {
        const confirmation = window.confirm(`Are you absolutely sure you want to permanently delete the user ${userName}? This action cannot be undone.`);

        if (!confirmation) return;

        setDeleteLoadingId(userId);

        try {
            const token = localStorage.getItem("token");
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

            await axios.delete(`${API}/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Filter out the deleted user to instantly update the UI
            setData((prevData) => ({
                ...prevData,
                allUsers: prevData.allUsers.filter(user => user.id !== userId)
            }));

        } catch (err) {
            alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Zap className="w-12 h-12 text-blue-500" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
                <div className="max-w-xl p-10 bg-red-950/20 border border-red-500/30 rounded-3xl backdrop-blur-xl text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="mb-4 text-3xl font-black text-red-400 tracking-tight">Access Denied</h2>
                    <p className="mb-8 text-slate-300 leading-relaxed">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="px-8 py-4 text-sm font-bold text-black uppercase transition-all bg-red-500 rounded-xl hover:bg-red-400"
                    >
                        Return to Safety
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { platformStats, allUsers, topTrendingImplementations, topTrendingIdeas } = data;

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* AMBIENT ADMIN BACKGROUND */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[-20%] w-[60%] h-[40%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:px-12">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b border-white/5 pb-6 sm:pb-8"
                >
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                            <LayoutDashboard className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-500 mb-1 block">Command Center</span>
                            <h1 className="text-4xl font-black text-white tracking-tight">System Admin</h1>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border rounded-xl text-slate-300 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 active:scale-95 group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        End Session
                    </button>
                </motion.div>

                {/* PLATFORM STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {/* Stat Cards */}
                    <StatCard icon={<Users />} label="Total Users" value={platformStats.totalUsers} color="blue" delay={0.1} />
                    <StatCard icon={<Lightbulb />} label="Global Ideas" value={platformStats.totalIdeas} color="emerald" delay={0.15} />
                    <StatCard icon={<Code />} label="Implementations" value={platformStats.totalImplementations} color="violet" delay={0.2} />
                    <StatCard icon={<Zap />} label="Total Votes Cast" value={platformStats.totalVotes} color="amber" delay={0.25} />
                    <StatCard icon={<CheckCircle2 />} label="Active This Month" value={platformStats.activeUsersThisMonth} color="rose" delay={0.3} />
                </div>

                {/* TRENDING SPLIT */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-16">
                    {/* Trending Ideas */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                            Trending Ideas
                        </h3>
                        <div className="p-6 border bg-slate-900/40 backdrop-blur-md rounded-[2rem] border-white/5 space-y-4 shadow-xl">
                            {topTrendingIdeas.map((idea, index) => (
                                <div key={idea.id} className="p-5 border border-white/5 rounded-2xl bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/20 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">{idea.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">Creator: {idea.createdBy}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 sm:justify-end">
                                        <div className="text-center">
                                            <span className="block text-xl font-black text-blue-400">{idea.implementationCount}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Built</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-black text-emerald-400">{idea.totalUpvotes}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Votes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trending Implementations */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <Award className="w-6 h-6 text-blue-400" />
                            Top Implementations
                        </h3>
                        <div className="p-6 border bg-slate-900/40 backdrop-blur-md rounded-[2rem] border-white/5 space-y-4 shadow-xl">
                            {topTrendingImplementations.map((impl, index) => (
                                <div key={impl.id} className="p-5 border border-white/5 rounded-2xl bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/20 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors max-w-sm truncate" title={impl.ideaTitle}>
                                                {impl.ideaTitle}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">{impl.language}</span>
                                                <span className="text-xs text-slate-500">by {impl.submittedBy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 sm:justify-end">
                                        <div className="text-center">
                                            <span className="block text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                                                {impl.stars} <Star className="w-4 h-4 fill-amber-400" />
                                            </span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Stars</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-black text-emerald-400">{impl.votes}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Votes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* USER MANAGEMENT DIRECTORY */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Users className="w-6 h-6 text-indigo-400" />
                        Account Management Directory
                    </h3>

                    <div className="border bg-slate-900/40 backdrop-blur-md rounded-[2rem] border-white/5 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-white/10">
                                        <th className="p-6">User / Email</th>
                                        <th className="p-6">Role</th>
                                        <th className="p-6">Contributions (Id. / Im.)</th>
                                        <th className="p-6">Total Impact</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-white mb-1">{user.name}</div>
                                                <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider border ${user.role === 'ADMIN'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                        : 'bg-slate-800 text-slate-300 border-slate-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4 text-sm font-bold font-mono">
                                                    <span className="text-emerald-400 tooltip" title="Ideas Created">{user.ideasCreated} I.</span>
                                                    <span className="text-slate-600">/</span>
                                                    <span className="text-blue-400 tooltip" title="Implementations Submitted">{user.implementationsSubmitted} Im.</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                                                    <Zap className="w-4 h-4" /> {user.upvotesReceived}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    disabled={user.role === 'ADMIN' || deleteLoadingId === user.id}
                                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ml-auto ${user.role === 'ADMIN'
                                                            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                                            : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                                        }`}
                                                >
                                                    {deleteLoadingId === user.id ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                                            <Zap className="w-4 h-4" />
                                                        </motion.div>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                    Eliminate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Reusable micro-component for the top stat cards
const StatCard = ({ icon, label, value, color, delay }) => {
    const colorMap = {
        blue: "text-blue-400 group-hover:border-blue-500/50 border-white/5",
        emerald: "text-emerald-400 group-hover:border-emerald-500/50 border-white/5",
        violet: "text-violet-400 group-hover:border-violet-500/50 border-white/5",
        amber: "text-amber-400 group-hover:border-amber-500/50 border-white/5",
        rose: "text-rose-400 group-hover:border-rose-500/50 border-white/5",
    };

    const iconColor = {
        blue: "text-blue-500",
        emerald: "text-emerald-500",
        violet: "text-violet-500",
        amber: "text-amber-500",
        rose: "text-rose-500",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className={`p-6 bg-slate-900/50 backdrop-blur-md rounded-[1.5rem] border relative overflow-hidden group transition-colors ${colorMap[color]}`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-all bg-current ${iconColor[color]}`} />
            <div className={`mb-4 w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-slate-950/50 border border-white/5 ${iconColor[color]}`}>
                {icon}
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">{label}</p>
            <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
        </motion.div>
    );
};

export default AdminDashboard;
