import { Home, BookOpen, Zap, Trophy, User, Gift, ShoppingBag } from 'lucide-react';

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
    description: 'Manage your account, view your achievements, and customize your gaming experience to match your preferences.',
  },
];

export const DiscoverFeatures = ({ theme, id }) => {
  // Professional content section colors - muted and readable
  const contentTheme = {
    primary: '#3B82F6', // Blue
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    text: '#F9FAFB',
    textMuted: '#D1D5DB',
    cardBg: 'rgba(30, 41, 59, 0.6)',
    cardBorder: 'rgba(148, 163, 184, 0.2)',
    cardHoverBorder: 'rgba(148, 163, 184, 0.4)',
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
            {featureCards.map((card) => {
              const IconComponent = card.icon;
              const handleCardClick = () => {
                const sectionId = card.id === 'home' ? 'hero-section' : card.id;
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = contentTheme.cardHoverBorder;
                    e.currentTarget.style.boxShadow = `0 8px 30px rgba(59, 130, 246, 0.2)`;
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
                        backgroundColor: `rgba(59, 130, 246, 0.15)`,
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
    </section>
  );
};
