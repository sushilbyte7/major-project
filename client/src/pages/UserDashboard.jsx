import { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const statusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5";
    const map = {
        Pending: `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200/60`,
        Approved: `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200/60`,
        Completed: `${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200/60`,
        Cancelled: `${baseClasses} bg-rose-50 text-rose-700 border border-rose-200/60`,
    };
    
    const icons = {
        Pending: '⏳',
        Approved: '👍',
        Completed: '✅',
        Cancelled: '❌'
    };

    return (
        <span className={map[status] || map.Pending}>
            <span className="text-[10px]">{icons[status] || '•'}</span> {status}
        </span>
    );
};

const UserDashboard = () => {
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
            reviews.forEach(review => {
                reviewMap[review.booking._id] = review;
            });
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200/60 pt-16 pb-12 mb-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                            My <span className="text-orange-500">Bookings</span>
                        </h1>
                        <p className="text-slate-500 text-lg">Manage and track all your scheduled services</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {bookings.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            📅
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No active bookings</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't booked any services yet. Discover what we can do for your home!</p>
                        <Button asChild size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20">
                            <a href="/services">Explore Services</a>
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {bookings.map((b, idx) => (
                                <motion.div
                                    key={b._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Card className="overflow-hidden border-slate-200/60 hover:border-slate-300 transition-colors shadow-sm hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row">
                                                {/* Left details */}
                                                <div className="flex-1 p-6 sm:p-8">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-xl font-bold text-slate-900">{b.service?.name}</h3>
                                                        <div className="sm:hidden">{statusBadge(b.status)}</div>
                                                    </div>
                                                    
                                                    <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-slate-400 mt-0.5">📅</span>
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Schedule</p>
                                                                <p className="text-sm font-medium text-slate-700">{b.date} • {b.time}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-slate-400 mt-0.5">📍</span>
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                                                                <p className="text-sm font-medium text-slate-700 line-clamp-2">{b.address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-slate-400 mt-0.5">👤</span>
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Professional</p>
                                                                <p className="text-sm font-medium text-slate-700">{b.provider?.name || 'Assigned soon'} {b.provider?.phone && <span className="text-slate-400 font-normal">({b.provider.phone})</span>}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {b.notes && (
                                                        <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Additional Notes</p>
                                                            <p className="text-sm text-slate-600 italic">{b.notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Actions Panel */}
                                                <div className="bg-slate-50/50 sm:w-64 border-t sm:border-t-0 sm:border-l border-slate-200/60 p-6 sm:p-8 flex flex-col justify-center gap-4">
                                                    <div className="hidden sm:block text-right mb-2">
                                                        {statusBadge(b.status)}
                                                    </div>
                                                    
                                                    {(b.status === 'Pending' || b.status === 'Approved') && (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
                                                            onClick={() => handleCancel(b._id)}
                                                        >
                                                            Cancel Booking
                                                        </Button>
                                                    )}
                                                    
                                                    {b.status === 'Completed' && !bookingReviews[b._id] && (
                                                        <Button
                                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
                                                            onClick={() => setReviewModalBooking(b)}
                                                        >
                                                            ⭐ Write a Review
                                                        </Button>
                                                    )}
                                                    
                                                    {b.status === 'Completed' && bookingReviews[b._id] && (
                                                        <div className="text-sm text-emerald-700 font-medium px-4 py-2.5 bg-emerald-50 border border-emerald-200/60 rounded-xl flex items-center justify-center gap-2">
                                                            <span>✓</span> Feedback left
                                                        </div>
                                                    )}

                                                    {b.status === 'Cancelled' && (
                                                        <div className="text-sm text-slate-500 text-center font-medium">
                                                            Service cancelled by user.
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
