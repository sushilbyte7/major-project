import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const categoryConfig = {
    Electrical: { icon: '⚡', gradient: 'from-yellow-400 to-orange-400', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
    Plumbing:   { icon: '🔧', gradient: 'from-blue-400 to-cyan-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    Cleaning:   { icon: '🧹', gradient: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    Carpentry:  { icon: '🪚', gradient: 'from-amber-400 to-orange-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    Painting:   { icon: '🎨', gradient: 'from-purple-400 to-pink-500',  badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    'AC Repair':{ icon: '❄️', gradient: 'from-sky-400 to-blue-500',     badge: 'bg-sky-50 text-sky-700 border-sky-200' },
    Other:      { icon: '🛠️', gradient: 'from-slate-400 to-slate-600', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const cfg = (cat) => categoryConfig[cat] || categoryConfig.Other;

const Services = () => {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

    useEffect(() => {
        api.get('/services').then(({ data }) => {
            setServices(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(services.map((s) => s.category))];
    const filtered = services.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.description || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
        return matchSearch && matchCat;
    });

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading services...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-100">
                <div className="page-container py-14">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Explore</p>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                            Our <span className="gradient-text">Services</span>
                        </h1>
                        <p className="text-slate-500 text-lg">Professional home services at your fingertips</p>
                    </motion.div>
                </div>
            </div>

            <div className="page-container py-10">
                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="flex flex-col sm:flex-row gap-4 mb-10"
                >
                    <div className="relative flex-1 max-w-sm">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        <Input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-orange-300 font-medium"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 border ${
                                    selectedCategory === cat
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600'
                                }`}
                            >
                                {cat === 'All' ? 'All Services' : `${cfg(cat).icon} ${cat}`}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Count */}
                <p className="text-sm text-slate-400 font-medium mb-6">
                    {filtered.length === 0 ? 'No services found' : `${filtered.length} service${filtered.length !== 1 ? 's' : ''} available`}
                </p>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Nothing found</h3>
                        <p className="text-slate-400">Try a different keyword or category</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((service, idx) => {
                                const c = cfg(service.category);
                                return (
                                    <motion.div
                                        key={service._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="premium-card overflow-hidden cursor-pointer group flex flex-col"
                                    >
                                        {/* Icon Banner */}
                                        <div className={`bg-gradient-to-br ${c.gradient} h-32 flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                                            <div className="absolute inset-0 bg-black/5" />
                                            <span className="text-5xl drop-shadow-md relative z-10 group-hover:scale-110 transition-transform duration-300">{c.icon}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="mb-3">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${c.badge}`}>
                                                    {service.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                                                {service.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 flex-1 line-clamp-2 leading-relaxed mb-5">
                                                {service.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium">Starting at</p>
                                                    <p className="text-2xl font-black text-slate-900">₹{service.price}</p>
                                                </div>
                                                <Link to={`/book/${service._id}`} className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                                                    <span>Book Now</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Services;
