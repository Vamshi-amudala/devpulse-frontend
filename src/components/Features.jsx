const Features = () => {
    return (
        <section className="py-24 px-10 md:px-20 bg-black">

            <h2 className="text-4xl font-bold text-center mb-16">
                Why <span className="text-emerald-500">DevPulse</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">

                <div className="bg-slate-900/40 border border-emerald-500/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">💡 Share Ideas</h3>
                    <p className="text-slate-400">
                        Post system design ideas and solutions for complex problems.
                    </p>
                </div>

                <div className="bg-slate-900/40 border border-emerald-500/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">🧠 Learn Architecture</h3>
                    <p className="text-slate-400">
                        Explore scalable architectures used in real systems.
                    </p>
                </div>

                <div className="bg-slate-900/40 border border-emerald-500/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">🗳 Community Voting</h3>
                    <p className="text-slate-400">
                        Discover the best ideas through community voting.
                    </p>
                </div>

            </div>

        </section>
    );
};

export default Features;