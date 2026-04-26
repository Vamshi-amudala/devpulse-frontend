import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddIdeaModal from "../components/modals/AddIdeaModal";
import {
    Lightbulb,
    Code,
    LogOut,
    Plus,
    ArrowUpRight,
    Loader2,
    ChevronRight,
    TrendingUp,
} from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchDashboard = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const { data: res } = await axios.get(`${API}/api/users/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res);
        } catch (err) {
            setError("Couldn't load your dashboard. Please try logging in again.");
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboard(); }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ background: `url('/images/dashboard.png') center/cover no-repeat fixed` }}
            >
                <div className="absolute inset-0 bg-black/80" />
                <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="w-8 h-8 text-emerald-400" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex items-center justify-center min-h-screen px-4"
                style={{ background: `url('/images/dashboard.png') center/cover no-repeat fixed` }}
            >
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative text-center max-w-sm">
                    <p className="text-slate-300 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur border border-white/15 text-sm text-white hover:bg-white/15 transition"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { userInfo, myIdeas, myImplementations } = data;

    const initials = userInfo.name
        ? userInfo.name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : "??";

    const totalUpvotes = myIdeas.reduce((s, i) => s + (i.totalUpvotes ?? 0), 0);

    const diffBadge = {
        EASY: "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
        MEDIUM: "text-amber-300 bg-amber-500/15 border-amber-400/25",
        HARD: "text-rose-300 bg-rose-500/15 border-rose-400/25",
    };

    return (
        <>
            {showAddModal && (
                <AddIdeaModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => { setShowAddModal(false); fetchDashboard(); }}
                />
            )}

            {/* Full-viewport background image */}
            <div
                className="fixed inset-0 -z-10"
                style={{ background: `url('/images/dashboard.png') center/cover no-repeat` }}
            />
            {/* Darkening overlay so text stays legible */}
            <div className="fixed inset-0 -z-10 bg-black/70" />

            <main className="min-h-screen text-white">
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-20">

                    {/* Profile bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(52,211,153,0.4)]">
                                <span className="text-sm font-bold text-black">{initials}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white leading-tight">{userInfo.name}</p>
                                <p className="text-xs text-white/40 mt-0.5">{userInfo.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-xs font-semibold text-black hover:bg-emerald-400 transition active:scale-95 shadow-[0_0_14px_rgba(52,211,153,0.35)]"
                            >
                                <Plus size={13} />
                                New Idea
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/8 backdrop-blur-sm border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition active:scale-95"
                            >
                                <LogOut size={13} />
                                Sign out
                            </button>
                        </div>
                    </motion.div>

                    {/* Welcome */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Welcome back,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                                {userInfo.name.split(" ")[0]}
                            </span>
                        </h1>
                        <p className="mt-2 text-sm text-white/40">
                            Here's a summary of your activity on DevPulse.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                        className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12"
                    >
                        {[
                            { label: "Ideas created", value: userInfo.totalIdeasCreated ?? 0, icon: Lightbulb, hover: "hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:scale-[1.03]" },
                            { label: "Implementations", value: userInfo.totalImplementationsSubmitted ?? 0, icon: Code, hover: "hover:border-blue-400/30 hover:bg-blue-500/10 hover:scale-[1.03]" },
                            { label: "Total upvotes", value: totalUpvotes, icon: TrendingUp, hover: "hover:border-violet-400/30 hover:bg-violet-500/10 hover:scale-[1.03]" },
                        ].map(({ label, value, icon: Icon, hover }) => (
                            <div
                                key={label}
                                className={`rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md px-4 sm:px-5 py-4 sm:py-5 cursor-default transition-all duration-200 ${hover}`}
                            >
                                <Icon size={14} className="text-emerald-400/70 mb-3" />
                                <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{value}</p>
                                <p className="mt-1 text-xs text-white/40">{label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Main columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Ideas */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.15 }}
                        >
                            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-white/80">My Ideas</h2>
                                    <button
                                        onClick={() => navigate("/my-ideas")}
                                        className="flex items-center gap-1 text-xs text-white/35 hover:text-emerald-400 transition"
                                    >
                                        View all <ChevronRight size={13} />
                                    </button>
                                </div>

                                {myIdeas.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 flex flex-col items-center text-center gap-3">
                                        <Lightbulb size={20} className="text-white/20" />
                                        <p className="text-xs text-white/35">No ideas yet. Start with your first one.</p>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="mt-1 px-4 py-2 rounded-lg bg-emerald-500 text-xs font-semibold text-black hover:bg-emerald-400 transition"
                                        >
                                            Add idea
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {myIdeas.map((idea) => {
                                            const tags = idea.techStack
                                                ? idea.techStack.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3)
                                                : [];
                                            return (
                                                <div
                                                    key={idea.id}
                                                    onClick={() => navigate(`/ideas/${idea.id}/implementations`)}
                                                    className="group flex items-start justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/[0.07] hover:border-emerald-400/20 px-4 py-3.5 cursor-pointer transition"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-medium text-white/85 group-hover:text-white truncate transition">
                                                                {idea.title}
                                                            </p>
                                                            {idea.difficulty && (
                                                                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diffBadge[idea.difficulty] ?? diffBadge.MEDIUM}`}>
                                                                    {idea.difficulty.charAt(0) + idea.difficulty.slice(1).toLowerCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {idea.description && (
                                                            <p className="text-xs text-white/30 line-clamp-1 mb-2">{idea.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2.5">
                                                            {tags.map(t => (
                                                                <span key={t} className="text-[11px] text-white/40">{t}</span>
                                                            ))}
                                                            {idea.techStack?.split(",").filter(Boolean).length > 3 && (
                                                                <span className="text-[11px] text-white/25">+more</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5 text-[11px] text-white/30">
                                                        <span>▲ {idea.totalUpvotes ?? 0}</span>
                                                        <span>{idea.implementationCount ?? 0} builds</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Implementations */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.2 }}
                        >
                            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-white/80">My Implementations</h2>
                                    <button
                                        onClick={() => navigate("/ideas")}
                                        className="flex items-center gap-1 text-xs text-white/35 hover:text-emerald-400 transition"
                                    >
                                        Browse ideas <ChevronRight size={13} />
                                    </button>
                                </div>

                                {myImplementations.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 flex flex-col items-center text-center gap-3">
                                        <Code size={20} className="text-white/20" />
                                        <p className="text-xs text-white/35">You haven't built anything yet.</p>
                                        <button
                                            onClick={() => navigate("/ideas")}
                                            className="mt-1 px-4 py-2 rounded-lg bg-white/8 border border-white/10 text-xs text-white/60 hover:bg-white/12 transition"
                                        >
                                            Find an idea to build
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {myImplementations.map((impl) => {
                                            // extract "my-project" from "https://github.com/user/my-project"
                                            const projectName = impl.repoUrl
                                                ? impl.repoUrl.replace(/\/+$/, "").split("/").pop()
                                                : `Implementation ${impl.id}`;

                                            return (
                                                <div
                                                    key={impl.id}
                                                    onClick={() => navigate(`/ideas/${impl.ideaId}/implementations`)}
                                                    className="group flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/20 px-4 py-3.5 cursor-pointer transition"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white/85 group-hover:text-white truncate transition">
                                                            {projectName}
                                                        </p>
                                                        {impl.repoUrl && (
                                                            <p className="text-[11px] text-white/30 font-mono truncate mt-1">{impl.repoUrl}</p>
                                                        )}
                                                    </div>
                                                    <ArrowUpRight size={15} className="shrink-0 text-white/20 group-hover:text-white/50 transition" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
