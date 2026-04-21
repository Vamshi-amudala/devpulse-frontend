import { motion } from "framer-motion";
import {
    Lightbulb,
    Github,
    Flame,
    Users,
    Code2,
    ShieldCheck,
    Database,
    Layers3,
    ArrowRight,
    Wind,
    Server,
    Lock,
    Zap,
    GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Assuming the image is in your public/images folder
const illustrationImage = '/images/some_ideas_come_at_night.png';

const AboutPage = () => {
    const navigate = useNavigate();

    // Fixed: pass animation values directly instead of using variant name strings
    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true, amount: 0.2 },
    };

    const features = [
        {
            icon: <Lightbulb size={28} />,
            title: "Idea Discovery",
            desc: "Explore creative project ideas shared by developers and find inspiration for your next build.",
        },
        {
            icon: <Code2 size={28} />,
            title: "Real Implementations",
            desc: "Submit working solutions and connect ideas with actual development work and execution.",
        },
        {
            icon: <Github size={28} />,
            title: "GitHub Integration",
            desc: "Showcase repositories with real code, activity, and technical credibility.",
        },
        {
            icon: <Flame size={28} />,
            title: "Trending System",
            desc: "Surface impactful and engaging implementations through community interaction and visibility.",
        },
    ];

    const techStack = [
        { name: "React", icon: <Zap size={18} /> },
        { name: "Tailwind CSS", icon: <Wind size={18} /> },
        { name: "Framer Motion", icon: <Layers3 size={18} /> },
        { name: "Spring Boot", icon: <Server size={18} /> },
        { name: "PostgreSQL", icon: <Database size={18} /> },
        { name: "Redis", icon: <Flame size={18} /> },
        { name: "JWT Authentication", icon: <Lock size={18} /> },
        { name: "GitHub API", icon: <GitBranch size={18} /> },
    ];

    const steps = [
        {
            step: "01",
            title: "Explore Ideas",
            desc: "Browse project ideas and discover what other developers are thinking and building.",
        },
        {
            step: "02",
            title: "Build & Submit",
            desc: "Turn ideas into working implementations and submit your solution with confidence.",
        },
        {
            step: "03",
            title: "Get Visibility",
            desc: "Gain recognition through votes, trending rankings, and public developer showcase.",
        },
    ];

    return (
        // Fixed: added `relative` so the absolute glow divs are scoped correctly
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute top-80 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />
            </div>

            {/* Hero */}
            <section className="relative px-6 md:px-12 lg:px-20 pt-24 pb-16">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_28%)]" />
                    <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:grid-cols-2 md:p-10 lg:p-14">

                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="relative z-10"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                                <Layers3 size={16} />
                                Built for developers who love building in public
                            </div>

                            <h1 className="mt-6 max-w-xl text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                                About <span className="text-emerald-400">DevPulse</span>
                            </h1>

                            <p className="mt-6 max-w-xl text-[15px] leading-8 text-zinc-300 md:text-lg">
                                DevPulse is a developer-first platform where raw ideas become real implementations.
                                Explore concepts, submit working solutions, showcase GitHub-backed builds, and gain
                                visibility through community interaction.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => navigate("/ideas")}
                                    className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition duration-300 hover:scale-105"
                                >
                                    Explore Ideas
                                </button>

                                <button
                                    onClick={() => navigate("/register")}
                                    className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-white transition duration-300 hover:border-emerald-400/40 hover:text-emerald-300"
                                >
                                    Join DevPulse
                                </button>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Focus</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">Ideas to execution</p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Backed by</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">GitHub + community</p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Built for</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">Developers shipping work</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="hidden md:block relative"
                        >
                            <div className="absolute -inset-6 rounded-[2.5rem] bg-emerald-400/10 blur-3xl" />

                            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-400/10 to-transparent" />

                                <img
                                    src="/images/idea.png"
                                    alt="Developer illustration"
                                    className="relative z-10 w-full rounded-[1.5rem] object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* Why DevPulse */}
            {/* Why DevPulse */}
            <section className="px-6 md:px-12 lg:px-20 py-16">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                    {/* Image */}
                    <motion.div
                        {...fadeUp}
                        className="relative"
                    >
                        <div className="absolute -inset-6 bg-emerald-400/10 blur-3xl rounded-[2rem]" />

                        <img
                            src="/images/team.png"
                            alt="Developer collaboration"
                            className="relative rounded-[2rem] border border-white/10"
                        />
                    </motion.div>

                    {/* Text */}
                    <motion.div {...fadeUp}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Why DevPulse Exists
                        </h2>

                        <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
                            Developers build amazing projects, but there’s rarely a place that connects
                            ideas, implementations, discovery, and recognition in one flow.
                        </p>

                        <p className="text-zinc-400 mt-4 leading-relaxed">
                            DevPulse bridges that gap — turning scattered efforts into a unified space
                            where builders can explore, create, and stand out through real work.
                        </p>
                    </motion.div>

                </div>
            </section>

            {/* Features */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            What You Can Do Here
                        </h2>
                        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                            DevPulse connects inspiration, implementation, and visibility in a
                            single platform experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 hover:border-emerald-400/40 hover:-translate-y-1 transition duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">How DevPulse Works</h2>
                        <p className="text-zinc-400 mt-4">
                            A simple flow designed around how developers actually build.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                viewport={{ once: true, amount: 0.2 }}
                                className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 relative overflow-hidden"
                            >
                                <span className="text-5xl font-extrabold text-emerald-400/20 absolute top-4 right-5 select-none">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-semibold mb-3 mt-6">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What makes it different */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                    {/* Text */}
                    <motion.div {...fadeUp}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            What Makes DevPulse Different
                        </h2>

                        <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                            DevPulse is not just a place to list finished projects. It connects raw ideas
                            with real implementations in a meaningful way.
                        </p>

                        <p className="text-zinc-400 mt-4 leading-relaxed">
                            By combining idea discovery, GitHub-backed submissions, community voting,
                            and visibility systems, it gives developers a platform to showcase both
                            creativity and execution.
                        </p>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        {...fadeUp}
                        className="relative"
                    >
                        <div className="absolute -inset-6 bg-cyan-400/10 blur-3xl rounded-[2rem]" />

                        <img
                            src="/images/share.png"
                            alt="Sharing ideas"
                            className="relative rounded-[2rem] border border-white/10"
                        />
                    </motion.div>

                </div>
            </section>

            {/* Tech stack */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Built with Modern Tech</h2>
                        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                            DevPulse combines a modern frontend experience with a scalable
                            backend foundation.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeUp}
                        className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8"
                    >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {techStack.map((tech, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 border border-zinc-800 bg-black/40 rounded-2xl px-4 py-4 text-zinc-200 hover:border-emerald-400/30 hover:bg-emerald-400/5 transition duration-300"
                                >
                                    <span className="text-emerald-400">{tech.icon}</span>
                                    <span>{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Vision */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                            <Users size={30} />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        The Vision Behind DevPulse
                    </h2>
                    <p className="text-zinc-300 leading-relaxed text-base md:text-lg max-w-4xl mx-auto">
                        The long-term vision of DevPulse is to help developers move beyond
                        static portfolios and showcase real problem-solving, execution, and
                        community impact. It is designed as a place where builders can not
                        only share what they made, but also reveal how they think, create,
                        and contribute.
                    </p>
                </motion.div>
            </section>

            {/* Creator note */}
            <section className="px-6 md:px-12 lg:px-20 py-20">
                <motion.div
                    {...fadeUp}
                    className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 md:p-10 text-center"
                >
                    <ShieldCheck className="mx-auto text-emerald-400 mb-4" size={34} />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Built for Builders</h2>
                    <p className="text-zinc-400 leading-relaxed">
                        DevPulse was built with a simple belief — developers deserve a place
                        where ideas, code, and recognition come together. It is a platform
                        focused on creation, learning, and the energy of building in public.
                    </p>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-12 lg:px-20 pt-8 pb-24">
                <motion.div
                    {...fadeUp}
                    className="max-w-6xl mx-auto rounded-[2rem] border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 via-zinc-900 to-cyan-400/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Ready to explore DevPulse?
                        </h2>
                        <p className="text-zinc-400 max-w-2xl">
                            Discover ideas, share implementations, and be part of a platform
                            built around real developer work.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/ideas")}
                        className="inline-flex items-center gap-2 bg-emerald-400 text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition duration-300 whitespace-nowrap"
                    >
                        Start Exploring <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;