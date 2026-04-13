import { motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";

const NavBar = ({ animationDelay = 0.3 }) => {
  const location = useLocation();

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: animationDelay,
        ease: "easeOut",
      },
    },
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors relative ${isActive
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-white"
    }`;

  const isLoginActive = location.pathname === "/login";
  const isRegisterActive = location.pathname === "/register";

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 w-full h-20 px-8 md:px-12 bg-black/80 backdrop-blur-md border-b border-white/5 z-[100] flex justify-between items-center text-white"
    >
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-3xl text-emerald-500 tracking-tight"
        >
          <span>DevPulse</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-[2] justify-center gap-10">
        <NavLink to="/" className={navLinkClass} end>
          Home
        </NavLink>

        <NavLink to="/ideas" className={navLinkClass}>
          Ideas
        </NavLink>

        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>

        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </div>

      <div className="flex-1 flex justify-end items-center">
        <div className="relative flex items-center bg-transparent rounded-full p-1 gap-1">
          {(isLoginActive || isRegisterActive) && (
            <motion.div
              layoutId="auth-pill"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute top-1 bottom-1 rounded-full bg-emerald-500 ${isLoginActive ? "left-1 w-[92px]" : "right-1 w-[132px]"
                }`}
            />
          )}

          <NavLink
            to="/login"
            className={`relative z-10 px-6 py-2 rounded-full font-bold transition-colors ${isLoginActive ? "text-black" : "text-slate-300 hover:text-white"
              }`}
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={`relative z-10 px-8 py-2 rounded-full font-bold transition-colors ${isRegisterActive
              ? "text-black"
              : "text-slate-300 hover:text-white"
              }`}
          >
            Register
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;