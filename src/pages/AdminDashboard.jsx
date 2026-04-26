import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
    Award,
    Loader2,
    ChevronRight,
} from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // user delete
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    // idea delete
    const [allIdeas, setAllIdeas] = useState([]);
    const [deletingIdeaId, setDeletingIdeaId] = useState(null);
    const [deleteIdeaLoadingId, setDeleteIdeaLoadingId] = useState(null);
    // impl delete
    const [deletingImplId, setDeletingImplId] = useState(null);
    const [deleteImplLoadingId, setDeleteImplLoadingId] = useState(null);

    const fetchAdminData = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await axios.get(`${API}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
        } catch (err) {
            setError("Failed to load admin dashboard. You might not have the required permissions.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAllIdeas = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const res = await axios.get(`${API}/api/admin/ideas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllIdeas(res.data || []);
        } catch (err) {
            console.error("Failed to fetch admin ideas:", err);
        }
    };

    useEffect(() => { fetchAdminData(); fetchAllIdeas(); }, [navigate]);

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        setDeleteLoadingId(userId);
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.delete(`${API}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData((prev) => ({
                ...prev,
                allUsers: prev.allUsers.filter((u) => u.id !== userId),
            }));
            setDeletingUserId(null);
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const handleDeleteIdea = async (ideaId) => {
        const token = localStorage.getItem("token");
        setDeleteIdeaLoadingId(ideaId);
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.delete(`${API}/api/admin/ideas/${ideaId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllIdeas((prev) => prev.filter((i) => i.id !== ideaId));
            setDeletingIdeaId(null);
        } catch (err) { console.error(err); }
        finally { setDeleteIdeaLoadingId(null); }
    };

    const handleDeleteImpl = async (implId) => {
        const token = localStorage.getItem("token");
        setDeleteImplLoadingId(implId);
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            await axios.delete(`${API}/api/admin/implementations/${implId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData((prev) => ({
                ...prev,
                topTrendingImplementations: prev.topTrendingImplementations.filter((i) => i.id !== implId),
            }));
            setDeletingImplId(null);
        } catch (err) { console.error(err); }
        finally { setDeleteImplLoadingId(null); }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    /* ── Loading ───────────────────────────────────────────── */
    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ background: `url('/images/admin.png') center/cover no-repeat fixed` }}
            >
                <div className="absolute inset-0 bg-black/80" />
                <motion.div
                    className="relative flex flex-col items-center gap-4"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                >
                    <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
                    <p className="text-sm text-white/50">Loading command center…</p>
                </motion.div>
            </div>
        );
    }

    /* ── Error ─────────────────────────────────────────────── */
    if (error) {
        return (
            <div
                className="flex items-center justify-center min-h-screen px-4"
                style={{ background: `url('/images/admin.png') center/cover no-repeat fixed` }}
            >
                <div className="absolute inset-0 bg-black/80" />
                <div className="relative max-w-md w-full rounded-2xl border border-red-500/20 bg-black/40 backdrop-blur-md p-10 text-center">
                    <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-5" />
                    <h2 className="mb-3 text-2xl font-bold text-red-400">Access Denied</h2>
                    <p className="mb-8 text-white/50 text-sm">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-red-400 active:scale-95"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { platformStats, allUsers, topTrendingImplementations, topTrendingIdeas } = data;

    const stats = [
        { label: "Total Users",         value: platformStats.totalUsers,            icon: Users,        hover: "hover:border-red-400/30 hover:bg-red-500/10 hover:scale-[1.03]",    iconColor: "text-red-400/70" },
        { label: "Global Ideas",         value: platformStats.totalIdeas,            icon: Lightbulb,    hover: "hover:border-amber-400/30 hover:bg-amber-500/10 hover:scale-[1.03]", iconColor: "text-amber-400/70" },
        { label: "Implementations",      value: platformStats.totalImplementations,  icon: Code,         hover: "hover:border-orange-400/30 hover:bg-orange-500/10 hover:scale-[1.03]",iconColor: "text-orange-400/70" },
        { label: "Votes Cast",           value: platformStats.totalVotes,            icon: Zap,          hover: "hover:border-rose-400/30 hover:bg-rose-500/10 hover:scale-[1.03]",   iconColor: "text-rose-400/70" },
        { label: "Active This Month",    value: platformStats.activeUsersThisMonth,  icon: CheckCircle2, hover: "hover:border-red-400/30 hover:bg-red-500/10 hover:scale-[1.03]",    iconColor: "text-red-300/70" },
    ];

    return (
        <>
            {/* Fixed background */}
            <div
                className="fixed inset-0 -z-10"
                style={{ background: `url('/images/admin.png') center/cover no-repeat` }}
            />
            {/* Dark overlay */}
            <div className="fixed inset-0 -z-10 bg-black/70" />

            <main className="min-h-screen text-white">
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-20">

                    {/* ── Header ───────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-10"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400/80 mb-1">
                                Command Center
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                                    <LayoutDashboard size={15} className="text-red-400" />
                                </div>
                                <h1 className="text-xl font-bold text-white/90">System Admin</h1>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/50 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/8 transition group"
                        >
                            <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            End Session
                        </button>
                    </motion.div>

                    {/* ── Stats row ────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10"
                    >
                        {stats.map(({ label, value, icon: Icon, hover, iconColor }) => (
                            <div
                                key={label}
                                className={`rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-4 cursor-default transition-all duration-200 ${hover}`}
                            >
                                <Icon size={14} className={`${iconColor} mb-3`} />
                                <p className="text-2xl font-bold text-white tabular-nums">{value ?? "—"}</p>
                                <p className="mt-1 text-[11px] text-white/40 leading-tight">{label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── Trending 2-col ────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

                        {/* Trending Ideas */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.15 }}
                        >
                            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                        <TrendingUp size={14} className="text-red-400/70" />
                                        Trending Ideas
                                    </h2>
                                    <span className="text-[10px] text-white/30 uppercase tracking-wider">by votes</span>
                                </div>

                                <div className="space-y-2">
                                    {topTrendingIdeas?.map((idea, i) => (
                                        <div
                                            key={idea.id}
                                            className="group flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-red-400/20 px-4 py-3 transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="shrink-0 text-[10px] font-bold text-white/25 w-4 text-right">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white/80 group-hover:text-white truncate transition">
                                                        {idea.title}
                                                    </p>
                                                    <p className="text-[11px] text-white/30 truncate">{idea.createdBy}</p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-3 text-xs">
                                                <span className="text-amber-400/80 font-semibold tabular-nums">{idea.totalUpvotes ?? 0} ▲</span>
                                                <span className="text-white/25">{idea.implementationCount ?? 0} impl</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Trending Implementations */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.2 }}
                        >
                            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                        <Award size={14} className="text-orange-400/70" />
                                        Top Implementations
                                    </h2>
                                    <span className="text-[10px] text-white/30 uppercase tracking-wider">by votes</span>
                                </div>

                                <div className="space-y-2">
                                    {topTrendingImplementations?.map((impl, i) => (
                                        <div
                                            key={impl.id}
                                            className="group flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-400/20 px-4 py-3 transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="shrink-0 text-[10px] font-bold text-white/25 w-4 text-right">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white/80 group-hover:text-white truncate transition">
                                                        {impl.ideaTitle}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {impl.language && (
                                                            <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                                                                {impl.language}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] text-white/30">{impl.submittedBy}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-3 text-xs">
                                                <span className="text-amber-400/80 font-semibold flex items-center gap-1">
                                                    {impl.stars ?? 0} <Star size={10} className="fill-amber-400/50" />
                                                </span>
                                                <span className="text-white/25">{impl.votes ?? 0} votes</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── User Management ───────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.25 }}
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                    <Users size={14} className="text-red-400/70" />
                                    User Management
                                    <span className="text-xs font-normal text-white/30 ml-1">({allUsers?.length ?? 0})</span>
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/8 text-[10px] uppercase tracking-widest text-white/30">
                                            <th className="pb-3 px-1 font-semibold">User</th>
                                            <th className="pb-3 px-1 font-semibold">Role</th>
                                            <th className="pb-3 px-1 font-semibold">Ideas</th>
                                            <th className="pb-3 px-1 font-semibold">Impls</th>
                                            <th className="pb-3 px-1 font-semibold">Votes ▲</th>
                                            <th className="pb-3 px-1 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {allUsers?.map((user) => {
                                                const isConfirming = deletingUserId === user.id;
                                                const isDeleting = deleteLoadingId === user.id;
                                                const isAdmin = user.role === "ADMIN";

                                                return (
                                                    <motion.tr
                                                        key={user.id}
                                                        layout
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="border-b border-white/5 hover:bg-white/[0.02] transition group"
                                                    >
                                                        <td className="py-3.5 px-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-red-500/30 to-black flex items-center justify-center text-xs font-bold text-red-300 shrink-0 uppercase">
                                                                    {(user.name || "?")[0]}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-white/85 truncate">{user.name}</p>
                                                                    <p className="text-[11px] text-white/30 font-mono truncate max-w-[160px]">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-1">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
                                                                isAdmin
                                                                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                                                                    : "text-white/40 bg-white/5 border-white/10"
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-1 text-sm text-white/60 tabular-nums">{user.ideasCreated ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-sm text-white/60 tabular-nums">{user.implementationsSubmitted ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-sm text-amber-400/70 tabular-nums font-semibold">{user.upvotesReceived ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-right">
                                                            {isAdmin ? (
                                                                <span className="text-[10px] text-white/20 italic">Protected</span>
                                                            ) : isConfirming ? (
                                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => setDeletingUserId(null)}
                                                                        className="px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white/40 hover:text-white transition"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        disabled={isDeleting}
                                                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500 text-[11px] font-semibold text-white hover:bg-red-400 disabled:opacity-60 transition"
                                                                    >
                                                                        {isDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                                                        {isDeleting ? "…" : "Delete"}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setDeletingUserId(user.id)}
                                                                    className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-[11px] text-white/35 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition"
                                                                >
                                                                    <Trash2 size={11} />
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Ideas Management ──────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.3 }}
                        className="mt-5"
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                    <Lightbulb size={14} className="text-amber-400/70" />
                                    Ideas Management
                                    <span className="text-xs font-normal text-white/30 ml-1">({allIdeas.length})</span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/8 text-[10px] uppercase tracking-widest text-white/30">
                                            <th className="pb-3 px-1 font-semibold">Title</th>
                                            <th className="pb-3 px-1 font-semibold">Difficulty</th>
                                            <th className="pb-3 px-1 font-semibold">Created By</th>
                                            <th className="pb-3 px-1 font-semibold">Tech Stack</th>
                                            <th className="pb-3 px-1 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {allIdeas.map((idea) => {
                                                const isConfirming = deletingIdeaId === idea.id;
                                                const isDeleting   = deleteIdeaLoadingId === idea.id;
                                                const diffColor = { EASY: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10", MEDIUM: "text-amber-400 border-amber-500/20 bg-amber-500/10", HARD: "text-rose-400 border-rose-500/20 bg-rose-500/10" }[idea.difficulty] || "text-white/40 border-white/10 bg-white/5";
                                                return (
                                                    <motion.tr key={idea.id} layout exit={{ opacity: 0, height: 0 }} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                                                        <td className="py-3 px-1 text-sm font-medium text-white/80 max-w-[200px] truncate">{idea.title}</td>
                                                        <td className="py-3 px-1">
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffColor}`}>
                                                                {idea.difficulty}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-1 text-[11px] text-white/40 truncate max-w-[120px]">{idea.createdBy}</td>
                                                        <td className="py-3 px-1 text-[11px] text-white/30 truncate max-w-[140px]">{idea.techStack}</td>
                                                        <td className="py-3 px-1 text-right">
                                                            {isConfirming ? (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button onClick={() => setDeletingIdeaId(null)} className="px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white/40 hover:text-white transition">Cancel</button>
                                                                    <button onClick={() => handleDeleteIdea(idea.id)} disabled={isDeleting} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500 text-[11px] font-semibold text-white hover:bg-red-400 disabled:opacity-60 transition">
                                                                        {isDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                                                        {isDeleting ? "…" : "Delete"}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setDeletingIdeaId(idea.id)} className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-[11px] text-white/35 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition">
                                                                    <Trash2 size={11} /> Remove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Implementations Management ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.35 }}
                        className="mt-5"
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                    <Code size={14} className="text-orange-400/70" />
                                    Implementations Management
                                    <span className="text-xs font-normal text-white/30 ml-1">({data?.topTrendingImplementations?.length ?? 0} trending)</span>
                                </h2>
                            </div>
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {data?.topTrendingImplementations?.map((impl, i) => {
                                        const isConfirming = deletingImplId === impl.id;
                                        const isDeleting   = deleteImplLoadingId === impl.id;
                                        return (
                                            <motion.div key={impl.id} layout exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.05]">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-[10px] font-bold text-white/25 w-4 shrink-0">{i + 1}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white/80 truncate">{impl.ideaTitle}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {impl.language && <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{impl.language}</span>}
                                                            <span className="text-[11px] text-white/30">{impl.submittedBy}</span>
                                                            <span className="text-[11px] text-amber-400/60">{impl.votes ?? 0} votes</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {isConfirming ? (
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button onClick={() => setDeletingImplId(null)} className="px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white/40 hover:text-white transition">Cancel</button>
                                                        <button onClick={() => handleDeleteImpl(impl.id)} disabled={isDeleting} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500 text-[11px] font-semibold text-white hover:bg-red-400 disabled:opacity-60 transition">
                                                            {isDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                                            {isDeleting ? "…" : "Delete"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeletingImplId(impl.id)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-[11px] text-white/35 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition">
                                                        <Trash2 size={11} /> Remove
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
        </>
    );
};

export default AdminDashboard;
