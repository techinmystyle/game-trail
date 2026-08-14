import { Home, BookOpen, Zap, Trophy, User, Gift, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    id: 'home',
    title: 'Home',
    icon: Home,
    description: 'Your starting point with all the rules and guidelines to make your learning journey across all courses smooth and effective.',
  },
  {
    id: 'rules',
    title: 'Rules',
    icon: BookOpen,
    description: 'Comprehensive guidelines and best practices to ensure fair play and maintain the integrity of the gaming experience.',
  },
  {
    id: 'store',
    title: 'Store',
    icon: ShoppingBag,
    description: 'Browse exclusive items, power-ups, and customization options. Unlock premium content to enhance your gaming experience.',
  },
  {
    id: 'specials',
    title: 'Specials',
    icon: Gift,
    description: 'Exclusive special events and limited-time tournaments with rare rewards and prestigious titles for top competitors.',
  },
  {
    id: 'tri-mode',
    title: 'Tri-Mode',
    icon: Zap,
    description: 'Three unique game modes to challenge yourself. Choose your difficulty and test your skills in different scenarios.',
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: Trophy,
    description: 'Compete with players worldwide and track your progress. See where you stand among the best players globally.',
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: User,
    route: '/profile',
    description: 'Manage your account, view your achievements, and customize your gaming experience to match your preferences.',
  },
];

export const DiscoverFeatures = ({ theme, id }) => {
  const navigate = useNavigate();
  // Professional content section colors - using passed theme
  const contentTheme = {
    primary: theme.accent,
    primaryLight: `${theme.accent}cc`,
    primaryDark: `${theme.accent}99`,
    text: '#F9FAFB',
    textMuted: '#D1D5DB',
    cardBg: 'rgba(5, 5, 10, 0.6)',
    cardBorder: `${theme.accent}20`,
    cardHoverBorder: `${theme.accent}60`,
  };

  return (
    <section 
      id={id}
      className="relative w-full overflow-hidden bg-black text-white" 
      style={{ minHeight: '100vh' }}
      data-testid="discover-features-section">
      
      {/* Cinematic vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-20 flex flex-col items-center justify-center px-6 py-20 sm:px-12">
        <div className="w-full max-w-6xl">
          {/* Section Title */}
          <h2
            className="mb-20 text-center font-sans text-4xl font-black tracking-tight sm:text-5xl"
            style={{
              color: contentTheme.text,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
            data-testid="discover-features-title"
          >
            Discover Our Features
          </h2>

          {/* Cards Grid - 3 columns with spacing */}
          <div className="flex flex-wrap justify-center gap-8" data-testid="features-cards-grid">
            {featureCards.map((card, index) => {
              const IconComponent = card.icon;
              const handleCardClick = () => {
                if (card.route) {
                  navigate(card.route);
                } else if (card.id === 'home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const routeMap = {
                    'rules': '/rules',
                    'store': '/store',
                    'specials': '/specials-mode',
                    'tri-mode': '/tri-mode',
                    'leaderboard': '/dashboard', // no separate leaderboard page yet
                  };
                  navigate(routeMap[card.id] || '/dashboard');
                }
              };
              return (
                <div
                  key={card.id}
                  onClick={handleCardClick}
                  className="group relative w-full overflow-hidden rounded-lg transition-all duration-300 sm:w-[calc(33.333%-1.5rem)] cursor-pointer"
                  style={{
                    backgroundColor: contentTheme.cardBg,
                    border: `1px solid ${contentTheme.cardBorder}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = contentTheme.cardHoverBorder;
                    e.currentTarget.style.boxShadow = `0 8px 30px ${contentTheme.primary}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = contentTheme.cardBorder;
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  data-testid={`feature-card-${card.id}`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
                    {/* Icon */}
                    <div
                      className="rounded-lg p-3 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${contentTheme.primary}20`,
                        color: contentTheme.primaryLight,
                      }}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>

                    {/* Title */}
                    <h3
                      className="font-sans text-lg font-bold tracking-tight"
                      style={{ color: contentTheme.text }}
                      data-testid={`feature-card-title-${card.id}`}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p 
                      className="text-sm leading-relaxed font-sans" 
                      style={{ color: contentTheme.textMuted }}
                      data-testid={`feature-card-desc-${card.id}`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};
