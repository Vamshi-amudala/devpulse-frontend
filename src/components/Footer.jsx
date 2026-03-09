import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-emerald-500/10 mt-20">

            <div className="max-w-7xl mx-auto px-10 md:px-20 py-12 grid md:grid-cols-3 gap-10">

                {/* Logo + Description */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Dev<span className="text-emerald-500">Pulse</span>
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        A platform for developers to explore system design challenges,
                        share ideas, and learn scalable architecture concepts.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Navigation</h3>

                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li className="hover:text-emerald-400 cursor-pointer">Home</li>
                        <li className="hover:text-emerald-400 cursor-pointer">Ideas</li>
                        <li className="hover:text-emerald-400 cursor-pointer">Challenges</li>
                        <li className="hover:text-emerald-400 cursor-pointer">About</li>
                    </ul>
                </div>

                {/* Social / Contact */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Connect</h3>

                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li className="hover:text-emerald-400 cursor-pointer">
                            <a href="https://github.com/Vamshi-amudala/devpulse" className=""> Github</a>
                        </li>
                        <li className="hover:text-emerald-400 cursor-pointer">LinkedIn</li>
                        <li className="hover:text-emerald-400 cursor-pointer">Twitter</li>
                    </ul>
                </div>

            </div>

            {/* Bottom bar */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="border-t border-white/5 text-center py-6 text-slate-500 text-sm"
            >
                © {new Date().getFullYear()} DevPulse — Built for developers
            </motion.div>

        </footer>
    );
};

export default Footer;