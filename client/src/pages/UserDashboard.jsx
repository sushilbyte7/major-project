import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
    Pending: { icon: '⏳', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    Approved: { icon: '👍', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    Completed: { icon: '✅', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Cancelled: { icon: '❌', cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.Pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {status}
        </span>
    );
};

const PaymentBadge = ({ paymentStatus, paymentMethod }) => {
    if (paymentStatus === 'Paid' && paymentMethod === 'online') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="text-base leading-none">✅</span>
                Payment Done
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
            <span className="text-base leading-none">🤝</span>
            Pay After Service
        </span>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
        </CardContent>
    </Card>
);

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

// ─── Profile Edit Panel ───
const ProfilePanel = ({ onClose }) => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef();

    const [tab, setTab] = useState('info'); // 'info' | 'password'
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        profilePic: user?.profilePic || '',
    });
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
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be under 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setForm(f => ({ ...f, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setSaving(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: form.name,
                phone: form.phone,
                address: form.address,
                profilePic: form.profilePic,
            });
            updateUser(data);
            setSuccess('Profile updated successfully! ✅');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (pwForm.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setSaving(true);
        try {
            const { data } = await api.put('/users/change-password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setSuccess(data.message + ' ✅');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Slide-in Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-xl">Edit Profile</h2>
                        <p className="text-white/75 text-sm">Update your personal information</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                        ✕
                    </button>
                </div>

                {/* Profile Pic */}
                <div className="flex flex-col items-center py-6 px-6 border-b border-slate-100 bg-slate-50">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-black text-3xl">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                            title="Change photo"
                        >
                            📷
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <p className="text-xs text-slate-400 mt-3">JPG, PNG or GIF · Max 2MB</p>

                    {preview && (
                        <button
                            onClick={() => { setPreview(''); setForm(f => ({ ...f, profilePic: '' })); }}
                            className="text-xs text-red-500 hover:underline mt-1"
                        >
                            Remove photo
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    {[{ id: 'info', label: '👤 Profile Info' }, { id: 'password', label: '🔐 Change Password' }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => { setTab(t.id); setError(''); setSuccess(''); }}
                            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === t.id
                                ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50'
                                : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">

                        {/* Alert messages */}
                        {(success || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`rounded-2xl px-4 py-3 text-sm font-medium mb-4 ${success
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'}`}
                            >
                                {success || `⚠️ ${error}`}
                            </motion.div>
                        )}

                        {/* Profile Info Tab */}
                        {tab === 'info' && (
                            <motion.form key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleInfoSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Full Name</Label>
                                    <Input
                                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required placeholder="Your full name"
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Email</Label>
                                    <Input
                                        value={user?.email || ''} disabled
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-400">Email cannot be changed</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Phone Number</Label>
                                    <Input
                                        type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="9876543210"
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">Home Address</Label>
                                    <Input
                                        value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                        placeholder="Your home address"
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-50"
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={saving}
                                        className="btn-primary w-full justify-center py-3 rounded-2xl text-base">
                                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                        {saving
                                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <span>✓</span>}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* Password Tab */}
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
                                            <Input
                                                type={field.show ? 'text' : 'password'}
                                                value={pwForm[field.id]}
                                                onChange={e => setPwForm(f => ({ ...f, [field.id]: e.target.value }))}
                                                required placeholder="••••••••"
                                                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pr-11"
                                            />
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
                                        className="btn-primary w-full justify-center py-3 rounded-2xl text-base"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                        <span>{saving ? 'Updating...' : 'Update Password'}</span>
                                        {saving
                                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <span>🔐</span>}
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

// ─── Main Dashboard ───
const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalBooking, setReviewModalBooking] = useState(null);
    const [bookingReviews, setBookingReviews] = useState({});
    const [showProfile, setShowProfile] = useState(false);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
            const { data: reviews } = await api.get('/reviews/my-reviews');
            const reviewMap = {};
            reviews.forEach(review => { reviewMap[review.booking._id] = review; });
            setBookingReviews(reviewMap);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not cancel booking');
        }
    };

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
        upcoming: bookings.filter(b => b.status === 'Approved').length,
    };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-4 mb-6">
                            {/* Profile Avatar — clickable */}
                            <button
                                onClick={() => setShowProfile(true)}
                                className="relative group focus:outline-none"
                                title="Edit Profile"
                            >
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-orange-400 transition-all shadow-lg shadow-orange-500/20">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-black text-xl">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                            </button>

                            <div className="flex-1">
                                <h1 className="text-3xl font-extrabold text-slate-900">
                                    Welcome back, <span className="text-orange-500">{user?.name?.split(' ')[0] || 'there'}</span>
                                </h1>
                                <p className="text-slate-500 mt-0.5">Track and manage all your service bookings</p>
                            </div>

                            <Button
                                onClick={() => setShowProfile(true)}
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-slate-200 font-semibold hidden sm:flex items-center gap-2"
                            >
                                ✏️ Edit Profile
                            </Button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard icon="📋" label="Total" value={stats.total} color="bg-slate-100" />
                            <StatCard icon="⏳" label="Pending" value={stats.pending} color="bg-amber-50" />
                            <StatCard icon="📅" label="Upcoming" value={stats.upcoming} color="bg-blue-50" />
                            <StatCard icon="✅" label="Completed" value={stats.completed} color="bg-emerald-50" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Booking List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">📅</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings yet</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Discover our professional home services and book your first appointment!</p>
                        <Button asChild size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20 px-8">
                            <Link to="/services">Explore Services →</Link>
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Your Bookings</h2>
                            <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 font-semibold">
                                <Link to="/services">+ New Booking</Link>
                            </Button>
                        </div>

                        <AnimatePresence>
                            {bookings.map((b, idx) => (
                                <motion.div
                                    key={b._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row">
                                                {/* Color accent stripe */}
                                                <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto flex-shrink-0 ${b.status === 'Completed' ? 'bg-emerald-400' :
                                                    b.status === 'Approved' ? 'bg-blue-400' :
                                                        b.status === 'Cancelled' ? 'bg-rose-400' : 'bg-amber-400'
                                                    }`} />

                                                {/* Main Content */}
                                                <div className="flex-1 p-5 sm:p-6">
                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-900">{b.service?.name}</h3>
                                                            <p className="text-sm text-slate-400 mt-0.5">
                                                                via {b.provider?.name || 'Provider TBD'}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <StatusBadge status={b.status} />
                                                            <PaymentBadge paymentStatus={b.paymentStatus} paymentMethod={b.paymentMethod} />
                                                        </div>
                                                    </div>

                                                    <div className="grid sm:grid-cols-3 gap-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-base">📅</span>
                                                            <div>
                                                                <p className="text-xs text-slate-400 font-medium">Date & Time</p>
                                                                <p className="font-semibold text-slate-700">{b.date} • {b.time}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-base">📍</span>
                                                            <div>
                                                                <p className="text-xs text-slate-400 font-medium">Location</p>
                                                                <p className="font-semibold text-slate-700 line-clamp-1">{b.address}</p>
                                                            </div>
                                                        </div>
                                                        {b.provider?.phone && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="text-base">📞</span>
                                                                <div>
                                                                    <p className="text-xs text-slate-400 font-medium">Contact</p>
                                                                    <p className="font-semibold text-slate-700">{b.provider.phone}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {b.notes && (
                                                        <div className="mt-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-500 italic">
                                                            "{b.notes}"
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Panel */}
                                                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 px-5 py-4 sm:w-48 flex sm:flex-col justify-end sm:justify-center gap-3 bg-slate-50/50">
                                                    {(b.status === 'Pending' || b.status === 'Approved') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCancel(b._id)}
                                                            className="rounded-xl border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 font-semibold"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}

                                                    {b.status === 'Completed' && !bookingReviews[b._id] && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setReviewModalBooking(b)}
                                                            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/20"
                                                        >
                                                            ⭐ Review
                                                        </Button>
                                                    )}

                                                    {b.status === 'Completed' && bookingReviews[b._id] && (
                                                        <div className="text-xs text-emerald-700 font-bold text-center px-2 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                                                            ✓ Reviewed
                                                        </div>
                                                    )}

                                                    {b.status === 'Cancelled' && (
                                                        <div className="text-xs text-slate-400 font-medium text-center">
                                                            Cancelled
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModalBooking && (
                <ReviewModal
                    booking={reviewModalBooking}
                    onClose={() => setReviewModalBooking(null)}
                    onSuccess={fetchBookings}
                />
            )}

            {/* Profile Edit Panel */}
            <AnimatePresence>
                {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default UserDashboard;
