import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Play, Trophy, Zap, BookOpen, Lock, Eye, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { computerModeAPI, profileAPI } from '../utils/api';
import { getSocket } from '../utils/socket';

/* ── Theme map ─────────────────────────────────────────────────── */
const THEMES = {
  red:    { accent: '#ff5252', ui: '#ff6b6b', bg: '#050105' },
  blue:   { accent: '#0099ff', ui: '#00ccff', bg: '#00050f' },
  green:  { accent: '#00ff88', ui: '#00ff99', bg: '#000a05' },
  purple: { accent: '#a855f7', ui: '#d8b4fe', bg: '#060110' },
};

const PAGE_BG = '#010d12'; // fallback dark bg
const ext = l => ({ HTML: 'html', CSS: 'css', JavaScript: 'js', Python: 'py', Java: 'java' }[l] || 'txt');

// ── Animated Binary Panel ──
const BinaryPanel = ({ username, progress = 0, isTyping = false, color }) => {
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
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
            {username}.enc [ENCRYPTED]
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isTyping && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: `${color}18`, border: `1px solid ${color}30`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, animation: 'binaryPulse 0.5s infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 13, color, fontWeight: 700 }}>TYPING...</span>
            </div>
          )}
          <Lock size={12} style={{ color: `${color}60` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: `${color}60` }}>OBFUSCATED</span>
        </div>
      </div>

      {/* Binary content */}
      <div style={{ flex: 1, padding: '12px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 13, lineHeight: 1.6, userSelect: 'none' }}>
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

        {/* Progress overlay bar */}
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
      <Lock size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
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

    <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 28, letterSpacing: 2 }}>
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
        <div style={{ borderLeft: `3px solid ${ac}`, paddingLeft: 16, fontFamily: 'monospace', fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, marginBottom: 16 }}>
          {challenge.objective}
        </div>
        {challenge.testCases && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {challenge.testCases.map((tc, i) => (
              <div key={i} style={{
                padding: '4px 12px', borderRadius: 20,
                background: `${ac}10`, border: `1px solid ${ac}20`,
                fontFamily: 'monospace', fontSize: 14, color: `${ac}90`,
              }}>
                Test {i + 1}{tc.description ? `: ${tc.description}` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

// ── Output Panel ──
const OutputPanel = ({ testResults, challenge, outputData, logs, ac }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('tests');

  const testCount = challenge?.testCases?.length || 0;
  const passCount = testResults.filter(Boolean).length;

  return (
    <div style={{
      flexShrink: 0,
      background: '#07090e',
      border: `1px solid ${ac}15`,
      borderRadius: 8,
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
        background: '#0a0d14',
      }}>
        {/* Tabs */}
        {[
          { id: 'tests', label: `TEST CASES (${passCount}/${testCount})` },
          { id: 'output', label: 'OUTPUT' },
          { id: 'logs', label: `LOGS (${logs.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(true); }}
            style={{
              padding: '7px 14px', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id && expanded ? `${ac}12` : 'transparent',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: activeTab === tab.id && expanded ? `2px solid ${ac}` : '2px solid transparent',
              fontFamily: 'monospace', fontSize: 14, fontWeight: 700, letterSpacing: 1,
              color: activeTab === tab.id && expanded ? ac : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            padding: '7px 12px', border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'monospace', fontSize: 14,
          }}
        >
          {expanded ? <><ChevronDown size={12} /> HIDE</> : <><ChevronUp size={12} /> SHOW</>}
        </button>
      </div>

      {/* Panel content */}
      {expanded && (
        <div style={{ maxHeight: 180, overflowY: 'auto' }}>
          {/* ── TEST CASES TAB ── */}
          {activeTab === 'tests' && (
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {testCount === 0 ? (
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '16px 0' }}>
                  // Run your code to see test results
                </div>
              ) : (
                challenge.testCases.map((tc, i) => {
                  const passed = testResults[i];
                  const od = outputData?.[i];
                  return (
                    <div key={i} style={{
                      borderRadius: 8,
                      border: `1px solid ${passed === true ? '#10b98130' : passed === false ? '#ef444430' : 'rgba(255,255,255,0.08)'}`,
                      background: passed === true ? 'rgba(16,185,129,0.04)' : passed === false ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
                      overflow: 'hidden',
                    }}>
                      {/* Test header */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: passed === true ? '#10b98120' : passed === false ? '#ef444420' : 'rgba(255,255,255,0.06)',
                          border: `1.5px solid ${passed === true ? '#10b981' : passed === false ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'monospace', fontSize: 14, fontWeight: 900,
                          color: passed === true ? '#10b981' : passed === false ? '#ef4444' : 'rgba(255,255,255,0.6)',
                        }}>
                          {passed === true ? '✓' : passed === false ? '✗' : i + 1}
                        </div>
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13,
                          color: passed === true ? '#10b981' : passed === false ? '#ef4444' : 'rgba(255,255,255,0.6)' }}>
                          Test Case {i + 1}
                          {tc.description ? ` — ${tc.description}` : ''}
                        </span>
                        <span style={{
                          marginLeft: 'auto', fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
                          color: passed === true ? '#10b981' : passed === false ? '#ef4444' : 'rgba(255,255,255,0.55)',
                        }}>
                          {passed === true ? 'PASSED' : passed === false ? 'FAILED' : 'PENDING'}
                        </span>
                      </div>
                      {/* Test details */}
                      <div style={{ padding: '6px 12px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {tc.input !== undefined && (
                          <div>
                            <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>INPUT</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all' }}>
                              {JSON.stringify(tc.input)}
                            </div>
                          </div>
                        )}
                        <div>
                          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>EXPECTED</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#10b981', background: 'rgba(16,185,129,0.06)', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all' }}>
                            {tc.expectedOutput !== undefined ? JSON.stringify(tc.expectedOutput) : tc.expected !== undefined ? JSON.stringify(tc.expected) : '—'}
                          </div>
                        </div>
                        {od?.actualOutput !== undefined && (
                          <div>
                            <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>YOUR OUTPUT</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: passed ? '#10b981' : '#ef4444', background: passed ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all' }}>
                              {JSON.stringify(od.actualOutput)}
                            </div>
                          </div>
                        )}
                        {od?.error && (
                          <div style={{ gridColumn: '1/-1' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#ef4444', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>ERROR</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,0.06)', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all' }}>
                              {od.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── OUTPUT TAB ── */}
          {activeTab === 'output' && (
            <div style={{ padding: '10px 12px' }}>
              {outputData && outputData.length > 0 ? (
                outputData.map((od, i) => (
                  od?.stdout ? (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                        ► Test {i+1} stdout:
                      </div>
                      <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: 6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {od.stdout}
                      </pre>
                    </div>
                  ) : null
                ))
              ) : (
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '16px 0' }}>
                  // Run your code to see output
                </div>
              )}
            </div>
          )}

          {/* ── LOGS TAB ── */}
          {activeTab === 'logs' && (
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logs.length === 0 ? (
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '16px 0' }}>
                  // System logs appear here...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={{
                    fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'baseline',
                    color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : 'rgba(255,255,255,0.8)',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13, flexShrink: 0 }}>{log.ts}</span>
                    <span>{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Player colors for multi-player
const PLAYER_COLORS = ['#00e5ff', '#ff6b35', '#a855f7', '#10b981'];

export default function CustomModeGamePage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const rd         = location.state || {};

  const totalRounds = Number(rd.rounds) || 3;
  const roomTime    = Number(rd.roomTime || rd.timeLimit) || 5;
  const language    = rd.language || 'JavaScript';
  const difficulty  = rd.difficulty || 'Moderate';
  const playerMode  = Number(rd.playerMode) || 2;
  const isSpectator = rd.isSpectator || false;

  // ── Dynamic theme from localStorage ──
  const [themeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  const theme = THEMES[themeKey] || THEMES.purple;
  const ac    = theme.accent;

  const [roomId]      = useState(() => rd.roomId || 'CUSTOM');
  const [myUserId, setMyUserId]   = useState(() => rd.userId || null);
  const [myUsername]  = useState(() => localStorage.getItem('username') || 'YOU');

  const [challenge, setChallenge] = useState(() => rd.gameData?.challenge || null);
  const [loading, setLoading]     = useState(() => !rd.gameData?.challenge);
  const [currentRound, setCurrentRound] = useState(() => rd.gameData?.currentRound || 1);
  const [scores, setScores]             = useState({});
  const [players, setPlayers]           = useState(() => rd.gameData?.players || rd.players || []);
  const [opponentTyping, setOpponentTyping]     = useState({});
  const [opponentProgress, setOpponentProgress] = useState({});

  // Editor
  const [userCode, setUserCode]       = useState('');
  const [testResults, setTestResults] = useState([]);
  const [outputData, setOutputData]   = useState([]); // per-test output detail
  const [allPassed, setAllPassed]     = useState(false);
  const [compiling, setCompiling]     = useState(false);
  const [logs, setLogs]               = useState([]);
  const [progress, setProgress]       = useState(0);

  // Timer
  const totalMs    = roomTime * 60 * 1000;
  const initMs     = rd.gameData?.timer ? rd.gameData.timer * 1000 : totalMs;
  const [playerMs, setPlayerMs] = useState(initMs);
  const msCurRef   = useRef(initMs);
  const startRef   = useRef(null);
  const timerIdRef = useRef(null);

  // Reading phase
  const [readingPhase, setReadingPhase]         = useState(false);
  const [readingCountdown, setReadingCountdown] = useState(15);
  const readingDoneRef = useRef(false);

  // Modals
  const [exitModal, setExitModal]   = useState(false);
  const [roundModal, setRoundModal] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [nextRoundIn, setNextRoundIn] = useState(5);
  const roundEndedRef  = useRef(false);
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

  // Profile fetch for userId
  useEffect(() => {
    if (!myUserId) {
      profileAPI.getProfile().then(r => setMyUserId(r.data.user._id)).catch(() => {});
    }
  }, [myUserId]);

  // Multiplayer init from route state
  const mpInitDone = useRef(false);
  useEffect(() => {
    if (mpInitDone.current) return;
    const gd = rd.gameData;
    if (!gd?.challenge) return;
    mpInitDone.current = true;
    setChallenge(gd.challenge);
    setCurrentRound(gd.currentRound || 1);
    setPlayers(gd.players || []);
    // ── FIX: initialize testResults array with false for each test case ──
    const tcLen = gd.challenge?.testCases?.length || 0;
    setTestResults(Array(tcLen).fill(null));
    setOutputData(Array(tcLen).fill(null));
    if (gd.timer) { msCurRef.current = gd.timer * 1000; setPlayerMs(gd.timer * 1000); }
    setLoading(false);
    setTimeout(() => startReadingPhase(), 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Socket listeners — re-register when myUserId is known
  useEffect(() => {
    const sock = getSocket();
    if (!sock) return;

    const onGameInit = (d) => {
      setChallenge(d.challenge);
      setCurrentRound(d.currentRound);
      setPlayers(d.players || []);
      const tcLen = d.challenge?.testCases?.length || 0;
      setTestResults(Array(tcLen).fill(null));
      setOutputData(Array(tcLen).fill(null));
      setLoading(false);
      startReadingPhase();
    };

    const onGameTick = (d) => {
      if (d.timer !== undefined) {
        msCurRef.current = d.timer * 1000;
        startRef.current = Date.now();
        setPlayerMs(d.timer * 1000);
      }
      if (d.players) {
        setPlayers(d.players);
        // ── FIX: update opponent progress map ──
        const prog = {};
        d.players.forEach(p => {
          if (p.userId !== myUserId) prog[p.userId] = p.progress ?? 0;
        });
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

    const onProgressUpdate = (d) => {
      // Real-time progress from opponent
      if (d.userId !== myUserId) {
        setOpponentProgress(prev => ({ ...prev, [d.userId]: d.progress ?? 0 }));
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
      const tcLen = d.challenge?.testCases?.length || 0;
      setTestResults(Array(tcLen).fill(null));
      setOutputData(Array(tcLen).fill(null));
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
    sock.on('custom-player-progress-update', onProgressUpdate);
    sock.on('custom-round-ended', onRoundEnded);
    sock.on('custom-next-round', onNextRound);
    sock.on('custom-game-over', onGameOver);

    return () => {
      sock.off('custom-game-init', onGameInit);
      sock.off('custom-game-state-tick', onGameTick);
      sock.off('custom-player-completed', onPlayerCompleted);
      sock.off('custom-player-typing-update', onTypingUpdate);
      sock.off('custom-player-progress-update', onProgressUpdate);
      sock.off('custom-round-ended', onRoundEnded);
      sock.off('custom-next-round', onNextRound);
      sock.off('custom-game-over', onGameOver);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  // Emit join-game once userId is ready
  useEffect(() => {
    const sock = getSocket();
    if (!sock || !myUserId) return;
    sock.emit('custom-join-game', { roomId, userId: myUserId });
  }, [roomId, myUserId]);

  // Handle typing events
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
      const validation = res.data.validation || {};
      const rawResults = validation.testResults || [];
      const results    = rawResults.map(r => r.passed);

      // ── FIX: preserve null for missing tests, store per-test output ──
      const tcLen  = challenge?.testCases?.length || 0;
      const filled = Array(tcLen).fill(null).map((_, i) => results[i] !== undefined ? results[i] : null);
      setTestResults(filled);
      // Store detailed output per test
      const details = Array(tcLen).fill(null).map((_, i) => rawResults[i] ? {
        actualOutput: rawResults[i].actualOutput,
        stdout: rawResults[i].stdout || '',
        error: rawResults[i].error || null,
      } : null);
      setOutputData(details);

      const cnt  = results.filter(Boolean).length;
      const tot  = tcLen > 0 ? tcLen : results.length;
      const pct  = tot > 0 ? (cnt / tot) * 100 : 0;
      setProgress(pct);

      // Emit progress to server so opponents' binary panels update
      const sock = getSocket();
      if (sock && myUserId) {
        sock.emit('custom-player-progress', { roomId, userId: myUserId, progress: pct, testsPassed: cnt });
      }

      if (cnt === tot && tot > 0) {
        setAllPassed(true);
        addLog(`✅ ALL ${tot}/${tot} TESTS PASSED! Click SUBMIT to WIN!`, 'success');
      } else {
        setAllPassed(false);
        addLog(`⚠️ ${cnt}/${tot} tests passed. Fix remaining cases.`, 'warning');
      }
      (validation.errors || []).forEach(e => addLog(`  ${e.message}`, 'error'));
    } catch (err) {
      addLog('❌ Validation error — check your connection.', 'error');
    }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compiling, allPassed, readingPhase, isSpectator]);

  // ── FIX: also init testResults when challenge loads with no socket data ──
  useEffect(() => {
    if (challenge && testResults.length === 0 && challenge.testCases?.length > 0) {
      setTestResults(Array(challenge.testCases.length).fill(null));
      setOutputData(Array(challenge.testCases.length).fill(null));
    }
  }, [challenge]);

  if (loading || !challenge) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: PAGE_BG, gap: 16 }}>
      <div style={{ width: 52, height: 52, border: `4px solid ${ac}25`, borderTopColor: ac, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 800, color: ac, letterSpacing: 3, margin: 0, textTransform: 'uppercase' }}>LOADING BATTLE CHALLENGE...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const timerPct   = (playerMs / totalMs) * 100;
  const timerCrit  = playerMs < 30000;
  const timerColor = timerCrit ? '#ef4444' : ac;

  // Identify players
  const myPlayer    = players.find(p => p.userId === myUserId);
  const opponents   = players.filter(p => p.userId !== myUserId && !p.isSpectator);

  // ── FIX: If players not loaded yet, generate placeholder opponents from playerMode ──
  const placeholderOpponents = opponents.length === 0 && !isSpectator
    ? Array.from({ length: playerMode - 1 }, (_, i) => ({
        userId: `placeholder-${i}`,
        username: `Player ${i + 2}`,
        progress: 0,
        finished: false,
      }))
    : opponents;

  const effectiveOpponents = opponents.length > 0 ? opponents : placeholderOpponents;
  const opponentCount      = effectiveOpponents.length;

  const gridCols = isSpectator
    ? `repeat(${Math.min(playerMode, 4)}, 1fr)`
    : opponentCount === 1 ? '42% 58%'
    : opponentCount === 2 ? '34% 33% 33%'
    : '28% 24% 24% 24%';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: PAGE_BG, color: 'white', overflow: 'hidden' }}>

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
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 13, color: ac, letterSpacing: 2 }}>CUSTOM MODE</span>
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
          <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>R{currentRound}/{totalRounds}</span>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 13, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>{challenge.title}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 14, padding: '2px 8px', borderRadius: 3, background: `${ac}20`, color: ac }}>{language}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 14, padding: '2px 8px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>{difficulty}</span>
          {isSpectator && (
            <span style={{ fontFamily: 'monospace', fontSize: 14, padding: '2px 8px', borderRadius: 3, background: `${ac}20`, color: ac, display: 'flex', alignItems: 'center', gap: 4 }}>
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

        {/* Timer in top bar */}
        <div style={{
          padding: '0 14px', borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: timerCrit ? '#ef4444' : 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 1 }}>TIME</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 900, color: timerColor, letterSpacing: 1, animation: timerCrit ? 'timerPulse 0.8s infinite' : 'none' }}>
            {fmtMs(playerMs)}
          </div>
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
      <div style={{ height: 3, flexShrink: 0, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${timerPct}%`,
          background: timerCrit
            ? 'linear-gradient(90deg, #ef4444, #ff6b6b)'
            : `linear-gradient(90deg, ${ac}, ${theme.ui})`,
          boxShadow: `0 0 8px ${timerCrit ? '#ef4444' : ac}`,
          transition: 'width 0.1s linear, background 0.5s',
        }} />
      </div>

      {/* ══ MAIN BODY ══ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: gridCols, minHeight: 0, overflow: 'hidden', gap: 6, padding: 6 }}>

        {/* ═══ SPECTATOR MODE ═══ */}
        {isSpectator ? (
          players.filter(p => !p.isSpectator).map((p, idx) => (
            <div key={p.userId} style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              background: '#0b0e17', border: `1px solid ${PLAYER_COLORS[idx % PLAYER_COLORS.length]}25`,
              borderRadius: 10, overflow: 'hidden',
            }}>
              <div style={{ padding: '8px 14px', background: '#07090e', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAYER_COLORS[idx % PLAYER_COLORS.length] }} />
                <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, color: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}>{p.username}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>· {p.progress || 0}% done</span>
                {p.finished && <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 13, color: '#10b981' }}>✅ SUBMITTED</span>}
              </div>
              <div style={{ flex: 1 }}>
                <BinaryPanel
                  username={p.username}
                  progress={p.progress || 0}
                  isTyping={opponentTyping[p.userId] || false}
                  color={PLAYER_COLORS[idx % PLAYER_COLORS.length]}
                />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* ═══ COLUMN 1: CHALLENGE + MY EDITOR + CONTROLS ═══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0, overflow: 'hidden' }}>

              {/* Challenge card */}
              <div style={{
                flexShrink: 0,
                background: '#0b0e17', border: `1px solid ${ac}20`,
                borderRadius: 10, padding: '10px 14px', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 3, height: 12, borderRadius: 2, background: ac }} />
                  <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 13, color: ac, textTransform: 'uppercase', letterSpacing: 2 }}>CHALLENGE</span>
                  {/* My progress indicator */}
                  {progress > 0 && (
                    <span style={{
                      marginLeft: 'auto', fontFamily: 'monospace', fontSize: 13,
                      color: allPassed ? '#10b981' : ac,
                      background: allPassed ? 'rgba(16,185,129,0.12)' : `${ac}15`,
                      padding: '2px 8px', borderRadius: 10, border: `1px solid ${allPassed ? '#10b98140' : ac + '30'}`,
                    }}>
                      MY: {progress.toFixed(0)}%
                    </span>
                  )}
                </div>
                <div style={{ borderLeft: `3px solid ${ac}`, paddingLeft: 10, maxHeight: 60, overflowY: 'auto' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>{challenge.objective}</p>
                </div>
              </div>

              {/* MY CODE EDITOR */}
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                background: '#0b0e17', border: `1px solid ${readingPhase ? 'rgba(255,255,255,0.08)' : ac + '22'}`,
                borderRadius: 10, minHeight: 0, overflow: 'hidden',
                opacity: readingPhase ? 0.5 : 1, transition: 'opacity 0.3s, border-color 0.3s',
              }}>
                {/* Editor header */}
                <div style={{ background: '#07090e', padding: '7px 14px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />)}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>solution.{ext(language)} — {myUsername}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {readingPhase && <span style={{ fontFamily: 'monospace', fontSize: 13, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={8} /> LOCKED
                    </span>}
                    <span style={{ fontFamily: 'monospace', fontSize: 13, background: `${ac}20`, color: ac, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{language}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#64748b' }}>Ctrl+Enter: Run · Ctrl+Shift+Enter: Submit</span>
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
                    lineHeight: 1.8, padding: '14px', border: 'none', resize: 'none', outline: 'none',
                    caretColor: ac, cursor: readingPhase ? 'not-allowed' : 'text',
                    tabSize: 2,
                  }}
                />

                {/* Progress bar under editor */}
                <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: allPassed ? '#10b981' : ac, transition: 'width 0.5s', boxShadow: `0 0 6px ${allPassed ? '#10b981' : ac}` }} />
                </div>
              </div>

              {/* Controls row */}
              <div style={{ flexShrink: 0, display: 'flex', gap: 6, alignItems: 'center' }}>
                {/* Test result pills */}
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {(challenge.testCases || []).map((_, i) => (
                    <div key={i} style={{
                      height: 28, flex: 1, borderRadius: 6,
                      background: testResults[i] === true ? 'rgba(16,185,129,0.2)' : testResults[i] === false ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${testResults[i] === true ? '#10b98140' : testResults[i] === false ? '#ef444430' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'monospace', fontSize: 14,
                      color: testResults[i] === true ? '#10b981' : testResults[i] === false ? '#ef4444' : 'rgba(255,255,255,0.6)',
                      transition: 'all 0.3s',
                    }}>
                      {testResults[i] === true ? '✓' : testResults[i] === false ? '✗' : `T${i + 1}`}
                    </div>
                  ))}
                </div>

                {/* Compile */}
                <button onClick={handleCompile} disabled={compiling || readingPhase} style={{
                  padding: '0 16px', height: 28, borderRadius: 6,
                  border: `1px solid ${ac}30`,
                  background: compiling ? 'rgba(255,255,255,0.08)' : `${ac}18`,
                  color: compiling ? 'rgba(255,255,255,0.6)' : ac,
                  fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, letterSpacing: 2,
                  cursor: compiling ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {compiling ? <><div style={{ width: 10, height: 10, border: `2px solid ${ac}40`, borderTopColor: ac, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> RUN</> : <><Play size={10} fill={ac} /> RUN</>}
                </button>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={!allPassed} style={{
                  padding: '0 16px', height: 28, borderRadius: 6, border: 'none',
                  background: allPassed ? `linear-gradient(135deg, ${ac}, ${theme.ui})` : 'rgba(255,255,255,0.06)',
                  color: allPassed ? '#001a20' : 'rgba(255,255,255,0.2)',
                  fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 14, letterSpacing: 2,
                  cursor: allPassed ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  boxShadow: allPassed ? `0 4px 16px ${ac}40` : 'none',
                  display: 'flex', alignItems: 'center', gap: 5,
                  animation: allPassed ? 'glowPulse 2s infinite' : 'none',
                }}>
                  <Trophy size={11} fill={allPassed ? '#001a20' : 'rgba(255,255,255,0.2)'} /> SUBMIT
                </button>
              </div>

              {/* ── OUTPUT PANEL (Test Cases + Expected/Actual output + Logs) ── */}
              <OutputPanel
                testResults={testResults}
                challenge={challenge}
                outputData={outputData}
                logs={logs}
                ac={ac}
              />
            </div>

            {/* ═══ OPPONENT PANELS ═══ */}
            {effectiveOpponents.map((opp, idx) => {
              const oppColor   = PLAYER_COLORS[(idx + 1) % PLAYER_COLORS.length];
              const isTyping   = opponentTyping[opp.userId] || false;
              const oppProgress = opponentProgress[opp.userId] ?? opp.progress ?? 0;
              const isPlaceholder = opp.userId?.startsWith('placeholder-');

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
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: oppColor, boxShadow: `0 0 6px ${oppColor}`, animation: isPlaceholder ? 'binaryPulse 2s infinite' : 'none' }} />
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, color: oppColor }}>{opp.username}</span>
                    {isPlaceholder ? (
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>
                        ⏳ WAITING TO CONNECT...
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginLeft: 'auto' }}>
                        {oppProgress.toFixed(0)}% done
                      </span>
                    )}
                  </div>

                  {/* Binary Matrix — always shown */}
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <BinaryPanel
                      username={opp.username}
                      progress={oppProgress}
                      isTyping={isTyping}
                      color={oppColor}
                    />
                  </div>

                  {/* Opponent progress footer */}
                  <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, background: '#080a12' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>PROGRESS</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {opp.finished
                          ? <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#10b981' }}>✅ SUBMITTED</span>
                          : isTyping
                            ? <span style={{ fontFamily: 'monospace', fontSize: 13, color: oppColor }}>⌨️ TYPING...</span>
                            : null
                        }
                        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 14, color: oppColor }}>{oppProgress.toFixed(0)}%</span>
                      </div>
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

      {/* Exit modal */}
      {exitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#0f1523', border: '1.5px solid #ef444440', borderRadius: 20, padding: '36px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 26, color: '#ef4444', letterSpacing: 3, margin: '0 0 12px' }}>ABANDON BATTLE?</h2>
            <p style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 28, lineHeight: 1.6 }}>You will forfeit this battle. Your opponent will be declared the winner.</p>
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
            <div style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 4, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>ROUND {currentRound} COMPLETE</div>
            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 32, letterSpacing: 3, margin: '0 0 8px',
              color: roundWinner?.userId === myUserId ? '#10b981' : ac }}>
              {roundWinner?.userId === myUserId ? 'YOU WIN THIS ROUND!' : `${roundWinner?.username || 'OPPONENT'} WINS!`}
            </h2>
            <p style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
              Next round in {nextRoundIn}s...
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {players.filter(p => !p.isSpectator).map((p, i) => (
                <div key={p.userId} style={{
                  padding: '10px 20px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${PLAYER_COLORS[i]}30`,
                }}>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 800, fontSize: 14, color: PLAYER_COLORS[i], marginBottom: 4 }}>{p.username}</div>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 900, fontSize: 28, color: 'white' }}>{scores[p.userId] || 0}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>POINTS</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes binaryPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 4px 16px ${ac}40} 50%{box-shadow:0 4px 24px ${ac}70} }
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: ${ac}40; border-radius: 3px; }
      `}</style>
    </div>
  );
}
