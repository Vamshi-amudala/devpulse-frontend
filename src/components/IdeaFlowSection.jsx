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
                            className="min-w-[400px] bg-slate-900/40 border border-emerald-500/10 p-8 rounded-[2.5rem] cursor-pointer transition-all shadow-2xl whitespace-normal"
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

                            <div className="pt-4 font-mono text-xs truncate border-t text-slate-500 border-white/5">
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

                            <h2 className="mb-4 text-3xl font-black text-white">
                                {selectedIdea.title}
                            </h2>

                            <p className="mb-8 text-lg leading-relaxed text-slate-300">
                                {selectedIdea.description}
                            </p>

                            <div className="mb-8 space-y-4">

                                <div className="flex justify-between pb-2 border-b border-white/5">
                                    <span className="text-sm text-slate-500">Tech Stack</span>
                                    <span className="font-mono text-sm text-emerald-400">
                                        {selectedIdea.techStack}
                                    </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-white/5">
                                    <span className="text-sm text-slate-500">Difficulty</span>
                                    <span className="text-sm font-bold uppercase text-slate-300">
                                        {selectedIdea.difficulty}
                                    </span>
                                </div>

                                <div className="flex justify-between pb-2 border-b border-white/5">
                                    <span className="text-sm text-slate-500">Created By</span>
                                    <span className="text-sm text-slate-300">
                                        {selectedIdea.createdBy}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={() => setSelectedIdea(null)}
                                className="w-full py-4 font-bold text-black transition-all bg-emerald-500 rounded-2xl hover:bg-emerald-400"
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