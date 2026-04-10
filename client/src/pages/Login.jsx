import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
            {/* Left — Brand Panel */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 flex-col justify-between p-14 text-white relative overflow-hidden"
            >
                {/* Decorative rings */}
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute bottom-16 -right-16 w-48 h-48 rounded-full bg-white/8" />
                <div className="absolute bottom-32 right-8 w-24 h-24 rounded-full bg-white/10" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-20">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-sm backdrop-blur-sm">SE</div>
                        <span className="font-bold text-2xl">ServeEase</span>
                    </div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Professional services<br />at your doorstep.
                    </h2>
                    <p className="text-white/75 text-base leading-relaxed">
                        Book trusted professionals for cleaning, repairs, maintenance, and more — instantly.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-3">
                    {[{ icon: '⭐', label: '4.8 Rating' }, { icon: '🛠️', label: '50+ Services' }, { icon: '✅', label: 'Verified Pros' }].map(item => (
                        <div key={item.label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                            <div className="text-2xl mb-1.5">{item.icon}</div>
                            <p className="text-xs font-bold text-white/80">{item.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/25">SE</div>
                        <span className="font-bold text-xl text-slate-900">Serve<span className="text-orange-500">Ease</span></span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
                        <p className="text-slate-500">Sign in to manage your bookings</p>
                    </div>

                    {/* Card */}
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

                        <form onSubmit={handleSubmit} method="post" className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email address</Label>
                                <Input
                                    id="email" type="email" name="email"
                                    value={form.email} onChange={handleChange}
                                    required placeholder="you@example.com"
                                    autoComplete="username email"
                                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-bold text-slate-700">Password</Label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-orange-500 hover:underline">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password" type={showPassword ? 'text' : 'password'} name="password"
                                        value={form.password} onChange={handleChange}
                                        required placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl">
                                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                                    {loading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : <span>→</span>}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        New to ServeEase?{' '}
                        <Link to="/register" className="text-orange-500 font-bold hover:underline">Create a free account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
