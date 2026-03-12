import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProviderReviews from '../components/ProviderReviews';

const ProviderDetail = () => {
    const { providerId } = useParams();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProvider();
    }, [providerId]);

    const fetchProvider = async () => {
        try {
            const { data } = await api.get(`/providers/${providerId}`);
            setProvider(data);
        } catch (err) {
            console.error('Error fetching provider:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-slate-400">Loading...</div>;
    }

    if (!provider) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-400">
                Provider not found
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Provider Info */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            {provider.name}
                        </h1>
                        <p className="text-slate-600 mb-4">{provider.service?.name}</p>
                        <div className="flex gap-4 text-sm text-slate-600">
                            <div>📧 {provider.email}</div>
                            <div>📱 {provider.phone}</div>
                            <div>💼 {provider.experience} years experience</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-orange-500">
                                {provider.rating.toFixed(1)}
                            </span>
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${provider.isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {provider.isAvailable ? '✓ Available' : '✗ Unavailable'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ProviderReviews providerId={providerId} />
        </div>
    );
};

export default ProviderDetail;
