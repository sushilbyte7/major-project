import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Waves from '@/components/ReactBits/Waves';
import AnimatedContent from '@/components/ReactBits/AnimatedContent';

const categories = [
    { name: 'Electrical', icon: '⚡', color: 'bg-orange-100 text-orange-600', cat: 'Electrical' },
    { name: 'Plumbing', icon: '🔧', color: 'bg-blue-100 text-blue-600', cat: 'Plumbing' },
    { name: 'Cleaning & Pest Control', icon: '🧹', color: 'bg-green-100 text-green-600', cat: 'Cleaning' },
    { name: 'AC & Appliance Repair', icon: '❄️', color: 'bg-cyan-100 text-cyan-600', cat: 'AC Repair' },
    { name: 'Painting', icon: '🎨', color: 'bg-purple-100 text-purple-600', cat: 'Painting' },
    { name: 'Carpentry', icon: '🪚', color: 'bg-yellow-100 text-yellow-700', cat: 'Carpentry' },
];

const heroImages = [
    { src: '/hero1.png', alt: 'Electrical service' },
    { src: '/hero2.png', alt: 'Plumbing service' },
    { src: '/hero3.png', alt: 'Cleaning service' },
    { src: '/hero4.png', alt: 'AC repair service' },
];

const Home = () => {
    return (
        <div className="bg-background min-h-screen">
            {/* ── HERO SECTION ── */}
            <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[90vh] flex items-center pt-16 pb-20">
                <div className="absolute inset-0 z-0 opacity-60">
                    <Waves lineColor="rgba(255, 255, 255, 0.15)" backgroundColor="transparent" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side */}
                        <div>
                            <AnimatedContent distance={50} direction="vertical" duration={0.8} ease="power3.out">
                                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                                    Home services <br />
                                    at your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">doorstep</span>
                                </h1>
                                <p className="text-lg text-slate-300 mb-10 max-w-lg">
                                    Book verified professionals for cleaning, repair, and maintenance. On-time and hassle-free, backed by our 100% satisfaction guarantee.
                                </p>
                            </AnimatedContent>

                            <AnimatedContent distance={50} direction="vertical" duration={0.8} delay={0.2}>
                                {/* Category Box */}
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                                    <p className="text-sm text-slate-300 font-medium mb-4">
                                        What are you looking for?
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.name}
                                                to={`/services?category=${encodeURIComponent(cat.cat)}`}
                                                className="group"
                                            >
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
                                                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 ${cat.color} group-hover:scale-110 transition-transform`}>
                                                        {cat.icon}
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-slate-100 leading-tight">
                                                        {cat.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-5 text-center">
                                        <Button variant="link" asChild className="text-orange-400 hover:text-orange-300">
                                            <Link to="/services">
                                                View all services →
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </div>

                        {/* Right Side - Photo Grid */}
                        <AnimatedContent distance={100} direction="horizontal" duration={1} delay={0.3}>
                            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                                {heroImages.map((img, i) => (
                                    <motion.div 
                                        key={i} 
                                        className={`rounded-3xl overflow-hidden bg-slate-800 border border-white/10 ${i === 0 ? 'row-span-2' : ''}`}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                                            onError={(e) => {
                                                // Fallback if images don't exist
                                                e.currentTarget.src = `https://source.unsplash.com/random/400x400/?${img.alt.split(' ')[0]},service`;
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </section>

            {/* ── WHY US SECTION ── */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <AnimatedContent distance={20} duration={0.6}>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                                Why choose <span className="text-orange-500">ServeEase?</span>
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Trusted by thousands of homes across the city
                            </p>
                        </AnimatedContent>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '✅', title: 'Verified Professionals', desc: 'Every provider is background-verified and rigorously trained.' },
                            { icon: '🕐', title: 'On-Time Service', desc: 'We respect your time. Our pros arrive exactly as scheduled.' },
                            { icon: '💯', title: '100% Satisfaction', desc: "Not happy? We'll make it right, no questions asked." },
                        ].map((item, idx) => (
                            <AnimatedContent key={item.title} distance={30} delay={idx * 0.1} duration={0.6}>
                                <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow bg-white rounded-3xl overflow-hidden group">
                                    <CardContent className="p-8 pt-8">
                                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </AnimatedContent>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <AnimatedContent distance={20}>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16">
                            How it works
                        </h2>
                    </AnimatedContent>
                    
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[26px] left-[15%] right-[15%] h-0.5 bg-orange-100 z-0"></div>

                        {[
                            { num: '1', title: 'Choose a service', desc: 'Browse and pick the exact service you need' },
                            { num: '2', title: 'Book a slot', desc: 'Pick a date, time, and your preferred verified provider' },
                            { num: '3', title: 'Relax at home', desc: 'The pro arrives and gets the job done seamlessly' },
                        ].map((item, idx) => (
                            <AnimatedContent key={item.num} distance={30} delay={idx * 0.15}>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-xl shadow-orange-500/30 ring-8 ring-white">
                                        {item.num}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-sm">{item.desc}</p>
                                </div>
                            </AnimatedContent>
                        ))}
                    </div>
                    
                    <AnimatedContent distance={20} delay={0.4}>
                        <div className="mt-16">
                            <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 h-14 text-base shadow-xl shadow-orange-500/25 hover:-translate-y-1 transition-transform" asChild>
                                <Link to="/services">
                                    Book a Service Now
                                </Link>
                            </Button>
                        </div>
                    </AnimatedContent>
                </div>
            </section>
        </div>
    );
};

export default Home;
