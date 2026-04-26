import { useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";

/**
 * AddIdeaModal
 *
 * Props:
 *  - onClose   () => void   — called when the modal should close
 *  - onCreated () => void   — called after a new idea has been successfully created
 */
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

export default AddIdeaModal;
