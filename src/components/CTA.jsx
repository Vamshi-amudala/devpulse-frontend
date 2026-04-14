import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-24 px-6 md:px-16 overflow-hidden">

            {/* CLEAN BACKGROUND (no gradient mess) */}
            <div className="absolute inset-0 bg-black" />

            <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">

                {/* TEXT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Build things that actually matter
                    </h2>

                    <p className="text-slate-400 mt-5 max-w-md leading-relaxed text-base md:text-lg">
                        Stop following tutorials. Start building real systems,
                        explore ideas, and grow by doing meaningful work.
                    </p>

                    <button
                        onClick={() => navigate("/register")}
                        className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_45px_rgba(16,185,129,0.45)]"
                    >
                        Get Started
                    </button>
                </motion.div>

                {/* IMAGE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative flex justify-center"
                >
                    <img
                        src="/images/home.png"
                        alt="developer"
                        className="max-h-[340px] object-contain opacity-95 mix-blend-lighten"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;