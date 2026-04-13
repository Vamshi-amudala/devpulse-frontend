import Features from "../components/Features";
import IdeasStream from "../components/IdeaFlowSection";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const HomePage = () => {

  const heroAnimation = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 }
    }
  };

  return (
    <div className="pt-10">

      {/* HERO */}
      <motion.section
        className="flex min-h-screen items-center justify-between gap-12 pt-32 px-10 md:px-20"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={heroAnimation}
          className="flex-1 max-w-3xl"
        >

          <span className="text-emerald-400 border border-emerald-400/30 px-4 py-1.5 rounded-full text-sm mb-8 inline-block">
            Welcome to DevPulse
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
            Design{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
              secure systems
            </span>
            <br />
            with confidence
          </h1>

          <p className="text-slate-300 text-xl mb-10">
            Explore system design challenges, share ideas,
            and improve backend architecture skills.
          </p>

          <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-full transition">
            Explore Challenges →
          </button>

        </motion.div>

        <motion.div
          className="flex-1 max-w-[500px] opacity-40"
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

    </div>
  );
};

export default HomePage;