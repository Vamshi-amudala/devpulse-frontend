import Features from "../components/Features";
import IdeasStream from "../components/IdeaFlowSection";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [showExploreModal, setShowExploreModal] = useState(false);

  const heroAnimation = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 }
    }
  };

  const handleExploreClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/ideas");
      return;
    }

    setShowExploreModal(true);
  };

  return (
    <div className="pt-10">
      {/* HERO */}
      <motion.section
        className="flex min-h-screen flex-col md:flex-row items-center justify-between gap-8 md:gap-12 pt-24 md:pt-28 px-5 sm:px-10 md:px-20"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={heroAnimation}
          className="flex-1 max-w-3xl text-center md:text-left"
        >
          <span className="text-emerald-400 border border-emerald-400/30 px-4 py-2 rounded-full text-xs sm:text-sm mb-6 sm:mb-8 inline-block hover:scale-105 transition-transform duration-300 hover:border-emerald-400">
            Welcome to DevPulse
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 sm:mb-8">
            Design{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
              secure systems
            </span>
            <br />
            with confidence
          </h1>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto md:mx-0">
            Explore system design challenges, share ideas,
            and improve backend architecture skills.
          </p>

          <button
            className="bg-emerald-500 hover:bg-emerald-300 text-black font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:scale-105 duration-300 transition-transform text-sm sm:text-base"
            onClick={handleExploreClick}
          >
            Explore Challenges →
          </button>
        </motion.div>

        <motion.div
          className="hidden sm:flex flex-1 max-w-[320px] md:max-w-[500px] opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <img
            src="/images/home-boy.png"
            alt="developer"
            className="w-full drop-shadow-[0_0_55px_rgba(34,197,94,0.4)]"
          />
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <Features />

      {/* IDEAS STREAM */}
      <IdeasStream title="Ideas Stream" />

      {/* CTA */}
      <CTA />

      {/* FOOTER */}
      <Footer />

      <AnimatePresence>
        {showExploreModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
            {/* Animated Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowExploreModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-md rounded-[2.5rem] bg-slate-950/80 border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden backdrop-blur-3xl z-10 p-1.5"
            >
              {/* Dynamic Glow Backgrounds */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-60 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[60px] pointer-events-none" />

              {/* Top Highlight Line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

              <div className="relative bg-[#0a0f16]/90 rounded-[2.1rem] p-8 md:p-10 backdrop-blur-xl border border-white/5 h-full">
                {/* Close Button */}
                <button
                  onClick={() => setShowExploreModal(false)}
                  className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2.5 backdrop-blur-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-3 tracking-tight">
                    Start Exploring
                  </h2>

                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-[280px] font-mono">
                    Join elite community. Explore ideas. Design systems. Become a better engineer.
                  </p>

                  <div className="w-full flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/register")}
                      className="relative w-full py-4 rounded-xl font-bold text-black bg-emerald-500 overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      Create Free Account
                    </motion.button>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/login")}
                        className="flex-1 py-4 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                      >
                        Sign In
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/ideas")}
                        className="flex-1 py-4 rounded-xl font-semibold text-slate-300 bg-transparent border border-transparent hover:text-white hover:bg-white/5 transition-all group flex items-center justify-center gap-2"
                      >
                        Guest
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:text-emerald-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;