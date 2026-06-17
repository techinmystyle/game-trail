import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Rocket, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/landing/CustomCursor';

const CM_ACCENT = '#00e5ff';
const CM_UI     = '#80ffff';
const CM_BG     = '#010d12';

const PLAYER_MODES = [
  { value: 2, icon: '⚔️', label: '2P',  sub: '2 Humans battle' },
  { value: 3, icon: '🔱', label: '3P',  sub: '3 Humans battle' },
  { value: 4, icon: '👑', label: '4P',  sub: '4 Humans battle' },
];

const TIME_OPTIONS = [3, 4, 5, 6, 7, 8];
const ROUND_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LANGUAGES = [
  { value: 'HTML',       icon: '🌐', color: '#e34c26' },
  { value: 'CSS',        icon: '🎨', color: '#1572b6' },
  { value: 'JavaScript', icon: '⚡', color: '#f7df1e' },
  { value: 'Python',     icon: '🐍', color: '#3776ab' },
  { value: 'Java',       icon: '☕', color: '#007396' },
];

function getDifficultyFromTime(t) {
  if (t <= 4) return { value: 'Beginner', tests: 3, color: '#10b981', icon: '⭐', label: 'BEGINNER MODE' };
  if (t <= 6) return { value: 'Moderate', tests: 4, color: '#f59e0b', icon: '🛡️', label: 'MODERATE MODE' };
  return { value: 'Advanced', tests: 5, color: '#ef4444', icon: '🔥', label: 'ADVANCED MODE' };
}

const Section = ({ title, subtitle, children }) => (
  <div style={{
    background: 'rgba(0,229,255,0.03)',
    border: '1px solid rgba(0,229,255,0.1)',
    borderRadius: 16, padding: '18px 20px',
  }}>
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: CM_ACCENT }} />
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, color: 'white' }}>{title}</div>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', paddingLeft: 11 }}>{subtitle}</div>
    </div>
    {children}
  </div>
);

const PillSel = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {options.map(opt => {
      const isSelected = opt === value;
      return (
        <div key={opt} onClick={() => onChange(opt)} style={{
          padding: '8px 18px', borderRadius: 100,
          border: `1.5px solid ${isSelected ? CM_ACCENT : 'rgba(255,255,255,0.08)'}`,
          background: isSelected ? `${CM_ACCENT}18` : 'rgba(255,255,255,0.02)',
          color: isSelected ? CM_ACCENT : 'rgba(255,255,255,0.5)',
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16,
          cursor: 'pointer', transition: 'all 0.2s',
          boxShadow: isSelected ? `0 0 16px ${CM_ACCENT}25` : 'none',
        }}>
          {opt}
        </div>
      );
    })}
  </div>
);

const CustomModeRoomCreationPage = () => {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  useEffect(() => { localStorage.setItem('themeKey', themeKey); }, [themeKey]);

  const themes = {
    red: { accent: '#ff5252', ui: '#ff6b6b' },
    blue: { accent: '#0099ff', ui: '#00ccff' },
    green: { accent: '#00ff88', ui: '#00ff99' },
    purple: { accent: '#a855f7', ui: '#d8b4fe' },
  };

  const [config, setConfig] = useState({
    playerMode: 2,
    rounds: 3,
    timeLimit: 5,
    language: 'JavaScript',
  });

  const [isCreating, setIsCreating] = useState(false);

  const update = (key, val) => setConfig(p => ({ ...p, [key]: val }));
  const diffInfo = getDifficultyFromTime(config.timeLimit);

  const selStyle = (isSelected, color = CM_ACCENT) => ({
    border: `1.5px solid ${isSelected ? color : 'rgba(255,255,255,0.07)'}`,
    background: isSelected ? `${color}12` : 'rgba(255,255,255,0.02)',
    boxShadow: isSelected ? `0 0 20px ${color}20` : 'none',
    cursor: 'pointer', borderRadius: 12, transition: 'all 0.2s',
  });

  const handleEnterArena = () => {
    setIsCreating(true);
    const roomId = 'CUST-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const roomPassword = Math.random().toString(36).substr(2, 6).toUpperCase();

    setTimeout(() => {
      navigate('/custom-mode/lobby', {
        state: {
          roomId,
          roomPassword,
          playerMode: config.playerMode,
          rounds: config.rounds,
          roomTime: config.timeLimit,
          language: config.language,
          difficulty: diffInfo.value,
          isHost: true,
          mode: 'custom',
        },
      });
      setIsCreating(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: CM_BG, color: 'white' }}>
      <CustomCursor theme={{ accent: CM_ACCENT, ui: CM_UI }} />
      <Navbar currentPage="custom-mode" themeKey={themeKey} setThemeKey={setThemeKey} themes={themes} currentTheme={{ accent: CM_ACCENT, ui: CM_UI }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500,
        background: `radial-gradient(ellipse, ${CM_ACCENT}10 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Hex grid subtle */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <button onClick={() => navigate('/custom-mode')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 8, border: `1.5px solid ${CM_ACCENT}40`, background: `${CM_ACCENT}10`,
            color: CM_ACCENT, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${CM_ACCENT}20`}
          onMouseLeave={e => e.currentTarget.style.background = `${CM_ACCENT}10`}
          >
            <ChevronLeft size={16} /> BACK
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 4, color: CM_ACCENT, textTransform: 'uppercase', marginBottom: 4 }}>
              CONFIGURE YOUR HUMAN BATTLE
            </div>
            <h1 style={{
              margin: 0, fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 38,
              textTransform: 'uppercase', letterSpacing: 4,
              background: `linear-gradient(135deg, white 30%, ${CM_ACCENT})`,
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              color: 'transparent', WebkitTextFillColor: 'transparent',
            }}>
              ROOM SETTINGS
            </h1>
          </div>
          <div style={{ width: 90 }} />
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

          {/* LEFT — config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Player Mode — NO 1P */}
            <Section title="👥 Player Mode" subtitle="Choose the number of human players — no solo, no bots!">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {PLAYER_MODES.map(m => (
                  <div key={m.value} onClick={() => update('playerMode', m.value)}
                    style={{ ...selStyle(config.playerMode === m.value), padding: '16px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 18,
                      color: config.playerMode === m.value ? CM_ACCENT : 'rgba(255,255,255,0.7)' }}>{m.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{m.sub}</div>
                    {config.playerMode === m.value && <CheckCircle2 size={14} style={{ color: CM_ACCENT, marginTop: 5 }} />}
                  </div>
                ))}
              </div>
              {/* No-solo notice */}
              <div style={{
                marginTop: 12, padding: '8px 14px', borderRadius: 8,
                background: `${CM_ACCENT}08`, border: `1px solid ${CM_ACCENT}20`,
                fontFamily: 'monospace', fontSize: 10, color: `${CM_ACCENT}80`,
              }}>
                ⚠️ Custom Mode is Human vs Human only — No AI bots involved!
              </div>
            </Section>

            {/* Time Limit */}
            <Section title="⏱️ Time Limit" subtitle="Minutes per round — auto-detects difficulty">
              <PillSel options={TIME_OPTIONS} value={config.timeLimit} onChange={v => update('timeLimit', v)} />
              {/* Difficulty badge */}
              <div style={{
                marginTop: 12, padding: '12px 16px', borderRadius: 10,
                background: `${diffInfo.color}12`, border: `1.5px solid ${diffInfo.color}35`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 22 }}>{diffInfo.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 15, color: diffInfo.color, letterSpacing: 2 }}>
                    {diffInfo.label} ACTIVATED
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {config.timeLimit} min → {diffInfo.tests} test cases per challenge
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto', padding: '4px 12px', borderRadius: 20,
                  background: `${diffInfo.color}20`, border: `1px solid ${diffInfo.color}40`,
                  fontFamily: 'monospace', fontSize: 10, color: diffInfo.color, fontWeight: 700,
                }}>
                  {diffInfo.tests} TESTS
                </div>
              </div>
              <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                3–4 min → Beginner · 5–6 min → Moderate · 7–8 min → Advanced
              </div>
            </Section>

            {/* Rounds */}
            <Section title="🔄 Rounds" subtitle="Number of rounds (1–10) — best score wins">
              <PillSel options={ROUND_OPTIONS} value={config.rounds} onChange={v => update('rounds', v)} />
            </Section>

            {/* Language */}
            <Section title="💻 Language" subtitle="Programming language for all coding challenges">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                {LANGUAGES.map(l => (
                  <div key={l.value} onClick={() => update('language', l.value)}
                    style={{ ...selStyle(config.language === l.value, l.color), padding: '12px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{l.icon}</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10,
                      color: config.language === l.value ? l.color : 'rgba(255,255,255,0.5)' }}>{l.value}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT — Summary + CTA */}
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${CM_ACCENT}10, ${CM_ACCENT}04)`,
              border: `1.5px solid ${CM_ACCENT}30`,
              borderRadius: 18, padding: '22px',
              position: 'sticky', top: 24,
            }}>
              {/* Header */}
              <div style={{
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 15,
                color: CM_ACCENT, marginBottom: 18, letterSpacing: 2, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Zap size={16} /> BATTLE SUMMARY
              </div>

              {/* Config grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Mode', value: `${config.playerMode}P Human Battle` },
                  { label: 'Rounds', value: `${config.rounds} rounds` },
                  { label: 'Time / Round', value: `${config.timeLimit} min` },
                  { label: 'Language', value: config.language },
                  { label: 'Difficulty', value: diffInfo.value },
                  { label: 'Test Cases', value: `${diffInfo.tests} tests` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px',
                  }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)',
                      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: 'white' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Difficulty badge */}
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 14,
                background: `${diffInfo.color}10`, border: `1px solid ${diffInfo.color}30`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{diffInfo.icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13, color: diffInfo.color, letterSpacing: 1 }}>
                  {diffInfo.label}
                </span>
              </div>

              {/* Multiplayer info */}
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: `${CM_ACCENT}08`, border: `1px solid ${CM_ACCENT}22`,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <AlertTriangle size={13} style={{ color: CM_ACCENT, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  Share <strong style={{ color: CM_ACCENT }}>Room ID + Password</strong> with your {config.playerMode - 1} opponent{config.playerMode > 2 ? 's' : ''} after creating the room.
                </span>
              </div>

              {/* Winner rule */}
              <div style={{
                padding: '8px 14px', borderRadius: 8, marginBottom: 16,
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 13 }}>🏆</span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  <strong style={{ color: '#10b981' }}>First to pass all test cases</strong> and submit wins the round!
                </span>
              </div>

              {/* Enter Arena */}
              <button onClick={handleEnterArena} disabled={isCreating} id="custom-enter-arena-btn" style={{
                width: '100%', padding: '16px 0', borderRadius: 12, border: 'none',
                background: isCreating ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${CM_ACCENT}, ${CM_UI})`,
                color: isCreating ? 'rgba(255,255,255,0.4)' : '#001a20',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
                fontSize: 15, letterSpacing: 3, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: isCreating ? 'none' : `0 8px 32px ${CM_ACCENT}40`,
                transition: 'all 0.3s',
              }}>
                {isCreating ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '3px solid rgba(0,0,0,0.3)',
                      borderTopColor: '#001a20', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    CREATING ARENA...
                  </>
                ) : (
                  <>
                    <Rocket size={16} /> ENTER THE ARENA <ChevronRight size={16} />
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'monospace',
                fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>
                Room ID generated automatically on creation
              </div>
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

export default CustomModeRoomCreationPage;
