import { motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const NavBar = ({ animationDelay = 0.3 }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      transition: {
        duration: 0.8,
        delay: animationDelay,
        ease: "easeOut",
      },
    },
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors relative font-medium ${isActive
      ? "text-emerald-400"
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
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:inline-flex items-center gap-2 mr-2 px-3 py-3 whitespace-nowrap font-normal tracking-tight bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm hover:scale-105 transition-transform duration-300 text-lg"
            >
              {user?.role?.includes("ADMIN")
                ? `${userName} · Keep things running smooth`
                : `Let's ship something, ${userName}`}
            </motion.span>
            <Link
              to={user.role?.includes("ADMIN") ? "/admin/dashboard" : "/dashboard"}
              className="px-5 py-2 flex items-center justify-center rounded-full font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Dashboard
            </Link>
            {/* <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Logout
            </button> */}
          </div>
        ) : (
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
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;