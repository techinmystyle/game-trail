import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Play, Trash2, Trophy, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { computerModeAPI, profileAPI } from '../utils/api';
import { getSocket } from '../utils/socket';

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = {
  red:    { accent: '#ff5252', ui: '#ff6b6b', bg: '#0d0305' },
  blue:   { accent: '#0099ff', ui: '#00ccff', bg: '#020810' },
  green:  { accent: '#00ff88', ui: '#00ff99', bg: '#020d07' },
  purple: { accent: '#a855f7', ui: '#d8b4fe', bg: '#06020d' },
};

const BOT_CONFIGS = {
  'Beginner Bot':        { color: '#10b981', image: '/assets/BEGINNER-BOT-BG.png', tag: 'EASY',   emoji: '🤖', offsetSeconds: 2  },
  'Lazy Compiler':       { color: '#f59e0b', image: '/assets/LAZY-COMPILER-BG.png', tag: 'EASY',   emoji: '😴', offsetSeconds: 5  },
  'Logic Bot':           { color: '#3b82f6', image: '/assets/LOGIC-BOT-BG.png', tag: 'MED',    emoji: '🧠', offsetSeconds: 10 },
  'Flash Coder':         { color: '#8b5cf6', image: '/assets/FLASH-CODER-BG.png', tag: 'HARD',   emoji: '⚡', offsetSeconds: 15 },
  'Test Case Destroyer': { color: '#ef4444', image: '/assets/TEST-CASE-DESTROYER-BG.png', tag: 'EXPERT', emoji: '💀', offsetSeconds: 30 },
};

const ALL_BOTS = Object.keys(BOT_CONFIGS);
const ext = l => ({ HTML: 'html', CSS: 'css', JavaScript: 'js', Python: 'py', Java: 'java' }[l] || 'txt');

// ─── Animated Binary Matrix (compact, 4 rows) ────────────────────────────────
const BinaryMatrix = ({ color, progress }) => {
  const ROWS = 4, COLS = 55;
  const [matrix, setMatrix] = useState(() =>
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => (Math.random() > 0.5 ? '1' : '0'))
    )
  );
  useEffect(() => {
    const iv = setInterval(() => {
      setMatrix(prev =>
        prev.map(row => row.map(c => (Math.random() > 0.88 ? (c === '0' ? '1' : '0') : c)))
      );
    }, 120);
    return () => clearInterval(iv);
  }, []);

  const filled = Math.floor((progress / 100) * ROWS * COLS);
  let count = 0;
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 8, lineHeight: 1.5, userSelect: 'none', overflow: 'hidden' }}>
      {matrix.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          {row.map((cell, ci) => {
            const lit = count++ < filled;
            return (
              <span key={ci} style={{
                color: lit ? color : `${color}22`,
                textShadow: lit ? `0 0 4px ${color}` : 'none',
                transition: 'color 0.15s',
              }}>{cell}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function ComputerModeGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rd = location.state || {};

  const totalRounds  = Number(rd.rounds) || 1;
  const roomTime     = Number(rd.roomTime || rd.timeLimit) || 5;
  const language     = rd.language || 'JavaScript';
  const difficulty   = rd.difficulty || 'Moderate';
  const playerMode   = Number(rd.playerMode) || 1;
  const playerBotsRaw = rd.playerBots || [];

  const [themeKey]   = useState(() => localStorage.getItem('themeKey') || 'purple');
  const { accent: ac, ui, bg: pageBg } = THEMES[themeKey];

  const [roomId]       = useState(() => rd.roomId || 'SOLO');
  const [userId, setUserId]     = useState(() => rd.userId || null);
  const [players, setPlayers]   = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores]     = useState({ player: 0, ai: 0 });
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading]   = useState(true);

  // Editor
  const [userCode, setUserCode] = useState('');
  const [logs, setLogs]         = useState([]);
  const [compiledOutput, setCompiledOutput] = useState('');
  const [testResults, setTestResults]       = useState([]);
  const [allPassed, setAllPassed]           = useState(false);
  const [compiling, setCompiling]           = useState(false);
  const [progress, setProgress]             = useState(0);

  // Timer (ms precision)
  const totalMs    = roomTime * 60 * 1000;
  const [playerMs, setPlayerMs] = useState(totalMs);
  const msCurRef   = useRef(totalMs);
  const startRef   = useRef(null);
  const timerIdRef = useRef(null);

  // Bots
  const [bots, setBots] = useState(() =>
    Array.from({ length: playerMode }, (_, i) => {
      const raw  = playerBotsRaw[i];
      const name = typeof raw === 'string' ? raw : (raw?.name || ALL_BOTS[i % ALL_BOTS.length]);
      const cfg  = BOT_CONFIGS[name] || BOT_CONFIGS['Logic Bot'];
      return { name, cfg, completesAtSecond: roomTime * 60 - cfg.offsetSeconds, progress: 0, finished: false };
    })
  );

  const botsRef = useRef(bots);
  useEffect(() => {
    botsRef.current = bots;
  }, [bots]);

  // Modals
  const [exitModal,  setExitModal]  = useState(false);
  const [roundModal, setRoundModal] = useState(false);
  const [roundWinner, setRoundWinner] = useState(null);
  const [nextRoundIn, setNextRoundIn] = useState(5);
  const roundEndedRef = useRef(false);

  const iframeRef = useRef(null);
  const expectedIframeRef = useRef(null);
  const [previewTab, setPreviewTab] = useState('yours');
  const username  = localStorage.getItem('username') || 'YOU';
  const profileImg = localStorage.getItem('profileImage') || null;
  const socket = getSocket();

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(p => [...p.slice(-80), { msg, type, ts: new Date().toLocaleTimeString() }]);
  }, []);

  // ms formatter  MM:SS.mm
  const fmtMs = ms => {
    const t = Math.max(0, ms);
    const m = Math.floor(t / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const c = Math.floor((t % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;
  };
  const fmtBotS = s => {
    const v = Math.max(0, Math.round(s));
    return `${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`;
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

  // Bot progress simulation
  // Bot progress simulation (Solo mode only)
  useEffect(() => {
    if (loading) return;
    if (roomId !== 'SOLO') return;
    const iv = setInterval(() => {
      const elSec = (totalMs - playerMs) / 1000;
      let botFinished = false;
      setBots(prev => prev.map(b => {
        if (b.finished) {
          botFinished = true;
          return b;
        }
        const pct = Math.min(100, (elSec / b.completesAtSecond) * 100);
        const finished = elSec >= b.completesAtSecond;
        if (finished) botFinished = true;
        return { ...b, progress: Math.max(0, pct), finished };
      }));

      // If in Solo Mode, and a bot has finished, and we haven't submitted yet
      if (botFinished && !allPassed) {
        clearInterval(iv);
        stopTimer();
        // Go to results screen with AI victory
        navigate('/computer-mode/results', {
          state: {
            roomId: 'SOLO', winner: 'ai',
            players: [{ userId: 'me', username, score: 0, finished: false }],
            aiScore: 1, scores: { player: 0, ai: 1 },
            botsUsed: botsRef.current.map(b => ({ name: b.name, progress: 100, finished: true, won: true })),
            timeUsed: totalMs - msCurRef.current, totalRounds: 1, language, difficulty, playerMode,
          },
        });
      }
    }, 300);
    return () => clearInterval(iv);
  }, [loading, playerMs, totalMs, roomId, allPassed, username, language, difficulty, playerMode]);

  // Profile
  useEffect(() => {
    if (!userId) {
      profileAPI.getProfile().then(r => setUserId(r.data.user._id)).catch(() => {});
    }
  }, [userId]);


  // WebSocket — Register listeners ONCE on mount (stable, never re-registered)
  useEffect(() => {
    if (!socket) return;

    const onGameInit = (d) => {
      console.log('[Socket] Received game-init event:', d);
      setChallenge(d.challenge);
      setCurrentRound(d.currentRound);
      setPlayers(d.players);
      setTestResults((d.challenge?.testCases || []).map(() => false));
      setLoading(false);
      startTimer();
    };
    const onRoundEnded = (d) => {
      stopTimer(); roundEndedRef.current = true;
      const w = d.roundWinner;
      setRoundWinner(w.type === 'player' ? (w.name === username ? 'player' : 'competitor') : 'ai');
      setNextRoundIn(d.nextRoundIn || 5);
      setScores({ player: d.players?.find(p => p.userId === userId)?.score || 0, ai: d.aiScore || 0 });
      setRoundModal(true);
    };
    const onNextRound = (d) => {
      roundEndedRef.current = false; setChallenge(d.challenge); setCurrentRound(d.round);
      setTestResults((d.challenge?.testCases||[]).map(()=>false));
      setProgress(0); setUserCode(''); setAllPassed(false); setRoundModal(false);
      msCurRef.current = totalMs; setPlayerMs(totalMs); startRef.current = Date.now(); startTimer();
      setBots(prev => prev.map(b => ({ ...b, progress: 0, finished: false })));
    };
    const onGameStateTick = (d) => {
      if (d.timer !== undefined) {
        msCurRef.current = d.timer * 1000;
        setPlayerMs(d.timer * 1000);
      }
      if (d.players) setPlayers(d.players);
      if (d.bots) {
        setBots(d.bots.map(b => {
          const cfg = BOT_CONFIGS[b.name] || BOT_CONFIGS['Logic Bot'];
          return {
            name: b.name, cfg,
            completesAtSecond: b.delaySeconds + b.completionTime,
            progress: b.progress,
            finished: b.finished
          };
        }));
      }
    };
    const onGameOver = (d) => {
      stopTimer();
      const totalHumanScore = d.players?.reduce((sum, p) => sum + (p.score || 0), 0) || 0;
      const aiScore = d.aiScore || 0;
      let fw = 'ai';
      if (totalHumanScore > aiScore) {
        let maxH = 0;
        d.players?.forEach(p => { if (p.score > maxH) maxH = p.score; });
        const w = d.players?.filter(p => p.score === maxH) || [];
        const isMeTop = w.some(p => p.userId === userId);
        fw = isMeTop ? 'player' : 'competitor';
      } else if (totalHumanScore === aiScore) {
        fw = 'draw';
      }
      navigate('/computer-mode/results', {
        state: {
          roomId, winner: fw, players: d.players,
          scores: { player: d.players?.find(p=>p.userId === userId)?.score||0, ai: d.aiScore||0 },
          botsUsed: botsRef.current.map(b=>({name:b.name,progress:b.progress,finished:b.finished})),
          timeUsed: totalMs - msCurRef.current, totalRounds, language, difficulty, playerMode,
        },
      });
    };

    socket.on('game-init', onGameInit);
    socket.on('round-ended', onRoundEnded);
    socket.on('next-round', onNextRound);
    socket.on('game-state-tick', onGameStateTick);
    socket.on('game-over', onGameOver);

    return () => {
      socket.off('game-init', onGameInit);
      socket.off('round-ended', onRoundEnded);
      socket.off('next-round', onNextRound);
      socket.off('game-state-tick', onGameStateTick);
      socket.off('game-over', onGameOver);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]); // Register once when socket is available

  // Emit join-game once we have both roomId (non-SOLO) and userId
  useEffect(() => {
    if (!socket || roomId === 'SOLO') return;
    const uid = userId || rd.userId;
    if (!uid) return;
    console.log(`[Socket] Emitting join-game: Room = ${roomId}, User = ${uid}`);
    socket.emit('join-game', { roomId, userId: uid });
  }, [socket, roomId, userId]); // Re-emit if userId resolves late

  // Solo challenge load
  useEffect(() => {
    if (roomId !== 'SOLO' || !loading) return;
    (async () => {
      try {
        const res = await computerModeAPI.getChallenge(language, difficulty, roomTime, Date.now());
        const ch  = res.data.challenge || res.data;
        setChallenge(ch); setTestResults((ch?.testCases||[]).map(()=>false));
        addLog(`✅ ${difficulty} ${language} challenge loaded`, 'success');
      } catch {
        const n = difficulty==='Hard'?5:difficulty==='Moderate'?4:3;
        setChallenge({
          title: `${language} ${difficulty} Challenge`,
          objective: `Write a ${language} solution. Pass all ${n} test cases to submit.`,
          testCases: Array.from({length:n},(_,i)=>({id:i+1,description:`Test case ${i+1}`})),
          expectedOutput: `// ${language} output`,
        });
        setTestResults(Array.from({length:n},()=>false));
        addLog('⚠️ Offline mode — local challenge loaded','warning');
      }
      setLoading(false); startTimer();
    })();
  }, [roomId, loading]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = e => {
      if ((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key==='Enter') { e.preventDefault(); if(!compiling&&!roundEndedRef.current) handleCompile(); }
      if ((e.ctrlKey||e.metaKey) && e.shiftKey && e.key==='Enter')  { e.preventDefault(); if(allPassed) handleSubmit(); }
      if (e.key==='Escape') { e.preventDefault(); setExitModal(v=>!v); }
    };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  }, [compiling, allPassed]);

  // Output iframe
  useEffect(() => {
    if (!iframeRef.current || !compiledOutput) return;
    try {
      const d = iframeRef.current.contentDocument;
      if (d) { d.open(); d.write(compiledOutput); d.close(); }
    } catch (err) {
      console.error('Error writing user output:', err);
    }
  }, [compiledOutput, previewTab]);

  // Expected Output iframe
  useEffect(() => {
    if (!expectedIframeRef.current || !challenge?.expectedOutput) return;
    try {
      const d = expectedIframeRef.current.contentDocument;
      if (d) { d.open(); d.write(challenge.expectedOutput); d.close(); }
    } catch (err) {
      console.error('Error writing expected output:', err);
    }
  }, [challenge?.expectedOutput, previewTab]);

  const handleCompile = async () => {
    if (!userCode.trim()) { addLog('✍️ Write some code first!','error'); return; }
    setCompiling(true);
    setPreviewTab('yours');
    addLog('⚙️ Compiling & validating...','info');
    setCompiledOutput(userCode);
    try {
      const res = await computerModeAPI.validateCode({ userCode, challenge, language, timeMinutes: roomTime, difficulty });
      const results = (res.data.validation?.testResults||[]).map(r=>r.passed);
      setTestResults(results);
      const cnt = results.filter(Boolean).length;
      const tot = results.length || (challenge?.testCases?.length||0);
      const pct = tot>0?(cnt/tot)*100:0;
      setProgress(pct);
      if (roomId!=='SOLO') socket.emit('player-progress',{roomId,userId,progress:pct,testsPassed:cnt});
      if (cnt===tot&&tot>0) { setAllPassed(true); addLog(`✅ ALL ${tot}/${tot} TESTS PASSED! Click SUBMIT to win!`,'success'); }
      else { setAllPassed(false); addLog(`⚠️ ${cnt}/${tot} tests passed. Fix the remaining cases.`,'warning'); }
      (res.data.validation?.errors||[]).forEach(e=>addLog(`  ${e.message}`,'error'));
    } catch { addLog('❌ Validation error — check your connection.','error'); }
    setCompiling(false);
  };

  const handleSubmit = () => {
    if (!allPassed) { addLog('❌ Pass all tests first!','error'); return; }
    stopTimer();
    addLog('🚀 SUBMITTED! System judging...','success');
    if (roomId!=='SOLO') { socket.emit('player-finished',{roomId,userId}); return; }
    const myTimeSec = (totalMs-playerMs)/1000;
    const fastestBot = bots.reduce((min,b)=>b.completesAtSecond<min?b.completesAtSecond:min,Infinity);
    const won = myTimeSec<fastestBot || !bots.some(b=>b.finished);
    navigate('/computer-mode/results',{
      state:{
        roomId:'SOLO', winner: won?'player':'ai',
        players:[{userId:'me',username,score:won?1:0,finished:true}],
        aiScore: won?0:1, scores:{player:won?1:0,ai:won?0:1},
        botsUsed: bots.map(b=>({name:b.name,progress:b.progress,finished:b.finished,won:!won})),
        timeUsed: totalMs-playerMs, totalRounds, language, difficulty, playerMode,
      },
    });
  };

  if (loading||!challenge) return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:pageBg,gap:16}}>
      <div style={{width:52,height:52,border:`4px solid ${ac}25`,borderTopColor:ac,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      <p style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:800,color:ac,letterSpacing:3,margin:0,textTransform:'uppercase'}}>LOADING BATTLE CHALLENGE...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const elapsedSec = (totalMs-playerMs)/1000;
  const timerPct   = (playerMs/totalMs)*100;
  const timerCrit  = playerMs<30000;
  const timerColor = timerCrit ? '#ef4444' : ac;

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:pageBg,color:'white',overflow:'hidden'}}>

      {/* ══════════════════ TOP BAR ══════════════════ */}
      <div style={{
        height:44,flexShrink:0,
        display:'flex',alignItems:'center',gap:0,
        background:'rgba(0,0,0,0.7)',
        borderBottom:`1px solid ${ac}28`,
      }}>
        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'0 14px',borderRight:'1px solid rgba(255,255,255,0.06)'}}>
          <Zap size={12} fill={ac} style={{color:ac}}/>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:11,color:ac,letterSpacing:2,whiteSpace:'nowrap'}}>GAME IN MY STYLE</span>
        </div>

        {/* Round indicator */}
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'0 14px',borderRight:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex',gap:4}}>
            {Array.from({length:totalRounds}).map((_,i)=>(
              <div key={i} style={{width:7,height:7,borderRadius:'50%',
                background: i<currentRound ? ac : 'rgba(255,255,255,0.1)',
                boxShadow: i<currentRound ? `0 0 6px ${ac}` : 'none',
                transition:'all 0.3s'
              }}/>
            ))}
          </div>
          <span style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.35)'}}>R{currentRound}/{totalRounds}</span>
        </div>

        {/* Title — center flex */}
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:13,color:'white',textTransform:'uppercase',letterSpacing:1}}>{challenge.title}</span>
          <span style={{fontFamily:'monospace',fontSize:9,padding:'2px 8px',borderRadius:3,background:`${ac}20`,color:ac}}>{language}</span>
          <span style={{fontFamily:'monospace',fontSize:9,padding:'2px 8px',borderRadius:3,background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.45)'}}>{difficulty}</span>
        </div>

        {/* Score */}
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'0 14px',borderLeft:'1px solid rgba(255,255,255,0.06)'}}>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:15,color:ac}}>{scores.player}</span>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:12,color:'rgba(255,255,255,0.2)'}}>:</span>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:15,color:'#f97316'}}>{scores.ai}</span>
        </div>

        {/* Exit */}
        <button onClick={()=>setExitModal(true)} style={{
          height:44,width:44,border:'none',borderLeft:'1px solid rgba(239,68,68,0.2)',
          background:'rgba(239,68,68,0.07)',color:'#ef4444',cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
          transition:'background 0.2s',
        }} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.18)'}
           onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.07)'}>
          <X size={14}/>
        </button>
      </div>

      {/* ══════════════════ MAIN BODY ══════════════════ */}
      <div style={{flex:1,display:'grid',gridTemplateColumns:'45% 28% 27%',minHeight:0,overflow:'hidden',gap:12,padding:12}}>

        {/* ═══════════ COLUMN 1: EDITOR & CHALLENGE ═══════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:0,overflow:'hidden'}}>
           {/* CHALLENGE CARD */}
           <div style={{
             flexShrink:0,
             display:'flex',flexDirection:'column',gap:8,
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             padding:'12px 16px',
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             height:150,
           }}>
             <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
               <div style={{width:3,height:14,borderRadius:2,background:ac,flexShrink:0}}/>
               <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:11,color:ac,textTransform:'uppercase',letterSpacing:2}}>CHALLENGE OBJECTIVE</span>
             </div>
             <div style={{
               flex:1,overflowY:'auto',
               background:'rgba(255,255,255,0.018)',
               borderLeft:`3px solid ${ac}`,
               borderRadius:'0 6px 6px 0',
               padding:'10px 14px',
             }}>
               <p style={{fontFamily:'monospace',fontSize:11.5,color:'#e2e8f0',margin:0,lineHeight:1.6}}>
                 {challenge.objective}
               </p>
             </div>
           </div>

           {/* CODE EDITOR CARD */}
           <div style={{
             flex:1,
             display:'flex',flexDirection:'column',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             minHeight:0,overflow:'hidden',
           }}>
             {/* Header */}
             <div style={{
               background:'#07090e',padding:'8px 14px',flexShrink:0,
               borderBottom:'1px solid rgba(255,255,255,0.06)',
               display:'flex',alignItems:'center',justifyContent:'space-between',
             }}>
               <div style={{display:'flex',alignItems:'center',gap:8}}>
                 <div style={{display:'flex',gap:4}}>
                   {['#ff5f56','#ffbd2e','#27c93f'].map(c=>(
                     <div key={c} style={{width:8,height:8,borderRadius:'50%',background:c}}/>
                   ))}
                 </div>
                 <span style={{fontFamily:'monospace',fontSize:10,color:'#94a3b8',fontWeight:600}}>
                   solution.{ext(language)}
                 </span>
               </div>
               <div style={{display:'flex',alignItems:'center',gap:8}}>
                 <span style={{fontFamily:'monospace',fontSize:8,background:`${ac}20`,color:ac,padding:'2px 8px',borderRadius:4,fontWeight:700,letterSpacing:0.5}}>{language}</span>
                 <span style={{fontFamily:'monospace',fontSize:8,color:'#64748b'}}>Ctrl+Enter: Compile</span>
               </div>
             </div>

             {/* Textarea */}
             <textarea
               value={userCode}
               onChange={e=>setUserCode(e.target.value)}
               placeholder={`// ${challenge.objective}\n\n// Write your ${language} solution here...`}
               spellCheck={false}
               style={{
                 flex:1,minHeight:0,background:'#07090e',color:'#f8fafc',
                 fontFamily:"'JetBrains Mono','Fira Code',monospace",fontSize:13,
                 lineHeight:1.8,padding:'16px',border:'none',resize:'none',outline:'none',
                 caretColor:ac,
               }}
             />

             {/* Action bar */}
             <div style={{
               flexShrink:0,display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:0,
               borderTop:'1px solid rgba(255,255,255,0.06)',background:'#07090e',
               borderRadius:'0 0 10px 10px',overflow:'hidden',
             }}>
               <button
                 onClick={handleCompile}
                 disabled={compiling||roundEndedRef.current}
                 style={{
                   padding:'12px 0',border:'none',borderRight:'1px solid rgba(255,255,255,0.06)',
                   background: compiling?'rgba(16,185,129,0.18)':'#10b981',
                   color:'white',cursor:compiling?'not-allowed':'pointer',
                   fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:13,
                   letterSpacing:2,textTransform:'uppercase',
                   display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                   transition:'all 0.2s',
                 }}
                 onMouseEnter={e=>{ if(!compiling) e.currentTarget.style.background='#059669'; }}
                 onMouseLeave={e=>{ if(!compiling) e.currentTarget.style.background='#10b981'; }}
               >
                 {compiling
                   ?<><div style={{width:11,height:11,border:'2px solid rgba(255,255,255,0.25)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/> COMPILING...</>
                   :<><Play size={12} fill="white"/> COMPILE</>}
               </button>

               <button
                 onClick={handleSubmit}
                 disabled={!allPassed||compiling||roundEndedRef.current}
                 style={{
                   padding:'12px 0',border:'none',borderRight:'1px solid rgba(255,255,255,0.06)',
                   background: allPassed?`linear-gradient(135deg,${ac},${ui})`:'rgba(255,255,255,0.04)',
                   color: allPassed?'white':'rgba(255,255,255,0.2)',
                   cursor: allPassed?'pointer':'not-allowed',
                   fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:13,
                   letterSpacing:2,textTransform:'uppercase',
                   display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                   boxShadow: allPassed?`0 0 20px ${ac}40`:'none',
                   transition:'all 0.3s',
                 }}
               >
                 <Trophy size={12}/> SUBMIT
               </button>

               <button
                 onClick={()=>setExitModal(true)}
                 style={{
                   padding:'12px 20px',border:'none',
                   background:'rgba(239,68,68,0.08)',color:'rgba(239,68,68,0.7)',
                   cursor:'pointer',fontFamily:'Rajdhani,sans-serif',fontWeight:700,
                   fontSize:11,letterSpacing:1,textTransform:'uppercase',
                   display:'flex',alignItems:'center',gap:5,transition:'all 0.2s',
                 }}
                 onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.color='#ef4444'; }}
                 onMouseLeave={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.color='rgba(239,68,68,0.7)'; }}
               >
                 <X size={11}/> EXIT
               </button>
             </div>
           </div>
        </div>

        {/* ═══════════ COLUMN 2: OUTPUTS & CONSOLE ═══════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:0,overflow:'hidden'}}>
           {/* PREVIEW ARENA CARD (tabbed) */}
           <div style={{
             flex:3,
             display:'flex',flexDirection:'column',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             minHeight:0,overflow:'hidden',
           }}>
             {/* Tabs Header */}
             <div style={{
               background:'#07090e',padding:'4px 6px',flexShrink:0,
               borderBottom:'1px solid rgba(255,255,255,0.06)',
               display:'flex',alignItems:'center',gap:4
             }}>
               <button 
                 onClick={() => setPreviewTab('yours')}
                 style={{
                   border:'none',outline:'none',padding:'6px 12px',borderRadius:6,
                   background: previewTab === 'yours' ? `${ac}1e` : 'transparent',
                   color: previewTab === 'yours' ? ac : '#94a3b8',
                   fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:11,
                   letterSpacing:1,cursor:'pointer',transition:'all 0.2s',
                   borderBottom: previewTab === 'yours' ? `2px solid ${ac}` : '2px solid transparent',
                 }}
               >
                 YOUR OUTPUT
               </button>
               <button 
                 onClick={() => setPreviewTab('expected')}
                 style={{
                   border:'none',outline:'none',padding:'6px 12px',borderRadius:6,
                   background: previewTab === 'expected' ? `${ac}1e` : 'transparent',
                   color: previewTab === 'expected' ? ac : '#94a3b8',
                   fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:11,
                   letterSpacing:1,cursor:'pointer',transition:'all 0.2s',
                   borderBottom: previewTab === 'expected' ? `2px solid ${ac}` : '2px solid transparent',
                 }}
               >
                 EXPECTED OUTPUT
               </button>
             </div>

             {/* Preview Body */}
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#07090e', padding: 10 }}>
               {/* Yours Iframe Container */}
               <div style={{ display: previewTab === 'yours' ? 'block' : 'none', width: '100%', height: '100%' }}>
                 {compiledOutput ? (
                   <iframe
                     ref={iframeRef}
                     title="your-output"
                     sandbox="allow-same-origin allow-scripts"
                     style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: 6 }}
                   />
                 ) : (
                   <div style={{ height: '100%', background: '#0a0d14', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Compile code to view live output.</span>
                   </div>
                 )}
               </div>

               {/* Expected Iframe Container */}
               <div style={{ display: previewTab === 'expected' ? 'block' : 'none', width: '100%', height: '100%' }}>
                 {challenge?.expectedOutput ? (
                   <iframe
                     ref={expectedIframeRef}
                     title="expected-output"
                     sandbox="allow-same-origin allow-scripts"
                     style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: 6 }}
                   />
                 ) : (
                   <div style={{ height: '100%', background: '#0a0d14', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>No expected output available.</span>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* CONSOLE LOGS CARD */}
           <div style={{
             flex:2,
             display:'flex',flexDirection:'column',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             minHeight:0,overflow:'hidden',
           }}>
             <div style={{
               background:'#07090e',padding:'6px 14px',flexShrink:0,
               borderBottom:'1px solid rgba(255,255,255,0.06)',
               display:'flex',alignItems:'center',justifyContent:'space-between',
             }}>
               <div style={{display:'flex',alignItems:'center',gap:6}}>
                 <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:2.5}}>
                   Execution Console
                 </span>
                 {logs.length>0 && (
                   <span style={{fontFamily:'monospace',fontSize:8.5,padding:'1px 6px',borderRadius:8,background:`${ac}20`,color:ac,fontWeight:700}}>{logs.length}</span>
                 )}
               </div>
               <button
                 onClick={() => setLogs([])}
                 style={{color:'#64748b',background:'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',padding:4}}
                 title="Clear Console"
               >
                 <Trash2 size={12}/>
               </button>
             </div>

             <div style={{
               flex:1,overflowY:'auto',padding:'12px',
               fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,
               background:'#07090e',lineHeight:1.6,
             }}>
               {logs.length===0
                 ? <span style={{color:'rgba(255,255,255,0.2)'}}>No output logs yet. Compile your code to see feedback.</span>
                 : logs.map((l,i)=>(
                   <div key={i} style={{marginBottom:4,color:
                     l.type==='error'?'#ef4444':
                     l.type==='success'?'#10b981':
                     l.type==='warning'?'#f59e0b':'#94a3b8'
                   }}>{l.msg}</div>
                 ))
               }
             </div>
           </div>
        </div>

        {/* ═══════════ COLUMN 3: STATUS & BOTS ═══════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:0,overflow:'hidden'}}>
           {/* TIMER CARD */}
           <div style={{
             flexShrink:0,padding:'12px 16px',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             height:115,
             display:'flex',flexDirection:'column',justifyContent:'space-between',
           }}>
             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
               <div>
                 <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:9,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1.5,marginBottom:2}}>
                   ⏱ TIME REMAINING
                 </div>
                 <div style={{
                   fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:32,
                   color:timerColor,lineHeight:1,letterSpacing:0.5,
                   textShadow:`0 0 20px ${timerColor}55`,
                   fontVariantNumeric:'tabular-nums',transition:'color 0.3s',
                 }}>
                   {fmtMs(playerMs)}
                 </div>
               </div>

               <div style={{textAlign:'right'}}>
                 {profileImg
                   ? <img src={profileImg} alt="You" style={{width:38,height:38,borderRadius:'50%',objectFit:'cover',border:`2.5px solid ${ac}60`,display:'block',marginLeft:'auto'}}/>
                   : <div style={{width:38,height:38,borderRadius:'50%',background:`${ac}1a`,border:`2.5px solid ${ac}50`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:16,color:ac,marginLeft:'auto'}}>{username[0]}</div>
                 }
                 <div style={{fontFamily:'monospace',fontSize:8,color:'#94a3b8',marginTop:4}}>
                   {username.length>10?username.slice(0,10)+'…':username}
                 </div>
               </div>
             </div>

             <div>
               <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden',marginBottom:4}}>
                 <div style={{
                   height:'100%',borderRadius:2,
                   width:`${timerPct}%`,
                   background:timerColor,
                   boxShadow:`0 0 8px ${timerColor}80`,
                   transition:'width 0.1s linear,background 0.3s',
                 }}/>
               </div>
               <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <span style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.25)'}}>
                   {Math.round(progress)}% complete · {testResults.filter(Boolean).length}/{testResults.length} tests
                 </span>
                 {allPassed && (
                   <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:9,color:'#10b981',animation:'pulse 1s infinite',letterSpacing:0.5}}>
                     ✅ READY TO SUBMIT
                   </span>
                 )}
               </div>
             </div>
           </div>

           {/* TEST CASES CARD */}
           <div style={{
             flexShrink:0,padding:'12px 16px',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             maxHeight:190,overflowY:'auto',
           }}>
             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
               <div style={{display:'flex',alignItems:'center',gap:6}}>
                 <div style={{width:2.5,height:12,borderRadius:2,background:'#10b981'}}/>
                 <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:10,textTransform:'uppercase',letterSpacing:2,color:'white'}}>TEST CASES</span>
               </div>
               <div style={{
                 padding:'2px 8px',borderRadius:20,
                 background: testResults.every(Boolean)?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.05)',
                 border: `1px solid ${testResults.every(Boolean)?'rgba(16,185,129,0.35)':'rgba(255,255,255,0.07)'}`,
                 fontFamily:'monospace',fontSize:8,
                 color: testResults.every(Boolean)?'#10b981':'rgba(255,255,255,0.35)',
                 transition:'all 0.3s',
               }}>
                 {testResults.filter(Boolean).length} / {testResults.length} PASS
               </div>
             </div>

             <div style={{display:'flex',flexDirection:'column',gap:6}}>
               {(challenge.testCases||[]).map((tc,i)=>(
                 <div key={tc.id||i} style={{
                   display:'flex',alignItems:'center',gap:8,padding:'6px 10px',borderRadius:6,
                   background: testResults[i]?'rgba(16,185,129,0.07)':'rgba(255,255,255,0.015)',
                   border: `1px solid ${testResults[i]?'rgba(16,185,129,0.25)':'rgba(255,255,255,0.05)'}`,
                   transition:'all 0.3s',
                 }}>
                   <div style={{
                     width:18,height:18,borderRadius:'50%',flexShrink:0,
                     background: testResults[i]?'#10b981':'rgba(255,255,255,0.06)',
                     display:'flex',alignItems:'center',justifyContent:'center',
                     fontWeight:700,fontSize:9,
                     color: testResults[i]?'white':'rgba(255,255,255,0.3)',
                     boxShadow: testResults[i]?'0 0 6px rgba(16,185,129,0.4)':'none',
                     transition:'all 0.3s',
                   }}>
                     {testResults[i]?'✓':i+1}
                   </div>
                   <span style={{
                     fontFamily:'monospace',fontSize:9.5,lineHeight:1.3,
                     color: testResults[i]?'#6ee7b7':'#94a3b8',
                     flex:1,
                   }}>{tc.description}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* AI OPPONENTS CARD */}
           <div style={{
             flex:1,
             display:'flex',flexDirection:'column',
             background:'#0b0e17',
             border:`1px solid ${ac}25`,
             borderRadius:10,
             boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
             minHeight:0,overflow:'hidden',
           }}>
             {/* Header */}
             <div style={{
               display:'flex',alignItems:'center',gap:6,
               padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',
               background:'#07090e',flexShrink:0,
             }}>
               <div style={{width:2.5,height:12,borderRadius:2,background:'#f97316'}}/>
               <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:10,color:'#f97316',textTransform:'uppercase',letterSpacing:2}}>
                 AI OPPONENTS
               </span>
               <span style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.25)',marginLeft:4}}>
                 {bots.length} bot{bots.length>1?'s':''}
               </span>
             </div>

             {/* Scrollable bots container */}
             <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',padding:'12px 14px 4px'}}>
               {bots.map((bot,idx)=>{
                 const cfg = BOT_CONFIGS[bot.name] || BOT_CONFIGS['Logic Bot'];
                 const remSec = Math.max(0, bot.completesAtSecond - elapsedSec);
                 const playerName = players[idx]?.username || (idx===0?username:`Player ${idx+1}`);

                 return (
                   <div key={idx} style={{
                     padding:'12px 14px',
                     marginBottom:12,
                     background: bot.finished?`${cfg.color}10`:'rgba(255,255,255,0.015)',
                     border: `1px solid ${bot.finished?cfg.color+'60':'rgba(255,255,255,0.09)'}`,
                     borderRadius:10,
                     boxShadow: bot.finished?`0 4px 15px ${cfg.color}15`:'none',
                     transition:'all 0.3s',
                     display:'flex',flexDirection:'column',gap:8,
                   }}>
                     {/* Bot Header */}
                     <div style={{display:'flex',alignItems:'center',gap:8}}>
                       <div style={{position:'relative',flexShrink:0}}>
                         <img src={cfg.image} alt={bot.name} style={{
                           width:30,height:30,borderRadius:'50%',objectFit:'cover',
                           border:`2px solid ${bot.finished?cfg.color:cfg.color+'40'}`,
                           background:'#0d1117',
                           boxShadow: bot.finished?`0 0 10px ${cfg.color}40`:'none',
                           transition:'all 0.4s',
                         }}/>
                         {bot.finished && (
                           <div style={{position:'absolute',top:-4,right:-4,fontSize:8}}>🏁</div>
                         )}
                       </div>

                       <div style={{flex:1,minWidth:0}}>
                         <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:1}}>
                           <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:12,color:cfg.color,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{bot.name}</span>
                           <span style={{fontFamily:'monospace',fontSize:7,padding:'0.5px 4px',borderRadius:2,background:`${cfg.color}20`,color:cfg.color,flexShrink:0}}>{cfg.tag}</span>
                         </div>
                         <div style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.3)'}}>
                           vs <span style={{color:'rgba(255,255,255,0.5)'}}>{playerName}</span>
                         </div>
                       </div>

                       <div style={{flexShrink:0,textAlign:'right'}}>
                         <div style={{
                           fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:16,
                           color: bot.finished?'#ef4444':cfg.color,lineHeight:1,
                           fontVariantNumeric:'tabular-nums',
                         }}>
                           {bot.finished?'DONE':fmtBotS(remSec)}
                         </div>
                         <div style={{fontFamily:'monospace',fontSize:7.5,color:'rgba(255,255,255,0.22)',marginTop:1}}>
                           {Math.round(bot.progress)}%
                         </div>
                       </div>
                     </div>

                     {/* Progress bar */}
                     <div style={{height:3,background:'rgba(255,255,255,0.06)',borderRadius:1.5,overflow:'hidden'}}>
                       <div style={{
                         height:'100%',borderRadius:1.5,
                         width:`${bot.progress}%`,background:cfg.color,
                         boxShadow:`0 0 6px ${cfg.color}50`,
                         transition:'width 0.5s',
                       }}/>
                     </div>

                     {/* Binary Matrix */}
                     <div style={{
                       background:'#04060a',borderRadius:8,
                       padding:'8px 10px',border:`1px solid ${cfg.color}35`,
                       overflow:'hidden',
                       boxShadow: `inset 0 0 10px rgba(0,0,0,0.8)`,
                     }}>
                       <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                         <span style={{fontFamily:'monospace',fontSize:7.5,color:`${cfg.color}aa`,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5}}>
                           {bot.finished ? '✅ DONE' : `${cfg.emoji} AI PROCESSING`}
                         </span>
                         <div style={{flex:1,height:1,background:`${cfg.color}10`}}/>
                       </div>
                       {bot.finished ? (
                         <div style={{
                           fontFamily: 'monospace', fontSize: 10, color: cfg.color,
                           textAlign: 'center', padding: '10px 0', fontWeight: 'bold',
                           textShadow: `0 0 8px ${cfg.color}`,
                         }}>
                           CODE COMPILED & SUBMITTED SUCCESSFULLY
                         </div>
                       ) : (
                         <BinaryMatrix color={cfg.color} progress={bot.progress}/>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>
      </div>

      {/* ══════════ EXIT MODAL ══════════ */}
      {exitModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#111',border:'1px solid rgba(239,68,68,0.25)',borderRadius:20,padding:'32px',maxWidth:360,width:'90%',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:14}}>⚠️</div>
            <h2 style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:22,color:'#ef4444',letterSpacing:2,margin:'0 0 10px',textTransform:'uppercase'}}>FORFEIT MATCH?</h2>
            <p style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.4)',margin:'0 0 24px',lineHeight:1.65}}>
              Leaving now counts as a forfeit. The AI will be declared winner.
            </p>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setExitModal(false)} style={{flex:1,padding:'12px 0',borderRadius:9,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontFamily:'Rajdhani,sans-serif',fontWeight:800,fontSize:13,textTransform:'uppercase'}}>
                KEEP FIGHTING
              </button>
              <button onClick={()=>navigate('/computer-mode')} style={{flex:1,padding:'12px 0',borderRadius:9,border:'none',background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'white',cursor:'pointer',fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:13,textTransform:'uppercase',boxShadow:'0 4px 14px rgba(239,68,68,0.4)'}}>
                FORFEIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ROUND MODAL ══════════ */}
      {roundModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{
            background:'#111',borderRadius:22,padding:'36px',maxWidth:400,width:'90%',textAlign:'center',
            border:`2px solid ${roundWinner==='player'?'rgba(16,185,129,0.5)':roundWinner==='ai'?'rgba(239,68,68,0.5)':ac+'60'}`,
            boxShadow: roundWinner==='player'?'0 0 60px rgba(16,185,129,0.18)':roundWinner==='ai'?'0 0 60px rgba(239,68,68,0.18)':`0 0 60px ${ac}15`,
          }}>
            <div style={{fontSize:62,marginBottom:12,animation:'bounceIn 0.5s ease'}}>
              {roundWinner==='player'?'🏆':roundWinner==='ai'?'💀':'👾'}
            </div>
            <h2 style={{
              fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:28,letterSpacing:3,
              textTransform:'uppercase',margin:'0 0 8px',
              color:roundWinner==='player'?'#10b981':roundWinner==='ai'?'#ef4444':ac,
            }}>
              {roundWinner==='player'?'ROUND WIN!':roundWinner==='ai'?'AI WINS ROUND':'TEAM WIN!'}
            </h2>
            <div style={{display:'flex',gap:20,justifyContent:'center',margin:'20px 0'}}>
              <div>
                <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:48,color:ac}}>{scores.player}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.3)'}}>YOU</div>
              </div>
              <div style={{alignSelf:'center',fontFamily:'Rajdhani,sans-serif',fontSize:20,color:'rgba(255,255,255,0.2)'}}>:</div>
              <div>
                <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:900,fontSize:48,color:'#f97316'}}>{scores.ai}</div>
                <div style={{fontFamily:'monospace',fontSize:8,color:'rgba(255,255,255,0.3)'}}>AI</div>
              </div>
            </div>
            <div style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.35)',animation:'pulse 1s infinite'}}>
              {currentRound<totalRounds?`⏳ Next round in ${nextRoundIn}s...`:'⏳ Computing final results...'}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes bounceIn{ 0%{transform:scale(0.2);opacity:0;} 60%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        textarea::placeholder { color: #2d333b; }
      `}</style>
    </div>
  );
}