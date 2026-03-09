import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NavBar = ({ animationDelay = 0.3 }) => {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: animationDelay, ease: "easeOut" }
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      // Added w-full, fixed, and left-0 to prevent shifting
      className="fixed top-0 left-0 w-full h-20 px-8 md:px-12 bg-black/80 backdrop-blur-md border-b border-white/5 z-[100] flex justify-between items-center text-white"
    >
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 font-bold text-3xl text-emerald-500 tracking-tight">
          <span>DevPulse</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-[2] justify-center gap-10 text-slate-300">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/ideas" className="hover:text-emerald-400 transition-colors">Ideas</Link>
        <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
        <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
      </div>

      <div className="flex-1 flex justify-end gap-6">
        <Link to="/login" className="text-slate-300 pt-2">Login</Link>
        <Link to="/register" className="bg-emerald-500 text-black px-6 py-2 rounded-full font-bold">
          Register
        </Link>
      </div>
    </motion.nav>
  );
};

export default NavBar;