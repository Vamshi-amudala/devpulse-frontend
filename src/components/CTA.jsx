import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden py-24 px-10 md:px-20 text-center"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[28rem] h-[28rem] bg-emerald-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
                >
                    Start building something real
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed text-base md:text-lg"
                >
                    Share your ideas, explore how others think, and grow by building systems
                    that go beyond tutorials.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/register")}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]"
                >
                    Get Started
                </motion.button>
            </div>
        </motion.section>
    );
};

export default CTA;