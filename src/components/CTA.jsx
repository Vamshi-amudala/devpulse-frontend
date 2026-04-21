import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-16 sm:py-24 px-5 sm:px-6 md:px-16 overflow-hidden">

            {/* CLEAN BACKGROUND (no gradient mess) */}
            <div className="absolute inset-0 bg-black" />

            <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-10">

                {/* TEXT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                        Build things that actually matter
                    </h2>

                    <p className="text-slate-400 mt-4 sm:mt-5 max-w-md mx-auto md:mx-0 leading-relaxed text-sm sm:text-base md:text-lg">
                        Stop following tutorials. Start building real systems,
                        explore ideas, and grow by doing meaningful work.
                    </p>

                    <button
                        onClick={() => navigate("/register")}
                        className="mt-6 sm:mt-8 bg-emerald-500 hover:bg-emerald-400 text-black px-7 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_45px_rgba(16,185,129,0.45)]"
                    >
                        Get Started
                    </button>
                </motion.div>

                {/* IMAGE — hidden on mobile */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:flex relative justify-center"
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