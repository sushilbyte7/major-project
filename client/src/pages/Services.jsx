import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const categoryIcons = {
    Electrical: '⚡', Plumbing: '🔧', Cleaning: '🧹',
    Carpentry: '🪚', Painting: '🎨', 'AC Repair': '❄️', Other: '🛠️',
};

const Services = () => {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || 'All'
    );

    useEffect(() => {
        api.get('/services').then(({ data }) => {
            setServices(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(services.map((s) => s.category))];
    const filtered = services.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
        return matchSearch && matchCat;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-slate-400 text-lg">Loading services...</div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Services</h1>
            <p className="text-slate-500 mb-8">Choose from our range of quality home services</p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Cards */}
            {filtered.length === 0 ? (
                <div className="text-center text-slate-400 py-16">No services found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((service) => (
                        <div key={service._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-8 text-center text-5xl">
                                {categoryIcons[service.category] || '🛠️'}
                            </div>
                            <div className="p-5">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {service.category}
                                </span>
                                <h3 className="text-lg font-semibold text-slate-800 mt-2 mb-1">{service.name}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-slate-800">₹{service.price}</span>
                                    <Link
                                        to={`/book/${service._id}`}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;
