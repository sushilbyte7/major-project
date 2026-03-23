import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-sm tracking-tighter group-hover:scale-105 transition-transform duration-300 shadow-md shadow-primary/20">
                        SE
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">
                        Serve<span className="text-orange-500">Ease</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Services
                    </Link>

                    {user ? (
                        <>
                            {isAdmin ? (
                                <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    Admin Panel
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    My Bookings
                                </Link>
                            )}
                            <div className="flex items-center gap-4 border-l pl-4 ml-2 border-border/40">
                                <span className="text-sm text-foreground/80 font-medium">Hi, {user.name.split(' ')[0]}</span>
                                <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                                <Link to="/register">Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
