const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const codeValidationRoutes = require('./routes/codeValidationRoutes');
const computerModeRoutes = require('./routes/computerModeRoutes');
const { generateChallenge } = require('./data/challengeGenerator');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow all origins for now
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', codeValidationRoutes);
app.use('/api/computer-mode', computerModeRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'GAME IN MY STYLE API Server',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET - COMPUTER MODE REAL-TIME MULTIPLAYER
// ═══════════════════════════════════════════════════════════════════════════

// In-memory room storage (in production, use Redis or MongoDB)
const rooms = new Map();

// Clean up old rooms every 5 minutes
setInterval(() => {
  const now = Date.now();
  const ROOM_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  rooms.forEach((room, roomId) => {
    if (now - room.createdAt > ROOM_TIMEOUT && room.status === 'waiting') {
      rooms.delete(roomId);
      console.log(`🗑️ Cleaned up inactive room: ${roomId}`);
    }
  });
}, 5 * 60 * 1000); // Run every 5 minutes

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // ─── CREATE ROOM ───
  socket.on('create-room', ({ roomId, roomData, userId, username }) => {
    console.log(`🏠 ${username} (${userId}) creating room: ${roomId}`);
    console.log(`   Settings: ${roomData.playerMode} players, ${roomData.language}, ${roomData.difficulty}`);
    
    // Check if room already exists
    const existingRoom = rooms.get(roomId);
    if (existingRoom) {
      console.log(`⚠️  Room ${roomId} already exists`);
      // If user is already in the room, just rejoin
      const existingPlayer = existingRoom.players.find(p => p.userId === userId);
      if (existingPlayer) {
        // Update socket ID for reconnection
        existingPlayer.socketId = socket.id;
        socket.join(roomId);
        socket.emit('room-created', { 
          success: true, 
          roomId,
          room: existingRoom
        });
        console.log(`♻️ User ${username} rejoined existing room ${roomId}`);
        return;
      }
      
      // If room exists but user is not in it, delete the old room and create new one
      // This handles the case where user creates a room, leaves, and creates again
      console.log(`🔄 Replacing existing room ${roomId} with new room`);
      rooms.delete(roomId);
    }
    
    // Create new room
    rooms.set(roomId, {
      id: roomId,
      host: socket.id,
      hostUserId: userId,
      hostUsername: username,
      settings: roomData,
      players: [{
        socketId: socket.id,
        userId,
        username,
        ready: false,
        isHost: true
      }],
      status: 'waiting', // waiting, playing, finished
      createdAt: Date.now()
    });

    // Join socket room
    socket.join(roomId);
    
    // Send confirmation
    socket.emit('room-created', { 
      success: true, 
      roomId,
      room: rooms.get(roomId)
    });
    
    console.log(`✅ Room ${roomId} created by ${username} (${roomData.playerMode} player mode)`);
  });

  // ─── JOIN ROOM ───
  socket.on('join-room', ({ roomId, password, userId, username }) => {
    console.log(`🚪 ${username} (${userId}) trying to join room: ${roomId}`);
    
    const room = rooms.get(roomId);
    
    if (!room) {
      console.log(`❌ Room ${roomId} not found. Available rooms:`, Array.from(rooms.keys()));
      socket.emit('join-error', { message: 'Room not found' });
      return;
    }

    console.log(`📊 Room ${roomId} status: ${room.players.length}/${room.settings.playerMode} players`);

    // Check password if set
    if (room.settings.password && room.settings.password !== password) {
      console.log(`❌ Incorrect password for room ${roomId}`);
      socket.emit('join-error', { message: 'Incorrect password' });
      return;
    }

    // Check if already in room (reconnection scenario)
    const existingPlayer = room.players.find(p => p.userId === userId);
    if (existingPlayer) {
      // Update socket ID for reconnection
      existingPlayer.socketId = socket.id;
      socket.join(roomId);
      socket.emit('room-joined', { 
        success: true, 
        roomId,
        room: room
      });
      console.log(`♻️ ${username} reconnected to room ${roomId}`);
      
      // Notify other players about reconnection
      io.to(roomId).emit('player-status-changed', {
        userId,
        ready: existingPlayer.ready,
        room: room
      });
      return;
    }

    // Check if room is full
    if (room.players.length >= room.settings.playerMode) {
      console.log(`❌ Room ${roomId} is full: ${room.players.length}/${room.settings.playerMode}`);
      socket.emit('join-error', { message: 'Room is full' });
      return;
    }

    // Add player to room
    room.players.push({
      socketId: socket.id,
      userId,
      username,
      ready: false,
      isHost: false
    });

    // Join socket room
    socket.join(roomId);

    // Notify all players in room
    io.to(roomId).emit('player-joined', {
      player: { userId, username, ready: false },
      room: room,
      totalPlayers: room.players.length
    });

    // Send confirmation to joiner
    socket.emit('room-joined', { 
      success: true, 
      roomId,
      room: room
    });

    console.log(`✅ ${username} joined room ${roomId}. Total players: ${room.players.length}`);
  });

  // ─── PLAYER READY ───
  socket.on('player-ready', ({ roomId, userId, ready }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.userId === userId);
    if (player) {
      player.ready = ready;
      
      // Notify all players
      io.to(roomId).emit('player-status-changed', {
        userId,
        ready,
        room: room
      });

      console.log(`${player.username} is ${ready ? 'ready' : 'not ready'} in room ${roomId}`);
    }
  });

  // ─── LOBBY CHAT ───
  socket.on('send-chat', ({ roomId, message }) => {
    // Broadcast to ALL others in the room (sender already adds their own msg locally)
    socket.to(roomId).emit('chat-message', { ...message, isMine: false });
    console.log(`💬 Chat in room ${roomId} from ${message.from}: ${message.text}`);
  });

  // ─── BOT CONFIGS AND ROSTER GENERATOR FOR SERVER-SIDE SIMULATION ───
  // Submission windows: how many seconds BEFORE the end the bot submits
  // Each entry is [minWindow, maxWindow] in seconds from end of timer
  const BOT_SUBMIT_WINDOWS = {
    'Beginner Bot':        { 3:3,  4:5,  5:8,  6:10, 7:12, 8:15 },
    'Lazy Compiler':       { 3:4,  4:6,  5:9,  6:11, 7:13, 8:16 },
    'Logic Bot':           { 3:5,  4:7,  5:10, 6:12, 7:14, 8:17 },
    'Flash Coder':         { 3:6,  4:8,  5:11, 6:13, 7:15, 8:18 },
    'Test Case Destroyer': { 3:10, 4:12, 5:15, 6:20, 7:25, 8:30 },
  };

  // Phase durations as fractions of total time (excluding submit window)
  const BOT_PHASE_RATIOS = {
    'Beginner Bot':        [0.15, 0.38, 0.22, 0.25],
    'Lazy Compiler':       [0.18, 0.35, 0.20, 0.27],
    'Logic Bot':           [0.12, 0.40, 0.25, 0.23],
    'Flash Coder':         [0.10, 0.42, 0.28, 0.20],
    'Test Case Destroyer': [0.08, 0.45, 0.30, 0.17],
  };

  // Returns the second at which bot submits (random within its window)
  function getBotSubmitSecond(botName, totalSecs) {
    const timeMin = Math.round(totalSecs / 60);
    const windowKey = [3,4,5,6,7,8].includes(timeMin) ? timeMin : 5;
    const windows = BOT_SUBMIT_WINDOWS[botName] || BOT_SUBMIT_WINDOWS['Logic Bot'];
    const windowSecs = windows[windowKey] || 10;
    // Bot submits randomly within [totalSecs - windowSecs, totalSecs - 1]
    const submitAt = totalSecs - Math.floor(Math.random() * windowSecs) - 1;
    return Math.max(0, submitAt);
  }

  // Compute phase boundaries for a bot based on submitSecond
  function getBotPhaseBoundaries(botName, submitSecond) {
    const ratios = BOT_PHASE_RATIOS[botName] || BOT_PHASE_RATIOS['Logic Bot'];
    const phases = [];
    let elapsed = 0;
    for (let i = 0; i < 4; i++) {
      const dur = Math.round(submitSecond * ratios[i]);
      phases.push({ start: elapsed, end: elapsed + dur });
      elapsed += dur;
    }
    // Phase 5 (submit) starts at submitSecond
    phases.push({ start: submitSecond, end: submitSecond + 1 });
    return phases;
  }

  // Get bot's current phase (1-5) based on elapsed seconds
  function getBotPhase(phaseBoundaries, elapsedSecs, finished) {
    if (finished) return 5;
    for (let i = 4; i >= 0; i--) {
      if (elapsedSecs >= phaseBoundaries[i].start) return i + 1;
    }
    return 1;
  }

  const BOT_CONFIGS = {
    'Beginner Bot':        { tag: 'BOT-1'  },
    'Lazy Compiler':       { tag: 'BOT-2'  },
    'Logic Bot':           { tag: 'BOT-6'  },
    'Flash Coder':         { tag: 'BOT-7'  },
    'Test Case Destroyer': { tag: 'BOT-15' },
  };
  const ALL_BOT_NAMES = ['Beginner Bot', 'Lazy Compiler', 'Logic Bot', 'Flash Coder', 'Test Case Destroyer'];

  function buildBotRoster(playerBots, playerMode) {
    // playerBots is an array of bot objects or bot names, one per player slot
    // Use each player's selected bot directly
    const names = [];
    for (let i = 0; i < playerMode; i++) {
      const raw = playerBots?.[i];
      let name;
      if (typeof raw === 'string') name = raw;
      else if (raw?.name) name = raw.name;
      else name = 'Logic Bot'; // Fallback only if truly not set
      // Validate the bot name exists in our config
      if (!BOT_CONFIGS[name]) name = 'Logic Bot';
      names.push(name);
    }
    return names;
  }

  const gameSessions = new Map();

  async function endRound(roomId) {
    const sess = gameSessions.get(roomId);
    if (!sess) return;

    if (sess.intervalId) {
      clearInterval(sess.intervalId);
      sess.intervalId = null;
    }

    // Per-player vs per-bot results
    // Each player[i] competes against bot[i]
    const playerResults = sess.players.map((p, idx) => {
      const bot = sess.bots[idx];
      const playerTime = p.finished ? p.timeUsed : Infinity;
      const botTime = bot && bot.finished ? (bot.finishedAt || bot.submitSecond) : Infinity;
      let outcome;
      if (!p.finished && (!bot || !bot.finished)) outcome = 'tie';
      else if (playerTime < botTime) outcome = 'player_wins';
      else if (botTime < playerTime) outcome = 'bot_wins';
      else outcome = 'tie'; // same time => tie
      return { userId: p.userId, username: p.username, outcome, playerTime, botTime };
    });

    let bestTime = Infinity;
    let roundWinnerName = 'AI';
    let roundWinnerType = 'ai';
    let winnerUserId = null;

    sess.players.forEach(p => {
      if (p.finished && p.timeUsed < bestTime) {
        bestTime = p.timeUsed;
        roundWinnerName = p.username;
        roundWinnerType = 'player';
        winnerUserId = p.userId;
      }
    });

    sess.bots.forEach(b => {
      const botTotalTime = b.finishedAt || b.submitSecond;
      if (b.finished && botTotalTime < bestTime) {
        bestTime = botTotalTime;
        roundWinnerName = b.name;
        roundWinnerType = 'ai';
        winnerUserId = null;
      }
    });

    if (roundWinnerType === 'player') {
      const playerObj = sess.players.find(p => p.userId === winnerUserId);
      if (playerObj) playerObj.score += 1;
    } else {
      sess.aiScore = (sess.aiScore || 0) + 1;
    }

    if (sess.currentRound < sess.totalRounds) {
      io.to(roomId).emit('round-ended', {
        roundWinner: { name: roundWinnerName, type: roundWinnerType },
        players: sess.players,
        aiScore: sess.aiScore || 0,
        currentRound: sess.currentRound,
        nextRoundIn: 5,
        playerResults,
      });

      setTimeout(async () => {
        const currentSess = gameSessions.get(roomId);
        if (!currentSess) return;

        try {
          currentSess.currentRound += 1;
          const newChallenge = await generateChallenge(currentSess.language, currentSess.difficulty, currentSess.roomTime);
          currentSess.challenge = newChallenge;
          currentSess.timer = currentSess.roomTime * 60;

          currentSess.players.forEach(p => {
            p.progress = 0;
            p.testsPassed = 0;
            p.finished = false;
            p.timeUsed = 0;
          });

          currentSess.bots.forEach((bot) => {
            const totalSecs = currentSess.roomTime * 60;
            const submitSecond = getBotSubmitSecond(bot.name, totalSecs);
            const phaseBoundaries = getBotPhaseBoundaries(bot.name, submitSecond);
            bot.submitSecond = submitSecond;
            bot.phaseBoundaries = phaseBoundaries;
            bot.started = false;
            bot.progress = 0;
            bot.finished = false;
            bot.won = false;
            bot.phase = 1;
            bot.finishedAt = null;
          });

          currentSess.intervalId = setInterval(async () => {
            const currentTickSess = gameSessions.get(roomId);
            if (!currentTickSess) return;

            currentTickSess.timer -= 1;
            const elapsedSecs = currentTickSess.roomTime * 60 - currentTickSess.timer;

            currentTickSess.bots.forEach(bot => {
              if (bot.finished) return;
              bot.phase = getBotPhase(bot.phaseBoundaries, elapsedSecs, false);
              const pct = Math.min(100, (elapsedSecs / bot.submitSecond) * 100);
              bot.progress = Math.max(0, pct);
              if (elapsedSecs >= bot.submitSecond) {
                bot.finished = true;
                bot.progress = 100;
                bot.phase = 5;
                bot.finishedAt = elapsedSecs;
              }
            });

            io.to(roomId).emit('game-state-tick', {
              timer: currentTickSess.timer,
              players: currentTickSess.players,
              bots: currentTickSess.bots,
              round: currentTickSess.currentRound,
              totalRounds: currentTickSess.totalRounds
            });

            const allHumansFinished = currentTickSess.players.every(p => p.finished);
            if (currentTickSess.timer <= 0 || allHumansFinished) {
              clearInterval(currentTickSess.intervalId);
              currentTickSess.intervalId = null;
              await endRound(roomId);
            }
          }, 1000);

          io.to(roomId).emit('next-round', {
            round: currentSess.currentRound,
            challenge: newChallenge
          });
        } catch (err) {
          console.error("Error starting next round:", err);
        }
      }, 5000);

     } else {
       const totalHumanScore = sess.players.reduce((sum, p) => sum + (p.score || 0), 0);
       const aiScore = sess.aiScore || 0;
       let finalWinner = 'ai';

       if (totalHumanScore > aiScore) {
         let maxHumanScore = 0;
         sess.players.forEach(p => {
           if (p.score > maxHumanScore) maxHumanScore = p.score;
         });
         const winnersList = sess.players.filter(p => p.score === maxHumanScore);
         if (winnersList.length === 1) {
           finalWinner = winnersList[0].userId;
         } else {
           // Tie-break by average time
           let minAvgTime = Infinity;
           let tieWinner = null;
           winnersList.forEach(p => {
             if (p.timeUsed < minAvgTime) { minAvgTime = p.timeUsed; tieWinner = p; }
           });
           finalWinner = tieWinner ? tieWinner.userId : 'draw';
         }
       } else if (totalHumanScore === aiScore) {
         finalWinner = 'draw';
       } else {
         finalWinner = 'ai';
       }

       io.to(roomId).emit('game-over', {
         winner: finalWinner,
         players: sess.players,
         aiScore: aiScore,
         bots: sess.bots
       });

       gameSessions.delete(roomId);
     }
  }

  // ─── START GAME ───
  socket.on('start-game', async ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const allReady = room.players.every(p => p.ready);
    if (!allReady) {
      socket.emit('start-error', { message: 'Not all players are ready' });
      return;
    }

    if (room.players.length < room.settings.playerMode) {
      socket.emit('start-error', { message: 'Waiting for more players' });
      return;
    }

    room.status = 'playing';

    try {
      const challenge = await generateChallenge(room.settings.language, room.settings.difficulty, room.settings.roomTime);
      // Use per-player bot selections from room settings (array of bot objects/names)
      const botNames = buildBotRoster(room.settings.playerBots || [room.settings.bot], room.settings.playerMode);
      console.log(`[Bot Roster] Player bots: ${botNames.join(', ')}`);

      const session = {
        roomId,
        status: 'playing',
        currentRound: 1,
        totalRounds: room.settings.rounds,
        language: room.settings.language,
        difficulty: room.settings.difficulty,
        roomTime: room.settings.roomTime,
        timer: room.settings.roomTime * 60,
        challenge,
        players: room.players.map(p => ({
          userId: p.userId,
          username: p.username,
          progress: 0,
          testsPassed: 0,
          finished: false,
          timeUsed: 0,
          score: 0
        })),
        bots: botNames.map((name, idx) => {
          const totalSecs = room.settings.roomTime * 60;
          const submitSecond = getBotSubmitSecond(name, totalSecs);
          const phaseBoundaries = getBotPhaseBoundaries(name, submitSecond);
          return {
            name,
            submitSecond,
            phaseBoundaries,
            started: false,
            progress: 0,
            finished: false,
            won: false,
            phase: 1,
          };
        }),
        aiScore: 0,
        intervalId: null
      };

      gameSessions.set(roomId, session);

      // 📡 Send full game data WITH game-starting so ALL players get challenge immediately
      // No need for a separate join-game roundtrip — eliminates timing issues entirely
      const gameInitPayload = {
        challenge: session.challenge,
        currentRound: session.currentRound,
        totalRounds: session.totalRounds,
        timer: session.timer,
        players: session.players,
        bots: session.bots,
        language: session.language,
        difficulty: session.difficulty,
        aiScore: session.aiScore || 0
      };

      io.to(roomId).emit('game-starting', {
        room: room,
        countdown: 3,
        gameData: gameInitPayload  // ✨ Full challenge data embedded
      });

      console.log(`🎮 Game starting in room ${roomId} — challenge sent to all ${room.players.length} players`);

      // ⏱️ Delay the game timer by 4 seconds to match the 3-second frontend countdown
      setTimeout(() => {
        const startSess = gameSessions.get(roomId);
        if (!startSess) return;

        startSess.intervalId = setInterval(async () => {
          const currentTickSess = gameSessions.get(roomId);
          if (!currentTickSess) return;

          currentTickSess.timer -= 1;
          const elapsedSecs = currentTickSess.roomTime * 60 - currentTickSess.timer;

          currentTickSess.bots.forEach(bot => {
            if (bot.finished) return;
            // Update phase
            bot.phase = getBotPhase(bot.phaseBoundaries, elapsedSecs, false);
            // Bot submits at its exact submitSecond
            const pct = Math.min(100, (elapsedSecs / bot.submitSecond) * 100);
            bot.progress = Math.max(0, pct);
            if (elapsedSecs >= bot.submitSecond) {
              bot.finished = true;
              bot.progress = 100;
              bot.phase = 5;
              bot.finishedAt = elapsedSecs;
              console.log(`🤖 Bot ${bot.name} submitted at ${elapsedSecs}s (window: last ${currentTickSess.roomTime * 60 - bot.submitSecond}s)`);
            }
          });

          io.to(roomId).emit('game-state-tick', {
            timer: currentTickSess.timer,
            players: currentTickSess.players,
            bots: currentTickSess.bots,
            round: currentTickSess.currentRound,
            totalRounds: currentTickSess.totalRounds
          });

          const allHumansFinished = currentTickSess.players.every(p => p.finished);
          if (currentTickSess.timer <= 0 || allHumansFinished) {
            clearInterval(currentTickSess.intervalId);
            currentTickSess.intervalId = null;
            await endRound(roomId);
          }
        }, 1000);

        console.log(`▶️  Game timer started for room ${roomId}`);
      }, 4000);

    } catch (error) {
      console.error("Failed to start game room:", error);
      socket.emit('start-error', { message: 'Error generating start challenge' });
    }
  });

  // ─── JOIN GAME ───
  socket.on('join-game', ({ roomId, userId }) => {
    console.log(`[Socket] join-game event received from socket ID: ${socket.id}`);
    console.log(`   Room ID: ${roomId}, User ID: ${userId}`);
    socket.join(roomId);
    const sess = gameSessions.get(roomId);
    if (sess) {
      console.log(`   Session found. Emitting game-init to socket ${socket.id}`);
      socket.emit('game-init', {
        challenge: sess.challenge,
        currentRound: sess.currentRound,
        totalRounds: sess.totalRounds,
        timer: sess.timer,
        players: sess.players,
        bots: sess.bots,
        language: sess.language,
        difficulty: sess.difficulty,
        aiScore: sess.aiScore || 0
      });
    } else {
      console.log(`   ⚠️ Session not found for Room ID: ${roomId}`);
      console.log(`   Available sessions:`, Array.from(gameSessions.keys()));
    }
  });

  // ─── PLAYER PROGRESS ───
  socket.on('player-progress', ({ roomId, userId, progress, testsPassed }) => {
    const sess = gameSessions.get(roomId);
    if (sess) {
      const player = sess.players.find(p => p.userId === userId);
      if (player) {
        player.progress = progress;
        player.testsPassed = testsPassed;
      }
      io.to(roomId).emit('progress-update', {
        userId,
        progress,
        testsPassed,
        players: sess.players
      });
    }
  });

  // ─── PLAYER FINISHED ───
  socket.on('player-finished', ({ roomId, userId, time, score }) => {
    const sess = gameSessions.get(roomId);
    if (sess) {
      const player = sess.players.find(p => p.userId === userId);
      if (player && !player.finished) {
        player.finished = true;
        player.timeUsed = sess.roomTime * 60 - sess.timer;
        console.log(`🏁 Player ${player.username} finished in ${player.timeUsed}s`);
      }
      io.to(roomId).emit('player-completed', {
        userId,
        players: sess.players
      });
    }
  });

  // ─── LEAVE ROOM ───
  socket.on('leave-room', ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    // Remove player from room
    room.players = room.players.filter(p => p.userId !== userId);

    // If host left, assign new host or delete room
    if (room.players.length === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    } else if (room.host === socket.id) {
      room.host = room.players[0].socketId;
      room.players[0].isHost = true;
      console.log(`👑 New host in room ${roomId}: ${room.players[0].username}`);
    }

    // Notify remaining players
    if (room.players.length > 0) {
      io.to(roomId).emit('player-left', {
        userId,
        room: room,
        totalPlayers: room.players.length
      });
    }

    socket.leave(roomId);
  });

  // ─── DISCONNECT ───
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);

    // Give a 15-second grace period before removing player from rooms.
    // This prevents rooms being deleted during:
    //   - Page navigation (LobbyPage → ComputerModeGamePage)
    //   - Brief network hiccups
    //   - Socket reconnections (new socket ID replaces old)
    setTimeout(() => {
      rooms.forEach((room, roomId) => {
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];

          // Only remove if the player hasn't reconnected with a new socket
          // (reconnection updates socketId via create-room/join-room handlers)
          if (player.socketId !== socket.id) {
            // Player reconnected — skip removal
            return;
          }

          // Only remove if room is NOT in 'playing' state (game in progress)
          if (room.status === 'playing') {
            // During a game, just mark as disconnected but keep in room
            player.disconnected = true;
            console.log(`⚡ ${player.username} disconnected during game in room ${roomId} — keeping in session`);
            return;
          }

          room.players.splice(playerIndex, 1);
          console.log(`👋 ${player.username} removed from room ${roomId} after grace period`);

          // If room is empty, delete it
          if (room.players.length === 0) {
            rooms.delete(roomId);
            console.log(`🗑️ Room ${roomId} deleted (empty after disconnect)`);
          } else {
            // If host disconnected, assign new host
            if (room.host === socket.id && room.players.length > 0) {
              room.host = room.players[0].socketId;
              room.players[0].isHost = true;
            }

            // Notify remaining players
            io.to(roomId).emit('player-left', {
              userId: player.userId,
              room: room,
              totalPlayers: room.players.length
            });
          }
        }
      });
    }, 15000); // 15-second grace period
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket ready for real-time multiplayer`);
});
