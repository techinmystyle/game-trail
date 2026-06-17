import { Zap, Github, Twitter, Youtube, Twitch, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = ({ theme }) => {
  return (
    <footer className="relative z-10 border-t px-6 py-16 sm:px-12" style={{ borderColor: `${theme.accent}20` }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <a
              href="#"
              className="mb-6 flex items-center gap-0 font-techno text-2xl font-bold tracking-wide transition-all duration-300"
              style={{
                color: theme.ui,
                filter: `drop-shadow(0 0 12px ${theme.accent}66)`,
              }}
            >
              <span>GAME IN MY</span>
              <Zap 
                className="h-6 w-6 animate-pulse" 
                style={{ color: theme.accent }}
                fill={theme.accent}
              />
              <span>TYLE</span>
            </a>
            <p
              className="mb-6 font-techno text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Experience the next generation of competitive gaming. Join millions of players worldwide in the ultimate
              cinematic gaming experience.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
                { Icon: Twitch, href: '#' },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110"
                  style={{
                    borderColor: `${theme.accent}40`,
                    background: `${theme.accent}10`,
                    color: theme.ui,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.background = `${theme.accent}25`;
                    e.currentTarget.style.boxShadow = `0 0 20px ${theme.accent}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${theme.accent}40`;
                    e.currentTarget.style.background = `${theme.accent}10`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="mb-6 font-techno text-lg font-bold tracking-wide"
              style={{ color: theme.ui }}
            >
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {['Home', 'Rules', 'Tri Mode', 'Leaderboard', 'Profile', 'Support'].map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="font-techno text-sm transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.ui;
                      e.currentTarget.style.textShadow = `0 0 10px ${theme.accent}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="mb-6 font-techno text-lg font-bold tracking-wide"
              style={{ color: theme.ui }}
            >
              RESOURCES
            </h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Community Forum', 'Bug Reports', 'Feature Requests', 'Changelog'].map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="font-techno text-sm transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.ui;
                      e.currentTarget.style.textShadow = `0 0 10px ${theme.accent}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="mb-6 font-techno text-lg font-bold tracking-wide"
              style={{ color: theme.ui }}
            >
              CONTACT
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: theme.ui }} />
                <a
                  href="mailto:support@gameinmystyle.com"
                  className="font-techno text-sm transition-all duration-300"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.ui;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  support@gameinmystyle.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: theme.ui }} />
                <span className="font-techno text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: theme.ui }} />
                <span className="font-techno text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  123 Gaming Street
                  <br />
                  San Francisco, CA 94102
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 border-t pt-8"
          style={{ borderColor: `${theme.accent}20` }}
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p
              className="font-techno text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              © 2024 Game In My Style. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="font-techno text-sm transition-all duration-300"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.ui;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
