import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

const EditIdeaModal = ({ idea, onClose, onUpdated }) => {
    const [form, setForm] = useState({
        title: idea.title || "",
        description: idea.description || "",
        techStack: idea.techStack || "",
        difficulty: idea.difficulty || "MEDIUM",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) { setError("Title is required."); return; }

        const token = localStorage.getItem("token");
        if (!token) { setError("You must be logged in."); return; }

        setLoading(true);
        try {
            const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const { data } = await axios.put(
                `${API}/api/ideas/${idea.id}`,
                {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    techStack: form.techStack.trim(),
                    difficulty: form.difficulty,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdated(data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update idea.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                                <Lightbulb size={15} className="text-emerald-400" />
                            </div>
                            <h2 className="text-sm font-semibold text-white">Edit Idea</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/30 hover:text-white/70 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs text-rose-400">
                                {error}
                            </p>
                        )}

                        {/* Title */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                                Title <span className="text-rose-400">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="What's the idea?"
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the core problem this solves..."
                                rows={3}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition resize-none"
                            />
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                                Tech Stack
                            </label>
                            <input
                                name="techStack"
                                value={form.techStack}
                                onChange={handleChange}
                                placeholder="React, Node.js, PostgreSQL..."
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">
                                Difficulty
                            </label>
                            <div className="flex gap-2">
                                {DIFFICULTIES.map((d) => {
                                    const colors = {
                                        EASY:   form.difficulty === d ? "border-emerald-500 bg-emerald-500/15 text-emerald-400" : "border-white/10 text-white/40 hover:border-emerald-500/40",
                                        MEDIUM: form.difficulty === d ? "border-amber-500 bg-amber-500/15 text-amber-400"   : "border-white/10 text-white/40 hover:border-amber-500/40",
                                        HARD:   form.difficulty === d ? "border-rose-500 bg-rose-500/15 text-rose-400"       : "border-white/10 text-white/40 hover:border-rose-500/40",
                                    };
                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setForm((p) => ({ ...p, difficulty: d }))}
                                            className={`flex-1 rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition ${colors[d]}`}
                                        >
                                            {d.charAt(0) + d.slice(1).toLowerCase()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditIdeaModal;
