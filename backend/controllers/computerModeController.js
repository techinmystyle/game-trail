// In-memory storage for rooms (in production, use Redis or MongoDB)
const rooms = new Map();

// Generate random room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate random password
const generatePassword = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { roomTime, playerMode, rounds, language, difficulty, bot } = req.body;
    const userId = req.user.id;

    const roomId = generateRoomId();
    const password = generatePassword();

    const room = {
      roomId,
      password,
      host: userId,
      settings: {
        roomTime,
        playerMode,
        rounds,
        language,
        difficulty,
        bot
      },
      players: [{
        id: userId,
        name: req.user.username,
        image: req.user.profileImage || '/assets/profile-images/human-01.png',
        accepted: false,
        progress: 0
      }],
      status: 'waiting', // waiting, playing, finished
      createdAt: new Date()
    };

    rooms.set(roomId, room);

    res.status(201).json({
      success: true,
      roomId,
      password,
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Error creating room' });
  }
};

// Join an existing room
exports.joinRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const userId = req.user.id;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (room.players.length >= room.settings.playerMode) {
      return res.status(400).json({ message: 'Room is full' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Game already started' });
    }

    // Check if player already in room
    if (room.players.some(p => p.id === userId)) {
      return res.status(400).json({ message: 'Already in this room' });
    }

    room.players.push({
      id: userId,
      name: req.user.username,
      image: req.user.profileImage || '/assets/profile-images/human-01.png',
      accepted: false,
      progress: 0
    });

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Error joining room' });
  }
};

// Get room details
exports.getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Error fetching room details' });
  }
};

// Update player status (accept/ready)
exports.updatePlayerStatus = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { accepted } = req.body;
    const userId = req.user.id;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const player = room.players.find(p => p.id === userId);
    if (!player) {
      return res.status(404).json({ message: 'Player not in room' });
    }

    player.accepted = accepted;

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Update player status error:', error);
    res.status(500).json({ message: 'Error updating player status' });
  }
};

// Start the game
exports.startGame = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.host !== userId) {
      return res.status(403).json({ message: 'Only host can start the game' });
    }

    const allAccepted = room.players.every(p => p.accepted);
    if (!allAccepted) {
      return res.status(400).json({ message: 'All players must accept before starting' });
    }

    room.status = 'playing';
    room.startedAt = new Date();

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ message: 'Error starting game' });
  }
};

// Submit player progress
exports.submitProgress = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const player = room.players.find(p => p.id === userId);
    if (!player) {
      return res.status(404).json({ message: 'Player not in room' });
    }

    player.progress = progress;

    // Check if game is finished
    if (progress >= 100) {
      room.status = 'finished';
      room.winner = userId;
      room.finishedAt = new Date();
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Submit progress error:', error);
    res.status(500).json({ message: 'Error submitting progress' });
  }
};
