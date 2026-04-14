import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    TrendingUp, Github, Star, ThumbsUp, ExternalLink,
    AlertCircle, Loader2, User, Flame, ArrowRight, Lightbulb, Code
} from "lucide-react";

const Trending = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ideas"); // "ideas" or "implementations"
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Remove pagination since backend doesn't support it
    // const [page, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Remove page reset logic
        // setPage(1);
        // setHasMore(true);
    }, [activeTab]);

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            setError("");
            try {
                const API = import.meta.env.VITE_API_URL;
                // Remove page parameter since backend doesn't support pagination
                const endpoint = activeTab === "ideas"
                    ? `${API}/api/trending/ideas?limit=20`  // Increased limit for more items
                    : `${API}/api/trending?limit=20`;

                const res = await axios.get(endpoint);
                const data = res.data || [];
                // Remove pagination logic
                const actualData = Array.isArray(data) ? data : data.content || [];
                setItems(actualData);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message || "Failed to load trending data.");
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, [activeTab]);  // Remove page dependency

    const getRankColor = (index) => {
        // Since no pagination, use simple index
        if (index === 0) return "from-amber-400 to-yellow-500";
        if (index === 1) return "from-slate-300 to-slate-400";
        if (index === 2) return "from-amber-600 to-orange-700";
        return activeTab === "ideas" ? "from-blue-500 to-blue-700" : "from-emerald-500 to-emerald-700";
    };

    const getRankLabel = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-24">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <img
                    src="/images/bg-view.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-32 max-w-5xl">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 text-center md:text-left"
                >
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                            <Flame size={20} className="text-amber-400" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
                            Leaderboard
                        </p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                            Trending
                        </span>{" "}
                        {activeTab === "ideas" ? "Ideas" : "Implementations"}
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto md:mx-0">
                        {activeTab === "ideas"
                            ? "The most upvoted and highly demanded app ideas by the community."
                            : "The most upvoted implementations across all ideas. See what the community is building."}
                    </p>
                </motion.div>

                {/* ── Tabs ── */}
                <div className="flex justify-center md:justify-start mb-10">
                    <div className="inline-flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                        <button
                            onClick={() => setActiveTab("ideas")}
                            className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === "ideas" ? "text-white shadow-lg" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {activeTab === "ideas" && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-blue-500 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Lightbulb size={16} className="relative z-10" />
                            <span className="relative z-10">Top Ideas</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("implementations")}
                            className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === "implementations" ? "text-white shadow-lg" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {activeTab === "implementations" && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-emerald-500 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Code size={16} className="relative z-10" />
                            <span className="relative z-10">Top Implementations</span>
                        </button>
                    </div>
                </div>

                {/* ── State Handling ── */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center h-64 text-amber-500"
                            >
                                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                <p className="text-slate-400 font-medium tracking-wide">
                                    Loading {activeTab}...
                                </p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 flex items-start gap-4 max-w-2xl mx-auto backdrop-blur-sm"
                            >
                                <AlertCircle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-red-400 font-bold text-lg mb-1">Failed to load</h3>
                                    <p className="text-slate-300">{error}</p>
                                </div>
                            </motion.div>
                        ) : items.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-24 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/5 max-w-3xl mx-auto"
                            >
                                <TrendingUp size={48} className="text-slate-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-300 mb-2">No trending data yet</h3>
                                <p className="text-slate-500">
                                    {activeTab === "ideas"
                                        ? "Create new ideas and upvote existing ones to see them here!"
                                        : "Submit implementations and start voting to see the leaderboard!"}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        key={activeTab === "ideas" ? item.ideaId : item.implementationId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className={`group relative rounded-[1.75rem] border backdrop-blur-xl overflow-hidden transition-all duration-300 cursor-pointer
                                            ${index === 0
                                                ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-400/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]"
                                                : index === 1
                                                    ? "border-slate-400/20 bg-white/[0.03] hover:border-slate-300/30"
                                                    : index === 2
                                                        ? "border-orange-700/20 bg-orange-500/[0.03] hover:border-orange-600/30"
                                                        : `border-white/8 bg-white/[0.02] ${activeTab === 'ideas' ? 'hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.07)]' : 'hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.07)]'}`
                                            }
                                        `}

                                                        onClick={() => {
                                            if (activeTab === "ideas") {
                                                const ideaId = item.ideaId || item.id;
                                                navigate(`/ideas/${ideaId}/implementations`);
                                            } else {
                                                const ideaId = item.ideaId;
                                                const implementationId = item.implementationId || item.id;

                                                if (!ideaId || !implementationId) return;

                                                navigate(`/ideas/${ideaId}/implementations/${implementationId}`);
                                            }
                                        }}

                                    >
                                        {/* Top highlight for #1 */}
                                        {index === 0 && (
                                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                                        )}

                                        <div className="flex items-center gap-5 p-5 md:p-6">
                                            {/* Rank badge */}
                                            <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-lg font-black shadow-lg shadow-black/50 border border-white/10`}>
                                                {index < 3 ? (
                                                    <span className="text-2xl drop-shadow-md">{getRankLabel(index)}</span>
                                                ) : (
                                                    <span className="text-white text-base font-black">#{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Main content - Dynamic based on tab */}
                                            {activeTab === "ideas" ? (
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                        <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                            {item.ideaTitle}
                                                        </h2>
                                                        {item.difficulty && (
                                                            <span className={`self-start sm:self-auto shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.difficulty?.toLowerCase() === 'easy' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                                                                item.difficulty?.toLowerCase() === 'medium' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                                                                    item.difficulty?.toLowerCase() === 'hard' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
                                                                        'text-slate-400 bg-slate-500/10 border-slate-500/20'
                                                                }`}>
                                                                {item.difficulty}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-slate-400 line-clamp-1 mb-2.5">
                                                        {item.ideaDescription}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {item.techStack && item.techStack.split(',').slice(0, 3).map((tech, i) => (
                                                            <span key={i} className="text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                                                                {tech.trim()}
                                                            </span>
                                                        ))}
                                                        {item.techStack && item.techStack.split(',').length > 3 && (
                                                            <span className="text-[11px] font-semibold text-slate-500">
                                                                +{item.techStack.split(',').length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                                                        <h2 className="text-base md:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                                            {item.repoName || item.githubUrl}
                                                        </h2>
                                                        {item.primaryLanguage && (
                                                            <span className="self-start sm:self-auto shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                                                {item.primaryLanguage}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-slate-500 truncate">
                                                        Idea:{" "}
                                                        <span className="text-slate-300 font-medium">{item.ideaTitle}</span>
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-4 mt-2.5">
                                                        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                                            <User size={12} className="text-slate-300" />
                                                            {item.submittedBy?.split("@")[0] || "Anonymous"}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                                            <Star size={12} className="fill-amber-400/40 text-amber-400" />
                                                            {item.stars?.toLocaleString() || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Right: votes + actions */}
                                            <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                                                {/* Vote count */}
                                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-[15px] border shadow-sm
                                                    ${index === 0
                                                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                                        : activeTab === "ideas"
                                                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                    }`}>
                                                    <ThumbsUp size={16} className={index === 0 ? "text-amber-400" : activeTab === "ideas" ? "text-blue-400" : "text-emerald-400"} />
                                                    {activeTab === "ideas" ? (item.totalVotes || 0) : (item.voteCount || 0)}
                                                </div>

                                                {/* Links */}
                                                <div className="flex items-center gap-2">
                                                    {activeTab === "implementations" && (
                                                        <a
                                                            href={item.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all shadow-sm hover:shadow-md"
                                                            title="View on GitHub"
                                                        >
                                                            <Github size={16} />
                                                        </a>
                                                    )}
                                                    <div className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all shadow-sm ${activeTab === "ideas"
                                                        ? "text-slate-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400"
                                                        : "text-slate-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400"
                                                        }`}>
                                                        <ArrowRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Footer note ── */}
                {!loading && items.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-xs font-semibold uppercase tracking-wider text-slate-600 mt-14"
                    >
                        Rankings are based on community upvotes · Updated in real time
                    </motion.p>
                )}
            </div>
        </div >
    );
};

export default Trending;