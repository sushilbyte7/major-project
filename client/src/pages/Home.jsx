import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-background font-body text-on-surface min-h-screen">
            <main className="pt-20 pb-32">
                {/* Hero Section */}
                <section className="page-container py-12 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-8">
                        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight">
                            Home services at <br /><span className="text-primary">your doorstep</span>
                        </h1>
                        {/* Service Selector Card */}
                        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/10">
                            <h2 className="font-headline text-xl font-bold mb-6">What are you looking for?</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <Link to="/services?category=Electrical" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">Electrical</span>
                                </Link>
                                <Link to="/services?category=Plumbing" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">plumbing</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">Plumbing</span>
                                </Link>
                                <Link to="/services?category=Cleaning" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">cleaning_services</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">Cleaning</span>
                                </Link>
                                <Link to="/services?category=AC Repair" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">ac_unit</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">AC Repair</span>
                                </Link>
                                <Link to="/services?category=Painting" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">imagesearch_roller</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">Painting</span>
                                </Link>
                                <Link to="/services?category=Carpentry" className="flex flex-col items-center text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                                        <span className="material-symbols-outlined text-primary text-3xl">handyman</span>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface-variant">Carpentry</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Asymmetric Masonry Grid */}
                    <div className="flex-1 min-w-[300px] h-[500px]">
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full hidden md:grid">
                            <img className="w-full h-full object-cover rounded-2xl row-span-2 shadow-sm" alt="professional house cleaner with high-end equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr8oHNEbUm4O-t9UIqDVw2ZyMR6sGnl6ybWdZywoTcHD-stEJc9cgQycb8mEdxa17YhcnifL6e4pYf6bbZyAngVIHB0tdb4mU9H06TK0aPRc6FQvG7n3KpB0moPes6oq95X45FO1vWV1gQavxlXda_b5HOHj5xNAaZvXCwdGavAtZE57LvyWIXHfOklUKAl7sC9buOfK-MWjpg4-dYQEuiQKMXaTIxkqaY9E10k4zo7OrOdgXfgifg7QJTB82M3O0qawu5WnkLve8x" />
                            <img className="w-full h-full object-cover rounded-2xl shadow-sm" alt="professional technician repairing ac" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAAGl2ylKrWlBfJskyoXmXT5Bgk6XVYIt0CMjeqgMSiB5InrLjzUDMK3ugiN04jR9qMYywIORZZze_HUEjtPm9T6sV6iHCvLYmprqkyM7a50hShyGdigW0EC4v6kOgJEIvutm9_IwQd57EXcB_BUNyUsuyx6_aqkhAKT6I60gcph-2fN2e5OW3TfVxYyFHw1I9nPPxgkR2sohbaUVsZGvW60YYF17vEflgus1UD3D48I4ddq9yxJxb71lvNXFNViHBT6641JT_tCH-" />
                            <img className="w-full h-full object-cover rounded-2xl shadow-sm" alt="professional hair stylist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgvVRe2QqTOILx83hIRkIXb8WYi4_mY_sB-yxjoxH4lDPfIteGY1KIjUqydKjZttspRbYkSuRtyg-ZUX3k9NEgr6rzr-mdee9ZoIaNBzl-jHsGouYgueMF2IxqlRVLYEFLY4LJJbCaQMZCBjZVcMX0m6WztQhT8z-p9Amz8lcDiCcMlhwGxcFwTJVTaELuSBtELG6yC0YtFSxcSqQFNu_12_PtJiI3dFLdypos_4LTFsJqJNwZ-yYi1Cpycbf3MPvwibcqdsBYqr0o" />
                        </div>
                    </div>
                </section>

                {/* Trust Badge */}
                <section className="bg-surface-container-low py-6 border-y border-outline-variant/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                            <span className="font-semibold text-sm">100% genuine products</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                            </div>
                            <span className="font-semibold text-sm">30 days warranty</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </div>
                            <span className="font-semibold text-sm">4.8+ Rated professionals</span>
                        </div>
                    </div>
                </section>

                {/* New and Noteworthy */}
                <section className="page-container mt-20">
                    <h3 className="font-headline text-3xl font-bold mb-8">New and Noteworthy</h3>
                    <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-6">
                        <div className="min-w-[280px] bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                            <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform" alt="close up portrait of a smiling man with a fresh professional haircut in a modern barbershop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzmw8YHTLeWMvlbjHdHYP969d1aXul7IA-0qPQWAIagpsb_DJ-P8c7Glj477Q97SrkUmCDuFnb11rkwWFHDpwqRKNFwYNhWIoXJEWlRSCzxGiAd5F7t9DOIXAzVmgmCmPrxhGoQAUkqcpxI1Aw_LGk9QuzB97LubL_H3-EuGWpY02Kbq5WL6sY_ntg5JZGST1Y6vIu8j5NBCXwWXZzFRhiiSLSdh4L_AvElyUbNbvPFRR5AcodJ3Ly_8fxZUIwl7jp1QvrVCicVz1A" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-1">Men's Grooming</h4>
                                <p className="text-sm text-on-surface-variant">Premium styling at home</p>
                            </div>
                        </div>
                        <div className="min-w-[280px] bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                            <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform" alt="aesthetic bathroom with natural light highlighting fresh white towels and minimalist cleaning supplies" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5usTnMAIt7e0m3LQbbKLXTwA0CgFw1M57dhx_0gq_MD_RNGEn2ttZub_QnLkQ0PFI1KLarBt4FMqEwAwSKVYg6ot9frmnsv6b2VA8QA-7he10LJixLjBMwFgU7jIPpSqbzfAQW-DMLAH-VRVtVRaBnXKDRTyexyUGNgi46pNFxLd3M9KmlXxTa1sd7zOcgvZriVTfI6a0cY7o1mgUQekE6XDmo6JPehtxpsKQVFcFKcyKfwuey_9QTeFTynqJM2wqouwkvSPzIQHK" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-1">Deep Cleaning</h4>
                                <p className="text-sm text-on-surface-variant">Sparkling results guaranteed</p>
                            </div>
                        </div>
                        <div className="min-w-[280px] bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                            <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform" alt="modern kitchen interior with luxury wooden cabinets and high-end marble countertops in natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrvCzw5lIt7Cof2UZkX5m-A0IapHgY3w_6zS9VETWB7u3HmpLZGXSFmgfXXYnWXe-LMGvuIcNZTtgNhRtxF8pHg4QIe2EgOGUdm2U2cRrh78DCdfHJvuXYAr3kS_gY2vJRaPuBQxdH_r5-aEQcMYrJU05n63abNi_fA6fGZ1tinN_9r9YrkXQl8oPArBzHrNQOAz83Yme4hw8ju_49-REQ6L3wnCstOL-Ret9lNgDUVUK-YK7XX4uejzl0v7fHKwzN6XiI01PQempg" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-1">Kitchen Renovation</h4>
                                <p className="text-sm text-on-surface-variant">Expert plumbing & electrical</p>
                            </div>
                        </div>
                        <div className="min-w-[280px] bg-white rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                            <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform" alt="professional makeup artist set with brushes and high-end cosmetic products in organized fashion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2jIvrap_Mc2xYSSBxV2X9wrIB5wYqDY2-kdzv5m6_Rcuwgl5fjvqASZc7XMhdPatwfSRxmOFvxzHqZvqOEtkRsKIE3KdlkezKCfZwvyFEIJfmmdpTr3iECeqTRCKKru8KfvnwI6GbolqTSPApjqbYB7Bk4i99Q8hxp_nxWf0nkM-5B-4eH9BS3WccMvc3BxiceYArPG_NmVxrs32qh9tY8WKzyimfDWYoqhZAuXUOnWXMpXdspirCw_Y1KzgQI0CBNYb4imRdPNG4" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-1">Bridal Makeup</h4>
                                <p className="text-sm text-on-surface-variant">Get ready for your big day</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Most Booked Services */}
                <section className="page-container mt-16 mb-8">
                    <h3 className="font-headline text-3xl font-bold mb-8">Most Booked Services</h3>
                    <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-6 px-2">
                        <Link to="/services?category=AC Repair" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="professional technician repairing an air conditioner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Wtw-wrPw9SZ_rENHAMD74pxa-qNrYZw6TTWH53J0Vz6iBqYmkpfdvSD7WPqMQdiyFSR45NmtrRtIFJ3bCCf8w0Gpx34wUzh64KFC1nu07yW5RU6crFKdecOxtCIxnBH9ylrcdKZGmYK1_IL3k9jJUBLux1JmEALEwHOUSPdbh7LPE9kvEjItSyGVP4trBQIMSGR98Vj1CWgy_1iqp0qxiHhanhPfkUWo4H_2-UaLX4FZX72CcLoKMnBo-wp3nM3EA24vL_RXPfMW" />
                            </div>
                            <span className="font-bold text-center">AC Repair</span>
                            <span className="text-xs text-on-surface-variant">4.8 ★ Top Rated</span>
                        </Link>
                        <Link to="/services?category=Cleaning" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="professional cleaner scrubbing a tiled kitchen floor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWdiXkRCh2Wxf7try-1V15p_E71SeDXhgghzwJqYyrcdONIGkHNJ7uS7od6gyiqwGfmk1QgjTiyF1h1ax3Y4DqvVjBU1pOMDCoFtizo_T9OAUWYl8azR9pDXbAGChUCRKxgV9Uq3GMGKgrTA3G2TbHTqLMUGGzBzhoqsfD9nPBGkZXf9l20bCrGLy2OHV6fqvgTEe0oYz2oWid26jX8VC6MbHKIwnQCLIwE5mBEr0pxNEOLMun5pI81slohw1RsDa3sjYokv9oz0CR" />
                            </div>
                            <span className="font-bold text-center">Cleaning</span>
                            <span className="text-xs text-on-surface-variant">4.7 ★ Top Rated</span>
                        </Link>
                        <Link to="/services?category=Plumbing" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="plumber repairing a leaking faucet in a modern bathroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-7e2zbonGeDFm-gSJybXKNs0DR0DNmu5bdzqJ1BFZGc5GRAETe0rEmEcmmj9jLyad1f1X3lDZaO9Tiz-EpQ69VpPJQmrDfipHweydtEE08jw4_3aEkeo1tad0iNJxCaWTkY_sGWzMtanXVIbRHaBRhvbuyl9Zpm8bSWHujayERK8juIovRJwP8KvMbktwmh2huxtra0na_N1hVkxcgxzl1km3YtQiKdT5iKnkozLE0koOHO7MEZSxCIdqUaKPIhN8bfD1ShZbXI4O" />
                            </div>
                            <span className="font-bold text-center">Plumbing</span>
                            <span className="text-xs text-on-surface-variant">4.8 ★ Top Rated</span>
                        </Link>
                        <Link to="/services?category=Electrical" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="professional electrician repairing switchboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr8oHNEbUm4O-t9UIqDVw2ZyMR6sGnl6ybWdZywoTcHD-stEJc9cgQycb8mEdxa17YhcnifL6e4pYf6bbZyAngVIHB0tdb4mU9H06TK0aPRc6FQvG7n3KpB0moPes6oq95X45FO1vWV1gQavxlXda_b5HOHj5xNAaZvXCwdGavAtZE57LvyWIXHfOklUKAl7sC9buOfK-MWjpg4-dYQEuiQKMXaTIxkqaY9E10k4zo7OrOdgXfgifg7QJTB82M3O0qawu5WnkLve8x" />
                            </div>
                            <span className="font-bold text-center">Electrical</span>
                            <span className="text-xs text-on-surface-variant">4.9 ★ Top Rated</span>
                        </Link>
                        <Link to="/services?category=Painting" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="professional painter painting a wall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrvCzw5lIt7Cof2UZkX5m-A0IapHgY3w_6zS9VETWB7u3HmpLZGXSFmgfXXYnWXe-LMGvuIcNZTtgNhRtxF8pHg4QIe2EgOGUdm2U2cRrh78DCdfHJvuXYAr3kS_gY2vJRaPuBQxdH_r5-aEQcMYrJU05n63abNi_fA6fGZ1tinN_9r9YrkXQl8oPArBzHrNQOAz83Yme4hw8ju_49-REQ6L3wnCstOL-Ret9lNgDUVUK-YK7XX4uejzl0v7fHKwzN6XiI01PQempg" />
                            </div>
                            <span className="font-bold text-center">Painting</span>
                            <span className="text-xs text-on-surface-variant">4.7 ★ Top Rated</span>
                        </Link>
                        <Link to="/services?category=Carpentry" className="min-w-[140px] lg:min-w-[180px] flex flex-col items-center group cursor-pointer shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-surface-container-high rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-primary transition-all shadow-md">
                                <img className="w-full h-full object-cover" alt="carpenter working on wooden furniture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2jIvrap_Mc2xYSSBxV2X9wrIB5wYqDY2-kdzv5m6_Rcuwgl5fjvqASZc7XMhdPatwfSRxmOFvxzHqZvqOEtkRsKIE3KdlkezKCfZwvyFEIJfmmdpTr3iECeqTRCKKru8KfvnwI6GbolqTSPApjqbYB7Bk4i99Q8hxp_nxWf0nkM-5B-4eH9BS3WccMvc3BxiceYArPG_NmVxrs32qh9tY8WKzyimfDWYoqhZAuXUOnWXMpXdspirCw_Y1KzgQI0CBNYb4imRdPNG4" />
                            </div>
                            <span className="font-bold text-center">Carpentry</span>
                            <span className="text-xs text-on-surface-variant">4.6 ★ Top Rated</span>
                        </Link>
                    </div>
                </section>

                {/* Electrical & Plumbing / Cleaning & Painting Grids */}
                <section className="page-container mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="font-headline text-2xl font-bold mb-8">Electrical & Plumbing</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <Link to="/services?category=Electrical" className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="professional electrician repairing switchboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr8oHNEbUm4O-t9UIqDVw2ZyMR6sGnl6ybWdZywoTcHD-stEJc9cgQycb8mEdxa17YhcnifL6e4pYf6bbZyAngVIHB0tdb4mU9H06TK0aPRc6FQvG7n3KpB0moPes6oq95X45FO1vWV1gQavxlXda_b5HOHj5xNAaZvXCwdGavAtZE57LvyWIXHfOklUKAl7sC9buOfK-MWjpg4-dYQEuiQKMXaTIxkqaY9E10k4zo7OrOdgXfgifg7QJTB82M3O0qawu5WnkLve8x" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-bold">Electrical Repairs</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Plumbing" className="col-span-2 relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="plumber repairing a leaking faucet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-7e2zbonGeDFm-gSJybXKNs0DR0DNmu5bdzqJ1BFZGc5GRAETe0rEmEcmmj9jLyad1f1X3lDZaO9Tiz-EpQ69VpPJQmrDfipHweydtEE08jw4_3aEkeo1tad0iNJxCaWTkY_sGWzMtanXVIbRHaBRhvbuyl9Zpm8bSWHujayERK8juIovRJwP8KvMbktwmh2huxtra0na_N1hVkxcgxzl1km3YtQiKdT5iKnkozLE0koOHO7MEZSxCIdqUaKPIhN8bfD1ShZbXI4O" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Plumbing Services</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Electrical" className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="electrician installing light fixtures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAAGl2ylKrWlBfJskyoXmXT5Bgk6XVYIt0CMjeqgMSiB5InrLjzUDMK3ugiN04jR9qMYywIORZZze_HUEjtPm9T6sV6iHCvLYmprqkyM7a50hShyGdigW0EC4v6kOgJEIvutm9_IwQd57EXcB_BUNyUsuyx6_aqkhAKT6I60gcph-2fN2e5OW3TfVxYyFHw1I9nPPxgkR2sohbaUVsZGvW60YYF17vEflgus1UD3D48I4ddq9yxJxb71lvNXFNViHBT6641JT_tCH-" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Fan & Geyser</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Plumbing" className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="professional water tank cleaning service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7CTqqzXQKR2qZ2igS0WY6gzAklHIi3IprXdcx_KdwQIhT-LHnh_NTGvXStgZiUJxEtoaGzYTTOOCNWJA8gG4Si9_2Y5Sa0wI3laFJ8Rlr1V5V6OmYw6Cu_dYsS5yoUHv968X8J82YlPC8DxozvE_g1lqfjXu26LFDBH7vlpDBQvkc3rVCI1xHGrzU4DprjvOUEtYICgdFu1Ael01jMWe5iyA63WqClOcOOOpJnuX7XesrE0ysaNumx_0WmVaeXVJakrq0F1BSuznT" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Tank Cleaning</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-2xl font-bold mb-8">Cleaning & Painting</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <Link to="/services?category=Cleaning" className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="professional home deep cleaning service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAShz3K9-ZUWHYy6KPRXzpMCKzrbEi0AGzUXbUUYGSs9FN4GlbsKq8UtxRjeOM-jrCvgW8Mff0Ji4XKbmRzYN43yOI79BNn1F4lfxrFPS-TsrzV5WPsVS9eqQX8iJG4KtxdonfDH-NqwZSOMQirDqAtxTyWsxZBjjBM7PPLu6-VhzzpOXrtEgvDVDtKiPhrRLEtENXA8IwlWKQjl8kJX8E2xZKJQ4whvkvOE5JhPgnoxIAvZkx3qd6EZZnI52rhvLdlBtr36xIxGM_P" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-bold">Full Home Cleaning</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Cleaning" className="col-span-2 relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="bathroom sanitisation service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7CTqqzXQKR2qZ2igS0WY6gzAklHIi3IprXdcx_KdwQIhT-LHnh_NTGvXStgZiUJxEtoaGzYTTOOCNWJA8gG4Si9_2Y5Sa0wI3laFJ8Rlr1V5V6OmYw6Cu_dYsS5yoUHv968X8J82YlPC8DxozvE_g1lqfjXu26LFDBH7vlpDBQvkc3rVCI1xHGrzU4DprjvOUEtYICgdFu1Ael01jMWe5iyA63WqClOcOOOpJnuX7XesrE0ysaNumx_0WmVaeXVJakrq0F1BSuznT" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Bathroom Sanitisation</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Painting" className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="interior wall painting professional service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrvCzw5lIt7Cof2UZkX5m-A0IapHgY3w_6zS9VETWB7u3HmpLZGXSFmgfXXYnWXe-LMGvuIcNZTtgNhRtxF8pHg4QIe2EgOGUdm2U2cRrh78DCdfHJvuXYAr3kS_gY2vJRaPuBQxdH_r5-aEQcMYrJU05n63abNi_fA6fGZ1tinN_9r9YrkXQl8oPArBzHrNQOAz83Yme4hw8ju_49-REQ6L3wnCstOL-Ret9lNgDUVUK-YK7XX4uejzl0v7fHKwzN6XiI01PQempg" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Wall Painting</span>
                                </div>
                            </Link>
                            <Link to="/services?category=Carpentry" className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                                <img className="w-full h-full object-cover" alt="carpentry furniture assembly service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAL8b47Uc5Dd2_UCU85wHSusmdZTBFNWsEGG-5gXdlnwphwHadm_leKYCaM6PuJqg23fI3iCevex6MqrhivAyT0t3aSlGxi88SVEMbrfjSUpEiQneE8G8EiOSCc2nMy8bXDqircl_1iuywbhdfjOyHv3S92Jdx3Uz3Vn2fwLhLCHQbPXgUIwqPCU2KJiSMW7gpRHoQV_JM9m-9xezXxwhw5O9v-y5u_TGMus41yMWWOr5561cjuCCZo8m66g7mCa8Ni1ah2CEe-VQN" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-2 text-center">
                                    <span className="text-white font-bold text-sm">Carpentry</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#f5f5f5] w-full mt-20 border-t border-slate-200">
                {/* Main Footer Grid */}
                <div className="page-container py-12">
                    {/* Logo */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">SE</div>
                            <span className="font-bold text-lg text-slate-900 leading-tight">Serve<br/>Ease</span>
                        </div>
                    </div>

                    {/* 4 Column Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        {/* Company */}
                        <div>
                            <h5 className="font-semibold text-slate-900 text-sm mb-4">Company</h5>
                            <nav className="flex flex-col gap-2.5">
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/about">About us</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/investor">Investor Relations</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/terms">Terms &amp; conditions</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/privacy">Privacy policy</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/anti-discrimination">Anti-discrimination policy</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/careers">Careers</Link>
                            </nav>
                        </div>

                        {/* For customers */}
                        <div>
                            <h5 className="font-semibold text-slate-900 text-sm mb-4">For customers</h5>
                            <nav className="flex flex-col gap-2.5">
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/reviews">ServeEase reviews</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/services">Categories near you</Link>
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/contact">Contact us</Link>
                            </nav>
                        </div>

                        {/* For professionals */}
                        <div>
                            <h5 className="font-semibold text-slate-900 text-sm mb-4">For professionals</h5>
                            <nav className="flex flex-col gap-2.5">
                                <Link className="text-sm text-slate-500 hover:text-slate-900 transition-colors" to="/register">Register as a professional</Link>
                            </nav>
                        </div>

                        {/* Social links + App badges */}
                        <div>
                            <h5 className="font-semibold text-slate-900 text-sm mb-4">Social links</h5>
                            <div className="flex gap-3 mb-6">
                                {/* Twitter/X */}
                                <a href="#" className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                                {/* Pinterest */}
                                <a href="#" className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                                </a>
                                {/* LinkedIn */}
                                <a href="#" className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                            </div>

                            {/* App Store Badges */}
                            <div className="flex flex-col gap-2">
                                <a href="#" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-fit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                                    <div className="text-left">
                                        <p className="text-[9px] leading-none opacity-70">Download on the</p>
                                        <p className="text-sm font-semibold leading-tight">App Store</p>
                                    </div>
                                </a>
                                <a href="#" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors w-fit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.99.2l12.43-7.16-2.69-2.7-10.73 9.66zM.46 1.27C.17 1.59 0 2.07 0 2.7v18.6c0 .63.17 1.11.46 1.43l.08.07 10.42-10.42v-.23L.54 1.2l-.08.07zM20.1 10.67l-2.97-1.71-3 2.99 3 2.99 2.98-1.72c.85-.49.85-1.28-.01-1.55zM3.18.24l12.43 7.17-2.69 2.69L2.19.44c.3-.22.66-.28.99-.2z"/></svg>
                                    <div className="text-left">
                                        <p className="text-[9px] leading-none opacity-70">GET IT ON</p>
                                        <p className="text-sm font-semibold leading-tight">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-300 pt-6">
                        <p className="text-xs text-slate-400">ᵃ As on March 28, 2026</p>
                        <p className="text-xs text-slate-400 mt-1">
                            © Copyright 2026 ServeEase Technologies India Limited. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
