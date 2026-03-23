import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TABS = ['Services', 'Providers', 'Bookings'];

const AdminDashboard = () => {
    const [tab, setTab] = useState('Services');
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);

    // --- Service Form State ---
    const [sForm, setSForm] = useState({ name: '', description: '', category: 'Electrical', price: '', image: '' });
    const [editingSvc, setEditingSvc] = useState(null);

    // --- Provider Form State ---
    const [pForm, setPForm] = useState({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
    const [editingProv, setEditingProv] = useState(null);

    const [sMsg, setSMsg] = useState('');
    const [pMsg, setPMsg] = useState('');

    // Fetch all data
    useEffect(() => {
        api.get('/services').then(({ data }) => setServices(data));
        api.get('/providers').then(({ data }) => setProviders(data));
        api.get('/bookings').then(({ data }) => setBookings(data));
    }, []);

    // Reload helpers
    const reloadServices = () => api.get('/services').then(({ data }) => setServices(data));
    const reloadProviders = () => api.get('/providers').then(({ data }) => setProviders(data));
    const reloadBookings = () => api.get('/bookings').then(({ data }) => setBookings(data));

    // ---- SERVICE CRUD ----
    const handleSvcSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSvc) {
                await api.put(`/services/${editingSvc}`, sForm);
                setSMsg('Service updated successfully!');
            } else {
                await api.post('/services', sForm);
                setSMsg('Service added successfully!');
            }
            setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' });
            setEditingSvc(null);
            reloadServices();
            setTimeout(() => setSMsg(''), 3000);
        } catch (err) { setSMsg(err.response?.data?.message || 'Error occurred'); }
    };

    const editSvc = (s) => {
        setSForm({ name: s.name, description: s.description, category: s.category, price: s.price, image: s.image });
        setEditingSvc(s._id);
        setSMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteSvc = async (id) => {
        if (!window.confirm('Delete this service permanently?')) return;
        await api.delete(`/services/${id}`);
        reloadServices();
    };

    // ---- PROVIDER CRUD ----
    const handleProvSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProv) {
                await api.put(`/providers/${editingProv}`, pForm);
                setPMsg('Provider updated successfully!');
            } else {
                await api.post('/providers', pForm);
                setPMsg('Provider added successfully!');
            }
            setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
            setEditingProv(null);
            reloadProviders();
            setTimeout(() => setPMsg(''), 3000);
        } catch (err) { setPMsg(err.response?.data?.message || 'Error occurred'); }
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

    // ---- BOOKINGS ----
    const updateStatus = async (id, status) => {
        await api.put(`/bookings/${id}/status`, { status });
        reloadBookings();
    };

    const categories = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
    const statuses = ['Pending', 'Approved', 'Completed', 'Cancelled'];
    
    const statusColors = {
        Pending: "bg-amber-100 text-amber-700",
        Approved: "bg-blue-100 text-blue-700",
        Completed: "bg-emerald-100 text-emerald-700",
        Cancelled: "bg-rose-100 text-rose-700"
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Area */}
            <div className="bg-slate-900 border-b border-slate-800 pt-16 pb-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">🛡️</span>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                Admin Dashboard
                            </h1>
                        </div>
                        <p className="text-slate-400 text-lg ml-12">Manage your platform's services, providers, and operations natively.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modern Tabs */}
                <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                                tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            {tab === t && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-indigo-600 rounded-xl"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{t}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* ---- SERVICES TAB ---- */}
                        {tab === 'Services' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4">
                                    <Card className="sticky top-24 border-slate-200/60 shadow-sm">
                                        <CardHeader>
                                            <CardTitle>{editingSvc ? 'Update Service' : 'Add New Service'}</CardTitle>
                                            <CardDescription>Configure service details and pricing here.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {sMsg && (
                                                <div className={`text-sm mb-4 p-3 rounded-lg ${sMsg.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                    {sMsg}
                                                </div>
                                            )}
                                            <form onSubmit={handleSvcSubmit} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Service Name</label>
                                                    <Input placeholder="e.g. Deep Cleaning" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} required />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                                                    <textarea 
                                                        className="w-full flex min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50" 
                                                        placeholder="Service details..." rows={3} value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} required 
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
                                                        <select 
                                                            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50" 
                                                            value={sForm.category} onChange={(e) => setSForm({ ...sForm, category: e.target.value })}
                                                        >
                                                            {categories.map((c) => <option key={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Price (₹)</label>
                                                        <Input type="number" placeholder="500" value={sForm.price} onChange={(e) => setSForm({ ...sForm, price: e.target.value })} required />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Cover Image URL</label>
                                                    <Input placeholder="https://..." value={sForm.image} onChange={(e) => setSForm({ ...sForm, image: e.target.value })} />
                                                </div>
                                                
                                                <div className="pt-2 flex gap-3">
                                                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                                        {editingSvc ? 'Save Changes' : 'Create Service'}
                                                    </Button>
                                                    {editingSvc && (
                                                        <Button type="button" variant="outline" onClick={() => { setEditingSvc(null); setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' }); }}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-8">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-slate-800">Active Services <span className="ml-2 text-sm font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{services.length}</span></h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {services.map((s) => (
                                            <Card key={s._id} className="border-slate-200/60 shadow-sm relative group overflow-hidden">
                                                {s.image && (
                                                    <div className="h-24 w-full bg-slate-100 overflow-hidden">
                                                        <img src={s.image} alt={s.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                                    </div>
                                                )}
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{s.category}</div>
                                                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{s.name}</h3>
                                                        </div>
                                                        <div className="font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">₹{s.price}</div>
                                                    </div>
                                                    <p className="text-slate-500 text-sm line-clamp-2 mt-2">{s.description}</p>
                                                    
                                                    <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => editSvc(s)}>Edit</Button>
                                                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => deleteSvc(s._id)}>Delete</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ---- PROVIDERS TAB ---- */}
                        {tab === 'Providers' && (
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4">
                                    <Card className="sticky top-24 border-slate-200/60 shadow-sm">
                                        <CardHeader>
                                            <CardTitle>{editingProv ? 'Update Provider' : 'Onboard Provider'}</CardTitle>
                                            <CardDescription>Add a new professional to the platform.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {pMsg && (
                                                <div className={`text-sm mb-4 p-3 rounded-lg ${pMsg.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                    {pMsg}
                                                </div>
                                            )}
                                            <form onSubmit={handleProvSubmit} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Provider Name</label>
                                                    <Input placeholder="John Doe" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} required />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                                                    <Input type="email" placeholder="john@example.com" value={pForm.email} onChange={(e) => setPForm({ ...pForm, email: e.target.value })} required />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                                                    <Input placeholder="+91 9876543210" value={pForm.phone} onChange={(e) => setPForm({ ...pForm, phone: e.target.value })} required />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Primary Service</label>
                                                    <select 
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50" 
                                                        value={pForm.service} onChange={(e) => setPForm({ ...pForm, service: e.target.value })} required
                                                    >
                                                        <option value="">-- Assign Service --</option>
                                                        {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Experience (Yrs)</label>
                                                        <Input type="number" placeholder="5" value={pForm.experience} onChange={(e) => setPForm({ ...pForm, experience: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-500 uppercase">Initial Rating</label>
                                                        <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={pForm.rating} onChange={(e) => setPForm({ ...pForm, rating: e.target.value })} />
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-2 flex gap-3">
                                                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                                        {editingProv ? 'Save Changes' : 'Add Provider'}
                                                    </Button>
                                                    {editingProv && (
                                                        <Button type="button" variant="outline" onClick={() => { setEditingProv(null); setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' }); }}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-8">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-slate-800">Verified Providers <span className="ml-2 text-sm font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{providers.length}</span></h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {providers.map((p) => (
                                            <Card key={p._id} className="border-slate-200/60 shadow-sm">
                                                <CardContent className="p-5">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex justify-center items-center font-bold text-lg border border-indigo-100">
                                                            {p.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{p.name}</h3>
                                                            <p className="text-indigo-600 font-medium text-sm">{p.service?.name || 'Unassigned'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2 mb-5">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Contact:</span>
                                                            <span className="font-medium text-slate-700">{p.phone}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Experience:</span>
                                                            <span className="font-medium text-slate-700">{p.experience} Years</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-500">Rating:</span>
                                                            <span className="font-medium text-amber-500 flex items-center gap-1">⭐ {p.rating} / 5</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => editProv(p)}>Edit</Button>
                                                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => deleteProv(p._id)}>Remove</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ---- BOOKINGS TAB ---- */}
                        {tab === 'Bookings' && (
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-800">All Operations <span className="ml-2 text-sm font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{bookings.length}</span></h2>
                                </div>
                                <div className="space-y-3">
                                    {bookings.map((b) => (
                                        <Card key={b._id} className="border-slate-200/60 shadow-sm overflow-hidden hover:border-indigo-200 transition-colors">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-slate-900 text-lg">{b.service?.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[b.status] || statusColors.Pending}`}>
                                                            {b.status}
                                                        </span>
                                                        <span className="text-slate-400 text-sm">{b.date} • {b.time}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="p-6 flex-1 grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                                                        <p className="text-sm font-medium text-slate-800">{b.user?.name}</p>
                                                        <p className="text-sm text-slate-500">{b.user?.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Provider</p>
                                                        <p className="text-sm font-medium text-slate-800">{b.provider?.name || 'Not assigned yet'}</p>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                                        <p className="text-sm text-slate-600 line-clamp-1">{b.address}</p>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-slate-50 md:w-48 flex flex-col items-start justify-center border-t md:border-t-0 md:border-l border-slate-100">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Change Status</label>
                                                    <select
                                                        value={b.status}
                                                        onChange={(e) => updateStatus(b._id, e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                                    >
                                                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
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
