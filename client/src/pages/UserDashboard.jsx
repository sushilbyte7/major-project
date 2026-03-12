import { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const statusBadge = (status) => {
    const map = {
        Pending: 'badge-pending',
        Approved: 'badge-approved',
        Completed: 'badge-completed',
        Cancelled: 'badge-cancelled',
    };
    return <span className={map[status] || 'badge-pending'}>{status}</span>;
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

            // Check which bookings have reviews
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

    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
            <p className="text-slate-500 mb-8">Track all your service bookings here</p>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <p className="text-slate-400 text-lg mb-4">No bookings yet</p>
                    <a href="/services" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Browse Services
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-slate-800">{b.service?.name}</h3>
                                        {statusBadge(b.status)}
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1">🔧 Provider: {b.provider?.name} ({b.provider?.phone})</p>
                                    <p className="text-sm text-slate-600 mb-1">📅 {b.date} at {b.time}</p>
                                    <p className="text-sm text-slate-600 mb-1">📍 {b.address}</p>
                                    {b.notes && <p className="text-sm text-slate-500 italic mt-2">Note: {b.notes}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {(b.status === 'Pending' || b.status === 'Approved') && (
                                        <button
                                            onClick={() => handleCancel(b._id)}
                                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors whitespace-nowrap"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {b.status === 'Completed' && !bookingReviews[b._id] && (
                                        <button
                                            onClick={() => setReviewModalBooking(b)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
                                        >
                                            ⭐ Write Review
                                        </button>
                                    )}
                                    {b.status === 'Completed' && bookingReviews[b._id] && (
                                        <div className="text-sm text-green-600 font-medium px-4 py-2 bg-green-50 border border-green-200 rounded-lg whitespace-nowrap text-center">
                                            ✓ Reviewed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
