/**
 * ServeEase – Services & Providers Seeder
 * Run: node seed-services.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/serveease';

// ── Schemas (minimal, same as models) ──────────────────────────────────────
const serviceSchema = new mongoose.Schema({ name: String, description: String, category: String, price: Number, image: String, isActive: { type: Boolean, default: true } }, { timestamps: true });
const providerSchema = new mongoose.Schema({ name: String, email: String, phone: String, service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, experience: Number, rating: Number, isAvailable: { type: Boolean, default: true } }, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);

// ── Seed Data ───────────────────────────────────────────────────────────────
const services = [
    // Electrical (10)
    { name: 'Switchboard Repair', description: 'Fix faulty switchboards, loose sockets and broken switches', category: 'Electrical', price: 299 },
    { name: 'Wiring & Rewiring', description: 'Complete home wiring and rewiring for safety and compliance', category: 'Electrical', price: 999 },
    { name: 'Fan Installation', description: 'Ceiling, exhaust & table fan installation and servicing', category: 'Electrical', price: 199 },
    { name: 'Inverter & Battery Setup', description: 'Install and configure home inverters and UPS batteries', category: 'Electrical', price: 499 },
    { name: 'MCB & Fuse Replacement', description: 'Replace tripped MCBs, fuses, and circuit breakers', category: 'Electrical', price: 249 },
    { name: 'Light Fixture Installation', description: 'Install chandeliers, downlights, LEDs and decorative lights', category: 'Electrical', price: 199 },
    { name: 'Geyser Installation', description: 'Install and inspect electric water heaters and geysers', category: 'Electrical', price: 399 },
    { name: 'Earthing & Grounding', description: 'Proper earthing setup to prevent electrical hazards', category: 'Electrical', price: 799 },
    { name: 'Power Outlet Extension', description: 'Add new electrical points and extension boards', category: 'Electrical', price: 349 },
    { name: 'Short Circuit Detection', description: 'Diagnose and fix electrical short circuits and faults', category: 'Electrical', price: 599 },

    // Plumbing (10)
    { name: 'Tap & Faucet Repair', description: 'Fix leaking taps, broken handles and dripping faucets', category: 'Plumbing', price: 199 },
    { name: 'Pipe Leak Repair', description: 'Detect and seal leaking water pipes in walls and floors', category: 'Plumbing', price: 499 },
    { name: 'Bathroom Fixture Fitting', description: 'Install showers, flush tanks, basins and commodes', category: 'Plumbing', price: 699 },
    { name: 'Water Tank Cleaning', description: 'Professional overhead and underground tank disinfection', category: 'Plumbing', price: 899 },
    { name: 'Drain Unclogging', description: 'Clear blocked kitchen sinks, bathroom drains and pipes', category: 'Plumbing', price: 349 },
    { name: 'Water Motor Repair', description: 'Repair and servicing of submersible and monoblock pumps', category: 'Plumbing', price: 599 },
    { name: 'Flush Tank Repair', description: 'Fix running, leaking or broken flush tanks', category: 'Plumbing', price: 249 },
    { name: 'Kitchen Sink Installation', description: 'Fit and plumb new kitchen sinks and drain systems', category: 'Plumbing', price: 599 },
    { name: 'Water Purifier Installation', description: 'Install RO water purifiers and check water quality', category: 'Plumbing', price: 399 },
    { name: 'Sewer Line Cleaning', description: 'Jet cleaning of sewer and drainage lines', category: 'Plumbing', price: 1199 },

    // Cleaning (10)
    { name: 'Full Home Deep Clean', description: 'Comprehensive top-to-bottom cleaning of your entire home', category: 'Cleaning', price: 1499 },
    { name: 'Kitchen Deep Clean', description: 'Degrease and sanitise kitchen surfaces, tiles and appliances', category: 'Cleaning', price: 799 },
    { name: 'Bathroom Sanitisation', description: 'Deep scrub and disinfect bathroom floors, tiles and fixtures', category: 'Cleaning', price: 499 },
    { name: 'Sofa & Upholstery Clean', description: 'Steam and shampoo cleaning for sofas, mattresses and chairs', category: 'Cleaning', price: 999 },
    { name: 'Carpet & Rug Cleaning', description: 'Professional cleaning of carpets and heavy rugs', category: 'Cleaning', price: 799 },
    { name: 'Pest Control – Cockroach', description: 'Gel-based treatment to eliminate cockroaches safely', category: 'Cleaning', price: 599 },
    { name: 'Pest Control – Termite', description: 'Preventive and curative termite treatment for all surfaces', category: 'Cleaning', price: 1299 },
    { name: 'Bed Bug Treatment', description: 'Chemical-free heat treatment for complete bed bug removal', category: 'Cleaning', price: 999 },
    { name: 'Post-Construction Cleanup', description: 'Remove dust, debris and residue after renovation work', category: 'Cleaning', price: 1999 },
    { name: 'Glass & Window Cleaning', description: 'Streak-free cleaning of windows, glass doors and grills', category: 'Cleaning', price: 399 },

    // AC Repair (10)
    { name: 'AC Gas Refilling', description: 'Refill refrigerant gas for optimal AC cooling performance', category: 'AC Repair', price: 899 },
    { name: 'AC Service & Tune-up', description: 'Full servicing including filter clean, coil wash and check', category: 'AC Repair', price: 599 },
    { name: 'AC Installation', description: 'Install split or window AC with proper mounting and wiring', category: 'AC Repair', price: 1299 },
    { name: 'AC PCB Repair', description: 'Diagnose and repair AC printed circuit board faults', category: 'AC Repair', price: 1499 },
    { name: 'AC Compressor Check', description: 'Inspect and service AC compressor for cooling issues', category: 'AC Repair', price: 799 },
    { name: 'AC Uninstallation', description: 'Safe removal and packing of split/window AC units', category: 'AC Repair', price: 499 },
    { name: 'AC Water Leakage Fix', description: 'Fix drainage issues causing water dripping from AC', category: 'AC Repair', price: 399 },
    { name: 'AC Remote Sensor Repair', description: 'Repair faulty remote sensors and IR receivers', category: 'AC Repair', price: 299 },
    { name: 'Refrigerator Repair', description: 'Fix cooling, compressor and thermostat issues in fridges', category: 'AC Repair', price: 699 },
    { name: 'Washing Machine Repair', description: 'Repair drum, motor and electronic faults in washing machines', category: 'AC Repair', price: 799 },

    // Painting (10)
    { name: 'Interior Wall Painting', description: 'Premium quality interior painting with putty and primer', category: 'Painting', price: 1999 },
    { name: 'Exterior Wall Painting', description: 'Weather-resistant exterior painting for all home types', category: 'Painting', price: 2999 },
    { name: 'Texture Painting', description: 'Designer texture and pattern painting for accent walls', category: 'Painting', price: 2499 },
    { name: 'Wood Polish & Paint', description: 'Sand, polish and paint furniture, doors and wood fixtures', category: 'Painting', price: 1499 },
    { name: 'Waterproofing', description: 'Terrace and bathroom waterproofing to prevent seepage', category: 'Painting', price: 3499 },
    { name: 'Wall Putty Application', description: 'Smooth wall surface with putty before painting', category: 'Painting', price: 999 },
    { name: 'Gate & Grill Painting', description: 'Rust-proof paint for iron gates, grills and railings', category: 'Painting', price: 799 },
    { name: 'Ceiling Painting', description: 'Professional ceiling painting with white or designer finish', category: 'Painting', price: 1299 },
    { name: 'Terrace Painting', description: 'Heat-reflective and waterproof terrace floor coating', category: 'Painting', price: 2499 },
    { name: 'Stencil & Wall Art', description: 'Custom stencil patterns and artistic wall murals', category: 'Painting', price: 1999 },

    // Carpentry (10)
    { name: 'Door Repair & Fitting', description: 'Fix warped, stuck or damaged doors and adjust hinges', category: 'Carpentry', price: 399 },
    { name: 'Furniture Assembly', description: 'Assemble flat-pack furniture, wardrobes and shelves', category: 'Carpentry', price: 499 },
    { name: 'Modular Kitchen Fitting', description: 'Install cabinets, shutters and modular kitchen units', category: 'Carpentry', price: 3999 },
    { name: 'Wardrobe Installation', description: 'Custom wardrobe fitting with sliding or hinged doors', category: 'Carpentry', price: 2999 },
    { name: 'TV Unit & Wall Mount', description: 'Build TV units and mount televisions on walls', category: 'Carpentry', price: 699 },
    { name: 'Window Frame Repair', description: 'Repair and seal cracked or rotting window wood frames', category: 'Carpentry', price: 599 },
    { name: 'False Ceiling (POP)', description: 'Design and install POP or gypsum false ceilings', category: 'Carpentry', price: 4999 },
    { name: 'Shelf & Storage Unit', description: 'Build custom wall shelves and storage solutions', category: 'Carpentry', price: 899 },
    { name: 'Bed Frame Repair', description: 'Fix broken bed frames, slats and joinery', category: 'Carpentry', price: 499 },
    { name: 'Sliding Door Track Repair', description: 'Fix stiff, noisy or broken sliding door mechanisms', category: 'Carpentry', price: 349 },
];

const providerTemplates = [
    { name: 'Arjun Mehta', phone: '9811000001', email: 'arjun.m@providers.com', experience: 7, rating: 4.8 },
    { name: 'Suresh Kumar', phone: '9811000002', email: 'suresh.k@providers.com', experience: 5, rating: 4.6 },
    { name: 'Vikram Singh', phone: '9811000003', email: 'vikram.s@providers.com', experience: 9, rating: 4.9 },
    { name: 'Ramesh Yadav', phone: '9811000004', email: 'ramesh.y@providers.com', experience: 6, rating: 4.5 },
    { name: 'Deepak Patel', phone: '9811000005', email: 'deepak.p@providers.com', experience: 4, rating: 4.3 },
    { name: 'Mohan Das', phone: '9811000006', email: 'mohan.d@providers.com', experience: 8, rating: 4.7 },
];

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Clear existing
    await Service.deleteMany({});
    await Provider.deleteMany({});
    console.log('🗑  Cleared existing services and providers');

    // Insert services
    const created = await Service.insertMany(services);
    console.log(`✅ ${created.length} services added`);

    // Insert ONLY 6 unique providers — no duplicates
    // Provider model ke service field ke liye pehli service assign karo (sirf required field hai)
    const uniqueProviders = providerTemplates.map((p, idx) => ({
        name: p.name,
        phone: p.phone,
        email: p.email,
        experience: p.experience,
        rating: p.rating,
        isAvailable: true,
        service: created[idx % created.length]._id,
    }));

    await Provider.insertMany(uniqueProviders);
    console.log(`✅ ${uniqueProviders.length} unique providers added (no duplicates)`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Seeding complete! 🎉');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
