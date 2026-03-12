import { useState, useEffect } from 'react';
import api from '../services/api';

const sentimentEmoji = {
    positive: '😊',
    negative: '😞',
    neutral: '😐'
};

const sentimentBadge = {
    positive: 'bg-green-100 text-green-700 border-green-200',
    negative: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200'
};

const ProviderReviews = ({ providerId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (providerId) {
            fetchReviews();
        }
    }, [providerId]);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/provider/${providerId}`);
            setReviews(data.reviews);
            setStats(data.stats);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-slate-400">Loading reviews...</div>;
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
                <p className="text-slate-400">No reviews yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Panel */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                    📊 Review Analytics (AI-Powered)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Reviews</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">⭐ {stats.averageRating}</p>
                        <p className="text-xs text-slate-500 mt-1">Avg Rating</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
                        <p className="text-xs text-slate-500 mt-1">😊 Positive</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
                        <p className="text-xs text-slate-500 mt-1">😞 Negative</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-slate-600">
                        <span className="font-semibold">AI Sentiment Score:</span> {stats.averageSentimentScore}
                        <span className="ml-2 text-slate-400">(Range: -1 to +1)</span>
                    </p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-semibold text-slate-800">{review.user?.name}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-lg">
                                            {i < review.rating ? '⭐' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-700 mb-3 leading-relaxed">{review.comment}</p>

                        {/* AI Sentiment Analysis Badge */}
                        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">🤖 AI Analysis:</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${sentimentBadge[review.sentiment]
                                        }`}
                                >
                                    {sentimentEmoji[review.sentiment]} {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400">
                                Score: {review.sentimentScore.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProviderReviews;
