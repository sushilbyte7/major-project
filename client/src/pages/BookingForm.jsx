import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookingForm = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState({ provider: '', date: '', time: '', address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/services/${serviceId}`).then(({ data }) => setService(data));
        api.get(`/providers?service=${serviceId}`).then(({ data }) => setProviders(data));
    }, [serviceId]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/bookings', { service: serviceId, ...form });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Book a Service</h1>
                {service && (
                    <p className="text-blue-600 font-medium mb-6">
                        {service.name} — <span className="text-slate-600 font-normal">₹{service.price}</span>
                    </p>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Provider */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Provider</label>
                        <select
                            name="provider"
                            value={form.provider}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">-- Choose a provider --</option>
                            {providers.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} — ⭐ {p.rating} | {p.experience} yrs exp
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required className={inputClass}
                            min={new Date().toISOString().split('T')[0]} />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                        <select name="time" value={form.time} onChange={handleChange} required className={inputClass}>
                            <option value="">-- Select time --</option>
                            {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Address</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            rows={3}
                            className={inputClass}
                            placeholder="Enter your full address..."
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (optional)</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={2}
                            className={inputClass}
                            placeholder="Any specific instructions..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/services')}
                            className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
