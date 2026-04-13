import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const IdeasStream = ({ title = "Ideas Stream" }) => {

    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const fetchIdeas = async () => {
            try {
                const API = import.meta.env.VITE_API_URL;

                const response = await axios.get(`${API}/api/ideas/all`);

                setIdeas(response.data.content || []);
            } catch (err) {
                console.error("Error fetching ideas:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();

    }, []);

    const ideaList = ideas.length ? [...ideas, ...ideas] : [];

    if (loading) {
        return (
            <div className="py-20 text-center text-slate-400">
                Loading ideas...
            </div>
        );
    }

    return (
        <section className="relative z-10 py-20">

            <div className="px-10 mb-12 md:px-20">
                <h2 className="text-4xl italic font-bold tracking-tighter uppercase">
                    Live <span className="text-emerald-500">{title}</span>
                </h2>
            </div>

            <div className="relative flex overflow-hidden group">

                <div className="flex w-max gap-8 pr-8 py-10 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">

                    {ideaList.map((idea, index) => (
                        <motion.div
                            key={`${idea.id}-${index}`}
                            whileHover={{ scale: 1.02, borderColor: "rgba(52,211,153,0.5)" }}
                            onClick={() => setSelectedIdea(idea)}
                            className="min-w-[400px] flex flex-col bg-slate-900/40 border border-emerald-500/10 p-8 rounded-[2.5rem] cursor-pointer transition-all shadow-2xl whitespace-normal"
                        >

                            <div className="flex items-start justify-between mb-6">
                                <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 uppercase tracking-wider">
                                    {idea.difficulty}
                                </span>
                            </div>

                            <h3 className="mb-4 text-2xl font-bold transition-colors hover:text-emerald-400">
                                {idea.title}
                            </h3>

                            <p className="mb-6 text-sm leading-relaxed text-slate-400 line-clamp-2">
                                {idea.description}
                            </p>

                            <div className="pt-4 mt-auto font-mono text-xs truncate border-t text-slate-500 border-white/5">
                                {idea.techStack}
                            </div>

                        </motion.div>
                    ))}

                </div>
            </div>

            {/* MODAL */}
            {/* MODAL */}
            <AnimatePresence>
                {selectedIdea && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedIdea(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f14] shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
                        >
                            {/* top glow */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                            {/* header */}
                            <div className="relative border-b border-white/10 px-6 py-5 md:px-8">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                                                {selectedIdea.difficulty}
                                            </span>

                                            {selectedIdea.createdBy && (
                                                <span className="text-sm text-slate-500">
                                                    by <span className="text-slate-300">{selectedIdea.createdBy}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
                                            {selectedIdea.title}
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => setSelectedIdea(null)}
                                        className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        Close
                                    </button>
                                </div>

                                <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                                    {selectedIdea.description}
                                </p>
                            </div>

                            {/* body */}
                            <div className="px-6 py-6 md:px-8">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Tech Stack
                                        </p>
                                        <p className="text-sm leading-6 text-slate-200 break-words">
                                            {selectedIdea.techStack || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Difficulty
                                        </p>
                                        <p className="text-sm font-medium text-slate-200">
                                            {selectedIdea.difficulty || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Author
                                        </p>
                                        <p className="text-sm font-medium text-slate-200">
                                            {selectedIdea.createdBy || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* footer */}
                            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 md:px-8">
                                <p className="text-xs text-slate-500">
                                    Review the idea details before exploring implementations.
                                </p>

                                <button
                                    onClick={() => setSelectedIdea(null)}
                                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default IdeasStream;