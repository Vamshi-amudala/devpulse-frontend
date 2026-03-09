import { motion } from "framer-motion";
// Removed NavBar import to prevent duplication

const HomePage = () => {
  const heroOrchestrator = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.9,
      },
    },
  };

  const imageFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 0.4,
      x: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const textFromLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.1, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* NavBar removed from here because it is now global in App.jsx */}

      <motion.div
        className="flex min-h-screen items-center justify-between gap-12 pt-32 px-10 md:px-20 z-0 relative"
        variants={heroOrchestrator}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={imageFromRight}
          className="flex-1 max-w-[500px] h-full flex items-center justify-center order-last z-10 pointer-events-none"
        >
          <motion.img
            src="/images/home-boy.png"
            alt="Hacker Boy Graphic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-auto object-contain drop-shadow-[0_0_55px_rgba(34,197,94,0.4)]"
          />
        </motion.div>

        <motion.div
          variants={textFromLeft}
          className="flex-1 z-20 flex flex-col items-start justify-center max-w-3xl text-left"
        >
          <span className="text-emerald-400 border border-emerald-400/30 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            ✨ Welcome to DevPulse
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">secure systems</span><br />
            with confidence
          </h1>

          <p className="text-slate-300 text-xl max-w-2xl mb-12 leading-relaxed">
            A secure browser platform for exploring advanced system design coding challenges, system architecture,
            and community-driven projects. DevPulse guides you to FAANG-ready skills.
          </p>

          <div className="flex gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Explore challenges →
            </button>
            <button className="bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 font-bold px-10 py-4 rounded-full text-lg transition-all">
              Learn more
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;