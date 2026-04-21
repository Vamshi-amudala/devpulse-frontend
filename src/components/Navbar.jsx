import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";

const NavBar = ({ animationDelay = 0.3 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  let user = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      user = JSON.parse(jsonPayload);
    } catch (e) {
      localStorage.removeItem("token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [userName, setUserName] = useState(user?.name || "Developer");

  useEffect(() => {
    if (token) {
      const fetchUserName = async () => {
        try {
          const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
          const response = await axios.get(`${API}/api/users/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.userInfo?.name) {
            setUserName(response.data.userInfo.name);
          }
        } catch (err) {
          console.error("Failed to fetch user name", err);
        }
      };
      fetchUserName();
    }
  }, [token, location.pathname]);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: animationDelay, ease: "easeOut" },
    },
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors relative font-medium text-base ${isActive
      ? "text-emerald-400"
      : "text-slate-300 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-3 px-4 rounded-xl text-base font-semibold transition-colors ${isActive
      ? "text-emerald-400 bg-emerald-500/10"
      : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;

  const isLoginActive = location.pathname === "/login";
  const isRegisterActive = location.pathname === "/register";

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/ideas", label: "Ideas" },
    { to: "/trending-ideas", label: "Trending" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full h-16 sm:h-20 px-4 sm:px-8 md:px-12 bg-black/85 backdrop-blur-md border-b border-white/5 z-[100] flex justify-between items-center text-white"
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl sm:text-3xl text-emerald-500 tracking-tight"
          >
            <span>DevPulse</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center gap-8 lg:gap-10">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} className={navLinkClass} end={end}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:inline-flex items-center gap-2 mr-1 px-3 py-2 whitespace-nowrap font-normal tracking-tight bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm hover:scale-105 transition-transform duration-300 text-base"
              >
                {user?.role?.includes("ADMIN")
                  ? `${userName} · Keep things running smooth`
                  : `Let's ship something, ${userName}`}
              </motion.span>
              <Link
                to={user.role?.includes("ADMIN") ? "/admin/dashboard" : "/dashboard"}
                className="px-4 py-2 flex items-center justify-center rounded-full font-bold text-sm text-black bg-emerald-500 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="relative flex items-center bg-transparent rounded-full p-1 gap-1">
              {(isLoginActive || isRegisterActive) && (
                <motion.div
                  layoutId="auth-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`absolute top-1 bottom-1 rounded-full bg-emerald-500 ${isLoginActive ? "left-1 w-[80px]" : "right-1 w-[104px]"
                    }`}
                />
              )}
              <NavLink
                to="/login"
                className={`relative z-10 px-4 py-2 rounded-full font-bold text-sm transition-colors ${isLoginActive ? "text-black" : "text-slate-300 hover:text-white"
                  }`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={`relative z-10 px-5 py-2 rounded-full font-bold text-sm transition-colors ${isRegisterActive
                  ? "text-black"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:border-white/20 transition-all"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 left-0 right-0 z-[99] md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            >
              <div className="px-4 py-5 space-y-1">
                {navLinks.map(({ to, label, end }) => (
                  <NavLink key={to} to={to} className={mobileLinkClass} end={end}>
                    {label}
                  </NavLink>
                ))}

                {/* Divider */}
                <div className="border-t border-white/8 my-3" />

                {/* Auth section */}
                {user ? (
                  <div className="space-y-2">
                    <p className="px-4 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                      {user?.role?.includes("ADMIN") ? "Admin" : "Account"}
                    </p>
                    <p className="px-4 text-sm text-emerald-400 font-semibold">
                      👋 {userName}
                    </p>
                    <Link
                      to={user.role?.includes("ADMIN") ? "/admin/dashboard" : "/dashboard"}
                      className="block py-3 px-4 rounded-xl text-base font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-colors text-center mt-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 px-4 rounded-xl text-base font-semibold text-slate-400 border border-white/10 hover:text-red-400 hover:border-red-500/30 transition-colors text-center"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/login"
                      className="block py-3 px-4 rounded-xl text-base font-bold text-center border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block py-3 px-4 rounded-xl text-base font-bold text-center bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;