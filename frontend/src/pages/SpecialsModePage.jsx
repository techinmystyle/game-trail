import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Bug } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";

const PAGE_BG = {
  red: "linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)",
  blue: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%)",
  green: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F0FDF4 100%)",
  purple: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FAF5FF 100%)",
};

const Carousel = ({ theme }) => {
  const [active, setActive] = useState(0);
  const TOTAL = 5;

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TOTAL), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full mb-8">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{
          height: "260px",
          background: `${theme.accent}0d`,
          border: `1px solid ${theme.accent}28`,
        }}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className="min-w-full h-full flex items-center justify-center"
            >
              <div
                className="rounded-2xl border-2 border-dashed"
                style={{
                  width: "260px",
                  height: "200px",
                  borderColor: `${theme.accent}35`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === active ? "28px" : "9px",
              height: "9px",
              backgroundColor:
                i === active ? theme.accent : `${theme.accent}48`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SpecialCard = ({ title, badge, type, navigate, theme }) => {
  let cardTop;

  if (type === "tournament") {
    cardTop = (
      <div 
        className="relative h-56 overflow-hidden flex items-center justify-center transition-all duration-400" 
        style={{ background: theme.accent }}
      >
        <div className="flex items-end">
          {/* 2nd Place - Silver */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-20 flex items-center justify-center text-white font-black text-2xl" style={{ background: '#C0C0C0' }}>
              2
            </div>
            <div className="w-16 h-8 flex items-center justify-center" style={{ background: '#A8A8A8' }}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* 1st Place - Gold */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-28 flex items-center justify-center text-white font-black text-3xl" style={{ background: '#FFD700' }}>
              1
            </div>
            <div className="w-16 h-8 flex items-center justify-center" style={{ background: '#FFA500' }}>
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          
          {/* 3rd Place - Bronze */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center text-white font-black text-xl" style={{ background: '#CD7F32' }}>
              3
            </div>
            <div className="w-16 h-8 flex items-center justify-center" style={{ background: '#B8722C' }}>
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    cardTop = (
      <div 
        className="relative h-56 overflow-hidden flex items-center justify-center transition-all duration-400" 
        style={{ background: theme.accent }}
      >
        <div className="relative">
          <Bug className="w-24 h-24 text-white" strokeWidth={2} />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {cardTop}

      <div className="border-t border-gray-200" />

      <div className="py-4 px-4 text-center">
        <h3
          className="font-techno font-bold text-gray-800 text-sm"
          style={{ letterSpacing: "0.16em" }}
        >
          {title}
        </h3>
      </div>

      <div className="border-t border-gray-200" />

      <div className="flex flex-col items-center gap-3 px-5 py-5">
        <span
          className="border border-gray-400 rounded px-4 py-1.5 text-gray-600 font-techno font-medium uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.18em" }}
        >
          {badge}
        </span>
        <button
          type="button"
          className="font-sans font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105"
          style={{
            width: "148px",
            paddingTop: "10px",
            paddingBottom: "10px",
            background: "#c81e1e",
            letterSpacing: "0.22em",
            fontSize: "13px",
            boxShadow: '0 2px 8px rgba(200, 30, 30, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#a01818";
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 30, 30, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#c81e1e";
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(200, 30, 30, 0.3)';
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

const SpecialsModePage = () => {
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
  const pageBg = PAGE_BG[themeKey] || "#f8f4ff";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: pageBg, transition: "background-color 0.5s ease" }}
    >
      <CustomCursor theme={currentTheme} />
      
      <Navbar 
        currentPage="specials"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={themes}
        currentTheme={currentTheme}
      />

      <main className="flex-1 px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Carousel theme={currentTheme} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 max-w-3xl mx-auto">
            <SpecialCard
              title="TOURNAMENT MODE"
              badge="COMPETITIVE"
              type="tournament"
              navigate={navigate}
              theme={currentTheme}
            />
            <SpecialCard
              title="BUG HUNTER ARENA"
              badge="CHALLENGE"
              type="bug-hunter"
              navigate={navigate}
              theme={currentTheme}
            />
          </div>
        </div>
      </main>

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

export default SpecialsModePage;
