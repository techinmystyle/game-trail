import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/landing/CustomCursor';
import { Lock, Hash, ChevronLeft, ArrowRight } from 'lucide-react';

const CM_ACCENT = '#00e5ff';
const CM_UI     = '#80ffff';
const CM_ORANGE = '#ff6b35';
const CM_BG     = '#010d12';

const CustomModeJoinPage = () => {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  useEffect(() => { localStorage.setItem('themeKey', themeKey); }, [themeKey]);

  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [joining, setJoining] = useState(false);

  const themes = {
    red: { accent: '#ff5252', ui: '#ff6b6b' },
    blue: { accent: '#0099ff', ui: '#00ccff' },
    green: { accent: '#00ff88', ui: '#00ff99' },
    purple: { accent: '#a855f7', ui: '#d8b4fe' },
  };

  const handleJoin = () => {
    if (!roomId.trim()) return;
    setJoining(true);
    setTimeout(() => {
      navigate('/custom-mode/lobby', {
        state: {
          roomId: roomId.trim().toUpperCase(),
          password: password.trim().toUpperCase(),
          isJoining: true,
          mode: 'custom',
        },
      });
    }, 600);
  };

  const canJoin = roomId.trim().length > 0;

  return (
    <div style={{ minHeight: '100vh', background: CM_BG, color: 'white', position: 'relative', overflow: 'hidden' }}>
      <CustomCursor theme={{ accent: CM_ACCENT, ui: CM_UI }} />
      <Navbar currentPage="custom-mode" themeKey={themeKey} setThemeKey={setThemeKey} themes={themes} currentTheme={{ accent: CM_ACCENT, ui: CM_UI }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400,
        background: `radial-gradient(ellipse, ${CM_ACCENT}12 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(${CM_ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${CM_ACCENT} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Corner glow */}
      <div style={{
        position: 'fixed', bottom: '10%', right: '5%',
        width: 400, height: 400,
        background: `radial-gradient(circle, ${CM_ORANGE}10 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Back button */}
          <button onClick={() => navigate('/custom-mode')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', marginBottom: 28,
            borderRadius: 8, border: `1px solid ${CM_ACCENT}30`, background: `${CM_ACCENT}08`,
            color: CM_ACCENT, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${CM_ACCENT}18`}
          onMouseLeave={e => e.currentTarget.style.background = `${CM_ACCENT}08`}
          >
            <ChevronLeft size={14} /> BACK TO CUSTOM MODE
          </button>

          {/* Card */}
          <div style={{
            background: 'rgba(0,229,255,0.03)',
            border: `1.5px solid ${CM_ACCENT}20`,
            borderRadius: 24, padding: '40px 36px',
            boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 40px ${CM_ACCENT}08`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top border accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${CM_ACCENT}, transparent)`,
            }} />

            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18, margin: '0 auto 18px',
                background: `linear-gradient(135deg, ${CM_ORANGE}, #ff9b6b)`,
                boxShadow: `0 8px 30px ${CM_ORANGE}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
              }}>
                🎯
              </div>
              <h1 style={{ margin: '0 0 8px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 32, textTransform: 'uppercase', letterSpacing: 3, color: 'white' }}>
                JOIN BATTLE
              </h1>
              <p style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Enter your credentials to join a human vs human arena
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Room ID */}
              <div>
                <label style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, color: CM_ACCENT, display: 'block', marginBottom: 8 }}>
                  ROOM ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Hash size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
                  <input
                    id="custom-join-room-id"
                    type="text"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && canJoin && handleJoin()}
                    placeholder="e.g. CUST-AB12CD34"
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px', borderRadius: 10, outline: 'none',
                      background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${roomId ? CM_ACCENT + '60' : 'rgba(255,255,255,0.08)'}`,
                      color: 'white', fontFamily: 'monospace', fontSize: 14,
                      transition: 'all 0.2s', caretColor: CM_ACCENT, letterSpacing: 1,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = CM_ACCENT; e.currentTarget.style.boxShadow = `0 0 12px ${CM_ACCENT}15`; }}
                    onBlur={e => { e.currentTarget.style.borderColor = roomId ? CM_ACCENT + '60' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 8 }}>
                  PASSWORD <span style={{ color: 'rgba(255,255,255,0.55)', textTransform: 'lowercase', fontSize: 13 }}>(required)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
                  <input
                    id="custom-join-password"
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && canJoin && handleJoin()}
                    placeholder="Enter room password"
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px', borderRadius: 10, outline: 'none',
                      background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)',
                      color: 'white', fontFamily: 'monospace', fontSize: 14,
                      transition: 'all 0.2s', caretColor: CM_ACCENT, letterSpacing: 1,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = CM_ACCENT; e.currentTarget.style.boxShadow = `0 0 12px ${CM_ACCENT}15`; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Info box */}
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: `${CM_ACCENT}06`, border: `1px solid ${CM_ACCENT}18`,
                fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
              }}>
                🎯 Get your Room ID and Password from the host's battle lobby screen. Room IDs start with <strong style={{ color: CM_ACCENT }}>CUST-</strong>
              </div>

              {/* Join Button */}
              <button id="custom-join-btn" onClick={handleJoin} disabled={!canJoin || joining} style={{
                width: '100%', padding: '16px 0', borderRadius: 12, border: 'none', marginTop: 8,
                background: canJoin && !joining
                  ? `linear-gradient(135deg, ${CM_ORANGE}, #ff9b6b)`
                  : 'rgba(255,255,255,0.06)',
                color: canJoin ? 'white' : 'rgba(255,255,255,0.2)',
                cursor: canJoin ? 'pointer' : 'not-allowed',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, textTransform: 'uppercase',
                fontSize: 16, letterSpacing: 3,
                boxShadow: canJoin && !joining ? `0 8px 30px ${CM_ORANGE}40` : 'none',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                {joining ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.6)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    JOINING...
                  </>
                ) : (
                  <>🎯 JOIN BATTLE <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default CustomModeJoinPage;
