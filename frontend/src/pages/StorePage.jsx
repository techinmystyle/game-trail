import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, X } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { Footer } from "../components/landing/Footer";
import { CustomCursor } from "../components/landing/CustomCursor";
import { pointsAPI } from "../utils/api";

const PAGE_BG = {
  red: "linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)",
  blue: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%)",
  green: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F0FDF4 100%)",
  purple: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FAF5FF 100%)",
};

const StorePage = () => {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
  }, [themeKey]);

  const [adsRemaining, setAdsRemaining] = useState(5);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(15);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [adMessage, setAdMessage] = useState('');
  const [adsResetTime, setAdsResetTime] = useState(null);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [xpPoints, setXpPoints] = useState(0);
  const [gThunderPoints, setGThunderPoints] = useState(0);
  const [convertAmount, setConvertAmount] = useState(100);
  const [convertMessage, setConvertMessage] = useState('');
  
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

  useEffect(() => {
    fetchAdsInfo();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!adsResetTime || adsRemaining > 0) {
      setTimeUntilReset('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const resetTime = new Date(adsResetTime);
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeUntilReset('Ready!');
        fetchAdsInfo(); // Refresh to reset counter
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [adsResetTime, adsRemaining]);

  const fetchAdsInfo = async () => {
    try {
      const response = await pointsAPI.getInfo();
      setAdsRemaining(response.data.adsWatched.remaining);
      setAdsResetTime(response.data.adsWatched.canWatchAt);
      setXpPoints(response.data.xpPoints || 0);
      setGThunderPoints(response.data.gThunderPoints || 0);
    } catch (error) {
      console.error('Error fetching ads info:', error);
    }
  };

  const handleConvertXp = async () => {
    if (convertAmount < 100) {
      setConvertMessage('Minimum 100 XP required');
      setTimeout(() => setConvertMessage(''), 3000);
      return;
    }

    if (convertAmount % 100 !== 0) {
      setConvertMessage('Amount must be a multiple of 100');
      setTimeout(() => setConvertMessage(''), 3000);
      return;
    }

    if (xpPoints < convertAmount) {
      setConvertMessage('Insufficient XP points');
      setTimeout(() => setConvertMessage(''), 3000);
      return;
    }

    try {
      const response = await pointsAPI.convertXp(convertAmount);
      setConvertMessage(`Converted ${response.data.xpSpent} XP → ${response.data.gThunderEarned} G-THUNDER!`);
      setXpPoints(response.data.newXpBalance);
      setGThunderPoints(response.data.newGThunderBalance);
      
      // Trigger points update event
      window.dispatchEvent(new Event('pointsUpdated'));
      
      setTimeout(() => setConvertMessage(''), 3000);
    } catch (error) {
      console.error('Error converting XP:', error);
      setConvertMessage(error.response?.data?.message || 'Error converting XP');
      setTimeout(() => setConvertMessage(''), 3000);
    }
  };

  const handleWatchAd = () => {
    if (adsRemaining <= 0) {
      setAdMessage('Daily ad limit reached! Come back tomorrow.');
      return;
    }
    
    setShowAdModal(true);
    setAdTimer(15);
    setCanCloseAd(false);
    setAdMessage('');
    
    // Start countdown
    const interval = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanCloseAd(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseAd = async () => {
    if (!canCloseAd) return;
    
    try {
      const response = await pointsAPI.watchAd();
      setAdMessage(`+${response.data.xpReward} XP Points!`);
      setAdsRemaining(response.data.adsRemaining);
      setAdsResetTime(response.data.canWatchAt);
      setXpPoints(response.data.newXpBalance);
      
      // Trigger points update event
      window.dispatchEvent(new Event('pointsUpdated'));
      
      setTimeout(() => {
        setShowAdModal(false);
        setAdMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error watching ad:', error);
      setAdMessage(error.response?.data?.message || 'Error claiming reward');
      setTimeout(() => {
        setShowAdModal(false);
        setAdMessage('');
      }, 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: pageBg, transition: "background-color 0.5s ease" }}
    >
      <CustomCursor theme={currentTheme} />
      
      <Navbar 
        currentPage="store"
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        themes={themes}
        currentTheme={currentTheme}
      />

      <main className="flex-1 px-6 py-14 sm:px-10">
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
              G-THUNDER STORE
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
            EARN <span style={{ color: currentTheme.accent }}>POINTS</span>
          </h1>

          <p
            className="mt-4 font-mono text-gray-500 uppercase tracking-[0.22em]"
            style={{ fontSize: "11px" }}
          >
            Watch Ads · Complete Tasks · Unlock Rewards
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Ads Card */}
          <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div 
              className="relative h-56 overflow-hidden flex items-center justify-center"
              style={{ background: '#3b82f6' }}
            >
              <svg 
                className="w-24 h-24 text-white" 
                viewBox="0 0 24 24" 
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>

            <div className="border-t border-gray-200" />

            <div className="py-4 px-4 text-center">
              <h3
                className="font-techno font-bold text-gray-800 text-sm mb-2"
                style={{ letterSpacing: "0.16em" }}
              >
                WATCH ADS
              </h3>
              <p className="text-xs text-gray-600">
                50 XP Points per ad
              </p>
            </div>

            <div className="border-t border-gray-200" />

            <div className="flex flex-col items-center gap-3 px-5 py-5">
              <span
                className="border border-gray-400 rounded px-4 py-1.5 text-gray-600 font-techno font-medium uppercase"
                style={{ fontSize: "11px", letterSpacing: "0.18em" }}
              >
                {adsRemaining}/5 AVAILABLE
              </span>
              
              {adsRemaining === 0 && timeUntilReset && (
                <div className="text-xs text-gray-600 font-mono text-center">
                  <div className="font-semibold mb-1">Next slot in:</div>
                  <div className="text-sm font-bold" style={{ color: currentTheme.accent }}>
                    {timeUntilReset}
                  </div>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleWatchAd}
                disabled={adsRemaining <= 0}
                className="font-sans font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  width: "148px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  background: adsRemaining > 0 ? "#c81e1e" : "#9CA3AF",
                  letterSpacing: "0.22em",
                  fontSize: "13px",
                  boxShadow: adsRemaining > 0 ? '0 2px 8px rgba(200, 30, 30, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (adsRemaining > 0) {
                    e.currentTarget.style.background = "#a01818";
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 30, 30, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (adsRemaining > 0) {
                    e.currentTarget.style.background = "#c81e1e";
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(200, 30, 30, 0.3)';
                  }
                }}
              >
                WATCH NOW
              </button>
              {adMessage && !showAdModal && (
                <p className="text-xs text-gray-600 mt-2">{adMessage}</p>
              )}
            </div>
          </div>

          {/* XP Conversion Card */}
          <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div 
              className="relative h-56 overflow-hidden flex items-center justify-center"
              style={{ background: currentTheme.accent }}
            >
              <Zap className="w-24 h-24 text-white" fill="white" strokeWidth={2} />
            </div>

            <div className="border-t border-gray-200" />

            <div className="py-4 px-4 text-center">
              <h3
                className="font-techno font-bold text-gray-800 text-sm mb-2"
                style={{ letterSpacing: "0.16em" }}
              >
                XP CONVERSION
              </h3>
              <p className="text-xs text-gray-600">
                100 XP = 1 G-THUNDER Point
              </p>
            </div>

            <div className="border-t border-gray-200" />

            <div className="flex flex-col items-center gap-3 px-5 py-5">
              <div className="w-full">
                <div className="text-xs text-gray-600 mb-2 text-center">
                  Your XP: <span className="font-bold text-blue-600">{xpPoints}</span>
                </div>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-techno text-sm"
                  placeholder="Enter XP amount"
                />
                <div className="text-xs text-gray-600 mt-2 text-center">
                  = <span className="font-bold" style={{ color: currentTheme.accent }}>{Math.floor(convertAmount / 100)}</span> G-THUNDER
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleConvertXp}
                disabled={xpPoints < 100}
                className="font-sans font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  width: "148px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  background: xpPoints >= 100 ? "#3b82f6" : "#9CA3AF",
                  letterSpacing: "0.22em",
                  fontSize: "13px",
                  boxShadow: xpPoints >= 100 ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (xpPoints >= 100) {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (xpPoints >= 100) {
                    e.currentTarget.style.background = "#3b82f6";
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                CONVERT
              </button>
              {convertMessage && (
                <p className="text-xs text-gray-600 mt-2 text-center">{convertMessage}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          {canCloseAd && (
            <button
              onClick={handleCloseAd}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              aria-label="Close Ad"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
          
          <div className="text-center">
            {!canCloseAd ? (
              <>
                <div className="text-white font-techno text-6xl font-bold mb-4">
                  {adTimer}
                </div>
                <p className="text-white/70 font-sans text-lg">
                  Please wait...
                </p>
              </>
            ) : adMessage ? (
              <div className="text-white font-techno text-3xl font-bold animate-pulse">
                {adMessage}
              </div>
            ) : (
              <div className="text-white font-techno text-2xl font-bold">
                Click X to claim your reward!
              </div>
            )}
          </div>
        </div>
      )}

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

export default StorePage;
