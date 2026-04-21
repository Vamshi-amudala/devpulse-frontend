import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
    ArrowLeft, Github, Star, Calendar, Code, ExternalLink,
    AlertCircle, Loader2, Plus
} from "lucide-react";
import AddImplModal from "../components/modals/AddImplModal";
import LoginPromptModal from "../components/modals/LoginPromptModal";

/* ── decode JWT ─────────────────────────────────────────────── */
const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            )
        );
    } catch {
        return null;
    }
};

const Implementation = () => {
    const { ideaId } = useParams();
    const navigate = useNavigate();

    const [implementations, setImplementations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("Idea Implementations");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const user = getUser();

    const fetchImplementations = async () => {
        setLoading(true);
        try {
            const API = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${API}/api/ideas/${ideaId}/implementations`);
            const data = response.data || [];
            setImplementations(data);
            if (data.length > 0 && data[0].ideaTitle) {
                setTitle(data[0].ideaTitle);
            }
        } catch (err) {
            console.error("Error fetching implementations:", err);
            setError(err.response?.data?.message || err.message || "Failed to load implementations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ideaId) fetchImplementations();
    }, [ideaId]);

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric", month: "short", day: "numeric"
        });
    };

    const handleAddClick = () => {
        if (user) setShowAddModal(true);
        else setShowLoginPrompt(true);
    };

    const handleCardClick = (impl) => {
        navigate(`/ideas/${ideaId}/implementations/${impl.id}`);
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pb-20">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <img
                    src="/images/bg-view.png"
                    alt="DevPulse Background"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-black z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent z-0" />
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddImplModal
                    ideaId={ideaId}
                    onClose={() => setShowAddModal(false)}
                    onCreated={fetchImplementations}
                />
            )}
            {showLoginPrompt && (
                <LoginPromptModal
                    onClose={() => setShowLoginPrompt(false)}
                    onGoLogin={() => navigate("/login")}
                    message="You need to be signed in to submit an implementation for this idea."
                />
            )}

            <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-400 mb-6 transition-colors group"
                    >
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Exploration
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between mb-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                    Implementations
                                </span>{" "}
                                for{" "}
                                {title}
                            </h1>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddClick}
                                className="flex shrink-0 items-center gap-2 self-start rounded-2xl bg-emerald-500 px-5 py-3 sm:px-5 sm:py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                <Plus size={16} />
                                {user ? "Add Implementation" : "Submit Implementation"}
                            </motion.button>
                        </div>

                        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mt-4">
                            Explore how the community has brought this idea to life. Browse code repositories,
                            technology stacks, and unique approaches to solving the core challenges.
                        </p>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="min-h-[50vh]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-emerald-500">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-slate-400 font-medium">Fetching developer implementations...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-2xl flex items-start gap-4 mx-auto mt-12 backdrop-blur-sm">
                            <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                            <div>
                                <h3 className="text-red-400 font-bold text-lg mb-2">Error Loading Data</h3>
                                <p className="text-slate-300">{error}</p>
                            </div>
                        </div>
                    ) : implementations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900/50 border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-12 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                                <Github size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No implementations yet</h3>
                            <p className="text-slate-400 mb-8">
                                Be the first developer to build and submit an implementation for this idea.
                                Secure community votes and showcase your engineering skills!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddClick}
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                            >
                                <Plus size={16} />
                                Be the first to implement
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {implementations.map((impl, index) => (
                                <motion.div
                                    key={impl.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => handleCardClick(impl)}
                                    className="flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] group relative cursor-pointer"
                                >
                                    {/* Top Line Accent */}
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="p-8 pb-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6 gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors"
                                                    title={impl.repoName || impl.githubUrl || "Implementation"}>
                                                    {impl.repoName || impl.githubUrl || "Implementation"}
                                                </h3>
                                                <div className="flex items-center text-xs text-slate-400 mt-3 space-x-3">
                                                    {impl.primaryLanguage && (
                                                        <span className="flex items-center bg-white/5 py-1 px-2.5 rounded-full border border-white/10">
                                                            <Code size={12} className="mr-1.5 text-emerald-500" />
                                                            {impl.primaryLanguage}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center">
                                                        <Star size={12} className="mr-1 text-amber-400 fill-amber-400/20" />
                                                        {impl.stars || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <a
                                                href={impl.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shrink-0"
                                                title="View Repository"
                                            >
                                                <Github size={18} />
                                            </a>
                                        </div>

                                        <div className="mb-6 flex-1">
                                            <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                                                {impl.approachDescription || "No detailed approach description provided for this implementation."}
                                            </p>
                                        </div>

                                        <div className="border-t border-white/10 pt-5 mt-auto">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-slate-800 flex items-center justify-center text-black font-bold text-xs uppercase">
                                                        {(impl.submittedBy || "?")[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-200 truncate pr-2 max-w-[120px]">
                                                            {impl.submittedBy || "Anonymous"}
                                                        </p>
                                                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                                            <Calendar size={10} className="mr-1" />
                                                            {formatDate(impl.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                    </svg>
                                                    {impl.votes || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action row */}
                                    <div className="bg-white/[0.02] border-t border-white/5 py-4 px-8 flex justify-center">
                                        <span className="text-sm font-semibold text-slate-300 group-hover:text-emerald-400 flex items-center transition-colors">
                                            View Details <ExternalLink size={14} className="ml-2 group-hover:-mt-1 group-hover:mb-1 transition-all" />
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Implementation;