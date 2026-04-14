import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    ArrowLeft, Github, Star, Calendar, ExternalLink,
    AlertCircle, Loader2, ThumbsUp, User, Clock, GitBranch, Code
} from "lucide-react";

const ImplementationDetail = () => {
    const { ideaId, implId } = useParams();
    const navigate = useNavigate();

    const [impl, setImpl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [voting, setVoting] = useState(false);
    const [voteError, setVoteError] = useState("");
    const [voteCount, setVoteCount] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const API = import.meta.env.VITE_API_URL;
                // Fetch all implementations for this idea and find the one we need
                const res = await axios.get(`${API}/api/ideas/${ideaId}/implementations`);
                const all = res.data || [];
                const found = all.find((i) => String(i.id) === String(implId));
                if (!found) {
                    setError("Implementation not found.");
                } else {
                    setImpl(found);
                    setVoteCount(found.votes || 0);
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message || "Failed to load implementation.");
            } finally {
                setLoading(false);
            }
        };

        if (ideaId && implId) fetchDetail();
    }, [ideaId, implId]);

    const formatFullDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const handleVote = async () => {
        setVoting(true);
        setVoteError("");
        try {
            const API = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            await axios.post(`${API}/api/implementations/${implId}/vote`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const voteRes = await axios.get(`${API}/api/implementations/${implId}/votes`);
            setVoteCount(voteRes.data);
            setImpl((prev) => ({ ...prev, votes: voteRes.data }));
        } catch (err) {
            setVoteError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to vote. Please login first."
            );
        } finally {
            setVoting(false);
        }
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
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-32 max-w-4xl">
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-400 mb-10 transition-colors group"
                >
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Implementations
                </motion.button>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-64 text-emerald-500">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Loading implementation...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 flex items-start gap-4 backdrop-blur-sm">
                        <AlertCircle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-red-400 font-bold text-lg mb-1">Error</h3>
                            <p className="text-slate-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && impl && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* ── Hero Card ── */}
                        <div className="relative rounded-[2.5rem] bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden p-8 md:p-12 shadow-[0_0_60px_rgba(16,185,129,0.06)]">
                            {/* Top glow line */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                            {/* Background glow blob */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Github size={28} className="text-emerald-400" />
                                </div>

                                {/* Title block */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                                        Implementation for "{impl.ideaTitle}"
                                    </p>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight break-words">
                                        {impl.repoName || impl.githubUrl || "Implementation Detail"}
                                    </h1>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {impl.primaryLanguage && (
                                            <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-300">
                                                <Code size={12} className="text-emerald-500" />
                                                {impl.primaryLanguage}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5 bg-amber-500/10 py-1.5 px-3 rounded-full border border-amber-500/20 text-xs font-semibold text-amber-300">
                                            <Star size={12} className="text-amber-400 fill-amber-400/30" />
                                            {impl.stars || 0} stars
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-300">
                                            <User size={12} className="text-emerald-500" />
                                            {impl.submittedBy || "Anonymous"}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-400">
                                            <Clock size={12} />
                                            {formatFullDate(impl.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Approach Description ── */}
                        <div className="rounded-[2rem] bg-slate-900/50 border border-white/8 backdrop-blur-xl p-8 md:p-10">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-5 flex items-center gap-2">
                                <GitBranch size={14} className="text-emerald-500" />
                                Approach Description
                            </h2>
                            <p className="text-slate-200 leading-[1.85] text-base whitespace-pre-wrap">
                                {impl.approachDescription || "No approach description provided for this implementation."}
                            </p>
                        </div>

                        {/* ── Author ── */}
                        <div className="rounded-[2rem] bg-slate-900/50 border border-white/8 backdrop-blur-xl p-6 md:p-8 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-slate-700 flex items-center justify-center text-black font-black text-xl uppercase shrink-0">
                                {(impl.submittedBy || "?")[0]}
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{impl.submittedBy || "Anonymous"}</p>
                                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
                                    <Calendar size={12} />
                                    Submitted on {formatFullDate(impl.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Upvote */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleVote}
                                disabled={voting}
                                className="flex-1 relative flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-black bg-emerald-500 overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {voting ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <ThumbsUp size={20} />
                                )}
                                <span className="relative z-10 text-base">
                                    {voting ? "Voting..." : "Upvote"}
                                </span>
                                <span className="relative z-10 bg-black/20 px-3 py-1 rounded-full text-sm font-black">
                                    {voteCount}
                                </span>
                            </motion.button>

                            {/* View Repo */}
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                href={impl.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-base"
                            >
                                <Github size={20} />
                                View on GitHub
                                <ExternalLink size={15} className="opacity-50" />
                            </motion.a>
                        </div>

                        {/* Vote error */}
                        <AnimatePresence>
                            {voteError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4"
                                >
                                    <AlertCircle size={16} className="shrink-0" />
                                    {voteError}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ImplementationDetail;
