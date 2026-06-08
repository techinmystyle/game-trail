export const PrismThemeToggle = ({ currentThemeKey, onThemeChange, themes }) => {
  // Fixed positions for each theme node - now with 4 themes in a diamond pattern
  const nodePositions = {
    blue: { x: 50, y: 10 },      // Top
    red: { x: 15, y: 75 },        // Bottom-left
    green: { x: 85, y: 75 },      // Bottom-right
    purple: { x: 50, y: 50 },     // Center
  };

  // Get active position for the moving indicator
  const activePos = nodePositions[currentThemeKey];

  return (
    <div className="relative h-20 w-20" data-testid="prism-theme-toggle-container">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* Background triangle */}
        <path
          d="M50 10 L15 75 L85 75 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        
        {/* Connection lines */}
        <line x1="50" y1="10" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="15" y1="75" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="85" y1="75" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Animated active indicator (moves between positions) */}
        <circle
          cx={activePos.x}
          cy={activePos.y}
          r="10"
          fill={themes[currentThemeKey].accent}
          opacity="0.3"
          className="transition-all duration-500 ease-out"
        >
          <animate
            attributeName="r"
            values="10;12;10"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Active glow ring */}
        <circle
          cx={activePos.x}
          cy={activePos.y}
          r="8"
          fill="none"
          stroke={themes[currentThemeKey].accent}
          strokeWidth="2"
          opacity="0.6"
          className="transition-all duration-500 ease-out"
        />

        {/* Theme node buttons */}
        {Object.keys(nodePositions).map((key) => {
          const pos = nodePositions[key];
          const active = currentThemeKey === key;
          
          return (
            <g key={key}>
              {/* Outer glow for active */}
              {active && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="9"
                  fill={themes[key].accent}
                  opacity="0.2"
                  className="transition-all duration-300"
                />
              )}
              
              {/* Main circle button */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={themes[key].accent}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={active ? "2" : "1"}
                className="cursor-pointer transition-all duration-300 hover:stroke-white"
                style={{
                  filter: active 
                    ? `drop-shadow(0 0 8px ${themes[key].accent})` 
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
                onClick={() => onThemeChange(key)}
                data-testid={`theme-node-${key}`}
              />
              
              {/* Inner highlight */}
              <circle
                cx={pos.x - 1.5}
                cy={pos.y - 1.5}
                r="2"
                fill="rgba(255,255,255,0.5)"
                pointerEvents="none"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

