import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';

const TABS = [
    { id: 'Services', icon: '🛠️' },
    { id: 'Providers', icon: '👤' },
    { id: 'Bookings', icon: '📋' },
    { id: 'Alerts', icon: '🚨' },
];

const CATEGORIES = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Other'];
const STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled'];

const statusCls = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-blue-50 text-blue-700 border-blue-200',
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

// ─── Eye Icons ───
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

// ─── Admin Profile Panel ───
const ProfilePanel = ({ onClose }) => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef();
    const [tab, setTab] = useState('info');
    const [form, setForm] = useState({ name: user?.name || '', profilePic: user?.profilePic || '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(user?.profilePic || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return; }
        const reader = new FileReader();
        reader.onloadend = () => { setPreview(reader.result); setForm(f => ({ ...f, profilePic: reader.result })); };
        reader.readAsDataURL(file);
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setSaving(true);
        try {
            const { data } = await api.put('/users/profile', { name: form.name, profilePic: form.profilePic });
            updateUser(data);
            setSuccess('Profile updated successfully! ✅');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally { setSaving(false); }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (pwForm.newPassword !== pwForm.confirmPassword) { setError('New passwords do not match'); return; }
        if (pwForm.newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        setSaving(true);
        try {
            const { data } = await api.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            setSuccess(data.message + ' ✅');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally { setSaving(false); }
    };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-xl">Admin Profile</h2>
                        <p className="text-white/60 text-sm">Update your account details</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">✕</button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center py-6 px-6 border-b border-slate-100 bg-slate-50">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black text-3xl">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <button onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors" title="Change photo">
                            📷
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <p className="text-xs text-slate-400 mt-3">JPG, PNG or GIF · Max 2MB</p>
                    {preview && (
                        <button onClick={() => { setPreview(''); setForm(f => ({ ...f, profilePic: '' })); }} className="text-xs text-red-500 hover:underline mt-1">Remove photo</button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    {[{ id: 'info', label: '👤 Profile Info' }, { id: 'password', label: '🔐 Change Password' }].map(t => (
                        <button key={t.id} onClick={() => { setTab(t.id); setError(''); setSuccess(''); }}
                            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === t.id ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {(success || error) && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`rounded-2xl px-4 py-3 text-sm font-medium mb-4 ${success ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                                {success || `⚠️ ${error}`}
                            </motion.div>
                        )}

                        {tab === 'info' && (
                            <motion.form key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleInfoSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Full Name</Label>
                                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Admin name"
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Email</Label>
                                    <Input value={user?.email || ''} disabled className="h-11 rounded-2xl border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" />
                                    <p className="text-xs text-slate-400">Email cannot be changed</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Role</Label>
                                    <Input value="Admin" disabled className="h-11 rounded-2xl border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition-colors text-base">
                                        {saving ? 'Saving...' : 'Save Changes'} {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '✓'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {tab === 'password' && (
                            <motion.form key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handlePasswordSubmit} className="space-y-4">
                                {[
                                    { id: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                                    { id: 'newPassword', label: 'New Password', show: showNew, toggle: () => setShowNew(v => !v) },
                                    { id: 'confirmPassword', label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(v => !v) },
                                ].map(field => (
                                    <div key={field.id} className="space-y-1.5">
                                        <Label className="text-sm font-bold text-slate-700">{field.label}</Label>
                                        <div className="relative">
                                            <Input type={field.show ? 'text' : 'password'} value={pwForm[field.id]}
                                                onChange={e => setPwForm(f => ({ ...f, [field.id]: e.target.value }))}
                                                required placeholder="••••••••" className="h-11 rounded-2xl border-slate-200 bg-slate-50 pr-11" />
                                            <button type="button" onClick={field.toggle}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors">
                                                {field.show ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                        {field.id === 'confirmPassword' && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                                            <p className="text-xs text-red-500">⚠️ Passwords do not match</p>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-2">
                                    <button type="submit" disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl transition-colors text-base"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                        {saving ? 'Updating...' : 'Update Password'} {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🔐'}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('Services');
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showProfile, setShowProfile] = useState(false);

    const [sForm, setSForm] = useState({ name: '', description: '', category: 'Electrical', price: '', image: '' });
    const [editingSvc, setEditingSvc] = useState(null);
    const [sMsg, setSMsg] = useState('');

    const [pForm, setPForm] = useState({ name: '', email: '', phone: '', service: '', experience: '', rating: '' });
    const [editingProv, setEditingProv] = useState(null);
    const [pMsg, setPMsg] = useState('');

    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const adminInitials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';

    useEffect(() => {
        api.get('/services').then(({ data }) => setServices(data));
        api.get('/providers').then(({ data }) => setProviders(data));
        api.get('/bookings').then(({ data }) => setBookings(data));
        api.get('/alerts').then(({ data }) => {
            setAlerts(data.alerts || []);
            setUnreadCount(data.unreadCount || 0);
        }).catch(() => {});
    }, []);

    const reloadServices = () => api.get('/services').then(({ data }) => setServices(data));
    const reloadProviders = () => api.get('/providers').then(({ data }) => setProviders(data));
    const reloadBookings = () => api.get('/bookings').then(({ data }) => setBookings(data));
    const reloadAlerts = () => api.get('/alerts').then(({ data }) => {
        setAlerts(data.alerts || []);
        setUnreadCount(data.unreadCount || 0);
    }).catch(() => {});

    const markAsRead = async (id) => {
        await api.put(`/alerts/${id}/read`);
        reloadAlerts();
    };

    const markAllRead = async () => {
        await api.put('/alerts/read-all');
        reloadAlerts();
    };

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
                        <div className="flex items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                {/* Admin Avatar - clickable */}
                                <button onClick={() => setShowProfile(true)} className="relative group focus:outline-none" title="Edit Profile">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-orange-400 transition-all shadow-lg shadow-orange-500/30">
                                        {user?.profilePic ? (
                                            <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-orange-500 flex items-center justify-center font-black text-sm text-white">
                                                {adminInitials}
                                            </div>
                                        )}
                                    </div>
                                </button>
                                <div>
                                    <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
                                    <p className="text-slate-400 text-sm">Welcome, {user?.name?.split(' ')[0] || 'Admin'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Edit Profile Button */}
                                <button
                                    onClick={() => setShowProfile(true)}
                                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-semibold text-white flex items-center gap-1.5"
                                    title="Edit Profile"
                                >
                                    <span>✏️</span>
                                    <span className="hidden sm:inline">Profile</span>
                                </button>
                                {/* Bell Icon */}
                                <button
                                    onClick={() => { setTab('Alerts'); }}
                                    className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                    title="View Alerts"
                                >
                                    <span className="text-xl">🔔</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
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
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === id ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
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
                            {/* Badge on Alerts tab */}
                            {id === 'Alerts' && unreadCount > 0 && (
                                <span className="relative z-10 bg-red-500 text-white text-xs font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                    {unreadCount}
                                </span>
                            )}
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
                                                        <div className={`w-full sm:w-1 h-1 sm:h-auto flex-shrink-0 ${b.status === 'Completed' ? 'bg-emerald-400' :
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
                                                                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${b.status === s
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
                        {/* ====== ALERTS TAB ====== */}
                        {tab === 'Alerts' && (
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="font-bold text-slate-800 text-lg">🚨 ML Alert Center</h2>
                                        <p className="text-slate-400 text-sm">Auto-generated by Sentiment Analysis & Rating Monitor</p>
                                    </div>
                                    {alerts.some(a => !a.isRead) && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-xl transition-all"
                                        >
                                            ✅ Mark All Read
                                        </button>
                                    )}
                                </div>

                                {alerts.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <div className="text-5xl mb-3">✅</div>
                                        <p className="text-slate-500 font-semibold">No alerts! All providers are doing great.</p>
                                        <p className="text-slate-400 text-sm mt-1">Alerts appear when a review has low rating (≤2⭐) or negative sentiment.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {alerts.map((alert, idx) => {
                                            const alertColors = {
                                                both: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', label: '⭐ Low Rating + 😠 Negative' },
                                                low_rating: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', label: '⭐ Low Rating' },
                                                negative_sentiment: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-500', label: '😠 Negative Sentiment' },
                                            };
                                            const color = alertColors[alert.alertType] || alertColors.low_rating;
                                            const stars = '⭐'.repeat(alert.rating) + '☆'.repeat(5 - alert.rating);

                                            return (
                                                <motion.div
                                                    key={alert._id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                >
                                                    <Card className={`border rounded-2xl overflow-hidden transition-all ${ alert.isRead ? 'border-slate-200 opacity-70' : `${color.border} shadow-sm` }`}>
                                                        <CardContent className="p-0">
                                                            <div className="flex">
                                                                {/* Left accent bar */}
                                                                <div className={`w-1 flex-shrink-0 ${alert.isRead ? 'bg-slate-200' : color.badge}`} />
                                                                <div className="flex-1 p-4">
                                                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                                                        <div className="flex-1 min-w-0">
                                                                            {/* Alert type badge */}
                                                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                                                <span className={`text-xs font-bold text-white px-2.5 py-0.5 rounded-full ${alert.isRead ? 'bg-slate-400' : color.badge}`}>
                                                                                    {color.label}
                                                                                </span>
                                                                                {!alert.isRead && (
                                                                                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full animate-pulse">NEW</span>
                                                                                )}
                                                                            </div>

                                                                            {/* Provider + rating */}
                                                                            <div className="flex items-center gap-3 mb-1">
                                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                                                    {alert.provider?.name?.charAt(0) || '?'}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-bold text-slate-900 text-sm">{alert.provider?.name || 'Unknown Provider'}</p>
                                                                                    <p className="text-xs text-slate-500">{stars} {alert.rating}/5 stars</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* ML Result */}
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <span className="text-xs text-slate-500">🤖 ML Sentiment:</span>
                                                                                <span className={`text-xs font-bold capitalize ${ alert.sentiment === 'negative' ? 'text-red-600' : alert.sentiment === 'positive' ? 'text-emerald-600' : 'text-amber-600' }`}>
                                                                                    {alert.sentiment} (score: {alert.sentimentScore})
                                                                                </span>
                                                                            </div>

                                                                            {/* Review comment */}
                                                                            {alert.commentPreview && (
                                                                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-2">
                                                                                    <p className="text-xs text-slate-600 italic">"{alert.commentPreview}"</p>
                                                                                </div>
                                                                            )}

                                                                            <p className="text-xs text-slate-400">
                                                                                {new Date(alert.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                            </p>
                                                                        </div>

                                                                        {/* Mark as read button */}
                                                                        {!alert.isRead && (
                                                                            <button
                                                                                onClick={() => markAsRead(alert._id)}
                                                                                className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all flex-shrink-0"
                                                                            >
                                                                                Mark Read
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            {/* Profile Edit Panel */}
            <AnimatePresence>
                {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
