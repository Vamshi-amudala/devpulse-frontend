import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Github, Star, Calendar, Code, ExternalLink, AlertCircle, Loader2, ThumbsUp, X, User, Clock, GitBranch } from "lucide-react";

const Implementation = () => {
    const { ideaId } = useParams();
    const navigate = useNavigate();

    const [implementations, setImplementations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("Idea Implementations");
    const [selectedImpl, setSelectedImpl] = useState(null);
    const [voting, setVoting] = useState(false);
    const [voteError, setVoteError] = useState("");

    useEffect(() => {
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

        if (ideaId) {
            fetchImplementations();
        }
    }, [ideaId]);

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatFullDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCardClick = (impl) => {
        setSelectedImpl(impl);
        setVoteError("");
    };

    const handleCloseModal = () => {
        setSelectedImpl(null);
        setVoteError("");
    };

    const handleVote = async (implId) => {
        setVoting(true);
        setVoteError("");
        try {
            const API = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            await axios.post(`${API}/api/implementations/${implId}/vote`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            // Fetch updated vote count
            const voteRes = await axios.get(`${API}/api/implementations/${implId}/votes`);
            const updatedVotes = voteRes.data;

            // Update in the implementations list
            setImplementations(prev =>
                prev.map(impl =>
                    impl.id === implId ? { ...impl, votes: updatedVotes } : impl
                )
            );

            // Update selected implementation
            setSelectedImpl(prev =>
                prev && prev.id === implId ? { ...prev, votes: updatedVotes } : prev
            );
        } catch (err) {
            console.error("Vote error:", err);
            setVoteError(err.response?.data?.message || err.response?.data || "Failed to vote. Please login first.");
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-sans overflow-hidden pb-20">
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

            <div className="relative z-10 container mx-auto px-6 pt-32 max-w-7xl">
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
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                Implementations
                            </span> for <br />
                            {title}
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mt-4">
                            Explore how the community has brought this idea to life. Browse code repositories, technology stacks, and unique approaches to solving the core challenges.
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
                                                <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors" title={impl.repoName || "Untitled Repository"}>
                                                    {impl.repoName || "Untitled Repository"}
                                                </h3>
                                                <div className="flex items-center text-xs text-slate-400 mt-3 space-x-3">
                                                    <span className="flex items-center bg-white/5 py-1 px-2.5 rounded-full border border-white/10">
                                                        <Code size={12} className="mr-1.5 text-emerald-500" />
                                                        {impl.primaryLanguage || "Multiple"}
                                                    </span>
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
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-slate-800 flex items-center justify-center text-black font-bold text-xs uppercase shadow-inner shadow-white/20">
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
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                                    {impl.votes || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action row */}
                                    <div className="bg-white/[0.02] border-t border-white/5 py-4 px-8 flex justify-center group/btn">
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

            {/* ═══════════════ Implementation Detail Modal ═══════════════ */}
            <AnimatePresence>
                {selectedImpl && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-y-auto py-10">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
                            className="relative w-full max-w-2xl rounded-[2.5rem] bg-slate-950/90 border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-3xl z-10 p-1.5"
                        >
                            {/* Decorative glows */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 opacity-60 pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />

                            {/* Top accent line */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                            <div className="relative bg-[#0a0f16]/95 rounded-[2.1rem] p-8 md:p-10 backdrop-blur-xl border border-white/5">
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2.5 backdrop-blur-md z-20"
                                >
                                    <X size={16} />
                                </button>

                                {/* Header Section */}
                                <div className="mb-8">
                                    <div className="flex items-start gap-4 mb-4 pr-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Github size={24} className="text-emerald-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight leading-tight">
                                                {selectedImpl.repoName || "Untitled Repository"}
                                            </h2>
                                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                                Implementation for "{selectedImpl.ideaTitle}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Meta badges row */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-300">
                                            <Code size={12} className="text-emerald-500" />
                                            {selectedImpl.primaryLanguage || "Multiple"}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-amber-500/10 py-1.5 px-3 rounded-full border border-amber-500/20 text-xs font-semibold text-amber-300">
                                            <Star size={12} className="text-amber-400 fill-amber-400/30" />
                                            {selectedImpl.stars || 0} stars
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-300">
                                            <User size={12} className="text-emerald-500" />
                                            {selectedImpl.submittedBy || "Anonymous"}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 text-xs font-semibold text-slate-400">
                                            <Clock size={12} />
                                            {formatFullDate(selectedImpl.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                                {/* Approach Description */}
                                <div className="mb-8">
                                    <h3 className="text-sm uppercase tracking-widest font-bold text-slate-500 mb-4 flex items-center gap-2">
                                        <GitBranch size={14} className="text-emerald-500" />
                                        Approach Description
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-[15px]">
                                        {selectedImpl.approachDescription || "No detailed approach description provided for this implementation."}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                                {/* Submitter info */}
                                <div className="flex items-center gap-4 mb-8 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-slate-800 flex items-center justify-center text-black font-bold text-lg uppercase shadow-inner shadow-white/20">
                                        {(selectedImpl.submittedBy || "?")[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-base">
                                            {selectedImpl.submittedBy || "Anonymous"}
                                        </p>
                                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                            <Calendar size={10} />
                                            Submitted on {formatFullDate(selectedImpl.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Upvote Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleVote(selectedImpl.id)}
                                        disabled={voting}
                                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-black bg-emerald-500 overflow-hidden group/vote shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transition-all disabled:opacity-60 disabled:cursor-not-allowed relative"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/vote:translate-x-full transition-transform duration-700" />
                                        {voting ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <ThumbsUp size={18} />
                                        )}
                                        <span className="relative z-10">
                                            {voting ? "Voting..." : "Upvote"} 
                                        </span>
                                        <span className="relative z-10 bg-black/15 px-2.5 py-0.5 rounded-full text-sm font-black">
                                            {selectedImpl.votes || 0}
                                        </span>
                                    </motion.button>

                                    {/* View Repo Button */}
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        href={selectedImpl.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                                    >
                                        <Github size={18} />
                                        View Repository
                                        <ExternalLink size={14} className="opacity-50" />
                                    </motion.a>
                                </div>

                                {/* Vote Error */}
                                <AnimatePresence>
                                    {voteError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                        >
                                            <AlertCircle size={16} className="shrink-0" />
                                            {voteError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Implementation;