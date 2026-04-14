import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Lock, Search, SlidersHorizontal, Plus } from "lucide-react";

/* ─── helper: decode JWT ─────────────────────────────────────── */
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

/* ─── difficulty badge colours ────────────────────────────────── */
const difficultyStyle = {
    easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    hard: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

/* ══════════════════════════════════════════════════════════════
   ADD IDEA MODAL
══════════════════════════════════════════════════════════════ */
const AddIdeaModal = ({ onClose, onCreated }) => {
    const overlayRef = useRef(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        techStack: "",
        difficulty: "MEDIUM",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Title is required."); return; }

        setSubmitting(true);
        setError(null);
        try {
            const API = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            await axios.post(
                `${API}/api/ideas/create`,
                {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    techStack: form.techStack.trim(),
                    difficulty: form.difficulty,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onCreated();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to create idea. Try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* close on backdrop click */
    const handleBackdrop = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={overlayRef}
                onClick={handleBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#07111f] p-7 md:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                    {/* top glow */}
                    <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

                    {/* header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                                <Lightbulb size={18} />
                            </span>
                            <h2 className="text-xl font-bold text-white">Add New Idea</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* error banner */}
                    {error && (
                        <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* title */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                Title <span className="text-rose-400">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Real-time code collaboration tool"
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* description */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="What's this idea about? What problem does it solve?"
                                className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* tech stack */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                Tech Stack
                            </label>
                            <input
                                name="techStack"
                                value={form.techStack}
                                onChange={handleChange}
                                placeholder="React, Node.js, PostgreSQL (comma-separated)"
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* difficulty */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                Difficulty
                            </label>
                            <div className="flex gap-3">
                                {["EASY", "MEDIUM", "HARD"].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setForm((p) => ({ ...p, difficulty: level }))}
                                        className={[
                                            "flex-1 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-widest transition",
                                            form.difficulty === level
                                                ? level === "EASY"
                                                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                                                    : level === "MEDIUM"
                                                        ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                                                        : "border-rose-500/50 bg-rose-500/15 text-rose-400"
                                                : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-slate-300",
                                        ].join(" ")}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-60 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                {submitting ? "Publishing…" : "Publish Idea"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ══════════════════════════════════════════════════════════════
   LOGIN PROMPT MODAL  (shown when visitor clicks Add Idea)
══════════════════════════════════════════════════════════════ */
const LoginPromptModal = ({ onClose, onGoLogin }) => {
    const overlayRef = useRef(null);
    const handleBackdrop = (e) => { if (e.target === overlayRef.current) onClose(); };

    return (
        <AnimatePresence>
            <motion.div
                ref={overlayRef}
                onClick={handleBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#07111f] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                    <div className="pointer-events-none absolute -top-14 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

                    <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300">
                        <Lock size={24} />
                    </span>

                    <h2 className="mb-2 text-xl font-bold text-white">Login Required</h2>
                    <p className="mb-7 text-sm leading-relaxed text-slate-400">
                        You need to be signed in to share an idea with the community.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onGoLogin}
                            className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        >
                            Login to DevPulse
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN IDEAS PAGE
══════════════════════════════════════════════════════════════ */
const Ideas = () => {
    const navigate = useNavigate();

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [featuredId, setFeaturedId] = useState(null);

    /* ── raw input states (instant, bound to inputs) ─────────── */
    const [searchInput, setSearchInput] = useState("");
    const [techInput, setTechInput] = useState("");

    /* ── debounced filter states (trigger API fetch) ──────────── */
    const [searchTerm, setSearchTerm] = useState("");
    const [techStack, setTechStack] = useState("");

    /* other filters */
    const [difficulty, setDifficulty] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [direction, setDirection] = useState("desc");

    /* pagination */
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [totalIdeas, setTotalIdeas] = useState(0);

    /* modals */
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const user = getUser();

    /* ── debounce: sync raw inputs → filter states after 500ms ── */
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setTechStack(techInput);
            setPage(0);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, techInput]);

    /* ── fetch ─────────────────────────────────────────────────── */
    const loadIdeas = async () => {
        try {
            setLoading(true);
            setError(null);

            const API = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${API}/api/ideas/search`, {
                params: {
                    keyword: searchTerm || null,
                    techStack: techStack || null,
                    difficulty: difficulty || null,
                    sortBy,
                    direction,
                    page,
                    size,
                },
            });

            const content = response.data.content || [];
            setIdeas(content);
            setTotalPages(response.data.totalPages || 0);
            setTotalIdeas(response.data.totalElements || 0);

            if (content.length > 0 && page === 0 && !searchTerm && !techStack && !difficulty) {
                setFeaturedId(content[0].id);
            } else {
                setFeaturedId(null);
            }
        } catch (err) {
            setError("Failed to load ideas. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ── only re-fetch when debounced values change ────────────── */
    useEffect(() => {
        loadIdeas();
    }, [searchTerm, techStack, difficulty, sortBy, direction, page]);

    /* ── sorted display list ───────────────────────────────────── */
    const displayedIdeas = useMemo(() => {
        if (!featuredId) return ideas;
        return [...ideas].sort((a, b) => {
            if (a.id === featuredId) return -1;
            if (b.id === featuredId) return 1;
            return 0;
        });
    }, [ideas, featuredId]);

    /* ── helpers ───────────────────────────────────────────────── */
    const getVisibleTags = (stack) => {
        if (!stack) return [];
        return stack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchTerm("");
        setTechInput("");
        setTechStack("");
        setDifficulty("");
        setSortBy("date");
        setDirection("desc");
        setPage(0);
    };

    /* use raw inputs for immediate "Clear Filters" button visibility */
    const hasActiveFilters =
        searchInput || techInput || difficulty || sortBy !== "date" || direction !== "desc";

    const handleAddClick = () => {
        if (user) {
            setShowAddModal(true);
        } else {
            setShowLoginPrompt(true);
        }
    };

    /* ── animations ────────────────────────────────────────────── */
    const cardVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    };

    /* ── loading ───────────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-[#050505]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border border-white/10 border-t-emerald-500" />
                    <p className="text-sm text-slate-500">Loading ideas…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] bg-[#050505] px-6 py-16 text-white md:px-12">
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ── modals ──────────────────────────────────────────── */}
            {showAddModal && (
                <AddIdeaModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => { setPage(0); loadIdeas(); }}
                />
            )}
            {showLoginPrompt && (
                <LoginPromptModal
                    onClose={() => setShowLoginPrompt(false)}
                    onGoLogin={() => navigate("/login")}
                />
            )}

            <section className="min-h-screen bg-[#050505] px-6 py-12 pt-28 text-white md:px-12 lg:px-16">
                <div className="mx-auto max-w-7xl">

                    {/* ── page header ─────────────────────────────── */}
                    <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                                Explore Ideas
                            </p>
                            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
                                Discover project ideas worth building
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                                Search curated concepts, explore different stacks, and find your next
                                practical or challenging project.
                            </p>
                        </div>

                        {/* Add Idea CTA */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAddClick}
                            className="flex shrink-0 items-center gap-2 self-start rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] md:self-end"
                        >
                            <Plus size={16} />
                            {user ? "Add Idea" : "Share an Idea"}
                        </motion.button>
                    </header>
                    )

                    {/* ── stats bar ─────────────────────────────────
                    <div className="mb-8 grid gap-4 md:grid-cols-3">
                        {[
                            { label: "Total Ideas", value: totalIdeas },
                            { label: "Current Page", value: page + 1 },
                            { label: "Total Pages", value: totalPages },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5"
                            >
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                                <p className="mt-3 text-3xl font-bold text-white">{value}</p>
                            </div>
                        ))}
                    </div> */}

                    {/* ── search + filters ────────────────────────── */}
                    <div className="mb-10 rounded-[2rem] border border-white/8 bg-white/[0.03] p-4 md:p-6">
                        {/* filter label row */}
                        <div className="mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={14} className="text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                Filter &amp; Sort
                            </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                            {/* keyword — bound to searchInput (raw) */}
                            <div className="relative xl:col-span-2">
                                <Search
                                    size={14}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    id="ideas-keyword-search"
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search by title…"
                                    className="w-full rounded-2xl border border-white/10 bg-[#0b0f14] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition"
                                />
                            </div>

                            {/* tech stack — bound to techInput (raw) */}
                            <input
                                id="ideas-techstack-filter"
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                placeholder="Tech stack (e.g. React)…"
                                className="rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition"
                            />

                            {/* difficulty — no debounce needed for selects */}
                            <select
                                id="ideas-difficulty-filter"
                                value={difficulty}
                                onChange={(e) => { setDifficulty(e.target.value); setPage(0); }}
                                className="rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition"
                            >
                                <option value="">All difficulties</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            {/* sort — no debounce needed for selects */}
                            <select
                                id="ideas-sort-select"
                                value={`${sortBy}:${direction}`}
                                onChange={(e) => {
                                    const [s, d] = e.target.value.split(":");
                                    setSortBy(s);
                                    setDirection(d);
                                    setPage(0);
                                }}
                                className="rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition"
                            >
                                <option value="date:desc">Newest First</option>
                                <option value="date:asc">Oldest First</option>
                                <option value="difficulty:asc">Difficulty ↑</option>
                                <option value="difficulty:desc">Difficulty ↓</option>
                                <option value="votes:desc">Most Voted</option>
                                <option value="votes:asc">Least Voted</option>
                                <option value="implementations:desc">Most Implemented</option>
                                <option value="implementations:asc">Least Implemented</option>
                            </select>
                        </div>

                        {/* results row */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                <span className="text-slate-300">{ideas.length}</span>{" "}
                                of{" "}
                                <span className="text-slate-300">{totalIdeas}</span>{" "}
                                ideas
                            </p>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-500/30 hover:text-rose-400"
                                >
                                    <X size={12} />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── ideas grid ──────────────────────────────── */}
                    {displayedIdeas.length === 0 ? (
                        <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-6 py-20 text-center">
                            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                                <Lightbulb size={24} />
                            </span>
                            <h3 className="text-2xl font-semibold text-white">No ideas found</h3>
                            <p className="mt-3 text-sm text-slate-400">
                                Try different keywords, tech stack, or sort options.
                            </p>
                            <button
                                onClick={handleAddClick}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                                <Plus size={14} />
                                Be the first to add one
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {displayedIdeas.map((idea) => {
                                const tags = getVisibleTags(idea.techStack);
                                const isFeatured = idea.id === featuredId;
                                const diffKey = idea.difficulty?.toLowerCase();

                                return (
                                    <motion.article
                                        key={idea.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ y: -8, scale: 1.015 }}
                                        onClick={() => navigate(`/ideas/${idea.id}/implementations`)}
                                        className={[
                                            "group relative cursor-pointer overflow-hidden rounded-[2rem]",
                                            "border border-white/8 bg-gradient-to-br from-[#07111f] via-[#060b16] to-[#041018]",
                                            "p-7 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.28)] transition-all duration-300",
                                            "hover:border-emerald-500/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)]",
                                            "min-h-[320px] flex flex-col",
                                            isFeatured ? "md:col-span-2 xl:col-span-2" : "",
                                        ].join(" ")}
                                    >
                                        {/* hover glow */}
                                        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                                            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
                                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-emerald-500/5 to-transparent" />
                                        </div>

                                        <div className="relative z-10 flex h-full flex-col">
                                            {/* badge row */}
                                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                                {idea.difficulty && (
                                                    <span
                                                        className={[
                                                            "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                                                            difficultyStyle[diffKey] || "border-slate-500/30 bg-slate-500/10 text-slate-400",
                                                        ].join(" ")}
                                                    >
                                                        {idea.difficulty}
                                                    </span>
                                                )}
                                                {isFeatured && (
                                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                                                        Spotlight
                                                    </span>
                                                )}
                                            </div>

                                            {/* title */}
                                            <h3
                                                className={[
                                                    "font-bold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-emerald-400",
                                                    isFeatured ? "max-w-2xl text-3xl md:text-4xl" : "text-2xl",
                                                ].join(" ")}
                                            >
                                                {idea.title}
                                            </h3>

                                            {/* description */}
                                            <p
                                                className={[
                                                    "mt-4 leading-relaxed text-slate-400",
                                                    isFeatured ? "max-w-2xl text-base line-clamp-4" : "text-sm line-clamp-3",
                                                ].join(" ")}
                                            >
                                                {idea.description ||
                                                    "Build something practical and polished from this concept."}
                                            </p>

                                            {/* tech tags */}
                                            {tags.length > 0 && (
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {tags.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {idea.techStack &&
                                                        idea.techStack.split(",").filter(Boolean).length > 4 && (
                                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                                +more
                                                            </span>
                                                        )}
                                                </div>
                                            )}

                                            {/* stats row */}
                                            {(idea.totalVotes !== undefined ||
                                                idea.totalImplementations !== undefined) && (
                                                    <div className="mt-5 flex gap-4">
                                                        {idea.totalVotes !== undefined && (
                                                            <span className="text-[11px] font-semibold text-slate-500">
                                                                ▲{" "}
                                                                <span className="text-slate-400">
                                                                    {idea.totalVotes}
                                                                </span>{" "}
                                                                votes
                                                            </span>
                                                        )}
                                                        {idea.totalImplementations !== undefined && (
                                                            <span className="text-[11px] font-semibold text-slate-500">
                                                                ⚙{" "}
                                                                <span className="text-slate-400">
                                                                    {idea.totalImplementations}
                                                                </span>{" "}
                                                                implementations
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                            {/* card footer */}
                                            <div className="mt-auto pt-7">
                                                <div className="flex items-center justify-between border-t border-white/8 pt-5">
                                                    <span className="text-xs text-slate-500">
                                                        {idea.createdAt
                                                            ? new Date(idea.createdAt).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })
                                                            : "Explore this build idea"}
                                                    </span>
                                                    <span className="text-sm font-semibold text-emerald-400 transition-transform duration-300 group-hover:translate-x-1">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    )}

                    {/* ── pagination ──────────────────────────────── */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-3">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Previous
                            </button>

                            {/* page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={[
                                        "h-9 w-9 rounded-xl border text-sm font-semibold transition",
                                        p === page
                                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                                            : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                                    ].join(" ")}
                                >
                                    {p + 1}
                                </button>
                            ))}

                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage((p) => p + 1)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Ideas;