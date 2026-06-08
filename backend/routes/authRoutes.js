const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  validateResetToken,
  resetPassword,
  testRoute,
  getProfile,
  setupProfile,
  updateProfile,
  searchUserByUid,
  updateComputerGameResult,
  claimDailyReward,
  watchAd,
  getPointsInfo,
  convertXpToGThunder,
  completeLevel,
  getLevelProgress
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Test route
router.get('/test', testRoute);

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/validate-reset-token/:token', validateResetToken);
router.post('/reset-password/:token', resetPassword);

// Profile routes (protected)
router.get('/profile', protect, getProfile);
router.post('/profile/setup', protect, setupProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/computer-game-result', protect, updateComputerGameResult);
router.get('/user/:uid', protect, searchUserByUid);

// G-THUNDER Points routes (protected)
router.post('/points/claim-daily', protect, claimDailyReward);
router.post('/points/watch-ad', protect, watchAd);
router.get('/points/info', protect, getPointsInfo);
router.post('/points/convert-xp', protect, convertXpToGThunder);

// Level Progress routes (protected)
router.post('/levels/complete', protect, completeLevel);
router.get('/levels/progress', protect, getLevelProgress);

module.exports = router;
