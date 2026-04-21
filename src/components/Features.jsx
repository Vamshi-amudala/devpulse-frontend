const Features = () => {
    return (
        <section className="py-16 sm:py-24 px-5 sm:px-10 md:px-20 bg-black">

            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
                Why <span className="text-emerald-500">DevPulse</span>
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">

                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                        Share what you’re building
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Document your ideas, approaches, and experiments. Build a public trail of how you think and solve problems.
                    </p>
                </div>

                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                        Learn from real implementations
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Explore how others approach system design, scalability, and architecture in practical, real-world scenarios.
                    </p>
                </div>

                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                        Discover what stands out
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        Surface the most impactful ideas through community feedback and voting, not just visibility.
                    </p>
                </div>

            </div>

        </section>
    );
};

export default Features;