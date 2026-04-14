import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const goToTop = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="mt-20 border-t border-emerald-500/10 bg-slate-900">
            <div className="mx-auto grid max-w-7xl gap-10 px-10 py-12 md:grid-cols-3 md:px-20">
                <div>
                    <h2 className="mb-3 text-2xl font-bold text-white">
                        Dev<span className="text-emerald-500">Pulse</span>
                    </h2>

                    <p className="text-sm leading-relaxed text-slate-400">
                        A platform for developers to explore system design challenges,
                        share ideas, and learn scalable architecture concepts.
                    </p>
                </div>

                <div className="font-mono">
                    <h3 className="mb-4 font-semibold text-white">Navigation</h3>

                    <ul className="space-y-2 text-sm text-slate-400">
                        <li>
                            <span
                                className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400"
                                onClick={() => goToTop("/")}
                            >
                                Home
                            </span>
                        </li>
                        <li>
                            <span
                                className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400"
                                onClick={() => goToTop("/ideas")}
                            >
                                Ideas
                            </span>
                        </li>
                        <li>
                            <span
                                className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400"
                                onClick={() => goToTop("/")}
                            >
                                Challenges
                            </span>
                        </li>
                        <li>
                            <span
                                className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400"
                                onClick={() => goToTop("/about")}
                            >
                                About
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="font-mono">
                    <h3 className="mb-4 font-semibold text-white">Connect</h3>

                    <ul className="space-y-2 text-sm text-slate-400">
                        <li>
                            <a
                                href="https://github.com/Vamshi-amudala/devpulse"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400"
                            >
                                Github
                            </a>
                        </li>
                        <li>
                            <span className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400">
                                LinkedIn
                            </span>
                        </li>
                        <li>
                            <span className="inline-block cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:text-emerald-400">
                                Twitter
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="border-t border-white/5 py-6 text-center text-sm text-slate-500"
            >
                © {new Date().getFullYear()} DevPulse — Built for developers
            </motion.div>
        </footer>
    );
};

export default Footer;