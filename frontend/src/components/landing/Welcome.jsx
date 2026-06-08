export const Welcome = ({ theme }) => {
  return (
    <section 
      className="relative w-full overflow-hidden bg-black text-white py-32" 
      data-testid="welcome-section">
      
      {/* Cinematic vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-20 flex flex-col items-center justify-center px-6 sm:px-12 min-h-[600px]">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center">
          {/* Simple Card matching TECH IN MY STYLE */}
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]"
            style={{
              borderColor: theme.accent,
              boxShadow: `0 0 40px ${theme.accent}44, 0 20px 60px rgba(0,0,0,0.6)`,
            }}
            data-testid="welcome-card"
          >
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-12 py-24 text-center gap-12">
              {/* Title - Large and Bold */}
              <h2
                className="font-sans text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none"
                style={{
                  color: theme.ui,
                  textShadow: `0 0 20px ${theme.accent}44, 0 4px 16px rgba(0,0,0,0.8)`,
                  opacity: 0.9,
                }}
                data-testid="welcome-title"
              >
                GAME IN MY
                <br />
                STYLE
              </h2>

              {/* Explore Button - Simple and Clean */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full px-10 py-4 font-sans text-base font-semibold tracking-wide transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: theme.accent,
                  color: '#ffffff',
                  boxShadow: `0 4px 20px ${theme.accent}66`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${theme.accent}88`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${theme.accent}66`;
                }}
                data-testid="welcome-explore-button"
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
