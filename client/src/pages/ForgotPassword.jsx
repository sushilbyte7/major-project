import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../services/api';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const ForgotPassword = () => {
    const navigate = useNavigate();

    // step: 1=email, 2=otp, 3=new password, 4=success
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = useRef([]);

    // Countdown timer
    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(s => s - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    // ── Step 1: Send OTP ──
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
            setResendTimer(60);
            setTimeout(() => otpRefs.current[0]?.focus(), 300);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── OTP input helpers ──
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            setOtp(paste.split(''));
            otpRefs.current[5]?.focus();
        }
        e.preventDefault();
    };

    // ── Step 2: Verify OTP ──
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-reset-otp', { email, otp: otpString });
            setResetToken(data.resetToken);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ──
    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 3: Reset Password ──
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { resetToken, newPassword });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please start again.');
        } finally {
            setLoading(false);
        }
    };

    const maskEmail = (em) => {
        const [user, domain] = em.split('@');
        return `${user.slice(0, 3)}${'*'.repeat(Math.max(user.length - 3, 2))}@${domain}`;
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Brand Panel */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 flex-col justify-between p-14 text-white relative overflow-hidden"
            >
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute bottom-16 -right-16 w-48 h-48 rounded-full bg-white/8" />
                <div className="absolute bottom-32 right-8 w-24 h-24 rounded-full bg-white/10" />

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 mb-20">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-sm backdrop-blur-sm">SE</div>
                        <span className="font-bold text-2xl">ServeEase</span>
                    </Link>
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Forgot your<br />password?
                    </h2>
                    <p className="text-white/75 text-base leading-relaxed">
                        No worries! We'll send a one-time password to your registered email so you can reset it securely.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    {[
                        { icon: '📧', text: 'OTP sent to your email' },
                        { icon: '⏱', text: 'Valid for 5 minutes only' },
                        { icon: '🔒', text: 'Secured with JWT token' },
                    ].map(item => (
                        <div key={item.text} className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3.5">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-white/80 text-sm font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right — Steps */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">SE</div>
                        <span className="font-bold text-xl text-slate-900">Serve<span className="text-indigo-600">Ease</span></span>
                    </Link>

                    <AnimatePresence mode="wait">

                        {/* ─── STEP 1: Email ─── */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                                <div className="mb-8">
                                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-5">🔑</div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Forgot Password?</h1>
                                    <p className="text-slate-500">Enter your email and we'll send you a reset OTP.</p>
                                </div>

                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5 font-medium">
                                            ⚠️ {error}
                                        </motion.div>
                                    )}
                                    <form onSubmit={handleSendOTP} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Registered Email</Label>
                                            <Input
                                                id="email" type="email" required
                                                value={email} onChange={e => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base"
                                            />
                                        </div>
                                        <button type="submit" disabled={loading}
                                            className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                            <span>{loading ? 'Sending OTP...' : 'Send Reset OTP'}</span>
                                            {loading
                                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : <span>→</span>}
                                        </button>
                                    </form>
                                </div>

                                <p className="text-center text-sm text-slate-500 mt-6">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
                                </p>
                            </motion.div>
                        )}

                        {/* ─── STEP 2: OTP ─── */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                                <div className="mb-8">
                                    <button onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '', '', '']); }}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors">
                                        ← Back
                                    </button>
                                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-5">📧</div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Check your email</h1>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        We sent a 6-digit OTP to<br />
                                        <strong className="text-slate-700">{maskEmail(email)}</strong>
                                    </p>
                                </div>

                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5 font-medium">
                                            ⚠️ {error}
                                        </motion.div>
                                    )}
                                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                                        <div>
                                            <Label className="text-sm font-bold text-slate-700 mb-4 block">Enter OTP</Label>
                                            <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                                                {otp.map((digit, i) => (
                                                    <input
                                                        key={i}
                                                        ref={el => otpRefs.current[i] = el}
                                                        type="text" inputMode="numeric" maxLength={1}
                                                        value={digit}
                                                        onChange={e => handleOtpChange(i, e.target.value)}
                                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                                        className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all bg-slate-50 text-slate-900
                                                            ${digit ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200'}
                                                            focus:border-indigo-500 focus:bg-indigo-50/50`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" disabled={loading || otp.join('').length !== 6}
                                            className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                            <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                                            {loading
                                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : <span>→</span>}
                                        </button>
                                    </form>

                                    <div className="mt-5 text-center">
                                        <p className="text-sm text-slate-500">
                                            Didn't receive it?{' '}
                                            {resendTimer > 0
                                                ? <span className="text-slate-400 font-medium">Resend in {resendTimer}s</span>
                                                : <button onClick={handleResend} disabled={loading}
                                                    className="text-indigo-600 font-bold hover:underline">Resend OTP</button>}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-6">🔒 OTP is valid for 5 minutes only</p>
                            </motion.div>
                        )}

                        {/* ─── STEP 3: New Password ─── */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                                <div className="mb-8">
                                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-5">🔐</div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Set new password</h1>
                                    <p className="text-slate-500">Choose a strong password for your account.</p>
                                </div>

                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5 font-medium">
                                            ⚠️ {error}
                                        </motion.div>
                                    )}
                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        {/* New Password */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="newPassword" className="text-sm font-bold text-slate-700">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNew ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    required placeholder="Min. 6 characters"
                                                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base pr-12"
                                                />
                                                <button type="button" onClick={() => setShowNew(v => !v)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors"
                                                    aria-label={showNew ? 'Hide password' : 'Show password'}>
                                                    {showNew ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Confirm Password */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="confirmPassword" className="text-sm font-bold text-slate-700">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    required placeholder="Re-enter password"
                                                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base pr-12"
                                                />
                                                <button type="button" onClick={() => setShowConfirm(v => !v)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors"
                                                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1">⚠️ Passwords do not match</p>
                                            )}
                                        </div>

                                        <div className="pt-1">
                                            <button type="submit" disabled={loading}
                                                className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl"
                                                style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                                                <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                                                {loading
                                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    : <span>→</span>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STEP 4: Success ─── */}
                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
                                    >
                                        ✅
                                    </motion.div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset Successfully!</h1>
                                    <p className="text-slate-500 text-sm mb-8">
                                        Your password has been updated. You can now log in with your new password.
                                    </p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn-primary w-full justify-center py-3.5 text-base rounded-2xl"
                                    >
                                        <span>Go to Login</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
