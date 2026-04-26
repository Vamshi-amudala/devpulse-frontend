import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lightbulb,
    ArrowLeft,
    ChevronRight,
    Activity,
    Code,
    Loader2,
    Plus,
    Inbox,
    Trash2,
    Pencil,
} from "lucide-react";
import EditIdeaModal from "../components/modals/EditIdeaModal";

/*  difficulty badge styles */
const difficultyStyle = {
    easy:   "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    hard:   "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

/* animation variants  */
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
    hidden:   { opacity: 0, y: 20 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit:     { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const MyIdeas = () => {
    const navigate = useNavigate();

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit modal state
    const [editingIdea, setEditingIdea] = useState(null);

    // Per-card delete confirmation state: stores the idea id being confirmed
    const [deletingId, setDeletingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const fetchMyIdeas = async () => {
            try {
                const res = await axios.get(`${API}/api/ideas/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIdeas(res.data || []);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
                setError("Failed to load your ideas. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyIdeas();
    }, [navigate]);

    /* ── handlers ─────────────────────────────────────────────── */

    const handleDelete = async (idea) => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        setDeleteLoading(true);
        try {
            await axios.delete(`${API}/api/ideas/${idea.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove from local state — no full refetch needed
            setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
            setDeletingId(null);
        } catch (err) {
            console.error("Delete failed:", err);
            // Reset to allow retry — don't close confirm UI
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleUpdated = (updatedIdea) => {
        setIdeas((prev) =>
            prev.map((i) => (i.id === updatedIdea.id ? { ...i, ...updatedIdea } : i))
        );
    };

    /* helpers */
    const getVisibleTags = (stack) => {
        if (!stack) return [];
        return stack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
    };

    const totalUpvotes = ideas.reduce((acc, i) => acc + (i.totalUpvotes || i.totalVotes || 0), 0);
    const totalImpls = ideas.reduce((acc, i) => acc + (i.implementationCount || i.totalImplementations || 0), 0);

    /* loading state */
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505]">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <Loader2 className="h-10 w-10 text-emerald-500" />
                    </motion.div>
                    <p className="text-sm text-slate-400">Loading your ideas…</p>
                </div>
            </div>
        );
    }

    /* error state */
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
                <div className="max-w-md w-full rounded-[2rem] border border-rose-500/20 bg-rose-500/5 p-10 text-center backdrop-blur-xl">
                    <h2 className="mb-3 text-2xl font-black tracking-tight text-rose-400">Something went wrong</h2>
                    <p className="mb-8 text-slate-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-400 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Edit modal */}
            {editingIdea && (
                <EditIdeaModal
                    idea={editingIdea}
                    onClose={() => setEditingIdea(null)}
                    onUpdated={handleUpdated}
                />
            )}

            <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

                <div className="pointer-events-none absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-emerald-900/15 blur-[160px]" />
                <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-900/10 blur-[140px]" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 pt-20 sm:pt-28 lg:px-12">

                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 sm:mb-10"
                    >
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-emerald-400 group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Dashboard
                        </button>

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                                    My Ideas
                                </p>
                                <h1 className="max-w-2xl text-3xl sm:text-4xl font-extrabold tracking-tight md:text-5xl">
                                    Your project blueprints
                                </h1>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                                    All the ideas you've shared with the community. Track engagement, explore implementations, and keep building.
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/ideas")}
                                className="flex shrink-0 items-center gap-2 self-start sm:self-auto rounded-2xl bg-emerald-500 px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                <Plus size={16} />
                                Add New Idea
                            </motion.button>
                        </div>
                    </motion.header>

                    {/* Stats row */}
                    {ideas.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-8 sm:mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
                        >
                            {[
                                { icon: <Lightbulb className="h-6 w-6 text-emerald-400" />, label: "Ideas Created",   value: ideas.length,  accent: "emerald" },
                                { icon: <Activity   className="h-6 w-6 text-violet-400"  />, label: "Total Upvotes",   value: totalUpvotes,  accent: "violet"  },
                                { icon: <Code       className="h-6 w-6 text-blue-400"    />, label: "Implementations", value: totalImpls,    accent: "blue"    },
                            ].map(({ icon, label, value, accent }) => (
                                <div
                                    key={label}
                                    className={`group relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/50 backdrop-blur-md p-6 sm:p-7 transition-all hover:border-${accent}-500/30`}
                                >
                                    <div className={`pointer-events-none absolute top-0 right-0 h-28 w-28 bg-${accent}-500/5 blur-[80px] transition-all group-hover:bg-${accent}-500/15`} />
                                    {icon}
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                                    <p className="mt-1 text-3xl font-black tracking-tighter text-white">{value}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Ideas grid */}
                    {ideas.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="rounded-[2rem] border border-dashed border-white/10 bg-slate-900/20 px-6 py-24 text-center"
                        >
                            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                                <Inbox size={28} />
                            </span>
                            <h2 className="text-2xl font-bold text-white mb-3">No ideas yet</h2>
                            <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
                                You haven't shared any project ideas with the community. Start by exploring existing ideas or create your own!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/ideas")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400"
                            >
                                <Plus size={16} />
                                Create Your First Idea
                            </motion.button>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-6 md:grid-cols-2"
                            >
                                {ideas.map((idea) => {
                                    const tags = getVisibleTags(idea.techStack);
                                    const diffKey = idea.difficulty?.toLowerCase();
                                    const isConfirmingDelete = deletingId === idea.id;

                                    return (
                                        <motion.article
                                            key={idea.id}
                                            variants={cardVariants}
                                            layout
                                            exit="exit"
                                            whileHover={isConfirmingDelete ? {} : { y: -4, scale: 1.01 }}
                                            className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-br from-[#07111f] via-[#060b16] to-[#041018] p-7 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)] flex flex-col min-h-[280px]"
                                            onClick={() => {
                                                if (!isConfirmingDelete) navigate(`/ideas/${idea.id}/implementations`);
                                            }}
                                        >
                                            {/* hover glow */}
                                            {!isConfirmingDelete && (
                                                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                                                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
                                                    <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-emerald-500/5 to-transparent" />
                                                </div>
                                            )}

                                            <div className="relative z-10 flex h-full flex-col">
                                                {/* badge row + action buttons */}
                                                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {idea.difficulty && (
                                                            <span className={["rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]", difficultyStyle[diffKey] || "border-slate-500/30 bg-slate-500/10 text-slate-400"].join(" ")}>
                                                                {idea.difficulty}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Edit + Delete buttons */}
                                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => { setDeletingId(null); setEditingIdea(idea); }}
                                                            title="Edit idea"
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-500 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 transition"
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingId(isConfirmingDelete ? null : idea.id)}
                                                            title="Delete idea"
                                                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                                                                isConfirmingDelete
                                                                    ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                                                                    : "border-white/10 bg-white/5 text-slate-500 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
                                                            }`}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Delete confirmation overlay */}
                                                <AnimatePresence>
                                                    {isConfirmingDelete && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -6 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="mb-4 rounded-xl border border-rose-500/25 bg-rose-500/8 px-4 py-3"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <p className="text-xs text-rose-300 font-medium mb-2.5">
                                                                Delete this idea? This cannot be undone.
                                                            </p>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setDeletingId(null)}
                                                                    className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs text-slate-400 hover:text-white transition"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(idea)}
                                                                    disabled={deleteLoading}
                                                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-500 py-1.5 text-xs font-semibold text-white hover:bg-rose-400 disabled:opacity-60 transition"
                                                                >
                                                                    {deleteLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                                                    {deleteLoading ? "Deleting..." : "Yes, delete"}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* title */}
                                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-emerald-400">
                                                    {idea.title}
                                                </h2>

                                                {/* description */}
                                                <p className="mt-3 text-sm leading-relaxed text-slate-400 line-clamp-3">
                                                    {idea.description || "Build something practical and polished from this concept."}
                                                </p>

                                                {/* tech tags */}
                                                {tags.length > 0 && (
                                                    <div className="mt-5 flex flex-wrap gap-2">
                                                        {tags.map((tech, i) => (
                                                            <span
                                                                key={i}
                                                                className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {idea.techStack && idea.techStack.split(",").filter(Boolean).length > 4 && (
                                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                                +more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* stats row */}
                                                <div className="mt-5 flex gap-4">
                                                    <span className="text-[11px] font-semibold text-slate-400">
                                                        ▲ <span className="text-slate-300">{idea.totalUpvotes ?? idea.totalVotes ?? 0}</span> votes
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400">
                                                        <span className="text-slate-300">{idea.implementationCount ?? idea.totalImplementations ?? 0}</span> implementations
                                                    </span>
                                                </div>

                                                {/* card footer */}
                                                <div className="mt-auto pt-6">
                                                    <div className="flex items-center justify-between border-t border-white/8 pt-5">
                                                        <span className="text-xs text-slate-400">
                                                            {idea.createdAt
                                                                ? new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                                : "Draft idea"}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400 transition-transform duration-300 group-hover:translate-x-1">
                                                            View Details
                                                            <ChevronRight size={14} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </>
    );
};

export default MyIdeas;