import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, X, Loader2, Send } from "lucide-react";
import axios from "axios";

const AddImplModal = ({ ideaId, onClose, onCreated }) => {
    const overlayRef = useRef(null);
    const [form, setForm] = useState({
        githubUrl: "",
        approachDescription: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.githubUrl.trim()) { setError("GitHub URL is required."); return; }

        setSubmitting(true);
        setError(null);
        try {
            const API = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            await axios.post(
                `${API}/api/ideas/${ideaId}/implementations`,
                {
                    githubUrl: form.githubUrl.trim(),
                    approachDescription: form.approachDescription.trim(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onCreated();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to submit implementation. Try again."
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
                className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-10 overflow-y-auto"
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
                                <Github size={18} />
                            </span>
                            <h2 className="text-xl font-bold text-white">Add Implementation</h2>
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
                        {/* GitHub URL */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                GitHub URL <span className="text-rose-400">*</span>
                            </label>
                            <input
                                name="githubUrl"
                                value={form.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username/repo"
                                className="w-full rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* Approach Description */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                Approach Description
                            </label>
                            <textarea
                                name="approachDescription"
                                value={form.approachDescription}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe your approach, architecture decisions, challenges solved…"
                                className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0f14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        {/* Actions */}
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
                                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-60 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                {submitting ? (
                                    <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                                ) : (
                                    <><Send size={15} /> Submit Implementation</>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddImplModal;
