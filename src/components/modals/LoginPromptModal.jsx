import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

const LoginPromptModal = ({ onClose, onGoLogin, message }) => {
    const overlayRef = useRef(null);
    const handleBackdrop = (e) => { if (e.target === overlayRef.current) onClose(); };

    return (
        <AnimatePresence>
            <motion.div
                ref={overlayRef}
                onClick={handleBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#07111f] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                >
                    <div className="pointer-events-none absolute -top-14 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

                    <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300">
                        <Lock size={24} />
                    </span>

                    <h2 className="mb-2 text-xl font-bold text-white">Login Required</h2>
                    <p className="mb-7 text-sm leading-relaxed text-slate-400">
                        {message || "You need to be signed in to continue."}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onGoLogin}
                            className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        >
                            Login to DevPulse
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-2xl border border-white/10 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoginPromptModal;
