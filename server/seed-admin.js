/**
 * ServeEase – Admin Seeder
 * Run: node seed-admin.js
 * Creates admin@serveease.com with password: Admin@123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/serveease';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    phone: String,
    address: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        // Check if admin already exists
        const existing = await User.findOne({ email: 'admin@serveease.com' });
        if (existing) {
            // Make sure role is admin and email is verified
            existing.role = 'admin';
            existing.isVerified = true;
            await existing.save();
            console.log('✅ Existing user updated to admin role');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);

            await User.create({
                name: 'Super Admin',
                email: 'admin@serveease.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
                phone: '9999999999',
                address: 'ServeEase HQ',
            });
            console.log('✅ Admin user created!');
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Email   : admin@serveease.com');
        console.log('  Password: Admin@123');
        console.log('  Role    : admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seedAdmin();
