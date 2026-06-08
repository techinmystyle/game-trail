const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRoom,
  joinRoom,
  getRoomDetails,
  updatePlayerStatus,
  startGame,
  submitProgress
} = require('../controllers/computerModeController');
const { validateComputerModeCode, getChallenge } = require('../controllers/computerModeValidationController');

router.post('/create-room', protect, createRoom);
router.post('/join-room', protect, joinRoom);
router.get('/room/:roomId', protect, getRoomDetails);
router.post('/room/:roomId/player-status', protect, updatePlayerStatus);
router.post('/room/:roomId/start', protect, startGame);
router.post('/room/:roomId/progress', protect, submitProgress);
router.post('/validate', protect, validateComputerModeCode);
router.get('/challenge', protect, getChallenge);

module.exports = router;
