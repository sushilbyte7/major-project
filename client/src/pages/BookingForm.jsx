import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const STEPS = ['Choose Provider', 'Pick Schedule', 'Address & Notes'];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookingForm = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState({ provider: '', date: '', time: '', address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(0);

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
            setLoading(false);
        }
    };

    const canNext = () => {
        if (step === 0) return !!form.provider;
        if (step === 1) return !!(form.date && form.time);
        return true;
    };

    const selectedProvider = providers.find(p => p._id === form.provider);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200/60">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Book Now</p>
                        <h1 className="text-4xl font-bold text-slate-900 mb-1">
                            {service?.name || 'Loading...'}
                        </h1>
                        {service && (
                            <p className="text-slate-500">
                                Starting at <span className="text-slate-900 font-bold text-lg">₹{service.price}</span>
                            </p>
                        )}
                    </motion.div>

                    {/* Step Progress */}
                    <div className="flex items-center gap-0 mt-8">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                        i < step ? 'bg-emerald-500 text-white' :
                                        i === step ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' :
                                        'bg-slate-200 text-slate-500'
                                    }`}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={`hidden sm:block text-sm font-semibold ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {s}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-3 transition-all duration-500 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 0 - Choose Provider */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Choose a Professional</h2>
                            {providers.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">No providers available for this service yet.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {providers.map((p) => (
                                        <button
                                            key={p._id}
                                            type="button"
                                            onClick={() => setForm({ ...form, provider: p._id })}
                                            className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                                                form.provider === p._id
                                                    ? 'border-orange-400 bg-orange-50/80 shadow-md shadow-orange-200/50'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                                                    {p.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.experience} yrs experience</p>
                                                </div>
                                                {form.provider === p._id && (
                                                    <div className="ml-auto w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-semibold text-amber-600">⭐ {p.rating?.toFixed(1) || 'New'}</span>
                                                {p.phone && <span className="text-xs text-slate-400">{p.phone}</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 1 - Schedule */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Pick Your Schedule</h2>
                            <Card className="border-slate-200/60 shadow-sm rounded-2xl">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700 mb-2 block">Preferred Date</Label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={form.date}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700 mb-3 block">Available Time Slots</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {TIME_SLOTS.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, time: t })}
                                                    className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                                                        form.time === t
                                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2 - Address */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Service Address</h2>
                            <Card className="border-slate-200/60 shadow-sm rounded-2xl mb-6">
                                <CardContent className="p-6 space-y-5">
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700 mb-2 block">Full Address <span className="text-orange-500">*</span></Label>
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            required
                                            rows={3}
                                            placeholder="House no., Street, Area, City, Pincode"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700 mb-2 block">Additional Notes <span className="text-slate-400 font-normal">(optional)</span></Label>
                                        <textarea
                                            name="notes"
                                            value={form.notes}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Any specific instructions for the professional..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50 resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary */}
                            <Card className="border-orange-200 bg-orange-50/50 rounded-2xl">
                                <CardContent className="p-5">
                                    <h3 className="font-bold text-slate-800 mb-3">Booking Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-semibold">{service?.name}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Professional</span><span className="font-semibold">{selectedProvider?.name || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Schedule</span><span className="font-semibold">{form.date} • {form.time}</span></div>
                                        <div className="flex justify-between pt-2 border-t border-orange-200/60"><span className="font-bold text-slate-700">Starting Price</span><span className="font-black text-orange-600 text-base">₹{service?.price}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                    {step > 0 ? (
                        <button
                            type="button"
                            onClick={() => setStep(s => s - 1)}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                            ← Back
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate('/services')}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    )}

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canNext()}
                            className="flex-1 btn-primary justify-center h-12 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            <span>Continue</span>
                            <span>→</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !form.address}
                            className="flex-1 btn-primary justify-center h-12 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Confirming...</span>
                                </>
                            ) : (
                                <><span>✓ Confirm Booking</span></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
