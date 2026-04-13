import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Ideas = () => {
    const navigate = useNavigate();
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const API = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API}/api/ideas/all`);
                setIdeas(response.data.content || []);
            } catch (err) {
                setError("Failed to load ideas");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
        </div>
    );

    if (error) return <p className="text-red-400 text-center p-10">{error}</p>;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <header className="mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                    Project Ideas
                </h2>
                <p className="text-slate-400 mt-2">Curated concepts for your next build.</p>
            </header>

            <motion.div
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {ideas.map((idea) => (
                    <motion.div
                        key={idea.id}
                        variants={cardVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl hover:border-emerald-500/30 transition-colors duration-300 overflow-hidden"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />

                        <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-emerald-400 transition-colors">
                            {idea.title}
                        </h3>

                        <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3 text-sm">
                            {idea.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {idea.techStack?.split(',').map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-bold text-emerald-400"
                                >
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Ideas;