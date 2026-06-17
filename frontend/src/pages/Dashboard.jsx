import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus, ChevronDown } from 'lucide-react';
import { PrismThemeToggle } from '../components/landing/PrismThemeToggle';
import { SpaceHeroScene } from '../components/landing/SpaceHeroScene';
import { DiscoverFeatures } from '../components/landing/DiscoverFeatures';
import { Rules } from '../components/landing/Rules';
import { Store } from '../components/landing/Store';
import { TriMode } from '../components/landing/TriMode';
import { Specials } from '../components/landing/Specials';
import { Leaderboard } from '../components/landing/Leaderboard';
import { Profile } from '../components/landing/Profile';
import { Welcome } from '../components/landing/Welcome';
import { CustomCursor } from '../components/landing/CustomCursor';
import { Footer } from '../components/landing/Footer';
import { GlobalParticleScene } from '../components/landing/GlobalParticleScene';
import { profileAPI, pointsAPI } from '../utils/api';

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

const Dashboard = () => {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('themeKey') || 'purple');
  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
  }, [themeKey]);

  const [profileImage, setProfileImage] = useState(null);
  const [xpPoints, setXpPoints] = useState(0);
  const [gThunderPoints, setGThunderPoints] = useState(0);
  const [isGameModeOpen, setIsGameModeOpen] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const currentTheme = useMemo(() => themes[themeKey], [themeKey]);
  const navigate = useNavigate();

  // Load profile image and points from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, pointsResponse] = await Promise.all([
          profileAPI.getProfile(),
          pointsAPI.getInfo()
        ]);
        
        const userData = profileResponse.data.user;
        
        // Only show image if profile is complete
        if (userData.profileSetupComplete && userData.profileImage) {
          setProfileImage(userData.profileImage);
        } else {
          setProfileImage(null); // Show default icon for incomplete profiles
        }

        // Set XP and G-THUNDER points
        setXpPoints(pointsResponse.data.xpPoints || 0);
        setGThunderPoints(pointsResponse.data.gThunderPoints || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    
    // Listen for profile and points updates
    const handleDataUpdate = () => {
      fetchData();
    };
    
    window.addEventListener('profileUpdated', handleDataUpdate);
    window.addEventListener('pointsUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleDataUpdate);
      window.removeEventListener('pointsUpdated', handleDataUpdate);
    };
  }, []);

  // Show global particles only once user has scrolled past the hero section
  useEffect(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setParticlesVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isGameModeOpen && !event.target.closest('[data-dropdown="game-mode"]')) {
        setIsGameModeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGameModeOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <CustomCursor theme={currentTheme} />
      <main
        id="hero-section"
        className="relative min-h-screen overflow-hidden bg-black text-white"
        style={{ background: currentTheme.background }}
        data-testid="landing-page-root"
      >
        <SpaceHeroScene theme={currentTheme} />
        
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)]" />

        <div className="relative z-20 flex min-h-screen flex-col px-6 pb-6 pt-4 sm:px-12 sm:pb-8 sm:pt-5">
          <header className="flex flex-wrap items-center justify-between gap-6" data-testid="top-navbar">
            <div className="pointer-events-auto flex items-center gap-7 sm:gap-10">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
                className="flex items-center gap-0 font-techno text-xl font-bold tracking-wide transition-all duration-300 hover:brightness-110 cursor-pointer"
                style={{ 
                  color: currentTheme.ui,
                  filter: `drop-shadow(0 0 12px ${currentTheme.accent}66)`
                }}
                data-testid="brand-logo-link"
              >
                <span data-testid="brand-title-text">GAME IN MY</span>
                <Zap 
                  className="h-5 w-5 animate-pulse" 
                  style={{ color: currentTheme.accent }}
                  fill={currentTheme.accent}
                  data-testid="brand-lightning-icon" 
                />
                <span data-testid="brand-title-text-2">TYLE</span>
              </a>

              <nav className="flex items-center gap-6 font-techno text-[15px] font-semibold sm:gap-7" data-testid="navbar-left-links">
                <a
                  href="/rules"
                  onClick={(e) => { e.preventDefault(); navigate('/rules'); }}
                  className="relative tracking-wider text-white/90 transition-all duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full cursor-pointer font-techno text-[15px] font-semibold"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  data-testid="nav-link-rules"
                >
                  <style>{`
                    a[data-testid="nav-link-rules"]:hover::after,
                    a[data-testid="nav-link-leaderboard-left"]:hover::after,
                    a[data-testid="nav-link-tutorials"]:hover::after {
                      background: ${currentTheme.accent};
                    }
                  `}</style>
                  RULES
                </a>
                
                {/* Game Mode Dropdown — TRI MODE & SPECIALS only */}
                <div 
                  className="relative"
                  data-dropdown="game-mode"
                >
                  <button
                    onClick={() => setIsGameModeOpen(!isGameModeOpen)}
                    className="flex items-center gap-1 relative tracking-wider text-white/90 transition-all duration-300 hover:text-white cursor-pointer font-techno text-[15px] font-semibold bg-transparent border-none p-0"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  >
                    GAME MODE
                    <ChevronDown 
                      className="h-4 w-4 transition-transform duration-300" 
                      style={{ 
                        transform: isGameModeOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isGameModeOpen && (
                    <div 
                      className="absolute top-full left-0 mt-2 py-2 rounded-lg backdrop-blur-md min-w-[160px]"
                      style={{
                        background: 'rgba(10, 5, 25, 0.98)',
                        border: `1px solid ${currentTheme.accent}60`,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.9), 0 0 24px ${currentTheme.accent}30`,
                        zIndex: 9999
                      }}
                    >
                      <button
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setIsGameModeOpen(false);
                          navigate('/tri-mode'); 
                        }}
                        className="w-full text-left px-4 py-2.5 font-techno text-[14px] font-semibold tracking-wider text-white/90 transition-all duration-200 hover:text-white cursor-pointer bg-transparent border-none"
                        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${currentTheme.accent}25`;
                          e.currentTarget.style.borderLeft = `3px solid ${currentTheme.accent}`;
                          e.currentTarget.style.paddingLeft = '13px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeft = 'none';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        TRI MODE
                      </button>
                      <button
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setIsGameModeOpen(false);
                          navigate('/specials-mode'); 
                        }}
                        className="w-full text-left px-4 py-2.5 font-techno text-[14px] font-semibold tracking-wider text-white/90 transition-all duration-200 hover:text-white cursor-pointer bg-transparent border-none"
                        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${currentTheme.accent}25`;
                          e.currentTarget.style.borderLeft = `3px solid ${currentTheme.accent}`;
                          e.currentTarget.style.paddingLeft = '13px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeft = 'none';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        SPECIALS
                      </button>
                    </div>
                  )}
                </div>
                
                <a
                  href="#leaderboard"
                  className="relative tracking-wider text-white/90 transition-all duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full cursor-pointer font-techno text-[15px] font-semibold"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  data-testid="nav-link-leaderboard-left"
                >
                  LEADERBOARD
                </a>
                <a
                  href="/tutorials"
                  onClick={(e) => { e.preventDefault(); navigate('/tutorials'); }}
                  className="relative tracking-wider text-white/90 transition-all duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full cursor-pointer font-techno text-[15px] font-semibold"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  data-testid="nav-link-tutorials"
                >
                  TUTORIALS
                </a>
              </nav>
            </div>

            <div className="pointer-events-auto flex items-center gap-5 sm:gap-7" data-testid="nav-right-group">
              {/* XP Points Display */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm"
                style={{
                  borderColor: '#3b82f660',
                  background: '#3b82f615',
                }}
              >
                <svg 
                  className="h-4 w-4" 
                  viewBox="0 0 24 24" 
                  fill="#3b82f6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
                <span 
                  className="font-techno text-sm font-bold"
                  style={{ color: currentTheme.ui }}
                >
                  {xpPoints}
                </span>
                <button
                  onClick={() => navigate('/store')}
                  className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                  }}
                  aria-label="Go to Store"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* G-THUNDER Points Display */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm"
                style={{
                  borderColor: `#a855f760`,
                  background: `#a855f715`,
                }}
              >
                <Zap 
                  className="h-4 w-4" 
                  style={{ color: '#a855f7' }}
                  fill="#a855f7"
                />
                <span 
                  className="font-techno text-sm font-bold"
                  style={{ color: currentTheme.ui }}
                >
                  {gThunderPoints}
                </span>
                <button
                  onClick={() => navigate('/store')}
                  className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: '#a855f7',
                    color: '#ffffff',
                  }}
                  aria-label="Go to Store"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <PrismThemeToggle currentThemeKey={themeKey} onThemeChange={setThemeKey} themes={themes} />

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:brightness-110 overflow-hidden"
                style={{ 
                  color: currentTheme.ui,
                  background: `${currentTheme.accent}40`,
                  borderColor: currentTheme.accent,
                  boxShadow: `0 0 20px ${currentTheme.accent}60`
                }}
                data-testid="profile-icon-button"
                aria-label="Profile"
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-7 w-7"
                  style={{ display: profileImage ? 'none' : 'block' }}
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/8 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/50 hover:bg-white/15"
                style={{ 
                  color: currentTheme.ui,
                  boxShadow: `0 0 16px ${currentTheme.accent}33`
                }}
                data-testid="logout-icon-button"
                aria-label="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </header>

          <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-end px-4 text-center">
            <div className="w-full max-w-5xl pb-4">
              <h1
                className="animate-rise font-display text-[5rem] font-black leading-[0.86] tracking-wide text-white sm:text-[8rem]"
                style={{ 
                  animationDelay: '100ms',
                  textShadow: `0 6px 32px rgba(0,0,0,0.9), 0 0 60px ${currentTheme.accent}44, 0 2px 4px rgba(0,0,0,0.8)`,
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.08)',
                  letterSpacing: '0.04em'
                }}
                data-testid="hero-main-title"
              >
                GAME IN
                <br />
                MY STYLE
              </h1>

              <p
                className="mt-3 animate-rise font-techno text-[11px] font-semibold tracking-[0.38em] sm:text-[13px]"
                style={{ 
                  animationDelay: '240ms',
                  color: 'rgba(255,255,255,0.7)',
                  textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 0 20px ${currentTheme.accent}33`
                }}
                data-testid="hero-cinematic-tagline"
              >
                C I N E M A T I C · E X P E R I E N C E
              </p>

              <button
                type="button"
                className="pointer-events-auto group mt-6 inline-flex animate-rise items-center rounded-full border-2 px-9 py-3.5 font-techno text-[13px] font-bold tracking-[0.24em] transition-all duration-400 hover:-translate-y-1.5 hover:scale-105"
                style={{
                  borderColor: currentTheme.accent,
                  backgroundColor: `${currentTheme.accent}18`,
                  color: '#ffffff',
                  boxShadow: `0 0 32px ${currentTheme.accent}88, 0 8px 24px rgba(0,0,0,0.6)`,
                  animationDelay: '380ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.accent}28`;
                  e.currentTarget.style.boxShadow = `0 0 48px ${currentTheme.accent}cc, 0 12px 32px rgba(0,0,0,0.7)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.accent}18`;
                  e.currentTarget.style.boxShadow = `0 0 32px ${currentTheme.accent}88, 0 8px 24px rgba(0,0,0,0.6)`;
                }}
                onClick={() => {
                  document.getElementById('discover-features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="hero-cta-button"
              >
                ENTER EXPERIENCE
              </button>
            </div>
          </section>
        </div>
      </main>

      <DiscoverFeatures theme={currentTheme} id="discover-features" />
      <Rules theme={currentTheme} id="rules" />
      <Store theme={currentTheme} id="store" />
      <Specials theme={currentTheme} id="specials" />
      <TriMode theme={currentTheme} id="tri-mode" />
      <Leaderboard theme={currentTheme} id="leaderboard" />
      <Profile theme={currentTheme} id="profile" />
      <Welcome theme={currentTheme} />
      <Footer theme={currentTheme} />

      {/* Single global particle canvas */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: particlesVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <GlobalParticleScene theme={currentTheme} />
      </div>
    </>
  );
};

export default Dashboard;
