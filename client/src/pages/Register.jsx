import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fields = [
    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Chandan Kumar', required: true },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com', required: true },
    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true },
    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '9876543210', required: false },
    { label: 'Home Address', name: 'address', type: 'text', placeholder: 'Your home address', required: false },
];

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', form);
            login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Brand */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-5/12 bg-[#0f172a] flex-col justify-between p-14 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 mb-20">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/30">SE</div>
                        <span className="font-bold text-2xl">ServeEase</span>
                    </Link>
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Join 50,000+<br />happy customers.
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Create your free account and start booking trusted home service professionals immediately.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    {[
                        { icon: '🏠', text: 'Doorstep service delivery' },
                        { icon: '🔒', text: 'Background-verified professionals' },
                        { icon: '⚡', text: 'Instant booking confirmation' },
                    ].map(item => (
                        <div key={item.text} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3.5">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md py-4"
                >
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm">SE</div>
                        <span className="font-bold text-xl text-slate-900">Serve<span className="text-orange-500">Ease</span></span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Create your account</h1>
                        <p className="text-slate-500">Home services, simplified. Join ServeEase today.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5 font-medium"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((field) => (
                                <div key={field.name} className="space-y-1.5">
                                    <Label className="text-sm font-bold text-slate-700">
                                        {field.label} {field.required && <span className="text-orange-500">*</span>}
                                    </Label>
                                    <Input
                                        type={field.type}
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                                    />
                                </div>
                            ))}
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl">
                                    <span>{loading ? 'Creating account...' : 'Create Free Account'}</span>
                                    {loading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : <span>→</span>}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-500 font-bold hover:underline">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
