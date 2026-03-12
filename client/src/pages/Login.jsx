import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
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
            const { data } = await api.post('/auth/login', form);
            login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', border: '1.5px solid #e5e5e5', borderRadius: '10px',
        padding: '12px 14px', fontSize: '14px', outline: 'none',
        fontFamily: 'inherit', color: '#111', background: '#fafafa',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '40px', width: '100%', maxWidth: '420px' }}>

                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '48px', height: '48px', background: '#1a1a2e', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '16px', fontWeight: 800, margin: '0 auto 12px',
                    }}>SE</div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>Welcome back</h1>
                    <p style={{ fontSize: '13px', color: '#999' }}>Login to your ServeEase account</p>
                </div>

                {error && (
                    <div style={{ background: '#fff1f0', border: '1px solid #ffd6d6', color: '#c0392b', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} style={{
                        width: '100%', background: '#f97316', color: '#fff', border: 'none',
                        borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Logging in...' : 'Login →'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#999', marginTop: '20px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
