import { Send, MessageSquare } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", formData);
        alert("Message submitted successfully!");

        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 sm:pt-28 overflow-x-hidden">

            {/* BACKGROUND GLOW */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute top-80 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-lime-500/10 blur-3xl" />
            </div>

            {/* HERO */}
            <section className="px-4 sm:px-6 md:px-12 lg:px-20 pb-12 sm:pb-16">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 px-4 py-2 rounded-full text-sm mb-6">
                        <MessageSquare size={16} />
                        Let’s connect
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        Contact <span className="text-emerald-400">DevPulse</span>
                    </h1>

                    <p className="text-zinc-300 text-base md:text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
                        Have a question, feedback, collaboration idea, or want to report an
                        issue? Reach out and let’s talk.
                    </p>
                </div>
            </section>

            {/* MAIN */}
            <section className="px-4 sm:px-6 md:px-12 lg:px-20 pb-16 sm:pb-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">

                    {/* LEFT - FORM */}
                    <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-8 md:p-10">
                        <h2 className="text-3xl font-bold mb-4">Send a Message</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Share feedback, report issues, or suggest ideas to improve DevPulse.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter subject"
                                    className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Write your message..."
                                    className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400 transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-emerald-400 text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition duration-300"
                            >
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                    {/* RIGHT - IMAGE CARD */}
                    <div className="space-y-6">

                        <div className="relative rounded-[2rem] overflow-hidden border border-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.08)] h-[280px] sm:h-[420px] group">

                            {/* IMAGE */}
                            <img
                                src="/images/contact.png"
                                alt="developer working"
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                            {/* TEXT */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/20">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    Let’s build something better
                                </h2>

                                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                                    Got an idea, feedback, or issue? Reach out and help improve DevPulse.
                                </p>
                            </div>

                        </div>

                        {/* INFO LIST */}
                        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-8">
                            <h3 className="text-2xl font-semibold mb-4">
                                What you can contact us for
                            </h3>
                            <ul className="space-y-3 text-zinc-400 list-disc pl-5">
                                <li>General questions about the platform</li>
                                <li>Feature suggestions and improvements</li>
                                <li>Bug reports or technical issues</li>
                                <li>Collaboration or project discussions</li>
                                <li>Feedback on user experience</li>
                            </ul>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    );
};

export default ContactPage;