import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";
import { HtmlIcon, CssIcon, JsIcon, PythonIcon, JavaIcon } from "../components/landing/TechIcons";
import { ChevronLeft } from "lucide-react";

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
    color: '#e34c26',
    description: "The skeleton of every webpage. Write clean, semantic markup that browsers love.",
    topics: ["Tags & Elements", "Semantic HTML", "Forms & Inputs", "Tables", "Accessibility"],
    symbol: '</>',
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
    color: '#1572b6',
    description: "Transform raw HTML into stunning, responsive designs with modern layout systems.",
    topics: ["Selectors & Box Model", "Flexbox & Grid", "Animations", "Responsive Design", "Variables"],
    symbol: '{ }',
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
    color: '#f0db4f',
    description: "Breathe life into your pages. Master the language of the web — from DOM to async.",
    topics: ["Variables & Functions", "DOM Manipulation", "Async / Await", "Fetch API & JSON", "ES6+"],
    symbol: 'JS',
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
    color: '#3776ab',
    description: "Clean, powerful, readable. Tackle problems with data structures, algorithms, and OOP.",
    topics: ["Syntax & Types", "Functions & OOP", "File Handling", "Modules & Packages", "Algorithms"],
    symbol: '🐍',
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
    color: '#e76f00',
    description: "Enterprise-grade power. Command OOP principles, collections, multithreading, and JVM.",
    topics: ["OOP & Inheritance", "Collections Framework", "Exceptions", "Multithreading", "Generics"],
    symbol: '☕',
  },
];

/* ══════════════════════════════════════════
   UNIQUE BACKGROUND: CIRCUIT-BOARD / DATA-STREAM
══════════════════════════════════════════ */
const CircuitBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    // Parse hex color
    const hex = theme.accent.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Hex from asteroid
    const hex2 = theme.asteroid.replace('#', '');
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    // Build circuit nodes
    const GRID = 60;
    const cols = Math.ceil(w / GRID) + 1;
    const rows = Math.ceil(h / GRID) + 1;

    // Random circuit paths
    const nodes = [];
    const paths = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.55) {
          nodes.push({
            x: col * GRID + (Math.random() - 0.5) * 12,
            y: row * GRID + (Math.random() - 0.5) * 12,
            r: Math.random() * 3 + 1.5,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.5 + 0.3,
            bright: Math.random() > 0.7,
          });
        }
      }
    }

    // Connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < GRID * 1.6 && Math.random() > 0.4) {
          // Only horizontal or vertical-ish lines (circuit style)
          if (Math.abs(dx) < 8 || Math.abs(dy) < 8) {
            paths.push({ from: i, to: j, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.4 + 0.2 });
          }
        }
      }
    }

    // Data stream particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.6 + 0.2,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      type: Math.random() > 0.5 ? 'accent' : 'asteroid',
    }));

    let frame;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;

      // Draw circuit paths
      paths.forEach(path => {
        const a = nodes[path.from];
        const b = nodes[path.to];
        const pulse = Math.sin(t * path.speed + path.phase) * 0.5 + 0.5;
        const alpha = pulse * 0.12 + 0.02;
        ctx.beginPath();
        // L-shaped circuit path
        const mx = a.x;
        const my = b.y;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, my);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Dot on corner
        ctx.beginPath();
        ctx.arc(mx, my, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 2})`;
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(node => {
        const pulse = Math.sin(t * node.speed + node.phase) * 0.5 + 0.5;
        const alpha = node.bright ? pulse * 0.5 + 0.1 : pulse * 0.15 + 0.03;

        if (node.bright) {
          // Glow ring for bright nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r2},${g2},${b2},${alpha * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.bright
          ? `rgba(${r2},${g2},${b2},${alpha})`
          : `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      // Data stream particles (falling bits)
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -10 || p.x > w + 10) { p.x = Math.random() * w; }
        const cr = p.type === 'accent' ? r : r2;
        const cg = p.type === 'accent' ? g : g2;
        const cb = p.type === 'accent' ? b : b2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha})`;
        ctx.fill();
      });

      // Horizontal scan-line effect
      const scanY = ((t * 40) % (h + 60)) - 30;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},0.04)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, w, 60);

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
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

/* Floating language glyphs in background */
const FloatingGlyphs = ({ theme }) => {
  const glyphs = ['01', '{}', '<>', '()', '=>', '&&', '||', '!=', '++', '--', 'fn()', 'var', 'if', 'for', 'def', 'class', 'null', '[]'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {glyphs.map((g, i) => (
        <div
          key={g + i}
          style={{
            position: 'absolute',
            left: `${(i * 37 + 5) % 95}%`,
            top: `${(i * 53 + 10) % 90}%`,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: `${Math.floor(i % 3) * 4 + 10}px`,
            color: i % 2 === 0 ? `${theme.accent}12` : `${theme.asteroid}10`,
            fontWeight: 900,
            animation: `glyphFloat ${6 + (i % 5) * 2}s ease-in-out ${i * 0.4}s infinite alternate`,
            userSelect: 'none',
          }}
        >
          {g}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   COURSE CARD — premium dark design
══════════════════════════════════════════ */
const CourseCard = ({ course, theme, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const { title, subtitle, version, difficulty, Icon, description, id, color, symbol } = course;
  const cardAccent = hovered ? color : theme.accent;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        borderRadius: 20,
        border: `1.5px solid ${hovered ? color : theme.accent + '20'}`,
        background: hovered
          ? `linear-gradient(160deg, ${color}14 0%, ${color}06 40%, rgba(255,255,255,0.01) 100%)`
          : 'rgba(255,255,255,0.02)',
        boxShadow: hovered
          ? `0 0 50px ${color}25, 0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 ${color}20`
          : '0 8px 32px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-12px) scale(1.025)' : 'translateY(0) scale(1)',
        transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
      }}
    >
      {/* Top scanning line */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: 'scanH 2s linear infinite',
        }} />
      )}

      {/* Difficulty badge */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        padding: '3px 10px', borderRadius: 20,
        background: difficulty === 1 ? 'rgba(16,185,129,0.15)' : difficulty === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
        border: `1px solid ${difficulty === 1 ? '#10b98140' : difficulty === 2 ? '#f59e0b40' : '#ef444440'}`,
        fontFamily: 'monospace', fontSize: 7, fontWeight: 900,
        color: difficulty === 1 ? '#10b981' : difficulty === 2 ? '#f59e0b' : '#ef4444',
        letterSpacing: 2, textTransform: 'uppercase',
      }}>
        {course.badge}
      </div>

      {/* Icon banner */}
      <div style={{
        height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? `${color}20` : `${color}08`,
        borderBottom: `1px solid ${hovered ? color + '30' : theme.accent + '12'}`,
        transition: 'background 0.4s ease',
        position: 'relative',
      }}>
        {/* Symbol watermark */}
        <div style={{
          position: 'absolute', right: 14, bottom: 8,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 26, fontWeight: 900,
          color: `${color}20`, userSelect: 'none',
        }}>
          {symbol}
        </div>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', width: 100, height: 100, borderRadius: '50%',
          border: `1px dashed ${color}20`,
          animation: hovered ? 'spinRing 12s linear infinite' : 'none',
        }} />
        <div style={{
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          filter: hovered ? `drop-shadow(0 0 16px ${color}60)` : 'none',
        }}>
          <Icon />
        </div>
      </div>

      {/* Title section */}
      <div style={{ padding: '14px 16px 10px', textAlign: 'center', borderBottom: `1px solid ${theme.accent}10` }}>
        <h3 style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, color: 'white',
          fontSize: 15, letterSpacing: '0.2em', margin: '0 0 4px',
          textShadow: hovered ? `0 0 20px ${color}60` : 'none',
          transition: 'text-shadow 0.3s',
        }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'monospace', margin: '0 0 8px', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          {subtitle}
        </p>
        <span style={{
          display: 'inline-block', borderRadius: 20, padding: '2px 10px',
          fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.12em',
          background: `${color}18`, color: hovered ? color : theme.ui,
          border: `1px solid ${color}35`,
          transition: 'color 0.3s',
        }}>
          {version}
        </span>
      </div>

      {/* Description */}
      <div style={{ padding: '10px 16px 10px', flex: 1, borderBottom: `1px solid ${theme.accent}10` }}>
        <p style={{ textAlign: 'center', lineHeight: 1.7, fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
          {description}
        </p>
      </div>

      {/* Difficulty dots */}
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${color}06`, borderBottom: `1px solid ${theme.accent}10` }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Difficulty</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {[1, 2, 3].map(d => (
            <div key={d} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: d <= difficulty ? (hovered ? color : theme.accent) : 'rgba(255,255,255,0.08)',
              boxShadow: d <= difficulty ? `0 0 8px ${hovered ? color : theme.accent}` : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>
          {course.levels} levels
        </span>
      </div>

      {/* Topics chips */}
      <div style={{ padding: '8px 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 4, borderBottom: `1px solid ${theme.accent}10` }}>
        {course.topics.map((t, i) => (
          <span key={i} style={{
            fontFamily: 'monospace', fontSize: 7.5, padding: '2px 7px', borderRadius: 10,
            background: hovered ? `${color}12` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${hovered ? color + '25' : 'rgba(255,255,255,0.06)'}`,
            color: hovered ? `${color}cc` : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 14px' }}>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); navigate(`/phases/${id}`); }}
          style={{
            width: '100%', fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
            color: hovered ? '#000' : 'white', textTransform: 'uppercase',
            borderRadius: 10, border: `1px solid ${hovered ? color : theme.accent + '50'}`,
            padding: '11px 0', fontSize: 12, letterSpacing: '0.24em', cursor: 'pointer',
            background: hovered
              ? `linear-gradient(135deg, ${color}, ${color}cc)`
              : `${theme.accent}25`,
            boxShadow: hovered ? `0 8px 24px ${color}50` : 'none',
            transition: 'all 0.35s',
          }}
        >
          START LEARNING ▶
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
  const [countUp, setCountUp] = useState({ levels: 0, langs: 0, streak: 0 });

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

  // Count-up animation for stats
  useEffect(() => {
    let frame;
    let start = null;
    const targets = { levels: 500, langs: 5, streak: 100 };
    const duration = 1800;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCountUp({
        levels: Math.floor(ease * targets.levels),
        langs: Math.floor(ease * targets.langs),
        streak: Math.floor(ease * targets.streak),
      });
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentTheme = THEMES[themeKey];

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 20% 0%, ${currentTheme.accent}18 0%, transparent 50%),
                   radial-gradient(ellipse at 80% 100%, ${currentTheme.asteroid}12 0%, transparent 50%),
                   ${currentTheme.bg}`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s ease',
    }}>
      <CustomCursor theme={currentTheme} />

      <Navbar
        currentPage="levels mode"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={THEMES}
        currentTheme={currentTheme}
      />

      {/* ── UNIQUE BACKGROUND LAYERS ── */}
      {/* Circuit board canvas */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <CircuitBackground theme={currentTheme} />
      </div>

      {/* Floating code glyphs */}
      <FloatingGlyphs theme={currentTheme} />

      {/* Vignette overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, ${currentTheme.bg}88 100%)`,
      }} />

      {/* Large ambient orb — top left */}
      <div style={{
        position: 'fixed', top: '-15%', left: '-8%',
        width: 700, height: 700,
        background: `radial-gradient(circle, ${currentTheme.accent}14 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0, animation: 'orbFloat1 14s ease-in-out infinite',
        transition: 'background 0.5s',
      }} />
      {/* Bottom-right orb */}
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: 550, height: 550,
        background: `radial-gradient(circle, ${currentTheme.asteroid}12 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0, animation: 'orbFloat2 18s ease-in-out infinite',
        transition: 'background 0.5s',
      }} />
      {/* Center subtle glow */}
      <div style={{
        position: 'fixed', top: '35%', left: '35%',
        width: 400, height: 400,
        background: `radial-gradient(circle, ${currentTheme.accent}07 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0, animation: 'orbFloat1 22s ease-in-out infinite reverse',
      }} />

      {/* ═══════════ MAIN ═══════════ */}
      <main style={{ position: 'relative', zIndex: 1, padding: '36px 24px 80px', maxWidth: 1420, margin: '0 auto' }}>

        {/* Back Button */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate('/tri-mode')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              color: currentTheme.ui, cursor: 'pointer',
              background: `${currentTheme.accent}12`,
              border: `1px solid ${currentTheme.accent}30`,
              padding: '8px 18px', borderRadius: 8,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${currentTheme.accent}22`; e.currentTarget.style.transform = 'translateX(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${currentTheme.accent}12`; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <ChevronLeft size={16} />
            BACK TO TRI MODE
          </button>
        </div>

        {/* ── PAGE HEADING ── */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>

          {/* Live status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 22px', borderRadius: 30,
            background: `${currentTheme.accent}10`,
            border: `1px solid ${currentTheme.accent}30`,
            fontFamily: 'monospace', fontSize: 9, color: currentTheme.accent,
            textTransform: 'uppercase', letterSpacing: 4, marginBottom: 24,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: currentTheme.accent,
              animation: 'pulseGlow 2s infinite',
              boxShadow: `0 0 8px ${currentTheme.accent}`,
            }} />
            SINGLE PLAYER CAMPAIGN · CHOOSE YOUR LANGUAGE
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: currentTheme.asteroid,
              animation: 'pulseGlow 2s infinite 1s',
              boxShadow: `0 0 8px ${currentTheme.asteroid}`,
            }} />
          </div>

          {/* Main title */}
          <h1 style={{
            margin: '0 0 18px',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
            fontSize: 'clamp(48px, 8vw, 80px)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            background: `linear-gradient(135deg, white 20%, ${currentTheme.accent} 52%, ${currentTheme.ui} 80%)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
            filter: glitch
              ? `drop-shadow(3px 0 0 ${currentTheme.accent}) drop-shadow(-3px 0 0 ${currentTheme.asteroid})`
              : `drop-shadow(0 0 40px ${currentTheme.accent}30)`,
            transition: 'filter 0.1s',
          }}>
            LEVELS MODE
          </h1>

          {/* Divider with text */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, transparent, ${currentTheme.accent}50)` }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: `${currentTheme.accent}70`, letterSpacing: 4, textTransform: 'uppercase' }}>
              MASTER · PROGRESS · CONQUER
            </span>
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, ${currentTheme.accent}50, transparent)` }} />
          </div>

          <p style={{
            fontFamily: 'monospace', fontSize: 12,
            color: 'rgba(255,255,255,0.4)', margin: '0 auto 40px', maxWidth: 560, lineHeight: 1.9,
            letterSpacing: 1,
          }}>
            Choose your specialization · Complete progressive challenges · Forge your skills<br/>
            100 levels per language · Instant feedback · Compete on leaderboards
          </p>

          {/* Stats row with count-up */}
          <div style={{
            display: 'inline-flex', alignItems: 'stretch', gap: 0,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${currentTheme.accent}18`,
            borderRadius: 18, overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 50px ${currentTheme.accent}08`,
          }}>
            {[
              { icon: '📚', value: `${countUp.levels}+`, label: 'Total Levels' },
              null,
              { icon: '💻', value: `${countUp.langs}`, label: 'Languages' },
              null,
              { icon: '⭐', value: `${countUp.streak}`, label: 'Max Streak' },
              null,
              { icon: '🏆', value: '∞', label: 'Challenges' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} style={{ width: 1, background: `${currentTheme.accent}15`, alignSelf: 'stretch' }} />
              ) : (
                <div key={item.label} style={{ textAlign: 'center', padding: '14px 24px' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 24, color: currentTheme.accent, lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 3 }}>{item.label}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── 5 COURSE CARDS ── */}
        <div style={{
          display: 'flex', gap: 18, alignItems: 'stretch', width: '100%',
          overflowX: 'auto', paddingBottom: 12,
          scrollbarWidth: 'thin',
          scrollbarColor: `${currentTheme.accent}40 transparent`,
        }}>
          {COURSES.map((course) => (
            <div key={course.id} style={{ flex: '1 1 0', minWidth: 240, maxWidth: 300 }}>
              <CourseCard course={course} theme={currentTheme} navigate={navigate} />
            </div>
          ))}
        </div>

        {/* ── Bottom feature strip ── */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 28,
            padding: '16px 36px', borderRadius: 40,
            background: `${currentTheme.accent}08`,
            border: `1px solid ${currentTheme.accent}18`,
            backdropFilter: 'blur(16px)',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {[
              { icon: '⚡', text: 'Instant Validation' },
              { icon: '📊', text: 'Progress Tracking' },
              { icon: '🎯', text: 'Adaptive Difficulty' },
              { icon: '🔥', text: 'Daily Streaks' },
              { icon: '🏅', text: 'Earn XP & Rewards' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, color: currentTheme.ui, letterSpacing: 1, textTransform: 'uppercase' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes orbFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.05); } 66% { transform: translate(-20px,15px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-25px,20px) scale(1.04); } 66% { transform: translate(20px,-10px) scale(0.98); } }
        @keyframes scanH { 0% { opacity:0; transform:scaleX(0); } 50% { opacity:1; } 100% { opacity:0; transform:scaleX(1); } }
        @keyframes pulseGlow { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes glyphFloat { 0% { transform: translateY(0) rotate(-2deg); opacity: 0.6; } 100% { transform: translateY(-18px) rotate(2deg); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${currentTheme.accent}40; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default LevelsModePage;
