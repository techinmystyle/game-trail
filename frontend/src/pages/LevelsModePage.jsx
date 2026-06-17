import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/landing/CustomCursor";
import { HtmlIcon, CssIcon, JsIcon, PythonIcon, JavaIcon } from "../components/landing/TechIcons";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Themes (synced with whole app) ────────────────────────────── */
const THEMES = {
  red:    { accent: '#ff5252', ui: '#ff6b6b', asteroid: '#ff6b6b', bg: '#0d0305' },
  blue:   { accent: '#0099ff', ui: '#00ccff', asteroid: '#00d4ff', bg: '#020810' },
  green:  { accent: '#00ff88', ui: '#00ff99', asteroid: '#39ff14', bg: '#020d07' },
  purple: { accent: '#a855f7', ui: '#d8b4fe', asteroid: '#c084fc', bg: '#06020d' },
};

/* ─── Course data ────────────────────────────────────────────────── */
const COURSES = [
  {
    id: "html",
    title: "HTML",
    subtitle: "HyperText Markup Language",
    version: "HTML5",
    badge: "BEGINNER",
    badgeColor: "#10b981",
    difficulty: 1,
    levels: 100,
    Icon: HtmlIcon,
    langColor: "#e34c26",
    glyph: "</>",
    description: "Build the skeleton of every webpage. Write clean, semantic markup browsers love.",
    features: [
      "Tags, Attributes & Semantic Structure",
      "Forms, Tables & Accessibility",
      "HTML5 APIs & Media Elements",
    ],
  },
  {
    id: "css",
    title: "CSS",
    subtitle: "Cascading Style Sheets",
    version: "CSS3",
    badge: "BEGINNER",
    badgeColor: "#10b981",
    difficulty: 1,
    levels: 100,
    Icon: CssIcon,
    langColor: "#1572b6",
    glyph: "{ }",
    description: "Transform raw HTML into stunning, responsive designs with modern layout systems.",
    features: [
      "Flexbox, Grid & Box Model",
      "Animations, Transitions & Variables",
      "Responsive Design & Media Queries",
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    subtitle: "ECMAScript / ES6+",
    version: "ES2024",
    badge: "INTERMEDIATE",
    badgeColor: "#f59e0b",
    difficulty: 2,
    levels: 100,
    Icon: JsIcon,
    langColor: "#f0db4f",
    glyph: "JS",
    description: "Breathe life into pages. Master the language of the web — DOM to async.",
    features: [
      "Variables, Functions & Closures",
      "Async / Await, Fetch & Promises",
      "DOM Manipulation & ES6+ Features",
    ],
  },
  {
    id: "python",
    title: "Python",
    subtitle: "Python Programming",
    version: "Python 3.x",
    badge: "INTERMEDIATE",
    badgeColor: "#f59e0b",
    difficulty: 2,
    levels: 100,
    Icon: PythonIcon,
    langColor: "#3776ab",
    glyph: "🐍",
    description: "Clean, powerful, readable. Tackle data structures, algorithms, and OOP.",
    features: [
      "Syntax, Types & Data Structures",
      "OOP, Decorators & Generators",
      "File I/O, Modules & Algorithms",
    ],
  },
  {
    id: "java",
    title: "Java",
    subtitle: "Java SE / JDK",
    version: "Java 21 LTS",
    badge: "ADVANCED",
    badgeColor: "#ef4444",
    difficulty: 3,
    levels: 100,
    Icon: JavaIcon,
    langColor: "#e76f00",
    glyph: "☕",
    description: "Enterprise-grade power. Master OOP, collections, multithreading & JVM.",
    features: [
      "OOP Principles & Inheritance",
      "Collections, Generics & Exceptions",
      "Multithreading & Java Streams",
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   UNIQUE BACKGROUND: NEURAL NETWORK / SYNAPTIC WEB
   — Nodes pulse and fire energy signals along connections.
   — Completely different from:
       • Computer Mode (binary rain — falling characters)
       • Custom Mode   (hex grid  — static honeycomb)
   — Represents "learning pathways" — thematically perfect.
════════════════════════════════════════════════════════════════ */
const NeuralWeb = ({ accent, asteroid }) => {
  const canvasRef = useRef(null);
  const accentRef  = useRef(accent);
  const asteroidRef = useRef(asteroid);

  // Keep color refs up-to-date when theme changes without destroying canvas
  useEffect(() => {
    accentRef.current   = accent;
    asteroidRef.current = asteroid;
  }, [accent, asteroid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    // ── Build nodes ──────────────────────────────────────────────
    const NODE_COUNT = Math.floor((W * H) / 14000);          // density
    const CONNECT_DIST = Math.min(W, H) * 0.18;               // max edge length

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * 0.28,
      vy:     (Math.random() - 0.5) * 0.28,
      r:      Math.random() * 2.8 + 1.2,
      phase:  Math.random() * Math.PI * 2,
      speed:  Math.random() * 0.4 + 0.2,
      bright: Math.random() > 0.75,                           // 25% are hub nodes
    }));

    // ── Pulses that travel along edges ───────────────────────────
    const pulses = [];
    const spawnPulse = () => {
      // Pick a random node that has neighbours
      const from = Math.floor(Math.random() * nodes.length);
      pulses.push({
        from,
        to:       -1,      // resolved when drawn
        t:        0,       // 0→1 along edge
        speed:    Math.random() * 0.008 + 0.004,
        useAster: Math.random() > 0.65,
      });
    };

    // Seed a few pulses
    for (let i = 0; i < 6; i++) spawnPulse();

    // ── Animation loop ───────────────────────────────────────────
    let frame;
    let tick = 0;

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);

      const ac  = accentRef.current;
      const ast = asteroidRef.current;

      // Parse accent hex to RGB for rgba()
      const hexToRgb = hex => {
        const h = hex.replace('#', '');
        return [
          parseInt(h.substring(0, 2), 16),
          parseInt(h.substring(2, 4), 16),
          parseInt(h.substring(4, 6), 16),
        ];
      };
      const [ar, ag, ab] = hexToRgb(ac);
      const [xr, xg, xb] = hexToRgb(ast);

      // Move nodes (slow drift)
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        // Bounce off walls
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
      });

      // Draw edges + pulse travel
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;

          const fade  = 1 - dist / CONNECT_DIST;
          const alpha = fade * 0.12;

          // Edge line
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha})`;
          ctx.lineWidth   = fade * 0.8;
          ctx.stroke();
        }
      }

      // Draw pulses along edges
      pulses.forEach((p, pi) => {
        // Find a live neighbouring node each frame
        const src = nodes[p.from];
        let bestDist = Infinity;
        let bestIdx  = -1;
        nodes.forEach((n, ni) => {
          if (ni === p.from) return;
          const dx = src.x - n.x, dy = src.y - n.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST && d < bestDist) { bestDist = d; bestIdx = ni; }
        });

        if (bestIdx === -1) { p.t = 1; return; }   // no neighbour — skip
        p.to = bestIdx;

        p.t += p.speed;

        const a = nodes[p.from];
        const b = nodes[p.to];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        const cr = p.useAster ? xr : ar;
        const cg = p.useAster ? xg : ag;
        const cb = p.useAster ? xb : ab;

        // Glow halo
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 9);
        grd.addColorStop(0, `rgba(${cr},${cg},${cb},0.7)`);
        grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Pulse dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.95)`;
        ctx.fill();

        // Recycle pulse when it reaches destination
        if (p.t >= 1) {
          p.from = p.to;
          p.t    = 0;
          p.speed = Math.random() * 0.009 + 0.004;
          p.useAster = Math.random() > 0.65;
        }
      });

      // Spawn a new pulse occasionally
      if (tick % 90 === 0 && pulses.length < 18) spawnPulse();

      // Draw nodes
      nodes.forEach(n => {
        const pulse  = Math.sin(tick * n.speed * 0.04 + n.phase) * 0.5 + 0.5;
        const alpha  = n.bright ? pulse * 0.75 + 0.2  : pulse * 0.25 + 0.05;
        const radius = n.bright ? n.r * 1.6            : n.r;

        if (n.bright) {
          // Outer glow ring for hub nodes
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
          grd.addColorStop(0, `rgba(${xr},${xg},${xb},${alpha * 0.4})`);
          grd.addColorStop(1, `rgba(${xr},${xg},${xb},0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${xr},${xg},${xb},${alpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
          ctx.fill();
        }
      });

      frame = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  // Run once — accent/asteroid handled by refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.55, pointerEvents: 'none',
      }}
    />
  );
};

/* ─── Stat badge ─────────────────────────────────────────────────── */
const StatBadge = ({ icon, value, label, color }) => (
  <div style={{ textAlign: 'center', padding: '16px 28px' }}>
    <div style={{ fontSize: 22, marginBottom: 5 }}>{icon}</div>
    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, fontSize: 26, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 3 }}>{label}</div>
  </div>
);

/* ─── Course Card ────────────────────────────────────────────────── */
const CourseCard = ({ course, theme, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const { title, subtitle, version, badge, badgeColor, difficulty, Icon, langColor, glyph, description, features } = course;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        borderRadius: 24,
        border: `1.5px solid ${hovered ? langColor : theme.accent + '28'}`,
        background: hovered
          ? `linear-gradient(160deg, ${langColor}14 0%, ${langColor}05 50%, rgba(255,255,255,0.01) 100%)`
          : 'rgba(255,255,255,0.02)',
        boxShadow: hovered
          ? `0 0 60px ${langColor}22, 0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 ${langColor}18`
          : '0 8px 32px rgba(0,0,0,0.45)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.42s cubic-bezier(0.34,1.56,0.64,1)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 480,
      }}
    >
      {/* Scan line on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${langColor}, transparent)`,
          animation: 'scanH 2s linear infinite',
        }} />
      )}

      {/* Hover glow orb */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 340, height: 340,
        background: `radial-gradient(circle, ${langColor}22 0%, transparent 70%)`,
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s',
      }} />

      {/* Difficulty badge */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        padding: '3px 12px', borderRadius: 20,
        background: `${badgeColor}18`, border: `1px solid ${badgeColor}45`,
        fontFamily: 'monospace', fontSize: 8, fontWeight: 900, letterSpacing: 2,
        color: badgeColor, textTransform: 'uppercase',
      }}>
        {badge}
      </div>

      {/* Language glyph watermark */}
      <div style={{
        position: 'absolute', bottom: 110, right: 18,
        fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 900,
        color: `${langColor}18`, userSelect: 'none', pointerEvents: 'none',
      }}>
        {glyph}
      </div>

      {/* Icon zone */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '44px 0 28px', position: 'relative',
      }}>
        {/* Rotating dashed ring */}
        <div style={{
          position: 'absolute',
          width: 118, height: 118, borderRadius: '50%',
          border: `1.5px dashed ${hovered ? langColor : theme.accent}28`,
          animation: hovered ? 'spinRing 10s linear infinite' : 'none',
        }} />
        {/* Inner solid ring */}
        <div style={{
          position: 'absolute',
          width: 92, height: 92, borderRadius: '50%',
          border: `1px solid ${hovered ? langColor : theme.accent}18`,
          animation: hovered ? 'spinRing 6s linear infinite reverse' : 'none',
        }} />
        {/* Icon container */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `linear-gradient(135deg, ${langColor}22, ${langColor}08)`,
          border: `2px solid ${hovered ? langColor : langColor + '50'}`,
          boxShadow: hovered ? `0 0 32px ${langColor}40, inset 0 0 24px ${langColor}12` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.42s',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
        }}>
          <div style={{ filter: hovered ? `drop-shadow(0 0 10px ${langColor}80)` : 'none', transition: 'filter 0.3s' }}>
            <Icon />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 26px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Title */}
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
          fontSize: 28, color: 'white',
          textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4,
          textShadow: hovered ? `0 0 24px ${langColor}60` : 'none',
          transition: 'text-shadow 0.3s',
        }}>
          {title}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 4, letterSpacing: 1 }}>
          {subtitle}
        </div>
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 20,
            background: `${hovered ? langColor : theme.accent}18`,
            border: `1px solid ${hovered ? langColor : theme.accent}35`,
            fontFamily: 'monospace', fontSize: 8, letterSpacing: 2,
            color: hovered ? langColor : theme.ui,
            transition: 'all 0.3s',
          }}>
            {version}
          </span>
        </div>

        {/* Description */}
        <div style={{
          fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.75, marginBottom: 18, flex: 1,
        }}>
          {description}
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {features.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: hovered ? langColor : theme.accent,
                boxShadow: `0 0 8px ${hovered ? langColor : theme.accent}`,
                transition: 'all 0.3s',
              }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.52)', lineHeight: 1.5 }}>
                {feat}
              </span>
            </div>
          ))}
        </div>

        {/* Difficulty dots + level count */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18, padding: '8px 12px',
          background: `${hovered ? langColor : theme.accent}08`,
          border: `1px solid ${hovered ? langColor : theme.accent}14`,
          borderRadius: 10, transition: 'all 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>Difficulty</span>
            <div style={{ display: 'flex', gap: 4, marginLeft: 6 }}>
              {[1, 2, 3].map(d => (
                <div key={d} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: d <= difficulty ? (hovered ? langColor : theme.accent) : 'rgba(255,255,255,0.08)',
                  boxShadow: d <= difficulty ? `0 0 8px ${hovered ? langColor : theme.accent}` : 'none',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13, color: hovered ? langColor : theme.ui, letterSpacing: 1, transition: 'color 0.3s' }}>
            100 LEVELS
          </span>
        </div>

        {/* CTA */}
        <button
          style={{
            marginTop: 'auto', width: '100%', padding: '15px 0',
            borderRadius: 12, border: 'none',
            background: hovered
              ? `linear-gradient(135deg, ${langColor}, ${langColor}cc)`
              : `linear-gradient(135deg, ${theme.accent}70, ${theme.accent}35)`,
            color: 'white', cursor: 'pointer',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
            fontSize: 15, letterSpacing: 3, textTransform: 'uppercase',
            boxShadow: hovered ? `0 8px 32px ${langColor}50` : 'none',
            transition: 'all 0.35s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          START LEARNING <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LEVELS MODE PAGE
═══════════════════════════════════════════════════════════ */
const LevelsModePage = () => {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  const [glitch,   setGlitch]   = useState(false);

  useEffect(() => { localStorage.setItem('themeKey', themeKey); }, [themeKey]);

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const theme  = THEMES[themeKey];
  const ac     = theme.accent;
  const ui     = theme.ui;
  const pageBg = theme.bg;

  const navThemes = {
    red:    { accent: '#ff5252', ui: '#ff6b6b' },
    blue:   { accent: '#0099ff', ui: '#00ccff' },
    green:  { accent: '#00ff88', ui: '#00ff99' },
    purple: { accent: '#a855f7', ui: '#d8b4fe' },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBg,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease',
    }}>
      <CustomCursor theme={{ accent: ac, ui }} />
      <Navbar
        currentPage="levels mode"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={navThemes}
        currentTheme={{ accent: ac, ui }}
      />

      {/* ── NEURAL WEB BACKGROUND (unique to Levels Mode) ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <NeuralWeb accent={ac} asteroid={theme.asteroid} />
      </div>

      {/* ── Ambient glows ── */}
      <div style={{
        position: 'fixed', top: '-8%', left: '15%',
        width: 560, height: 560,
        background: `radial-gradient(circle, ${ac}14 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
        animation: 'floatA 9s ease-in-out infinite',
        transition: 'background 0.4s',
      }} />
      <div style={{
        position: 'fixed', top: '25%', right: '8%',
        width: 420, height: 420,
        background: `radial-gradient(circle, ${theme.asteroid}10 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
        animation: 'floatA 12s ease-in-out infinite reverse',
        transition: 'background 0.4s',
      }} />
      <div style={{
        position: 'fixed', bottom: '5%', left: '5%',
        width: 380, height: 380,
        background: `radial-gradient(circle, ${ac}07 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
        animation: 'floatA 15s ease-in-out infinite 2s',
        transition: 'background 0.4s',
      }} />

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '36px 28px 100px' }}>

        {/* Back button */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={() => navigate('/tri-mode')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px', borderRadius: 8,
              border: `1.5px solid ${ac}35`, background: `${ac}10`,
              color: ac, cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 800,
              fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${ac}20`; e.currentTarget.style.transform = 'translateX(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${ac}10`; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <ChevronLeft size={16} /> BACK TO TRI MODE
          </button>
        </div>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 20px', borderRadius: 20,
            background: `${ac}12`, border: `1px solid ${ac}30`,
            fontFamily: 'monospace', fontSize: 10, color: ac,
            textTransform: 'uppercase', letterSpacing: 4, marginBottom: 22,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ac, animation: 'pulse 2s infinite', boxShadow: `0 0 8px ${ac}` }} />
            SINGLE PLAYER CAMPAIGN — CHOOSE YOUR LANGUAGE
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.asteroid, animation: 'pulse 2s infinite 1s', boxShadow: `0 0 8px ${theme.asteroid}` }} />
          </div>

          {/* Glitch title */}
          <h1 style={{
            margin: '0 0 16px',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 900,
            fontSize: 'clamp(52px, 8.5vw, 86px)',
            textTransform: 'uppercase', letterSpacing: 6,
            background: `linear-gradient(135deg, white 25%, ${ac} 55%, ${ui} 80%)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text',
            color: 'transparent', WebkitTextFillColor: 'transparent',
            filter: glitch
              ? `drop-shadow(3px 0 0 ${ac}) drop-shadow(-3px 0 0 ${theme.asteroid})`
              : `drop-shadow(0 0 40px ${ac}30)`,
            transition: 'filter 0.1s',
          }}>
            LEVELS MODE
          </h1>

          {/* Divider */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ height: 1, width: 70, background: `linear-gradient(90deg, transparent, ${ac}50)` }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: `${ac}70`, letterSpacing: 4, textTransform: 'uppercase' }}>
              MASTER · PROGRESS · CONQUER
            </span>
            <div style={{ height: 1, width: 70, background: `linear-gradient(90deg, ${ac}50, transparent)` }} />
          </div>

          <p style={{
            fontFamily: 'monospace', fontSize: 13,
            color: 'rgba(255,255,255,0.4)', margin: '0 auto 40px', maxWidth: 520, lineHeight: 1.85,
          }}>
            Choose your language. Conquer 100 progressive levels. The System tracks every move.
            <br />Earn XP, climb the ranks, and forge your coding legacy.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0,
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${ac}15`,
            borderRadius: 18, width: 'fit-content', margin: '0 auto',
            overflow: 'hidden', backdropFilter: 'blur(12px)',
            boxShadow: `0 0 40px ${ac}08`,
          }}>
            <StatBadge icon="📚" value="500+" label="Total Levels" color={ac} />
            <div style={{ width: 1, background: `${ac}15`, alignSelf: 'stretch' }} />
            <StatBadge icon="💻" value="5" label="Languages"    color={theme.asteroid} />
            <div style={{ width: 1, background: `${ac}15`, alignSelf: 'stretch' }} />
            <StatBadge icon="⚡" value="∞" label="Challenges"   color="#10b981" />
            <div style={{ width: 1, background: `${ac}15`, alignSelf: 'stretch' }} />
            <StatBadge icon="🏆" value="XP" label="Rewards"     color="#f59e0b" />
          </div>
        </div>

        {/* ── COURSE CARDS ── */}
        <div style={{
          display: 'flex', gap: 22, alignItems: 'stretch',
          overflowX: 'auto', paddingBottom: 8,
          scrollbarWidth: 'thin',
          scrollbarColor: `${ac}40 transparent`,
        }}>
          {COURSES.map(course => (
            <div key={course.id} style={{ flex: '1 1 0', minWidth: 248, maxWidth: 310 }}>
              <CourseCard
                course={course}
                theme={theme}
                onClick={() => navigate(`/phases/${course.id}`)}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom info strip ── */}
        <div style={{ marginTop: 44, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 32,
            padding: '15px 36px', borderRadius: 40,
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${ac}14`,
            backdropFilter: 'blur(14px)',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {[
              { icon: '⚡', text: 'Instant Validation' },
              { icon: '📊', text: 'XP Tracking' },
              { icon: '🎯', text: 'Adaptive Difficulty' },
              { icon: '🔥', text: 'Daily Streaks' },
              { icon: '🏅', text: 'Rank & Rewards' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, color: ui, letterSpacing: 1, textTransform: 'uppercase', transition: 'color 0.3s' }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 10, color: `${ac}30`, letterSpacing: 3 }}>
            SELECT A LANGUAGE TO BEGIN YOUR CAMPAIGN · ALL 100 LEVELS UNLOCKED
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatA  { 0%,100% { transform: translateY(0); }  50% { transform: translateY(-22px); } }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.45; transform:scale(0.75); } }
        @keyframes scanH   { 0%,100% { opacity:0; transform:scaleX(0); } 50% { opacity:1; transform:scaleX(1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar         { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track   { background: transparent; }
        ::-webkit-scrollbar-thumb   { background: ${ac}40; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default LevelsModePage;
