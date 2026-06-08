import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";
import { HtmlIcon, CssIcon, JsIcon, PythonIcon, JavaIcon } from "../components/landing/TechIcons";
import { ChevronLeft } from "lucide-react";

/* ─── Page background tint per theme ─── */
const PAGE_BG = {
  red: "#fff5f5",
  blue: "#f4f8ff",
  green: "#f4fff8",
  purple: "#f8f4ff",
};

const DEFAULT_THEME = {
  thunder: "#8b0000",
  asteroid: "#ff6b6b",
  accent: "#ff5252",
  ui: "#ff6b6b",
  background:
    "radial-gradient(circle at 50% 32%, rgba(220, 20, 60, 0.75), rgba(30, 5, 10, 0.96) 54%, #0a0005 100%)",
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
    description:
      "The skeleton of every webpage. Write clean, semantic markup that browsers and search engines love.",
    topics: [
      "Tags & Elements",
      "Semantic HTML",
      "Forms & Inputs",
      "Tables & Media",
      "Accessibility",
    ],
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
    description:
      "Transform raw HTML into stunning, responsive designs with modern layout systems and animations.",
    topics: [
      "Selectors & Box Model",
      "Flexbox & Grid",
      "Animations & Transitions",
      "Responsive Design",
      "CSS Variables",
    ],
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
    description:
      "Breathe life into your pages. Master the language of the web — from DOM to async programming.",
    topics: [
      "Variables & Functions",
      "DOM Manipulation",
      "Async / Await",
      "Fetch API & JSON",
      "ES6+ Syntax",
    ],
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
    description:
      "Clean, powerful, readable. Tackle real-world problems with data structures, algorithms, and OOP.",
    topics: [
      "Syntax & Data Types",
      "Functions & OOP",
      "File Handling",
      "Modules & Packages",
      "Algorithms & DS",
    ],
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
    description:
      "Enterprise-grade power. Command OOP principles, collections, multithreading, and JVM architecture.",
    topics: [
      "OOP & Inheritance",
      "Collections Framework",
      "Exception Handling",
      "Multithreading",
      "Generics & Streams",
    ],
  },
];

/* ── difficulty dots ── */
const DifficultyDots = ({ level, accent }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3].map((d) => (
      <span
        key={d}
        className="inline-block rounded-full"
        style={{
          width: "8px",
          height: "8px",
          background: d <= level ? accent : `${accent}28`,
          boxShadow: d <= level ? `0 0 5px ${accent}88` : "none",
        }}
      />
    ))}
  </div>
);

/* ══════════════════════════════════════════
   COURSE CARD
══════════════════════════════════════════ */
const CourseCard = ({ course, theme, navigate }) => {
  const {
    title,
    subtitle,
    version,
    badge,
    difficulty,
    levels,
    Icon,
    description,
    topics,
    id,
  } = course;

  return (
    <div className="flex flex-col flex-1 min-w-0 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* ── Icon banner — solid theme accent, no patterns ── */}
      <div
        className="flex items-center justify-center"
        style={{
          height: "170px",
          background: theme.accent,
          transition: "background 0.4s ease",
        }}
      >
        <Icon />
      </div>

      {/* ── Title ── */}
      <div className="px-5 pt-5 pb-3 text-center border-b border-gray-100">
        <h3
          className="font-techno font-black text-gray-900"
          style={{ fontSize: "14px", letterSpacing: "0.2em" }}
        >
          {title}
        </h3>
        <p
          className="text-gray-400 font-mono mt-1"
          style={{ fontSize: "10px", letterSpacing: "0.1em" }}
        >
          {subtitle}
        </p>
        <span
          className="inline-block mt-2 rounded-full px-2.5 py-0.5 font-mono font-semibold"
          style={{
            fontSize: "9px",
            letterSpacing: "0.12em",
            background: `${theme.accent}15`,
            color: theme.accent,
            border: `1px solid ${theme.accent}40`,
          }}
        >
          {version}
        </span>
      </div>

      {/* ── Description ── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p
          className="text-gray-500 text-center leading-relaxed"
          style={{ fontSize: "11px" }}
        >
          {description}
        </p>
      </div>

      {/* ── Phases Info ── */}
      <div className="px-5 py-4 flex-1 border-b border-gray-100">
        <p
          className="font-techno font-bold uppercase mb-3"
          style={{
            fontSize: "8px",
            letterSpacing: "0.22em",
            color: `${theme.accent}bb`,
          }}
        >
          Course Phases
        </p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold" style={{ fontSize: "10.5px" }}>
              Total Phases
            </span>
            <span className="font-techno font-black" style={{ fontSize: "16px", color: theme.accent }}>
              10
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold" style={{ fontSize: "10.5px" }}>
              Progression
            </span>
            <span className="font-mono font-bold text-gray-700" style={{ fontSize: "10px" }}>
              SEQUENTIAL
            </span>
          </div>
        </div>
      </div>

      {/* ── Phase Breakdown ── */}
      <div
        className="px-5 py-3 border-b border-gray-100"
        style={{ background: `${theme.accent}07` }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold" style={{ fontSize: "10px" }}>
              Phase 1
            </span>
            <span className="font-mono text-gray-600 font-bold" style={{ fontSize: "9px" }}>
              10 TASKS
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold" style={{ fontSize: "10px" }}>
              Phases 2-10
            </span>
            <span className="font-mono text-gray-400 font-bold" style={{ fontSize: "9px" }}>
              10 TASKS EACH
            </span>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-5 py-5">
        <button
          type="button"
          onClick={() => navigate(`/phases/${id}`)}
          className="w-full font-techno font-black text-white uppercase rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            padding: "11px 0",
            fontSize: "11px",
            letterSpacing: "0.26em",
            background: theme.accent,
            boxShadow: `0 6px 20px ${theme.accent}44`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.thunder || theme.accent;
            e.currentTarget.style.boxShadow = `0 8px 28px ${theme.accent}77`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.accent;
            e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accent}44`;
          }}
        >
          START COURSE
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
  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
  }, [themeKey]);

  
  const themes = {
    red: {
      thunder: '#8b0000',
      asteroid: '#ff6b6b',
      accent: '#ff5252',
      ui: '#ff6b6b',
      background: 'radial-gradient(circle at 50% 32%, rgba(220, 20, 60, 0.75), rgba(30, 5, 10, 0.96) 54%, #0a0005 100%)',
    },
    blue: {
      thunder: '#003d99',
      asteroid: '#00d4ff',
      accent: '#0099ff',
      ui: '#00ccff',
      background: 'radial-gradient(circle at 50% 32%, rgba(0, 102, 255, 0.7), rgba(5, 15, 50, 0.96) 56%, #000a1a 100%)',
    },
    green: {
      thunder: '#1a5c1a',
      asteroid: '#39ff14',
      accent: '#00ff88',
      ui: '#00ff99',
      background: 'radial-gradient(circle at 50% 32%, rgba(0, 255, 65, 0.65), rgba(5, 30, 15, 0.96) 58%, #000a05 100%)',
    },
    purple: {
      thunder: '#6d28d9',
      asteroid: '#c084fc',
      accent: '#a855f7',
      ui: '#d8b4fe',
      background: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.7), rgba(30, 10, 50, 0.96) 56%, #0a0515 100%)',
    },
  };
  
  const currentTheme = themes[themeKey];
  const pageBg = PAGE_BG[themeKey] || "#fff5f5";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: pageBg, transition: "background-color 0.5s ease" }}
    >
      <CustomCursor theme={currentTheme} />

      <Navbar 
        currentPage="levels mode"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={themes}
        currentTheme={currentTheme}
      />

      {/* ═══════════ MAIN ═══════════ */}
      <main className="flex-1 px-6 py-14 sm:px-10">
        {/* Back Button */}
        <div className="mb-6 max-w-[1600px] mx-auto">
          <button 
            onClick={() => navigate('/tri-mode')} 
            className="flex items-center gap-2 font-techno text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 px-3 py-1.5 rounded-lg" 
            style={{ 
              color: currentTheme.accent, 
              background: 'white', 
              border: `2px solid ${currentTheme.accent}40`,
              boxShadow: `0 2px 8px ${currentTheme.accent}20`
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO TRI MODE
          </button>
        </div>

        {/* Page heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className="h-px w-24 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentTheme.accent}70)`,
              }}
            />
            <span
              className="font-techno text-xs font-bold uppercase tracking-[0.35em]"
              style={{ color: `${currentTheme.accent}cc` }}
            >
              LEVELS MODE
            </span>
            <div
              className="h-px w-24 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentTheme.accent}70, transparent)`,
              }}
            />
          </div>

          <h1
            className="font-techno font-black tracking-wide text-gray-900"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            SELECT YOUR{" "}
            <span style={{ color: currentTheme.accent }}>COURSE</span>
          </h1>

          <p
            className="mt-4 font-mono text-gray-500 uppercase tracking-[0.22em]"
            style={{ fontSize: "11px" }}
          >
            Choose a language · Complete progressive levels · Prove your skill
          </p>
        </div>

        {/* ── 5 cards in ONE row ── */}
        <div className="flex gap-5 items-stretch w-full">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} theme={currentTheme} navigate={navigate} />
          ))}
        </div>

        {/* Bottom info strip */}
        <div className="mt-14 flex justify-center">
          <div
            className="inline-flex items-center gap-3 rounded-full px-8 py-3.5 border"
            style={{
              borderColor: `${currentTheme.accent}30`,
              background: `${currentTheme.accent}09`,
            }}
          >
            <svg
              viewBox="0 0 20 20"
              width="17"
              height="17"
              fill={currentTheme.accent}
            >
              <path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0zm-1.5 14.5L4 9.9l1.4-1.4 3.1 3.1 6.1-6.1 1.4 1.4-7.5 7.6z" />
            </svg>
            <span
              className="font-techno font-bold uppercase tracking-widest"
              style={{ fontSize: "10px", color: currentTheme.accent }}
            >
              Unlimited Access · Progressive Difficulty · Real-Time Feedback
            </span>
          </div>
        </div>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,0,18,1) 0%, rgba(0,0,4,1) 100%)",
        }}
      >
        <Footer theme={currentTheme} />
      </div>
    </div>
  );
};

export default LevelsModePage;
