import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Play, Trophy, Zap, BookOpen, Lock, Eye } from 'lucide-react';
import { computerModeAPI, profileAPI } from '../utils/api';
import { getSocket } from '../utils/socket';

const CM_ACCENT = '#00e5ff';
const CM_UI     = '#80ffff';
const CM_BG     = '#010d12';

const ext = l => ({ HTML: 'html', CSS: 'css', JavaScript: 'js', Python: 'py', Java: 'java' }[l] || 'txt');

// ── Animated Binary Panel — shown to opponents ──
const BinaryPanel = ({ username, progress = 0, isTyping = false, color = CM_ACCENT }) => {
  const ROWS = 18, COLS = 42;
  const [matrix, setMatrix] = useState(() =>
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => (Math.random() > 0.5 ? '1' : '0'))
    )
  );

  useEffect(() => {
    const speed = isTyping ? 60 : 300;
    const iv = setInterval(() => {
      setMatrix(prev =>
        prev.map(row =>
          row.map(c => (Math.random() > (isTyping ? 0.7 : 0.92) ? (c === '0' ? '1' : '0') : c))
        )
      );
    }, speed);
    return () => clearInterval(iv);
  }, [isTyping]);

  const totalCells = ROWS * COLS;
  const lit = Math.floor((progress / 100) * totalCells);
  let count = 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '8px 14px', background: '#07090e',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
            {username}.{ext('encrypted')} [ENCRYPTED]
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isTyping && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: `${color}18`, border: `1px solid ${color}30`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, animation: 'pulse 0.5s infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color, fontWeight: 700 }}>TYPING...</span>
            </div>
          )}
          <Lock size={12} style={{ color: `${color}60` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: `${color}60` }}>OBFUSCATED</span>
        </div>
      </div>

      {/* Binary content */}
      <div style={{ flex: 1, padding: '12px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 11, lineHeight: 1.6, userSelect: 'none' }}>
          {matrix.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
              {row.map((cell, ci) => {
                const isLit = count++ < lit;
                return (
                  <span key={ci} style={{
                    color: isLit ? color : `${color}15`,
                    textShadow: isLit ? `0 0 5px ${color}80` : 'none',
                    transition: isTyping ? 'color 0.06s' : 'color 0.3s',
                  }}>{cell}</span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Progress overlay */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: 2, transition: 'width 0.5s', boxShadow: `0 0 8px ${color}` }} />
        </div>
      </div>
    </div>
  );
};

// ── Reading Phase Overlay ──
const ReadingPhaseOverlay = ({ challenge, countdown, ac }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 500,
    background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
      padding: '10px 24px', borderRadius: 30,
      background: `${ac}12`, border: `1px solid ${ac}30`,
    }}>
      <BookOpen size={18} style={{ color: ac }} />
      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 16, color: ac, letterSpacing: 3 }}>
        READING PHASE — STUDY THE CHALLENGE
      </span>
      <Lock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
    </div>

    <div style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 24,
      border: `4px solid ${countdown <= 5 ? '#ef4444' : ac}40`,
      boxShadow: `0 0 30px ${countdown <= 5 ? '#ef4444' : ac}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={countdown <= 5 ? '#ef4444' : ac}
          strokeWidth="4" strokeDasharray={`${2 * Math.PI * 46}`}
          strokeDashoffset={`${2 * Math.PI * 46 * (1 - countdown / 15)}`}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
      </svg>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 36,
        color: countdown <= 5 ? '#ef4444' : ac, textShadow: `0 0 20px ${countdown <= 5 ? '#ef4444' : ac}60` }}>{countdown}</div>
    </div>

    <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 28, letterSpacing: 2 }}>
      {countdown <= 5 ? '⚠️ GET READY — TIMER STARTS SOON!' : 'Editor locked · Read the problem carefully'}
    </div>

    {challenge && (
      <div style={{
        maxWidth: 680, width: '100%',
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${ac}30`,
        borderRadius: 16, padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: ac }} />
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 18, color: 'white', letterSpacing: 2 }}>
            {challenge.title}
          </span>
        </div>
        <div style={{ borderLeft: `3px solid ${ac}`, paddingLeft: 16, fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', lineHeight: 1.7, marginBottom: 16 }}>
          {challenge.objective}
        </div>
        {challenge.testCases && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {challenge.testCases.map((tc, i) => (
              <div key={i} style={{
                padding: '4px 12px', borderRadius: 20,
                background: `${ac}10`, border: `1px solid ${ac}20`,
                fontFamily: 'monospace', fontSize: 9, color: `${ac}90`,
              }}>
                Test {i + 1}: {tc.description}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

// Player colors for multi-player
const PLAYER_COLORS = ['#00e5ff', '#ff6b35', '#a855f7', '#10b981'];

export default function CustomModeGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rd = location.state || {};

  const totalRounds  = Number(rd.rounds) || 3;
  const roomTime     = Number(rd.roomTime || rd.timeLimit) || 5;
  const language     = rd.language || 'JavaScript';
  const difficulty   = rd.difficulty || 'Moderate';
  const playerMode   = Number(rd.playerMode) || 2;
  const isSpectator  = rd.isSpectator || false;

  const [themeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  const pageBg = CM_BG;
  const ac = CM_ACCENT;

  const [roomId]     = useState(() => rd.roomId || 'CUSTOM');
  const [myUserId, setMyUserId] = useState(() => rd.userId || null);
  const [myUsername] = useState(() => localStorage.getItem('username') || 'YOU');
  const [myProfileImg] = useState(() => localStorage.getItem('profileImage') || null);

  const [challenge, setChallenge] = useState(() => rd.gameData?.challenge || null);
  const [loading, setLoading] = useState(() => !rd.gameData?.challenge);
  const [currentRound, setCurrentRound] = useState(() => rd.gameData?.currentRound || 1);
  const [scores, setScores] = useState({});       // { userId: score }
  const [players, setPlayers] = useState(() => rd.gameData?.players || rd.players || []);
  const [opponentTyping, setOpponentTyping] = useState({});  // { userId: bool }
  const [opponentProgress, setOpponentProgress] = useState({}); // { userId: 0-100 }

  // Editor state
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [allPassed, setAllPassed] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  // Timer
  const totalMs = roomTime * 60 * 1000;
  const initMs  = rd.gameData?.timer ? rd.gameData.timer * 1000 : totalMs;
  const [playerMs, setPlayerMs] = useState(initMs);
  const msCurRef   = useRef(initMs);
  const startRef   = useRef(null);
  const timerIdRef = useRef(null);

  // Reading phase
  const [readingPhase, setReadingPhase] = useState(false);
  const [readingCountdown, setReadingCountdown] = useState(15);
  const readingDoneRef = useRef(false);

  // Modals
  const [exitModal, setExitModal] = useState(false);
  const [roundModal, setRoundModal] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [nextRoundIn, setNextRoundIn] = useState(5);
  const roundEndedRef = useRef(false);
  const typingTimerRef = useRef(null);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(p => [...p.slice(-80), { msg, type, ts: new Date().toLocaleTimeString() }]);
  }, []);

  const fmtMs = ms => {
    const t = Math.max(0, ms);
    const m = Math.floor(t / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const c = Math.floor((t % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
  };

  const startTimer = useCallback(() => {
    if (timerIdRef.current) return;
    startRef.current = Date.now();
    timerIdRef.current = setInterval(() => {
      const rem = Math.max(0, msCurRef.current - (Date.now() - startRef.current));
      setPlayerMs(rem);
      if (rem <= 0) { clearInterval(timerIdRef.current); timerIdRef.current = null; }
    }, 16);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIdRef.current) {
      msCurRef.current = Math.max(0, msCurRef.current - (Date.now() - startRef.current));
      clearInterval(timerIdRef.current); timerIdRef.current = null;
    }
  }, []);

  const startReadingPhase = useCallback(() => {
    if (readingDoneRef.current) return;
    setReadingPhase(true);
    setReadingCountdown(15);
    let remaining = 15;
    const iv = setInterval(() => {
      remaining -= 1;
      setReadingCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(iv);
        setReadingPhase(false);
        readingDoneRef.current = true;
        startTimer();
      }
    }, 1000);
  }, [startTimer]);

  // Profile fetch
  useEffect(() => {
    if (!myUserId) {
      profileAPI.getProfile().then(r => setMyUserId(r.data.user._id)).catch(() => {});
    }
  }, [myUserId]);

  // Multiplayer init
  const mpInitDone = useRef(false);
  useEffect(() => {
    if (mpInitDone.current) return;
    const gd = rd.gameData;
    if (!gd?.challenge) return;
    mpInitDone.current = true;
    setChallenge(gd.challenge);
    setCurrentRound(gd.currentRound || 1);
    setPlayers(gd.players || []);
    setTestResults((gd.challenge?.testCases || []).map(() => false));
    if (gd.timer) { msCurRef.current = gd.timer * 1000; setPlayerMs(gd.timer * 1000); }
    setLoading(false);
    setTimeout(() => startReadingPhase(), 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Socket listeners
  useEffect(() => {
    const sock = getSocket();
    if (!sock) return;

    const onGameInit = (d) => {
      setChallenge(d.challenge);
      setCurrentRound(d.currentRound);
      setPlayers(d.players || []);
      setTestResults((d.challenge?.testCases || []).map(() => false));
      setLoading(false);
      startReadingPhase();
    };

    const onGameTick = (d) => {
      if (d.timer !== undefined) {
        msCurRef.current = d.timer * 1000;
        startRef.current = Date.now();
        setPlayerMs(d.timer * 1000);
      }
      if (d.players) setPlayers(d.players);
      // Update opponent progress from tick
      if (d.players) {
        const prog = {};
        d.players.forEach(p => { if (p.userId !== myUserId) prog[p.userId] = p.progress || 0; });
        setOpponentProgress(prog);
      }
    };

    const onPlayerCompleted = (d) => {
      if (d.userId !== myUserId) {
        addLog(`🏁 ${d.username || 'Opponent'} submitted their solution!`, 'warning');
      }
    };

    const onTypingUpdate = (d) => {
      if (d.userId !== myUserId) {
        setOpponentTyping(prev => ({ ...prev, [d.userId]: d.isTyping }));
      }
    };

    const onRoundEnded = (d) => {
      stopTimer();
      roundEndedRef.current = true;
      setRoundWinner(d.roundWinner);
      setNextRoundIn(d.nextRoundIn || 5);
      if (d.scores) setScores(d.scores);
      setRoundModal(true);
    };

    const onNextRound = (d) => {
      roundEndedRef.current = false;
      setChallenge(d.challenge);
      setCurrentRound(d.round);
      setTestResults((d.challenge?.testCases || []).map(() => false));
      setProgress(0); setUserCode(''); setAllPassed(false); setRoundModal(false);
      msCurRef.current = totalMs; setPlayerMs(totalMs);
      readingDoneRef.current = false;
      startReadingPhase();
    };

    const onGameOver = (d) => {
      stopTimer();
      navigate('/custom-mode/results', {
        state: {
          roomId, winner: d.winner, players: d.players,
          scores: d.scores || {}, totalRounds, language, difficulty, playerMode,
          myUserId,
        },
      });
    };

    sock.on('custom-game-init', onGameInit);
    sock.on('custom-game-state-tick', onGameTick);
    sock.on('custom-player-completed', onPlayerCompleted);
    sock.on('custom-player-typing-update', onTypingUpdate);
    sock.on('custom-round-ended', onRoundEnded);
    sock.on('custom-next-round', onNextRound);
    sock.on('custom-game-over', onGameOver);

    return () => {
      sock.off('custom-game-init', onGameInit);
      sock.off('custom-game-state-tick', onGameTick);
      sock.off('custom-player-completed', onPlayerCompleted);
      sock.off('custom-player-typing-update', onTypingUpdate);
      sock.off('custom-round-ended', onRoundEnded);
      sock.off('custom-next-round', onNextRound);
      sock.off('custom-game-over', onGameOver);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  // Emit join-game
  useEffect(() => {
    const sock = getSocket();
    if (!sock || !myUserId) return;
    sock.emit('custom-join-game', { roomId, userId: myUserId });
  }, [roomId, myUserId]);

  // Handle typing events — emit to server so others see binary rain
  const handleCodeChange = (val) => {
    setUserCode(val);
    const sock = getSocket();
    if (sock && myUserId && !isSpectator) {
      sock.emit('custom-player-typing', { roomId, userId: myUserId, isTyping: true });
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        sock.emit('custom-player-typing', { roomId, userId: myUserId, isTyping: false });
      }, 1500);
    }
  };

  const handleCompile = async () => {
    if (!userCode.trim() || isSpectator) { addLog('✍️ Write some code first!', 'error'); return; }
    setCompiling(true);
    addLog('⚙️ Compiling & validating...', 'info');
    try {
      const res = await computerModeAPI.validateCode({ userCode, challenge, language, timeMinutes: roomTime, difficulty });
      const results = (res.data.validation?.testResults || []).map(r => r.passed);
      setTestResults(results);
      const cnt = results.filter(Boolean).length;
      const tot = results.length || (challenge?.testCases?.length || 0);
      const pct = tot > 0 ? (cnt / tot) * 100 : 0;
      setProgress(pct);
      const sock = getSocket();
      if (sock && myUserId) {
        sock.emit('custom-player-progress', { roomId, userId: myUserId, progress: pct, testsPassed: cnt });
      }
      if (cnt === tot && tot > 0) { setAllPassed(true); addLog(`✅ ALL ${tot}/${tot} TESTS PASSED! Click SUBMIT to WIN!`, 'success'); }
      else { setAllPassed(false); addLog(`⚠️ ${cnt}/${tot} tests passed. Fix remaining cases.`, 'warning'); }
      (res.data.validation?.errors || []).forEach(e => addLog(`  ${e.message}`, 'error'));
    } catch { addLog('❌ Validation error — check your connection.', 'error'); }
    setCompiling(false);
  };

  const handleSubmit = () => {
    if (!allPassed || isSpectator) { addLog('❌ Pass all tests first!', 'error'); return; }
    stopTimer();
    addLog('🚀 SUBMITTED! System judging...', 'success');
    const sock = getSocket();
    if (sock && myUserId) {
      sock.emit('custom-player-finished', { roomId, userId: myUserId });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const h = e => {
      if (readingPhase || isSpectator) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'Enter') { e.preventDefault(); if (!compiling && !roundEndedRef.current) handleCompile(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') { e.preventDefault(); if (allPassed) handleSubmit(); }
      if (e.key === 'Escape') { e.preventDefault(); setExitModal(v => !v); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [compiling, allPassed, readingPhase, isSpectator]);

  if (loading || !challenge) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: pageBg, gap: 16 }}>
      <div style={{ width: 52, height: 52, border: `4px solid ${ac}25`, borderTopColor: ac, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 800, color: ac, letterSpacing: 3, margin: 0, textTransform: 'uppercase' }}>LOADING BATTLE CHALLENGE...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const timerPct  = (playerMs / totalMs) * 100;
  const timerCrit = playerMs < 30000;
  const timerColor = timerCrit ? '#ef4444' : ac;

  // Identify my player and opponents
  const myPlayer = players.find(p => p.userId === myUserId);
  const opponents = players.filter(p => p.userId !== myUserId && !p.isSpectator);
  const spectatorsList = players.filter(p => p.isSpectator);

  // Grid layout: question | my editor | opponent panels
  const opponentCount = opponents.length;
  const gridCols = isSpectator
    ? `repeat(${Math.min(playerMode, 4)}, 1fr)`
    : opponentCount === 1 ? '42% 30% 28%'
    : opponentCount === 2 ? '35% 22% 22% 21%'
    : '28% 18% 18% 18% 18%'; // 4-player

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: pageBg, color: 'white', overflow: 'hidden' }}>

      {/* Reading Phase Overlay */}
      {readingPhase && <ReadingPhaseOverlay challenge={challenge} countdown={readingCountdown} ac={ac} />}

      {/* ══ TOP BAR ══ */}
      <div style={{
        height: 44, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 0,
        background: 'rgba(0,0,0,0.75)',
        borderBottom: `1px solid ${ac}20`,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <Zap size={12} fill={ac} style={{ color: ac }} />
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 11, color: ac, letterSpacing: 2 }}>CUSTOM MODE</span>
        </div>

        {/* Round dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: totalRounds }).map((_, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%',
                background: i < currentRound ? ac : 'rgba(255,255,255,0.1)',
                boxShadow: i < currentRound ? `0 0 6px ${ac}` : 'none', transition: 'all 0.3s' }} />
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>R{currentRound}/{totalRounds}</span>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 13, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>{challenge.title}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 3, background: `${ac}20`, color: ac }}>{language}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{difficulty}</span>
          {isSpectator && (
            <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 3, background: `${ac}20`, color: ac, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={10} /> SPECTATING
            </span>
          )}
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          {players.filter(p => !p.isSpectator).map((p, i) => (
            <div key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAYER_COLORS[i % PLAYER_COLORS.length] }} />
              <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 13, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }}>
                {scores[p.userId] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Exit */}
        <button onClick={() => setExitModal(true)} style={{
          height: 44, width: 44, border: 'none', borderLeft: '1px solid rgba(239,68,68,0.2)',
          background: 'rgba(239,68,68,0.07)', color: '#ef4444', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}>
          <X size={14} />
        </button>
      </div>

      {/* ══ TIMER BAR ══ */}
      <div style={{ height: 4, flexShrink: 0, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${timerPct}%`,
          background: timerCrit
            ? 'linear-gradient(90deg, #ef4444, #ff6b6b)'
            : `linear-gradient(90deg, ${ac}, ${CM_UI})`,
          boxShadow: `0 0 8px ${timerCrit ? '#ef4444' : ac}`,
          transition: 'width 0.1s linear, background 0.5s',
        }} />
      </div>

      {/* ══ MAIN BODY ══ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: gridCols, minHeight: 0, overflow: 'hidden', gap: 8, padding: 8 }}>

        {/* ═══ SPECTATOR MODE: show all editors ═══ */}
        {isSpectator ? (
          players.filter(p => !p.isSpectator).map((p, idx) => (
            <div key={p.userId} style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              background: '#0b0e17', border: `1px solid ${PLAYER_COLORS[idx % PLAYER_COLORS.length]}25`,
              borderRadius: 10, overflow: 'hidden',
            }}>
              {/* Player header */}
              <div style={{ padding: '8px 14px', background: '#07090e', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAYER_COLORS[idx % PLAYER_COLORS.length] }} />
                <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 12, color: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}>{p.username}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>· {p.progress || 0}% done</span>
                {p.finished && <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: '#10b981' }}>✅ SUBMITTED</span>}
              </div>
              {/* Spectator sees the real code — real-time via socket would need code sync, show placeholder for now */}
              <div style={{ flex: 1, padding: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, overflowY: 'auto' }}>
                <div style={{ color: `${PLAYER_COLORS[idx % PLAYER_COLORS.length]}50`, fontFamily: 'monospace', fontSize: 10 }}>
                  // Spectator view — {p.username}'s editor
                </div>
                <div style={{ marginTop: 8 }}>
                  {p.finished
                    ? <span style={{ color: '#10b981' }}>✅ Player submitted successfully</span>
                    : <span style={{ color: `${PLAYER_COLORS[idx % PLAYER_COLORS.length]}70` }}>⏳ Player is coding...</span>
                  }
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* ═══ COLUMN 1: CHALLENGE + MY EDITOR + CONTROLS ═══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'hidden' }}>

              {/* Challenge card */}
              <div style={{
                flexShrink: 0, height: 140,
                background: '#0b0e17', border: `1px solid ${ac}20`,
                borderRadius: 10, padding: '12px 16px', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: ac }} />
                  <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 11, color: ac, textTransform: 'uppercase', letterSpacing: 2 }}>CHALLENGE</span>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: 90, borderLeft: `3px solid ${ac}`, paddingLeft: 12 }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>{challenge.objective}</p>
                </div>
              </div>

              {/* MY CODE EDITOR */}
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                background: '#0b0e17', border: `1px solid ${readingPhase ? 'rgba(255,255,255,0.08)' : ac + '22'}`,
                borderRadius: 10, minHeight: 0, overflow: 'hidden',
                opacity: readingPhase ? 0.5 : 1, transition: 'opacity 0.3s',
              }}>
                {/* Editor header */}
                <div style={{ background: '#07090e', padding: '8px 14px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>solution.{ext(language)} — {myUsername}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {readingPhase && <span style={{ fontFamily: 'monospace', fontSize: 8, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={8} /> LOCKED
                    </span>}
                    <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${ac}20`, color: ac, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{language}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#64748b' }}>Ctrl+Enter: Run</span>
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  value={userCode}
                  onChange={e => handleCodeChange(e.target.value)}
                  placeholder={readingPhase ? '// Editor locked during reading phase...' : `// Write your ${language} solution here...\n// ${challenge.objective}`}
                  disabled={readingPhase}
                  spellCheck={false}
                  style={{
                    flex: 1, minHeight: 0, background: '#07090e', color: '#f8fafc',
                    fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13,
                    lineHeight: 1.8, padding: '16px', border: 'none', resize: 'none', outline: 'none',
                    caretColor: ac, cursor: readingPhase ? 'not-allowed' : 'text',
                    tabSize: 2,
                  }}
                />

                {/* Progress bar */}
                {progress > 0 && (
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: allPassed ? '#10b981' : ac, transition: 'width 0.5s', boxShadow: `0 0 6px ${allPassed ? '#10b981' : ac}` }} />
                  </div>
                )}
              </div>

              {/* Controls row */}
              <div style={{ flexShrink: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Test results */}
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {challenge.testCases?.map((_, i) => (
                    <div key={i} style={{
                      height: 28, flex: 1, borderRadius: 6,
                      background: testResults[i] === true ? 'rgba(16,185,129,0.2)' : testResults[i] === false ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${testResults[i] === true ? '#10b98140' : testResults[i] === false ? '#ef444430' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'monospace', fontSize: 9,
                      color: testResults[i] === true ? '#10b981' : testResults[i] === false ? '#ef4444' : 'rgba(255,255,255,0.3)',
                    }}>
                      {testResults[i] === true ? '✓' : testResults[i] === false ? '✗' : `T${i + 1}`}
                    </div>
                  ))}
                </div>

                {/* Compile */}
                <button onClick={handleCompile} disabled={compiling || readingPhase} style={{
                  padding: '0 18px', height: 36, borderRadius: 8,
                  border: `1px solid ${ac}30`,
                  background: compiling ? 'rgba(255,255,255,0.08)' : `${ac}18`,
                  color: compiling ? 'rgba(255,255,255,0.3)' : ac,
                  fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: 2,
                  cursor: compiling ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {compiling ? <><div style={{ width: 12, height: 12, border: `2px solid ${ac}40`, borderTopColor: ac, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> RUN</> : <><Play size={12} fill={ac} /> RUN</>}
                </button>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={!allPassed} style={{
                  padding: '0 18px', height: 36, borderRadius: 8, border: 'none',
                  background: allPassed ? `linear-gradient(135deg, ${ac}, ${CM_UI})` : 'rgba(255,255,255,0.06)',
                  color: allPassed ? '#001a20' : 'rgba(255,255,255,0.2)',
                  fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: 2,
                  cursor: allPassed ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  boxShadow: allPassed ? `0 4px 16px ${ac}40` : 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                  animation: allPassed ? 'glowPulse 2s infinite' : 'none',
                }}>
                  <Trophy size={13} fill={allPassed ? '#001a20' : 'rgba(255,255,255,0.2)'} /> SUBMIT
                </button>
              </div>

              {/* Log output */}
              <div style={{
                flexShrink: 0, height: 80,
                background: '#07090e', border: `1px solid ${ac}15`,
                borderRadius: 8, padding: '8px 12px', overflowY: 'auto',
              }}>
                {logs.slice(-5).map((log, i) => (
                  <div key={i} style={{
                    fontFamily: 'monospace', fontSize: 10, lineHeight: 1.6,
                    color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                  }}>{log.msg}</div>
                ))}
                {logs.length === 0 && <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>// Output will appear here after running...</div>}
              </div>
            </div>

            {/* ═══ OPPONENT PANELS ═══ */}
            {opponents.map((opp, idx) => {
              const oppColor = PLAYER_COLORS[(idx + 1) % PLAYER_COLORS.length];
              const isTyping = opponentTyping[opp.userId] || false;
              const oppProgress = opponentProgress[opp.userId] || opp.progress || 0;

              return (
                <div key={opp.userId} style={{
                  display: 'flex', flexDirection: 'column', gap: 0,
                  background: '#0b0e17',
                  border: `1px solid ${oppColor}20`,
                  borderRadius: 10, overflow: 'hidden',
                }}>
                  {/* Opponent header */}
                  <div style={{
                    padding: '8px 14px', background: '#07090e',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: oppColor, boxShadow: `0 0 6px ${oppColor}` }} />
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 12, color: oppColor }}>{opp.username}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                      {oppProgress.toFixed(0)}% done
                    </span>
                  </div>

                  {/* Binary Matrix */}
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <BinaryPanel
                      username={opp.username}
                      progress={oppProgress}
                      isTyping={isTyping}
                      color={oppColor}
                    />
                  </div>

                  {/* Opponent progress bar */}
                  <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>PROGRESS</span>
                      {opp.finished && <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10b981' }}>✅ SUBMITTED</span>}
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${oppProgress}%`, background: oppColor, borderRadius: 2, transition: 'width 0.5s', boxShadow: `0 0 6px ${oppColor}` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Timer display */}
      <div style={{
        position: 'fixed', top: 58, right: 16,
        padding: '6px 16px', borderRadius: 10,
        background: timerCrit ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.7)',
        border: `1px solid ${timerCrit ? '#ef444440' : ac + '20'}`,
        zIndex: 100,
        animation: timerCrit ? 'timerPulse 0.8s infinite' : 'none',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 8, color: timerCrit ? '#ef4444' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>TIME LEFT</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 900, color: timerColor, letterSpacing: 1, textShadow: timerCrit ? '0 0 20px #ef4444' : `0 0 12px ${ac}60` }}>
          {fmtMs(playerMs)}
        </div>
      </div>

      {/* Exit modal */}
      {exitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#0f1523', border: `1.5px solid #ef444440`, borderRadius: 20, padding: '36px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 26, color: '#ef4444', letterSpacing: 3, margin: '0 0 12px' }}>ABANDON BATTLE?</h2>
            <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 28, lineHeight: 1.6 }}>You will forfeit this battle. Your opponent will be declared the winner.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setExitModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${ac}40`, background: `${ac}10`, color: ac, fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 2 }}>
                KEEP FIGHTING
              </button>
              <button onClick={() => navigate('/custom-mode')} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #ef444430', background: '#ef444420', color: '#ef4444', fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 2 }}>
                ABANDON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Round over modal */}
      {roundModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#0f1523', border: `1.5px solid ${ac}40`, borderRadius: 24, padding: '40px', maxWidth: 460, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {roundWinner?.userId === myUserId ? '🏆' : '💀'}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>ROUND {currentRound} COMPLETE</div>
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 32, letterSpacing: 3, margin: '0 0 8px',
              color: roundWinner?.userId === myUserId ? '#10b981' : ac }}>
              {roundWinner?.userId === myUserId ? 'YOU WIN THIS ROUND!' : `${roundWinner?.username || 'OPPONENT'} WINS!`}
            </h2>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              Next round in {nextRoundIn}s...
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {players.filter(p => !p.isSpectator).map((p, i) => (
                <div key={p.userId} style={{
                  padding: '10px 20px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${PLAYER_COLORS[i]}30`,
                }}>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 12, color: PLAYER_COLORS[i], marginBottom: 4 }}>{p.username}</div>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 28, color: 'white' }}>{scores[p.userId] || 0}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>POINTS</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 4px 16px ${CM_ACCENT}40} 50%{box-shadow:0 4px 24px ${CM_ACCENT}70} }
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: ${CM_ACCENT}40; border-radius: 3px; }
      `}</style>
    </div>
  );
}
