const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Configure Gmail SMTP transporter with explicit settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('⚠️  Gmail SMTP not configured (email features disabled)');
    console.log('   This is OK - Computer Mode will work without email');
    console.log('   To enable email: Check GMAIL_USER and GMAIL_PASS in .env');
  } else {
    console.log('✅ Gmail SMTP Server is ready to send emails');
  }
});

// Test endpoint
exports.testRoute = (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    time: new Date().toISOString() 
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "Registered Successfully" });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: "User not found. Please register first" });
    }

    console.log('User found:', user.email);
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: "Incorrect password" });
    }

    console.log('Password matched for:', email);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log('Login successful:', email);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        username: user.username,
        uid: user.uid,
        bio: user.bio,
        profileImage: user.profileImage,
        isPublic: user.isPublic,
        nameChangeCount: user.nameChangeCount,
        rankPoints: user.rankPoints,
        profileSetupComplete: user.profileSetupComplete
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Forgot password request for:', email);
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for forgot password:', email);
      // Security: Don't reveal if user exists or not
      return res.json({ message: "If this email is registered, you will receive a reset link" });
    }

    console.log('User found, generating reset token for:', email);
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 900000; // 15 minutes (900000 ms)
    await user.save();

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontend}/reset-password/${resetToken}`;
    
    console.log('Reset URL generated:', resetURL);
    console.log('Gmail configured:', !!process.env.GMAIL_USER);

    const mailOptions = {
      from: `"GAME IN MY STYLE" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Password Reset - GAME IN MY STYLE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">GAME IN MY STYLE</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #555; line-height: 1.6;">Hello ${user.name},</p>
            <p style="color: #555; line-height: 1.6;">You requested a password reset for your GAME IN MY STYLE account.</p>
            <p style="color: #555; line-height: 1.6;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; letter-spacing: 1px;">RESET PASSWORD</a>
            </div>
            
            <p style="color: #666; font-size: 13px; line-height: 1.6;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; word-break: break-all; font-size: 12px; background: #f3f4f6; padding: 10px; border-radius: 5px;">${resetURL}</p>
            
            <div style="margin-top: 30px; padding: 15px; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 5px;">
              <p style="color: #991b1b; font-size: 13px; margin: 0; font-weight: bold;">⚠️ Important Security Notice:</p>
              <p style="color: #991b1b; font-size: 12px; margin: 5px 0 0 0;">This link will expire in 15 minutes for your security.</p>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px; line-height: 1.5;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">© 2026 GAME IN MY STYLE. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    // Send email asynchronously (non-blocking)
    console.log('Queuing email to:', user.email);
    transporter.sendMail(mailOptions)
      .then(() => {
        console.log('Password reset email sent successfully to:', user.email);
      })
      .catch((emailErr) => {
        console.error('Gmail SMTP error for', user.email, ':', emailErr.message);
        console.log('Manual reset URL for debugging:', resetURL);
      });
    
    // Respond immediately without waiting for email
    res.json({ message: "If this email is registered, you will receive a reset link" });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Validate reset token (check if token is still valid)
exports.validateResetToken = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false, 
        message: "Invalid or expired token" 
      });
    }

    res.json({ 
      valid: true, 
      message: "Token is valid" 
    });
  } catch (err) {
    console.error('Validate token error:', err);
    res.status(500).json({ 
      valid: false, 
      message: "Server error" 
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Setup profile (first time after registration)
exports.setupProfile = async (req, res) => {
  try {
    const { fullName, username, gender, bio, profileImage } = req.body;
    
    console.log('Setup profile request:', { fullName, username, gender, bio, profileImage, userId: req.user.id });
    
    if (!fullName || !username || !gender) {
      return res.status(400).json({ message: "Full name, username, and gender are required" });
    }

    if (!['male', 'female'].includes(gender)) {
      return res.status(400).json({ message: "Gender must be either 'male' or 'female'" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is already taken (by another user)
    if (user.username !== username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    // Generate random 6-digit UID
    let uid;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate random 6-digit number (100000 to 999999)
      uid = String(Math.floor(100000 + Math.random() * 900000));
      
      // Check if UID already exists
      const existingUid = await User.findOne({ uid });
      if (!existingUid) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: "Unable to generate unique UID. Please try again." });
    }

    console.log('Generated UID:', uid);

    user.name = fullName;
    user.username = username;
    user.uid = uid;
    user.gender = gender;
    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;
    user.profileSetupComplete = true;
    
    console.log('Saving user with data:', { name: user.name, username: user.username, uid: user.uid });
    
    await user.save();

    console.log('User saved successfully');

    res.json({ 
      message: "Profile setup complete",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        uid: user.uid,
        gender: user.gender,
        bio: user.bio,
        profileImage: user.profileImage,
        isPublic: user.isPublic,
        nameChangeCount: user.nameChangeCount,
        rankPoints: user.rankPoints,
        profileSetupComplete: user.profileSetupComplete
      }
    });
  } catch (err) {
    console.error('Setup profile error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, username, bio, profileImage, isPublic } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if name or username is being changed
    const nameChanged = (fullName && fullName !== user.name) || (username && username !== user.username);
    
    if (nameChanged && user.nameChangeCount >= 3) {
      return res.status(400).json({ message: "Maximum name changes reached (3/3)" });
    }

    // Check if new username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    // Update fields
    if (fullName) user.name = fullName;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    if (isPublic !== undefined) user.isPublic = isPublic;
    
    if (nameChanged) {
      user.nameChangeCount += 1;
    }

    await user.save();

    res.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        uid: user.uid,
        bio: user.bio,
        profileImage: user.profileImage,
        isPublic: user.isPublic,
        nameChangeCount: user.nameChangeCount,
        rankPoints: user.rankPoints,
        profileSetupComplete: user.profileSetupComplete
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search user by UID
exports.searchUserByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const user = await User.findOne({ uid }).select('-password -email -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isPublic) {
      return res.status(403).json({ message: "This user's profile is private" });
    }

    res.json({ 
      user: {
        name: user.name,
        username: user.username,
        uid: user.uid,
        bio: user.bio,
        profileImage: user.profileImage,
        rankPoints: user.rankPoints
      }
    });
  } catch (err) {
    console.error('Search user error:', err);
    res.status(500).json({ message: "Server error" });
  }
};


// Claim daily reward (XP Points)
exports.claimDailyReward = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize fields if needed
    const initUpdates = {};
    
    if (typeof user.xpPoints !== 'number') {
      initUpdates.xpPoints = 0;
    }

    if (!user.dailyRewards || typeof user.dailyRewards !== 'object') {
      initUpdates['dailyRewards.currentDay'] = 0;
      initUpdates['dailyRewards.lastClaimTime'] = null;
      initUpdates['dailyRewards.lastClaimDate'] = null;
    }

    if (Object.keys(initUpdates).length > 0) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: initUpdates },
        { new: true }
      );
    }

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if already claimed today
    if (user.dailyRewards.lastClaimDate === todayDate) {
      return res.status(400).json({ 
        message: 'Already claimed today',
        nextClaimDate: todayDate
      });
    }

    // Check if this is consecutive day or reset
    const lastClaimDate = user.dailyRewards.lastClaimDate;
    let currentDay = user.dailyRewards.currentDay || 0;
    
    if (lastClaimDate) {
      const lastDate = new Date(lastClaimDate);
      const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      
      // If missed a day, reset to day 0
      if (daysDiff > 1) {
        currentDay = 0;
      }
    }

    // Daily rewards: Day 1-6: 50 XP, Day 7: 100 XP
    const rewardAmounts = [50, 50, 50, 50, 50, 50, 100];
    const reward = rewardAmounts[currentDay];
    const nextDay = (currentDay + 1) % 7;

    // Update using atomic operation
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { xpPoints: reward },
        $set: {
          'dailyRewards.lastClaimTime': now,
          'dailyRewards.lastClaimDate': todayDate,
          'dailyRewards.currentDay': nextDay
        }
      },
      { new: true }
    );

    res.json({
      message: 'Daily reward claimed!',
      reward,
      newXpBalance: updatedUser.xpPoints,
      nextDay: nextDay + 1,
      canClaimTomorrow: true,
    });
  } catch (err) {
    console.error('Claim daily reward error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Watch ad and earn XP points
exports.watchAd = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize fields if needed
    const initUpdates = {};
    
    if (typeof user.xpPoints !== 'number') {
      initUpdates.xpPoints = 0;
    }

    if (!user.adsWatched || typeof user.adsWatched !== 'object') {
      initUpdates['adsWatched.count'] = 0;
      initUpdates['adsWatched.lastResetDate'] = null;
    }

    if (Object.keys(initUpdates).length > 0) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: initUpdates },
        { new: true }
      );
    }

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Reset count if it's a new day
    if (user.adsWatched.lastResetDate !== todayDate) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'adsWatched.count': 0,
            'adsWatched.lastResetDate': todayDate
          }
        },
        { new: true }
      );
    }

    // Check if user has reached daily limit
    if (user.adsWatched.count >= 5) {
      return res.status(400).json({ 
        message: 'Daily ad limit reached (5/5)',
        adsWatchedToday: user.adsWatched.count,
        adsRemaining: 0
      });
    }

    // Give 50 XP per ad
    const xpReward = 50;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { 
          xpPoints: xpReward,
          'adsWatched.count': 1
        }
      },
      { new: true }
    );

    res.json({
      message: 'Ad watched successfully!',
      xpReward,
      newXpBalance: updatedUser.xpPoints,
      adsWatchedToday: updatedUser.adsWatched.count,
      adsRemaining: 5 - updatedUser.adsWatched.count,
    });
  } catch (err) {
    console.error('Watch ad error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get points info
exports.getPointsInfo = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize fields if they don't exist
    let needsUpdate = false;
    const updates = {};

    if (typeof user.gThunderPoints !== 'number') {
      updates.gThunderPoints = 20;
      needsUpdate = true;
    }

    if (!user.dailyRewards || typeof user.dailyRewards !== 'object') {
      updates['dailyRewards.currentDay'] = 0;
      updates['dailyRewards.lastClaimTime'] = null;
      updates['dailyRewards.canClaimAt'] = null;
      needsUpdate = true;
    } else if (typeof user.dailyRewards.currentDay !== 'number') {
      updates['dailyRewards.currentDay'] = 0;
      needsUpdate = true;
    }

    if (!user.adsWatched || typeof user.adsWatched !== 'object') {
      updates['adsWatched.count'] = 0;
      updates['adsWatched.lastResetDate'] = null;
      updates['adsWatched.canWatchAt'] = null;
      updates['adsWatched.adTimestamps'] = [];
      needsUpdate = true;
    } else {
      if (typeof user.adsWatched.count !== 'number') {
        updates['adsWatched.count'] = 0;
        needsUpdate = true;
      }
      if (!Array.isArray(user.adsWatched.adTimestamps)) {
        updates['adsWatched.adTimestamps'] = [];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true }
      );
    }

    const now = new Date();

    // Filter out timestamps older than 24 hours
    const adTimestamps = user.adsWatched.adTimestamps || [];
    const validTimestamps = adTimestamps.filter(timestamp => {
      const adTime = new Date(timestamp);
      const hoursSince = (now - adTime) / (1000 * 60 * 60);
      return hoursSince < 24;
    });

    const availableSlots = 5 - validTimestamps.length;

    // Calculate when the next slot will be available
    let nextAvailableTime = null;
    if (validTimestamps.length > 0 && validTimestamps.length >= 5) {
      const oldestTimestamp = new Date(Math.min(...validTimestamps.map(t => new Date(t))));
      nextAvailableTime = new Date(oldestTimestamp.getTime() + 24 * 60 * 60 * 1000);
    }

    // Update the count and timestamps if they changed
    if (validTimestamps.length !== adTimestamps.length) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'adsWatched.count': validTimestamps.length,
            'adsWatched.adTimestamps': validTimestamps,
            'adsWatched.canWatchAt': nextAvailableTime,
          }
        }
      );
    }

    res.json({
      gThunderPoints: user.gThunderPoints || 0,
      xpPoints: user.xpPoints || 0,
      dailyRewards: {
        currentDay: (user.dailyRewards && user.dailyRewards.currentDay) || 0,
        lastClaimTime: user.dailyRewards && user.dailyRewards.lastClaimTime,
        canClaimAt: user.dailyRewards && user.dailyRewards.canClaimAt,
      },
      adsWatched: {
        count: validTimestamps.length,
        remaining: availableSlots,
        canWatchAt: nextAvailableTime,
        adTimestamps: validTimestamps,
      },
    });
  } catch (err) {
    console.error('Get points info error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Convert XP to G-THUNDER points
exports.convertXpToGThunder = async (req, res) => {
  try {
    const { xpAmount } = req.body;
    
    if (!xpAmount || xpAmount < 100) {
      return res.status(400).json({ message: 'Minimum 100 XP required for conversion' });
    }

    if (xpAmount % 100 !== 0) {
      return res.status(400).json({ message: 'XP amount must be a multiple of 100' });
    }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize if needed
    if (typeof user.xpPoints !== 'number') {
      user.xpPoints = 0;
    }
    if (typeof user.gThunderPoints !== 'number') {
      user.gThunderPoints = 20;
    }

    // Check if user has enough XP
    if (user.xpPoints < xpAmount) {
      return res.status(400).json({ 
        message: 'Insufficient XP points',
        currentXp: user.xpPoints,
        required: xpAmount
      });
    }

    // Convert: 100 XP = 1 G-THUNDER
    const gThunderToAdd = xpAmount / 100;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { 
          xpPoints: -xpAmount,
          gThunderPoints: gThunderToAdd
        }
      },
      { new: true }
    );

    res.json({
      message: 'Conversion successful!',
      xpSpent: xpAmount,
      gThunderEarned: gThunderToAdd,
      newXpBalance: updatedUser.xpPoints,
      newGThunderBalance: updatedUser.gThunderPoints,
    });
  } catch (err) {
    console.error('Convert XP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Complete level and earn XP
exports.completeLevel = async (req, res) => {
  try {
    const { course, phase, level, xpReward } = req.body;
    
    if (!course || !phase || !level || !xpReward) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validCourses = ['html', 'css', 'javascript', 'python', 'java'];
    if (!validCourses.includes(course.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid course' });
    }

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize if needed
    if (typeof user.xpPoints !== 'number') {
      user.xpPoints = 0;
    }
    if (!user.levelProgress) {
      user.levelProgress = {
        html: { phase1: 1, phase2: 0, phase3: 0 },
        css: { phase1: 0, phase2: 0, phase3: 0 },
        javascript: { phase1: 0, phase2: 0, phase3: 0 },
        python: { phase1: 0, phase2: 0, phase3: 0 },
        java: { phase1: 0, phase2: 0, phase3: 0 },
      };
    }

    const courseLower = course.toLowerCase();
    const phaseKey = `phase${phase}`;
    
    // Check if level is already completed
    const alreadyCompleted = user.completedLevels?.some(
      cl => cl.course === courseLower && cl.phase === phase && cl.level === level
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Level already completed' });
    }

    // Update progress and award XP
    const currentUnlocked = user.levelProgress[courseLower][phaseKey] || 1;
    const newUnlocked = Math.max(currentUnlocked, level + 1);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { xpPoints: xpReward },
        $set: { [`levelProgress.${courseLower}.${phaseKey}`]: newUnlocked },
        $push: {
          completedLevels: {
            course: courseLower,
            phase,
            level,
            xpEarned: xpReward,
            completedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({
      message: 'Level completed successfully!',
      xpEarned: xpReward,
      newXpBalance: updatedUser.xpPoints,
      nextLevelUnlocked: newUnlocked,
    });
  } catch (err) {
    console.error('Complete level error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get level progress
exports.getLevelProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize if needed
    if (!user.levelProgress) {
      user.levelProgress = {
        html: { phase1: 1, phase2: 0, phase3: 0 },
        css: { phase1: 0, phase2: 0, phase3: 0 },
        javascript: { phase1: 0, phase2: 0, phase3: 0 },
        python: { phase1: 0, phase2: 0, phase3: 0 },
        java: { phase1: 0, phase2: 0, phase3: 0 },
      };
      await user.save();
    }

    res.json({
      levelProgress: user.levelProgress,
      completedLevels: user.completedLevels || [],
    });
  } catch (err) {
    console.error('Get level progress error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Submit computer mode game results (wins and losses against bots)
exports.updateComputerGameResult = async (req, res) => {
  try {
    const { botName, outcome } = req.body;
    
    if (!botName || !outcome) {
      return res.status(400).json({ message: 'Missing botName or outcome' });
    }

    const botNames = ['Beginner Bot', 'Lazy Compiler', 'Logic Bot', 'Flash Coder', 'Test Case Destroyer'];
    const botIndex = botNames.indexOf(botName);

    if (botIndex === -1) {
      return res.status(400).json({ message: 'Invalid bot name' });
    }

    if (!['player_win', 'ai_win', 'draw'].includes(outcome)) {
      return res.status(400).json({ message: 'Invalid game outcome' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize arrays if they don't exist
    if (!user.winsVsBots || user.winsVsBots.length !== 5) {
      user.winsVsBots = [0, 0, 0, 0, 0];
    }
    if (!user.lossesVsBots || user.lossesVsBots.length !== 5) {
      user.lossesVsBots = [0, 0, 0, 0, 0];
    }

    // Point rewards config based on difficulty/bot index
    // 0: Beginner, 1: Lazy, 2: Logic, 3: Flash, 4: Destroyer
    const rewards = [
      { xp: 10, rp: 5, rpLoss: -2 }, // Beginner Bot
      { xp: 15, rp: 8, rpLoss: -2 }, // Lazy Compiler
      { xp: 25, rp: 15, rpLoss: -4 }, // Logic Bot
      { xp: 40, rp: 25, rpLoss: -8 }, // Flash Coder
      { xp: 60, rp: 40, rpLoss: -15 } // Test Case Destroyer
    ];

    const currentReward = rewards[botIndex];
    let xpEarned = 0;
    let rpEarned = 0;

    if (outcome === 'player_win') {
      user.winsVsBots[botIndex] += 1;
      xpEarned = currentReward.xp;
      rpEarned = currentReward.rp;
    } else if (outcome === 'ai_win') {
      user.lossesVsBots[botIndex] += 1;
      rpEarned = currentReward.rpLoss; // Negative points
    } else if (outcome === 'draw') {
      xpEarned = 5;
      rpEarned = 2;
    }

    // Update arrays in a way that Mongoose detects change
    user.markModified('winsVsBots');
    user.markModified('lossesVsBots');

    // Update XP and Rank Points
    user.xpPoints = (user.xpPoints || 0) + xpEarned;
    user.rankPoints = Math.max(0, (user.rankPoints || 0) + rpEarned); // Don't drop below 0

    await user.save();

    res.json({
      message: 'Computer game result updated successfully',
      xpEarned,
      rpEarned,
      newXpBalance: user.xpPoints,
      newRankPoints: user.rankPoints,
      winsVsBots: user.winsVsBots,
      lossesVsBots: user.lossesVsBots
    });
  } catch (err) {
    console.error('Update computer game result error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
