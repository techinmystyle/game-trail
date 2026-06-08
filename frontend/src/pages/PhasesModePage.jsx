import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";
import { levelsAPI } from "../utils/api";

const PAGE_BG = {
  red: "#fff5f5",
  blue: "#f4f8ff",
  green: "#f4fff8",
  purple: "#f8f4ff",
};

const COURSE_INFO = {
  html: { name: "HTML", levels: 100 },
  css: { name: "CSS", levels: 100 },
  javascript: { name: "JAVASCRIPT", levels: 100 },
  python: { name: "PYTHON", levels: 100 },
  java: { name: "JAVA", levels: 100 },
};

const PhaseCard = ({ phaseNumber, theme, isLocked, onStart, totalLevels = 5 }) => {
  return (
    <div className={`flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${isLocked ? 'opacity-60' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      {/* Top section with phase number - increased height */}
      <div
        className="flex items-end justify-center pb-6 pt-16 relative"
        style={{
          background: isLocked ? '#9CA3AF' : theme.accent,
          transition: "background 0.4s ease",
        }}
      >
        <h3
          className="font-techno font-black text-white"
          style={{ fontSize: "32px", letterSpacing: "0.1em" }}
        >
          PHASE {phaseNumber}
        </h3>
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200" />

      {/* Level breakdown section - only show for unlocked phases */}
      {!isLocked && (
        <>
          <div className="px-5 py-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                  Beginner
                </span>
                <span className="text-xs font-bold text-gray-700">{totalLevels} Tasks</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-sm font-black text-gray-900">{totalLevels} Tasks</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200" />
        </>
      )}

      {/* Spacer to push button to bottom */}
      <div className="flex-1" />

      {/* Bottom section with button */}
      <div className="flex flex-col items-center gap-3 px-5 py-5">
        {isLocked ? (
          <button
            type="button"
            disabled
            className="font-sans font-bold text-white uppercase rounded-full cursor-not-allowed"
            style={{
              width: "148px",
              paddingTop: "10px",
              paddingBottom: "10px",
              background: "#9CA3AF",
              letterSpacing: "0.22em",
              fontSize: "13px",
              boxShadow: "0 2px 8px rgba(156, 163, 175, 0.3)",
            }}
          >
            COMING SOON
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="font-sans font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105"
            style={{
              width: "148px",
              paddingTop: "10px",
              paddingBottom: "10px",
              background: theme.accent,
              letterSpacing: "0.22em",
              fontSize: "13px",
              boxShadow: `0 2px 8px ${theme.accent}55`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accent}88`;
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accent}55`;
              e.currentTarget.style.opacity = '1';
            }}
          >
            START
          </button>
        )}
      </div>
    </div>
  );
};

const PhasesModePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
  }, [themeKey]);

  const [phaseUnlockStatus, setPhaseUnlockStatus] = useState(Array(10).fill(false));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhaseProgress();
  }, [courseId]);

  const PHASE_LEVEL_COUNTS = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]; // Levels per phase

  const fetchPhaseProgress = async () => {
    setIsLoading(true);
    try {
      const response = await levelsAPI.getProgress();
      const completed = response.data.completedLevels || [];
      
      const unlockStatus = [true]; // Phase 1 always unlocked
      
      // Check each phase to see if previous phase is completed
      for (let phase = 1; phase < 10; phase++) {
        const prevPhaseCompleted = completed.filter(
          cl => cl.course === courseId && cl.phase === phase
        );
        const requiredLevels = PHASE_LEVEL_COUNTS[phase - 1];
        unlockStatus.push(prevPhaseCompleted.length >= requiredLevels);
      }
      
      setPhaseUnlockStatus(unlockStatus);
    } catch (error) {
      console.error('Error fetching phase progress:', error);
      setPhaseUnlockStatus([true, ...Array(9).fill(false)]);
    } finally {
      setIsLoading(false);
    }
  };

  const themes = {
    red: {
      thunder: "#8b0000",
      asteroid: "#ff6b6b",
      accent: "#ff5252",
      ui: "#ff6b6b",
      background: "radial-gradient(circle at 50% 32%, rgba(220, 20, 60, 0.75), rgba(30, 5, 10, 0.96) 54%, #0a0005 100%)",
    },
    blue: {
      thunder: "#003d99",
      asteroid: "#00d4ff",
      accent: "#0099ff",
      ui: "#00ccff",
      background: "radial-gradient(circle at 50% 32%, rgba(0, 102, 255, 0.7), rgba(5, 15, 50, 0.96) 56%, #000a1a 100%)",
    },
    green: {
      thunder: "#1a5c1a",
      asteroid: "#39ff14",
      accent: "#00ff88",
      ui: "#00ff99",
      background: "radial-gradient(circle at 50% 32%, rgba(0, 255, 65, 0.65), rgba(5, 30, 15, 0.96) 58%, #000a05 100%)",
    },
    purple: {
      thunder: "#6d28d9",
      asteroid: "#c084fc",
      accent: "#a855f7",
      ui: "#d8b4fe",
      background: "radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.7), rgba(30, 10, 50, 0.96) 56%, #0a0515 100%)",
    },
  };

  const currentTheme = themes[themeKey];
  const pageBg = PAGE_BG[themeKey] || "#fff5f5";
  const courseInfo = COURSE_INFO[courseId] || { name: "COURSE", levels: 59 };
  const totalPhases = 10; // 10 phases for HTML course

  const handlePhaseStart = (phaseNumber) => {
    if (phaseUnlockStatus[phaseNumber - 1]) {
      navigate(`/levels/${courseId}/phase${phaseNumber}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: PAGE_BG[themeKey] }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent mb-4" style={{ color: themes[themeKey].accent }}></div>
          <p className="text-gray-600 font-techno">Loading phases...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: pageBg, transition: "background-color 0.5s ease" }}
    >
      <CustomCursor theme={currentTheme} />

      <Navbar 
        currentPage={`${courseInfo.name} PHASES`}
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={themes}
        currentTheme={currentTheme}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-14 sm:px-10">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <button
            onClick={() => navigate('/levels-mode')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              background: `${currentTheme.accent}15`,
              color: currentTheme.accent,
              border: `2px solid ${currentTheme.accent}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = currentTheme.accent;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${currentTheme.accent}15`;
              e.currentTarget.style.color = currentTheme.accent;
            }}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="font-techno font-bold text-sm uppercase tracking-wider">Back to Courses</span>
          </button>
        </div>

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
              {courseInfo.name} COURSE
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
            <span style={{ color: currentTheme.accent }}>PHASE</span>
          </h1>

          <p
            className="mt-4 font-mono text-gray-500 uppercase tracking-[0.22em]"
            style={{ fontSize: "11px" }}
          >
            {totalPhases} PHASES · {courseInfo.levels} TOTAL LEVELS · PROGRESSIVE DIFFICULTY
          </p>
        </div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Array.from({ length: totalPhases }, (_, i) => {
            const phaseNumber = i + 1;
            const isLocked = !phaseUnlockStatus[i];
            const totalLevels = PHASE_LEVEL_COUNTS[i];
            
            return (
              <PhaseCard
                key={phaseNumber}
                phaseNumber={phaseNumber}
                theme={currentTheme}
                isLocked={isLocked}
                onStart={() => handlePhaseStart(phaseNumber)}
                totalLevels={totalLevels}
              />
            );
          })}
        </div>

        {/* Bottom info */}
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
              Complete Phase 1 to Unlock Phase 2 · Master Each Phase
            </span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <div
        style={{
          background: "linear-gradient(to bottom, rgba(4,0,18,1) 0%, rgba(0,0,4,1) 100%)",
        }}
      >
        <Footer theme={currentTheme} />
      </div>
    </div>
  );
};

export default PhasesModePage;
