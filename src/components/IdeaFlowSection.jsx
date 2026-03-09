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
                const response = await axios.get("/api/ideas/all");
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
        <section className="py-20 relative z-10">

            <div className="px-10 md:px-20 mb-12">
                <h2 className="text-4xl font-bold italic tracking-tighter uppercase">
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
                            className="min-w-[400px] bg-slate-900/40 border border-emerald-500/10 p-8 rounded-[2.5rem] cursor-pointer transition-all shadow-2xl whitespace-normal"
                        >

                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 uppercase tracking-wider">
                                    {idea.difficulty}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 hover:text-emerald-400 transition-colors">
                                {idea.title}
                            </h3>

                            <p className="text-slate-400 line-clamp-2 text-sm leading-relaxed mb-6">
                                {idea.description}
                            </p>

                            <div className="text-xs text-slate-500 border-t border-white/5 pt-4 font-mono truncate">
                                {idea.techStack}
                            </div>

                        </motion.div>
                    ))}

                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>

                {selectedIdea && (

                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedIdea(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-slate-950 border border-emerald-500/30 p-10 rounded-[3rem] max-w-2xl w-full shadow-2xl"
                        >

                            <h2 className="text-3xl font-black text-white mb-4">
                                {selectedIdea.title}
                            </h2>

                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                {selectedIdea.description}
                            </p>

                            <div className="space-y-4 mb-8">

                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500 text-sm">Tech Stack</span>
                                    <span className="text-emerald-400 font-mono text-sm">
                                        {selectedIdea.techStack}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500 text-sm">Difficulty</span>
                                    <span className="text-slate-300 text-sm font-bold uppercase">
                                        {selectedIdea.difficulty}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500 text-sm">Created By</span>
                                    <span className="text-slate-300 text-sm">
                                        {selectedIdea.createdBy}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={() => setSelectedIdea(null)}
                                className="w-full bg-emerald-500 text-black font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all"
                            >
                                Close View
                            </button>

                        </motion.div>

                    </div>

                )}

            </AnimatePresence>

        </section>
    );
};

export default IdeasStream;