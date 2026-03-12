import { useState, useEffect } from 'react';
import api from '../services/api';

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
                setSMsg('Service updated!');
            } else {
                await api.post('/services', sForm);
                setSMsg('Service added!');
            }
            setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' });
            setEditingSvc(null);
            reloadServices();
        } catch (err) { setSMsg(err.response?.data?.message || 'Error'); }
    };

    const editSvc = (s) => {
        setSForm({ name: s.name, description: s.description, category: s.category, price: s.price, image: s.image });
        setEditingSvc(s._id);
        setSMsg('');
    };

    const deleteSvc = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        await api.delete(`/services/${id}`);
        reloadServices();
    };

    // ---- PROVIDER CRUD ----
    const handleProvSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProv) {
                await api.put(`/providers/${editingProv}`, pForm);
                setPMsg('Provider updated!');
            } else {
                await api.post('/providers', pForm);
                setPMsg('Provider added!');
            }
            setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
            setEditingProv(null);
            reloadProviders();
        } catch (err) { setPMsg(err.response?.data?.message || 'Error'); }
    };

    const editProv = (p) => {
        setPForm({ name: p.name, email: p.email, phone: p.phone, service: p.service?._id || p.service, experience: p.experience, rating: p.rating });
        setEditingProv(p._id);
        setPMsg('');
    };

    const deleteProv = async (id) => {
        if (!window.confirm('Delete this provider?')) return;
        await api.delete(`/providers/${id}`);
        reloadProviders();
    };

    // ---- BOOKINGS ----
    const updateStatus = async (id, status) => {
        await api.put(`/bookings/${id}/status`, { status });
        reloadBookings();
    };

    const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const categories = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
    const statuses = ['Pending', 'Approved', 'Completed', 'Cancelled'];
    const statusColors = { Pending: 'badge-pending', Approved: 'badge-approved', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 mb-8">Manage services, providers, and bookings</p>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 mb-8">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2.5 font-medium text-sm transition-colors border-b-2 -mb-px ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* ---- SERVICES TAB ---- */}
            {tab === 'Services' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="font-semibold text-slate-800 mb-4">{editingSvc ? 'Edit Service' : 'Add New Service'}</h2>
                        {sMsg && <p className="text-sm text-green-600 mb-3">{sMsg}</p>}
                        <form onSubmit={handleSvcSubmit} className="space-y-3">
                            <input className={inputClass} placeholder="Service Name" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} required />
                            <textarea className={inputClass} placeholder="Description" rows={2} value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} required />
                            <select className={inputClass} value={sForm.category} onChange={(e) => setSForm({ ...sForm, category: e.target.value })}>
                                {categories.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <input type="number" className={inputClass} placeholder="Price (₹)" value={sForm.price} onChange={(e) => setSForm({ ...sForm, price: e.target.value })} required />
                            <input className={inputClass} placeholder="Image URL (optional)" value={sForm.image} onChange={(e) => setSForm({ ...sForm, image: e.target.value })} />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                                    {editingSvc ? 'Update' : 'Add Service'}
                                </button>
                                {editingSvc && (
                                    <button type="button" onClick={() => { setEditingSvc(null); setSForm({ name: '', description: '', category: 'Electrical', price: '', image: '' }); }}
                                        className="px-4 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 mb-4">All Services ({services.length})</h2>
                        <div className="space-y-3">
                            {services.map((s) => (
                                <div key={s._id} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-medium text-slate-800">{s.name}</p>
                                        <p className="text-sm text-slate-400">{s.category} · ₹{s.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editSvc(s)} className="text-blue-600 text-sm hover:underline">Edit</button>
                                        <button onClick={() => deleteSvc(s._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ---- PROVIDERS TAB ---- */}
            {tab === 'Providers' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="font-semibold text-slate-800 mb-4">{editingProv ? 'Edit Provider' : 'Add New Provider'}</h2>
                        {pMsg && <p className="text-sm text-green-600 mb-3">{pMsg}</p>}
                        <form onSubmit={handleProvSubmit} className="space-y-3">
                            <input className={inputClass} placeholder="Provider Name" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} required />
                            <input type="email" className={inputClass} placeholder="Email" value={pForm.email} onChange={(e) => setPForm({ ...pForm, email: e.target.value })} required />
                            <input className={inputClass} placeholder="Phone" value={pForm.phone} onChange={(e) => setPForm({ ...pForm, phone: e.target.value })} required />
                            <select className={inputClass} value={pForm.service} onChange={(e) => setPForm({ ...pForm, service: e.target.value })} required>
                                <option value="">-- Assign Service --</option>
                                {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                            <input type="number" className={inputClass} placeholder="Experience (years)" value={pForm.experience} onChange={(e) => setPForm({ ...pForm, experience: e.target.value })} />
                            <input type="number" step="0.1" min="0" max="5" className={inputClass} placeholder="Rating (0-5)" value={pForm.rating} onChange={(e) => setPForm({ ...pForm, rating: e.target.value })} />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                                    {editingProv ? 'Update' : 'Add Provider'}
                                </button>
                                {editingProv && (
                                    <button type="button" onClick={() => { setEditingProv(null); setPForm({ name: '', email: '', phone: '', service: '', experience: '', rating: '' }); }}
                                        className="px-4 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 mb-4">All Providers ({providers.length})</h2>
                        <div className="space-y-3">
                            {providers.map((p) => (
                                <div key={p._id} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                    <div>
                                        <p className="font-medium text-slate-800">{p.name}</p>
                                        <p className="text-sm text-slate-400">{p.service?.name} · ⭐{p.rating} · {p.experience}yr</p>
                                        <p className="text-xs text-slate-400">{p.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editProv(p)} className="text-blue-600 text-sm hover:underline">Edit</button>
                                        <button onClick={() => deleteProv(p._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ---- BOOKINGS TAB ---- */}
            {tab === 'Bookings' && (
                <div>
                    <h2 className="font-semibold text-slate-800 mb-4">All Bookings ({bookings.length})</h2>
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <div key={b._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-slate-800">{b.service?.name}</h3>
                                            <span className={statusColors[b.status] || 'badge-pending'}>{b.status}</span>
                                        </div>
                                        <p className="text-sm text-slate-500">👤 {b.user?.name} ({b.user?.email})</p>
                                        <p className="text-sm text-slate-500">🔧 Provider: {b.provider?.name}</p>
                                        <p className="text-sm text-slate-500">📅 {b.date} at {b.time}</p>
                                        <p className="text-sm text-slate-500">📍 {b.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Update Status</label>
                                        <select
                                            value={b.status}
                                            onChange={(e) => updateStatus(b._id, e.target.value)}
                                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {statuses.map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
