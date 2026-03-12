import { Link } from 'react-router-dom';

const categories = [
    { name: 'Electrical', icon: '⚡', color: '#fff7ed', cat: 'Electrical' },
    { name: 'Plumbing', icon: '🔧', color: '#eff6ff', cat: 'Plumbing' },
    { name: 'Cleaning & Pest Control', icon: '🧹', color: '#f0fdf4', cat: 'Cleaning' },
    { name: 'AC & Appliance Repair', icon: '❄️', color: '#eff6ff', cat: 'AC Repair' },
    { name: 'Painting', icon: '🎨', color: '#fdf4ff', cat: 'Painting' },
    { name: 'Carpentry', icon: '🪚', color: '#fff7ed', cat: 'Carpentry' },
];

const heroImages = [
    { src: '/hero1.png', alt: 'Electrical service' },
    { src: '/hero2.png', alt: 'Plumbing service' },
    { src: '/hero3.png', alt: 'Cleaning service' },
    { src: '/hero4.png', alt: 'AC repair service' },
];

const Home = () => {
    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>

            {/* ── HERO SECTION ── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px 60px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                alignItems: 'start',
            }}>
                {/* Left */}
                <div>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: 800,
                        color: '#111',
                        lineHeight: 1.2,
                        letterSpacing: '-1px',
                        marginBottom: '32px',
                    }}>
                        Home services at your<br />
                        <span style={{ color: '#f97316' }}>doorstep</span>
                    </h1>

                    {/* Category Box */}
                    <div style={{
                        border: '1px solid #eee',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    }}>
                        <p style={{ fontSize: '14px', color: '#888', fontWeight: 500, marginBottom: '16px' }}>
                            What are you looking for?
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                        }}>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    to={`/services?category=${encodeURIComponent(cat.cat)}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        background: cat.color,
                                        borderRadius: '12px',
                                        padding: '16px 12px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s, box-shadow 0.15s',
                                        border: '1px solid transparent',
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.15)';
                                            e.currentTarget.style.borderColor = '#fed7aa';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                                        <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#f97316', lineHeight: 1.3 }}>
                                            {cat.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Link to="/services" style={{
                                color: '#f97316', fontSize: '13px', fontWeight: 600,
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                                View all services →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right - Photo Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '10px',
                    height: '460px',
                }}>
                    {heroImages.map((img, i) => (
                        <div key={i} style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: '#f5f5f5',
                            gridRow: i === 0 ? 'span 2' : 'auto',
                        }}>
                            <img
                                src={img.src}
                                alt={img.alt}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHY US SECTION ── */}
            <section style={{ background: '#fafafa', padding: '60px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111', marginBottom: '8px', textAlign: 'center' }}>
                        Why choose <span style={{ color: '#f97316' }}>ServeEase?</span>
                    </h2>
                    <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '40px' }}>
                        Trusted by thousands of homes across the city
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {[
                            { icon: '✅', title: 'Verified Professionals', desc: 'Every provider is background-verified and trained' },
                            { icon: '🕐', title: 'On-Time Service', desc: 'We respect your time. Our pros arrive as scheduled.' },
                            { icon: '💯', title: '100% Satisfaction', desc: "Not happy? We'll make it right, no questions asked." },
                        ].map((item) => (
                            <div key={item.title} style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '28px 24px',
                                border: '1px solid #f0f0f0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '60px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111', marginBottom: '40px' }}>
                        How it works
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', position: 'relative' }}>
                        {[
                            { num: '1', title: 'Choose a service', desc: 'Browse and pick the service you need' },
                            { num: '2', title: 'Book a slot', desc: 'Pick a date, time, and verified provider' },
                            { num: '3', title: 'Relax at home', desc: 'Pro arrives and gets the job done' },
                        ].map((item) => (
                            <div key={item.num}>
                                <div style={{
                                    width: '52px', height: '52px',
                                    background: '#f97316', color: '#fff',
                                    borderRadius: '50%', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', fontWeight: 800,
                                    margin: '0 auto 16px',
                                }}>
                                    {item.num}
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/services" style={{
                        display: 'inline-block', marginTop: '40px',
                        background: '#f97316', color: '#fff',
                        textDecoration: 'none', fontWeight: 700,
                        padding: '14px 36px', borderRadius: '12px',
                        fontSize: '15px',
                    }}>
                        Book a Service Now
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
