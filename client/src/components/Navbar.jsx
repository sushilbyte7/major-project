import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: '#1a1a2e',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '-0.5px'
                    }}>SE</div>
                    <span style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a2e', letterSpacing: '-0.3px' }}>
                        Serve<span style={{ color: '#f97316' }}>Ease</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <Link to="/services" style={{ textDecoration: 'none', color: '#444', fontSize: '14px', fontWeight: 500 }}
                        onMouseEnter={e => e.target.style.color = '#f97316'}
                        onMouseLeave={e => e.target.style.color = '#444'}>
                        Services
                    </Link>

                    {user ? (
                        <>
                            {isAdmin ? (
                                <Link to="/admin" style={{ textDecoration: 'none', color: '#444', fontSize: '14px', fontWeight: 500 }}
                                    onMouseEnter={e => e.target.style.color = '#f97316'}
                                    onMouseLeave={e => e.target.style.color = '#444'}>
                                    Admin Panel
                                </Link>
                            ) : (
                                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#444', fontSize: '14px', fontWeight: 500 }}
                                    onMouseEnter={e => e.target.style.color = '#f97316'}
                                    onMouseLeave={e => e.target.style.color = '#444'}>
                                    My Bookings
                                </Link>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '13px', color: '#888' }}>Hi, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} style={{
                                    background: 'none', border: '1.5px solid #e5e5e5', color: '#555',
                                    padding: '6px 16px', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
                                }}
                                    onMouseEnter={e => { e.target.style.borderColor = '#f97316'; e.target.style.color = '#f97316'; }}
                                    onMouseLeave={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.color = '#555'; }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link to="/login" style={{
                                textDecoration: 'none', color: '#444', fontSize: '14px', fontWeight: 500,
                                padding: '6px 16px', borderRadius: '8px', border: '1.5px solid #e5e5e5'
                            }}>
                                Login
                            </Link>
                            <Link to="/register" style={{
                                textDecoration: 'none', background: '#f97316', color: '#fff',
                                fontSize: '14px', fontWeight: 600, padding: '7px 20px',
                                borderRadius: '8px', border: 'none'
                            }}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
