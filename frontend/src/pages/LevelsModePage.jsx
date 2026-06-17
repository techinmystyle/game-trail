import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";
import { HtmlIcon, CssIcon, JsIcon, PythonIcon, JavaIcon } from "../components/landing/TechIcons";
import { ChevronLeft } from "lucide-react";
import { PrismThemeToggle } from "../components/landing/PrismThemeToggle";

/* ─── Themes ─── */
const THEMES = {
  red: {
    accent: '#ff5252',
    ui: '#ff6b6b',
    asteroid: '#ff6b6b',
    bg: '#0a0005',
  },
  blue: {
    accent: '#0099ff',
    ui: '#00ccff',
    asteroid: '#00d4ff',
    bg: '#000a1a',
  },
  green: {
    accent: '#00ff88',
    ui: '#00ff99',
    asteroid: '#39ff14',
    bg: '#000a05',
  },
  purple: {
    accent: '#a855f7',
    ui: '#d8b4fe',
    asteroid: '#c084fc',
    bg: '#0a0515',
  },
};

/* ══════════════════════════════════════════
   COURSE DATA
══════════════════════════════════════════ */
const COURSES = [
  {
    id: "html",
    title: "HTML",
    subtitle: "HyperText Markup Language",
    version: "HTML 5",
    badge: "BEGINNER",
    difficulty: 1,
    levels: 100,
    Icon: HtmlIcon,
    description: "The skeleton of every webpage. Write clean, semantic markup that browsers love.",
    topics: ["Tags & Elements", "Semantic HTML", "Forms & Inputs", "Tables", "Accessibility"],
  },
  {
    id: "css",
    title: "CSS",
    subtitle: "Cascading Style Sheets",
    version: "CSS 3",
    badge: "BEGINNER",
    difficulty: 1,
    levels: 100,
    Icon: CssIcon,
    description: "Transform raw HTML into stunning, responsive designs with modern layout systems.",
    topics: ["Selectors & Box Model", "Flexbox & Grid", "Animations", "Responsive Design", "Variables"],
  },
  {
    id: "javascript",
    title: "JAVASCRIPT",
    subtitle: "ECMAScript / ES6+",
    version: "ES 2024",
    badge: "INTERMEDIATE",
    difficulty: 2,
    levels: 100,
    Icon: JsIcon,
    description: "Breathe life into your pages. Master the language of the web — from DOM to async.",
    topics: ["Variables & Functions", "DOM Manipulation", "Async / Await", "Fetch API & JSON", "ES6+"],
  },
  {
    id: "python",
    title: "PYTHON",
    subtitle: "Python Programming",
    version: "Python 3.x",
    badge: "INTERMEDIATE",
    difficulty: 2,
    levels: 100,
    Icon: PythonIcon,
    description: "Clean, powerful, readable. Tackle problems with data structures, algorithms, and OOP.",
    topics: ["Syntax & Types", "Functions & OOP", "File Handling", "Modules & Packages", "Algorithms"],
  },
  {
    id: "java",
    title: "JAVA",
    subtitle: "Java SE / JDK",
    version: "Java 21 LTS",
    badge: "ADVANCED",
    difficulty: 3,
    levels: 100,
    Icon: JavaIcon,
    description: "Enterprise-grade power. Command OOP principles, collections, multithreading, and JVM.",
    topics: ["OOP & Inheritance", "Collections Framework", "Exceptions", "Multithreading", "Generics"],
  },
];

/* ─── Background Components (reused from CustomMode for consistency) ─── */
const HexGrid = ({ theme }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w; canvas.height = h;
    const size = 28;
    const cols = Math.ceil(w / (size * 1.732)) + 2;
    const rows = Math.ceil(h / (size * 1.5)) + 2;
    let frame;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.01;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * size * 1.732 + (r % 2 === 0 ? 0 : size * 0.866);
          const y = r * size * 1.5;
          const pulse = Math.sin(t + r * 0.4 + c * 0.3) * 0.5 + 0.5;
          const alpha = pulse * 0.12 + 0.03;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + size * 0.85 * Math.cos(angle);
            const py = y + size * 0.85 * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          const hex = theme.accent.replace('#', '');
          const rColor = parseInt(hex.substring(0, 2), 16);
          const gColor = parseInt(hex.substring(2, 4), 16);
          const bColor = parseInt(hex.substring(4, 6), 16);
          
          ctx.strokeStyle = `rgba(${rColor},${gColor},${bColor},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    
    const handleResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: 1, pointerEvents: 'none',
    }} />
  );
};

const ScanLines = ({ theme }) => {
  const hex = theme.accent.replace('#', '');
  const rColor = parseInt(hex.substring(0, 2), 16);
  const gColor = parseInt(hex.substring(2, 4), 16);
  const bColor = parseInt(hex.substring(4, 6), 16);
  
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${rColor},${gColor},${bColor},0.012) 2px, rgba(${rColor},${gColor},${bColor},0.012) 4px)`,
    }} />
  );
};

/* ══════════════════════════════════════════
   COURSE CARD (Dark Theme Adapted)
══════════════════════════════════════════ */
const CourseCard = ({ course, theme, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const { title, subtitle, version, difficulty, Icon, description, id } = course;

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        borderRadius: 24,
        border: `1.5px solid ${hovered ? theme.accent : theme.accent + '25'}`,
        background: hovered
          ? `linear-gradient(135deg, ${theme.accent}12, ${theme.accent}04)`
          : `rgba(255,255,255,0.02)`,
        boxShadow: hovered
          ? `0 0 40px ${theme.accent}20, 0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${theme.accent}15`
          : '0 8px 32px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
      }}
    >
      {/* ── Top scanner line ── */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
          animation: 'scanH 2s linear infinite',
        }} />
      )}

      {/* ── Icon banner ── */}
      <div
        className="flex items-center justify-center"
        style={{
          height: "140px",
          background: hovered ? `${theme.accent}25` : `${theme.accent}10`,
          borderBottom: `1px solid ${theme.accent}20`,
          transition: "background 0.4s ease",
          position: "relative",
        }}
      >
        <div style={{ 
          transform: hovered ? 'scale(1.15)' : 'scale(1)', 
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' 
        }}>
          <Icon />
        </div>
      </div>

      {/* ── Title ── */}
      <div className="px-5 pt-5 pb-3 text-center" style={{ borderBottom: `1px solid ${theme.accent}15` }}>
        <h3
          className="font-techno font-black text-white"
          style={{ fontSize: "16px", letterSpacing: "0.2em" }}
        >
          {title}
        </h3>
        <p
          className="font-mono mt-1"
          style={{ fontSize: "10px", letterSpacing: "0.1em", color: 'rgba(255,255,255,0.5)' }}
        >
          {subtitle}
        </p>
        <div className="flex justify-center mt-3">
          <span
            className="inline-block rounded-full px-3 py-1 font-mono font-bold"
            style={{
              fontSize: "9px",
              letterSpacing: "0.15em",
              background: `${theme.accent}20`,
              color: theme.ui,
              border: `1px solid ${theme.accent}40`,
            }}
          >
            {version}
          </span>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="px-5 py-4 flex-1" style={{ borderBottom: `1px solid ${theme.accent}15` }}>
        <p
          className="text-center leading-relaxed"
          style={{ fontSize: "12px", color: 'rgba(255,255,255,0.6)' }}
        >
          {description}
        </p>
      </div>

      {/* ── Difficulty / Stats ── */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: `${theme.accent}08`, borderBottom: `1px solid ${theme.accent}15` }}>
        <span style={{ fontSize: "10px", color: 'rgba(255,255,255,0.4)', fontFamily: "monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Difficulty</span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(d => (
            <div key={d} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: d <= difficulty ? theme.accent : 'rgba(255,255,255,0.1)',
              boxShadow: d <= difficulty ? `0 0 8px ${theme.accent}` : 'none'
            }} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="p-4 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/phases/${id}`);
          }}
          className="w-full font-techno font-black text-white uppercase rounded-xl transition-all duration-300"
          style={{
            padding: "12px 0",
            fontSize: "12px",
            letterSpacing: "0.26em",
            background: hovered ? `linear-gradient(135deg, ${theme.accent}, ${theme.ui})` : `${theme.accent}40`,
            border: `1px solid ${theme.accent}`,
            boxShadow: hovered ? `0 8px 24px ${theme.accent}50` : 'none',
          }}
        >
          START
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   LEVELS MODE PAGE — main export
══════════════════════════════════════════ */
const LevelsModePage = () => {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
  }, [themeKey]);

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const currentTheme = THEMES[themeKey];

  return (
    <div style={{ minHeight: '100vh', background: currentTheme.bg, color: 'white', position: 'relative', overflow: 'hidden', transition: 'background-color 0.5s ease' }}>
      <CustomCursor theme={currentTheme} />
      
      {/* Absolute container for the Theme Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '180px', zIndex: 100 }}>
        <PrismThemeToggle currentThemeKey={themeKey} onThemeChange={setThemeKey} themes={THEMES} />
      </div>

      <Navbar 
        currentPage="levels mode"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={THEMES}
        currentTheme={currentTheme}
      />

      {/* Backgrounds */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <HexGrid theme={currentTheme} />
      </div>
      <ScanLines theme={currentTheme} />

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: '-10%', left: '10%',
        width: 600, height: 600,
        background: `radial-gradient(circle, ${currentTheme.accent}12 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0, animation: 'floatSlow 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed', bottom: '-5%', right: '5%',
        width: 500, height: 500,
        background: `radial-gradient(circle, ${currentTheme.asteroid}10 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0, animation: 'floatSlow 15s ease-in-out infinite reverse',
      }} />

      {/* ═══════════ MAIN ═══════════ */}
      <main style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/tri-mode')} 
            className="flex items-center gap-2 font-techno text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 px-4 py-2 rounded-lg" 
            style={{ 
              color: 'white', 
              background: `${currentTheme.accent}20`, 
              border: `1px solid ${currentTheme.accent}40`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO TRI MODE
          </button>
        </div>

        {/* Page heading */}
        <div className="text-center mb-12">
          {/* Top badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 20px', borderRadius: 20,
            background: `${currentTheme.accent}10`, border: `1px solid ${currentTheme.accent}30`,
            fontFamily: 'monospace', fontSize: 10, color: currentTheme.accent,
            textTransform: 'uppercase', letterSpacing: 4, marginBottom: 22,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: currentTheme.accent, animation: 'pulseGlow 2s infinite', boxShadow: `0 0 8px ${currentTheme.accent}` }} />
            SINGLE PLAYER CAMPAIGN
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: currentTheme.accent, animation: 'pulseGlow 2s infinite 1s', boxShadow: `0 0 8px ${currentTheme.accent}` }} />
          </div>

          <h1 style={{
            margin: '0 0 16px',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
            fontSize: 'clamp(42px, 7vw, 72px)',
            textTransform: 'uppercase', letterSpacing: 6,
            background: `linear-gradient(135deg, white 20%, ${currentTheme.accent} 50%, ${currentTheme.ui} 80%)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
            filter: glitch
              ? `drop-shadow(3px 0 0 ${currentTheme.accent}) drop-shadow(-3px 0 0 ${currentTheme.asteroid})`
              : `drop-shadow(0 0 40px ${currentTheme.accent}30)`,
            transition: 'filter 0.1s',
          }}>
            LEVELS MODE
          </h1>

          <p style={{
            fontFamily: 'monospace', fontSize: 13,
            color: 'rgba(255,255,255,0.4)', margin: '0 auto 36px', maxWidth: 600, lineHeight: 1.8,
            textTransform: 'uppercase', letterSpacing: 2,
          }}>
            Choose your specialization · Complete progressive challenges · Forge your skills
          </p>
        </div>

        {/* ── 5 cards in ONE row ── */}
        <div className="flex gap-6 items-stretch w-full overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: 'none' }}>
          {COURSES.map((course) => (
            <div key={course.id} className="snap-center min-w-[280px]" style={{ flex: '1 1 0' }}>
              <CourseCard course={course} theme={currentTheme} navigate={navigate} />
            </div>
          ))}
        </div>

        {/* Bottom info strip */}
        <div className="mt-8 flex justify-center">
          <div
            className="inline-flex items-center gap-4 rounded-full px-8 py-3.5 border backdrop-blur-sm"
            style={{
              borderColor: `${currentTheme.accent}30`,
              background: `${currentTheme.accent}10`,
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            <span
              className="font-techno font-bold uppercase tracking-widest"
              style={{ fontSize: "11px", color: currentTheme.ui }}
            >
              Unlimited Access · Progressive Difficulty · Real-Time Feedback
            </span>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes floatSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
        @keyframes scanH { 0% { opacity:0; transform:scaleX(0) translateX(-50%); } 50% { opacity:1; } 100% { opacity:0; transform:scaleX(1) translateX(50%); } }
        @keyframes pulseGlow { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default LevelsModePage;
