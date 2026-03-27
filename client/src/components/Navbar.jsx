import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = user
        ? isAdmin
            ? [{ to: '/admin', label: 'Admin Panel' }, { to: '/services', label: 'Services' }]
            : [{ to: '/services', label: 'Services' }, { to: '/dashboard', label: 'My Bookings' }]
        : [{ to: '/services', label: 'Services' }];

    return (
        <motion.nav
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-900/5"
        >
            <div className="page-container">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                        <div className="w-9 h-9 bg-purple-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-700/30 group-hover:scale-105 transition-transform duration-200">
                            SE
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">
                            Serve<span className="text-purple-700">Ease</span>
                        </span>
                    </Link>

                    {/* Desktop links & Search */}
                    <div className="hidden md:flex flex-1 mx-8 items-center justify-between">
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        isActive(link.to)
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        
                        <div className="flex-1 max-w-lg hidden lg:flex ml-4">
                            <div className="flex items-center w-full bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 shadow-inner">
                                <div className="flex items-center gap-3 w-full">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                    <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 focus:outline-none" placeholder="Search for 'AC repair'" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/60">
                                    <div className="w-6 h-6 rounded-lg bg-purple-700 flex items-center justify-center text-white text-xs font-black">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                                >
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                                    <span>Get Started</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 flex flex-col gap-1.5">
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
                    >
                        <div className="p-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                                        isActive(link.to) ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-slate-100 mt-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white font-black text-sm">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                            Login
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary justify-center py-3 rounded-xl text-sm">
                                            <span>Get Started</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
