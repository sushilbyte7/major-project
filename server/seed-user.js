/**
 * ServeEase – Test User Seeder
 * Run: node seed-user.js
 * Creates user@serveease.com with password: User@123
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

async function seedUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        // Check if user already exists
        const existing = await User.findOne({ email: 'user@serveease.com' });
        if (existing) {
            console.log('✅ Test user already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('User@123', salt);

            await User.create({
                name: 'Test User',
                email: 'user@serveease.com',
                password: hashedPassword,
                role: 'user',
                phone: '9876543210',
                address: '123 Test Street, Mumbai',
            });
            console.log('✅ Test user created!');
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Email   : user@serveease.com');
        console.log('  Password: User@123');
        console.log('  Role    : user');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seedUser();
