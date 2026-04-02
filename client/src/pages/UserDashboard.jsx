import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalBooking, setReviewModalBooking] = useState(null);
    const [bookingReviews, setBookingReviews] = useState({});

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
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/25">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">
                                    Welcome back, <span className="text-orange-500">{user?.name?.split(' ')[0] || 'there'}</span>
                                </h1>
                                <p className="text-slate-500 mt-0.5">Track and manage all your service bookings</p>
                            </div>
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

            {reviewModalBooking && (
                <ReviewModal
                    booking={reviewModalBooking}
                    onClose={() => setReviewModalBooking(null)}
                    onSuccess={fetchBookings}
                />
            )}
        </div>
    );
};

export default UserDashboard;
