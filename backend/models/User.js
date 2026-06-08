const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    uid: { type: String, unique: true, sparse: true },
    gender: { type: String, enum: ['male', 'female'], required: false },
    bio: { type: String, default: 'Add some things about you' },
    profileImage: { type: String, default: '/assets/profile-images/human-01.png' },
    isPublic: { type: Boolean, default: true },
    nameChangeCount: { type: Number, default: 0 },
    rankPoints: { type: Number, default: 0 },
    profileSetupComplete: { type: Boolean, default: false },
    winsVsBots: { type: [Number], default: [0, 0, 0, 0, 0] },
    lossesVsBots: { type: [Number], default: [0, 0, 0, 0, 0] },
    // G-THUNDER Points System
    gThunderPoints: { type: Number, default: 20 },
    // XP Points System
    xpPoints: { type: Number, default: 0 },
    dailyRewards: {
        currentDay: { type: Number, default: 0 },
        lastClaimTime: { type: Date, default: null },
        lastClaimDate: { type: String, default: null }, // Store date as YYYY-MM-DD
    },
    adsWatched: {
        count: { type: Number, default: 0 },
        lastResetDate: { type: String, default: null }, // Store date as YYYY-MM-DD
    },
    // Level Progress Tracking
    levelProgress: {
        html: {
            phase1: { type: Number, default: 1 }, // Current unlocked level (1-5)
            phase2: { type: Number, default: 0 },
            phase3: { type: Number, default: 0 },
        },
        css: {
            phase1: { type: Number, default: 0 },
            phase2: { type: Number, default: 0 },
            phase3: { type: Number, default: 0 },
        },
        javascript: {
            phase1: { type: Number, default: 0 },
            phase2: { type: Number, default: 0 },
            phase3: { type: Number, default: 0 },
        },
        python: {
            phase1: { type: Number, default: 0 },
            phase2: { type: Number, default: 0 },
            phase3: { type: Number, default: 0 },
        },
        java: {
            phase1: { type: Number, default: 0 },
            phase2: { type: Number, default: 0 },
            phase3: { type: Number, default: 0 },
        },
    },
    completedLevels: [{
        course: String, // 'html', 'css', 'javascript', 'python', 'java'
        phase: Number, // 1, 2, 3
        level: Number, // 1-12
        xpEarned: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
