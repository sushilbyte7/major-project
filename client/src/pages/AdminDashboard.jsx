import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TABS = [
    { id: 'Services', icon: '🛠️' },
    { id: 'Providers', icon: '👤' },
    { id: 'Bookings', icon: '📋' },
];

const CATEGORIES = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
const STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled'];

const statusCls = {
    Pending:   'bg-amber-50 text-amber-700 border-amber-200',
    Approved:  'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const FieldLabel = ({ children }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const FeedbackMsg = ({ msg }) => {
    if (!msg) return null;
    const isError = msg.toLowerCase().includes('error') || msg.toLowerCase().includes('failed');
    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`text-sm p-3 rounded-xl mb-4 border font-medium ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
        >
            {msg}
        </motion.div>
    );
};

const AdminDashboard = () => {
    const [tab, setTab] = useState('Services');
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [sForm, setSForm] = useState({ name: '', description: '', category: 'Electrical', price: '', image: '' });
    const [editingSvc, setEditingSvc] = useState(null);
    const [sMsg, setSMsg] = useState('');

    const [pForm, setPForm] = useState({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
    const [editingProv, setEditingProv] = useState(null);
    const [pMsg, setPMsg] = useState('');

    useEffect(() => {
        api.get('/services').then(({ data }) => setServices(data));
        api.get('/providers').then(({ data }) => setProviders(data));
        api.get('/bookings').then(({ data }) => setBookings(data));
    }, []);

    const reloadServices = () => api.get('/services').then(({ data }) => setServices(data));
    const reloadProviders = () => api.get('/providers').then(({ data }) => setProviders(data));
    const reloadBookings = () => api.get('/bookings').then(({ data }) => setBookings(data));

    const handleSvcSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSvc) {
                await api.put(`/services/${editingSvc}`, sForm);
                setSMsg('✅ Service updated successfully!');
            } else {
                await api.post('/services', sForm);
                setSMsg('✅ Service added successfully!');
            }
            setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' });
            setEditingSvc(null);
            reloadServices();
            setTimeout(() => setSMsg(''), 3000);
        } catch (err) { setSMsg('Error: ' + (err.response?.data?.message || 'Something went wrong')); }
    };

    const editSvc = (s) => {
        setSForm({ name: s.name, description: s.description, category: s.category, price: s.price, image: s.image || '' });
        setEditingSvc(s._id);
        setSMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteSvc = async (id) => {
        if (!window.confirm('Delete this service permanently?')) return;
        await api.delete(`/services/${id}`);
        reloadServices();
    };

    const handleProvSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProv) {
                await api.put(`/providers/${editingProv}`, pForm);
                setPMsg('✅ Provider updated successfully!');
            } else {
                await api.post('/providers', pForm);
                setPMsg('✅ Provider added successfully!');
            }
            setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
            setEditingProv(null);
            reloadProviders();
            setTimeout(() => setPMsg(''), 3000);
        } catch (err) { setPMsg('Error: ' + (err.response?.data?.message || 'Something went wrong')); }
    };

    const editProv = (p) => {
        setPForm({ name: p.name, email: p.email, phone: p.phone, service: p.service?._id || p.service, experience: p.experience, rating: p.rating });
        setEditingProv(p._id);
        setPMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProv = async (id) => {
        if (!window.confirm('Delete this provider permanently?')) return;
        await api.delete(`/providers/${id}`);
        reloadProviders();
    };

    const updateStatus = async (id, status) => {
        await api.put(`/bookings/${id}/status`, { status });
        reloadBookings();
    };

    const stats = [
        { icon: '🛠️', label: 'Services', value: services.length, color: 'bg-indigo-50 text-indigo-700' },
        { icon: '👤', label: 'Providers', value: providers.length, color: 'bg-violet-50 text-violet-700' },
        { icon: '📋', label: 'Total Bookings', value: bookings.length, color: 'bg-orange-50 text-orange-700' },
        { icon: '⏳', label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: 'bg-amber-50 text-amber-700' },
    ];

    const inputCls = "w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400";
    const selectCls = "w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300/50";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white">
                <div className="page-container py-10">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/30">🛡️</div>
                            <div>
                                <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
                                <p className="text-slate-400 text-sm">Manage services, providers, and bookings</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {stats.map((s) => (
                                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                                        <p className="text-2xl font-black text-white">{s.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="page-container py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm w-fit">
                    {TABS.map(({ id, icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                tab === id ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            {tab === id && (
                                <motion.div
                                    layoutId="admin-tab"
                                    className="absolute inset-0 bg-orange-500 rounded-xl shadow-md shadow-orange-500/25"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{icon}</span>
                            <span className="relative z-10">{id}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                    >
                        {/* ====== SERVICES TAB ====== */}
                        {tab === 'Services' && (
                            <div className="grid lg:grid-cols-12 gap-6">
                                {/* Form */}
                                <div className="lg:col-span-4">
                                    <Card className="sticky top-24 border-slate-200/60 shadow-sm rounded-2xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">{editingSvc ? '✏️ Update Service' : '+ Add New Service'}</CardTitle>
                                            <CardDescription>Fill in the service details below</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FeedbackMsg msg={sMsg} />
                                            <form onSubmit={handleSvcSubmit} className="space-y-4">
                                                <div>
                                                    <FieldLabel>Service Name</FieldLabel>
                                                    <Input placeholder="e.g. Deep Cleaning" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} required className="rounded-xl" />
                                                </div>
                                                <div>
                                                    <FieldLabel>Description</FieldLabel>
                                                    <textarea className={inputCls + " h-20 py-2 resize-none"} placeholder="Describe the service..." value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <FieldLabel>Category</FieldLabel>
                                                        <select className={selectCls} value={sForm.category} onChange={(e) => setSForm({ ...sForm, category: e.target.value })}>
                                                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Price (₹)</FieldLabel>
                                                        <Input type="number" placeholder="999" value={sForm.price} onChange={(e) => setSForm({ ...sForm, price: e.target.value })} required className="rounded-xl" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <FieldLabel>Image URL (optional)</FieldLabel>
                                                    <Input placeholder="https://..." value={sForm.image} onChange={(e) => setSForm({ ...sForm, image: e.target.value })} className="rounded-xl" />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    {editingSvc && (
                                                        <Button type="button" variant="outline" onClick={() => { setEditingSvc(null); setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' }); setSMsg(''); }} className="flex-1 rounded-xl text-sm">
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    <Button type="submit" className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm shadow-md shadow-orange-500/20">
                                                        {editingSvc ? 'Update' : 'Add Service'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Service List */}
                                <div className="lg:col-span-8 space-y-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="font-bold text-slate-800">All Services <span className="text-slate-400 font-normal text-sm">({services.length})</span></h2>
                                    </div>
                                    {services.map((s, idx) => (
                                        <motion.div key={s._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                                            <Card className="border-slate-200/60 hover:shadow-md transition-shadow rounded-2xl">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                                                        {s.category === 'Electrical' ? '⚡' : s.category === 'Plumbing' ? '🔧' : s.category === 'Cleaning' ? '🧹' : s.category === 'Painting' ? '🎨' : s.category === 'Carpentry' ? '🪚' : s.category === 'AC Repair' ? '❄️' : '🛠️'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{s.category}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{s.description}</p>
                                                    </div>
                                                    <div className="text-base font-black text-slate-900 flex-shrink-0">₹{s.price}</div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button size="sm" variant="outline" onClick={() => editSvc(s)} className="rounded-xl text-xs px-3 border-slate-200 hover:border-orange-300 hover:text-orange-600">Edit</Button>
                                                        <Button size="sm" variant="outline" onClick={() => deleteSvc(s._id)} className="rounded-xl text-xs px-3 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600">Del</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                    {services.length === 0 && <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No services yet. Add one with the form!</div>}
                                </div>
                            </div>
                        )}

                        {/* ====== PROVIDERS TAB ====== */}
                        {tab === 'Providers' && (
                            <div className="grid lg:grid-cols-12 gap-6">
                                {/* Form */}
                                <div className="lg:col-span-4">
                                    <Card className="sticky top-24 border-slate-200/60 shadow-sm rounded-2xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">{editingProv ? '✏️ Update Provider' : '+ Add Provider'}</CardTitle>
                                            <CardDescription>Add or update a service professional</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <FeedbackMsg msg={pMsg} />
                                            <form onSubmit={handleProvSubmit} className="space-y-4">
                                                <div>
                                                    <FieldLabel>Full Name</FieldLabel>
                                                    <Input placeholder="Rahul Kumar" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} required className="rounded-xl" />
                                                </div>
                                                <div>
                                                    <FieldLabel>Email</FieldLabel>
                                                    <Input type="email" placeholder="rahul@example.com" value={pForm.email} onChange={(e) => setPForm({ ...pForm, email: e.target.value })} required className="rounded-xl" />
                                                </div>
                                                <div>
                                                    <FieldLabel>Phone</FieldLabel>
                                                    <Input type="tel" placeholder="9876543210" value={pForm.phone} onChange={(e) => setPForm({ ...pForm, phone: e.target.value })} className="rounded-xl" />
                                                </div>
                                                <div>
                                                    <FieldLabel>Assigned Service</FieldLabel>
                                                    <select className={selectCls} value={pForm.service} onChange={(e) => setPForm({ ...pForm, service: e.target.value })} required>
                                                        <option value="">-- Select Service --</option>
                                                        {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <FieldLabel>Experience (yrs)</FieldLabel>
                                                        <Input type="number" placeholder="3" value={pForm.experience} onChange={(e) => setPForm({ ...pForm, experience: e.target.value })} className="rounded-xl" />
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Rating</FieldLabel>
                                                        <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={pForm.rating} onChange={(e) => setPForm({ ...pForm, rating: e.target.value })} className="rounded-xl" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    {editingProv && (
                                                        <Button type="button" variant="outline" onClick={() => { setEditingProv(null); setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' }); setPMsg(''); }} className="flex-1 rounded-xl text-sm">
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    <Button type="submit" className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm shadow-md shadow-orange-500/20">
                                                        {editingProv ? 'Update' : 'Add Provider'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Provider List */}
                                <div className="lg:col-span-8 space-y-3">
                                    <h2 className="font-bold text-slate-800 mb-1">All Providers <span className="text-slate-400 font-normal text-sm">({providers.length})</span></h2>
                                    {providers.map((p, idx) => (
                                        <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                                            <Card className="border-slate-200/60 hover:shadow-md transition-shadow rounded-2xl">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                        {p.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                                                            {p.rating && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">⭐ {Number(p.rating).toFixed(1)}</span>}
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-0.5">{p.email} • {p.phone}</p>
                                                        <p className="text-xs text-slate-400">{p.service?.name || 'No service'} • {p.experience || 0} yrs exp</p>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button size="sm" variant="outline" onClick={() => editProv(p)} className="rounded-xl text-xs px-3 border-slate-200 hover:border-orange-300 hover:text-orange-600">Edit</Button>
                                                        <Button size="sm" variant="outline" onClick={() => deleteProv(p._id)} className="rounded-xl text-xs px-3 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600">Del</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                    {providers.length === 0 && <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No providers yet. Add one with the form!</div>}
                                </div>
                            </div>
                        )}

                        {/* ====== BOOKINGS TAB ====== */}
                        {tab === 'Bookings' && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-slate-800">All Bookings <span className="text-slate-400 font-normal text-sm">({bookings.length})</span></h2>
                                </div>

                                <div className="space-y-3">
                                    {bookings.map((b, idx) => (
                                        <motion.div key={b._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.025 }}>
                                            <Card className="border-slate-200/60 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                                                <CardContent className="p-0">
                                                    <div className="flex flex-col sm:flex-row">
                                                        <div className={`w-full sm:w-1 h-1 sm:h-auto flex-shrink-0 ${
                                                            b.status === 'Completed' ? 'bg-emerald-400' :
                                                            b.status === 'Approved' ? 'bg-blue-400' :
                                                            b.status === 'Cancelled' ? 'bg-rose-400' : 'bg-amber-400'
                                                        }`} />
                                                        <div className="flex-1 p-4">
                                                            <div className="flex flex-wrap items-start gap-3 mb-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                        <h3 className="font-bold text-slate-900 text-sm">{b.service?.name || 'Unknown'}</h3>
                                                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${statusCls[b.status] || statusCls.Pending}`}>{b.status}</span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-400">
                                                                        <span className="font-medium text-slate-500">{b.user?.name || 'User'}</span>
                                                                        {' → '}
                                                                        <span>{b.provider?.name || 'Provider TBD'}</span>
                                                                    </p>
                                                                </div>
                                                                <div className="text-right text-xs text-slate-400 flex-shrink-0">
                                                                    <p>{b.date}</p>
                                                                    <p className="font-medium text-slate-500">{b.time}</p>
                                                                </div>
                                                            </div>

                                                            <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                                                                <span>📍</span> {b.address}
                                                            </p>

                                                            <div className="flex flex-wrap gap-2">
                                                                {STATUSES.map((s) => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => updateStatus(b._id, s)}
                                                                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                                                                            b.status === s
                                                                                ? `${statusCls[s]} shadow-sm`
                                                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                                                        }`}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                    {bookings.length === 0 && <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No bookings found.</div>}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
