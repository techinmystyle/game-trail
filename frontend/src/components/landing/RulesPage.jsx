import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";

const humanLargeImg = "/assets/HUMANS-BG.png";
const systemLargeImg = "/assets/SYSTEM-BG.png";

// ── Image URLs ──────────────────────────────────────────────────────────────
const HERO_BG =
  "https://images.unsplash.com/photo-1664179550989-894a1587554b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZnV0dXJpc3RpYyUyMHNwYWNlJTIwcnVsZXMlMjBhYnN0cmFjdCUyMGhlcm8lMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzkxMTI3NXww&ixlib=rb-4.1.0&q=80&w=1080";
const ROBOT_BG = "/assets/ROBOTS-BG.png";
const ROBOT_LOGIC_BOT = "/assets/LOGIC-BOT-BG.png";
const ROBOT_FLASH_CODER = "/assets/FLASH-CODER-BG.png";
const ROBOT_BEGINNER_BOT = "/assets/BEGINNER-BOT-BG.png";
const ROBOT_LAZY_COMPILER = "/assets/LAZY-COMPILER-BG.png";
const ROBOT_TEST_DESTROYER = "/assets/TEST-CASE-DESTROYER-BG.png";
const HUMAN_MALE = "/assets/HUMANS-MALE-BG.png";
const HUMAN_FEMALE = "/assets/HUMANS-FEMALE-BG.png";

// ── Data ────────────────────────────────────────────────────────────────────
const ROBOT_CARDS = [
  {
    img: ROBOT_BEGINNER_BOT,
    name: "BEGINNER BOT",
    type: "Beginner-Unit · Mark-I",
    designation: "Bot-001 / Training Class",
    speciality: "Understands basic problems · Writes simple code",
    weakness: "Many logical mistakes · Fails complex test cases",
    description: "Ideal for learning fundamental programming concepts. Solves basic problems with straightforward logic. Perfect starting point for coding journey.",
  },
  {
    img: ROBOT_LAZY_COMPILER,
    name: "LAZY COMPILER",
    type: "Beginner-Unit · Mark-I",
    designation: "Bot-002 / Training-class",
    speciality: "Writes short code quickly · Optimizes for speed",
    weakness: "Skips edge cases · Fails large inputs",
    description: "Focuses on quick solutions with minimal code. Best for simple tasks requiring fast turnaround. Prioritizes speed over comprehensive testing.",
  },
  {
    img: ROBOT_LOGIC_BOT,
    name: "LOGIC BOT",
    type: "Moderate-Unit · Mark II",
    designation: "Bot-006 / Battle-Class",
    speciality: "Strong logical thinking · Correct algorithms",
    weakness: "Slow coding speed",
    description: "Handles moderate complexity with precise logic. Implements correct algorithms for standard problems. Balances accuracy with reasonable performance.",
  },
  {
    img: ROBOT_FLASH_CODER,
    name: "FLASH CODER",
    type: "Moderate-Unit · Mark II",
    designation: "Bot-004 /   Battle-Class",
    speciality: "Very fast coding",
    weakness: "Misses edge cases",
    description: "Delivers solutions at lightning speed. Excels at moderate problems with time constraints. Optimized for rapid development cycles.",
  },
  {
    img: ROBOT_TEST_DESTROYER,
    name: "TEST CASE DESTROYER",
    type: "Hard-Unit · Mark III",
    designation: "Bot-015 / Elite-Class",
    speciality: "Passes all hidden test cases",
    weakness: "Takes longer time · Resource intensive",
    description: "Masters complex problems with comprehensive solutions. Handles all edge cases and hidden test scenarios. Delivers production-ready, bulletproof code.",
  },
];

const HUMAN_CARDS = [
  {
    img: HUMAN_MALE,
    name: "ALEX CROSS",
    type: "Guardian Class · Level-infinte",
    designation: "ID: H-001 / Male Division",
    description: "Greetings, challengers! I'm Alex Cross, leader of the human division. Our courses are divided into three levels: Beginner, Moderate, and Hard. Take the risk, attempt the challenge, and never copy code. Use your brain, trust your instincts, and be proud you conquered AI without AI. This is the human way.",
  },
  {
    img: HUMAN_FEMALE,
    name: "NOVA VALE",
    type: "Guardian Class · Level-infinite",
    designation: "ID: H-002 / Female Division",
    description: "Welcome, warriors! I'm Nova Vale, your guide through this journey. We've crafted three difficulty tiers to test your limits: Beginner, Moderate, and Hard. Embrace the challenge, think independently, and resist the temptation to copy. Show the world that human creativity and logic can outshine any algorithm. Let's prove what we're made of.",
  },
];

const SYSTEM_CARDS = [
  {
    name: "JUDGE & ARBITER",
    designation: "Core Function · Priority Alpha",
    description: "System evaluates every code submission and determines the winner. No bias, no favoritism—only logic and accuracy matter. When humans battle AI, System decides who stands victorious.",
  },
  {
    name: "ROOM CONTROLLER",
    designation: "Core Function · Priority Beta",
    description: "System manages all battle room settings, time counters, and submission updates. Every challenge runs smoothly under System's watchful control. The arena is set, the rules are enforced.",
  },
  {
    name: "ULTIMATE AUTHORITY",
    designation: "Core Function · Priority Omega",
    description: "System is the main lead orchestrating every coding battle. From start to finish, System ensures fairness, tracks performance, and maintains order. Without System, there is no challenge.",
  },
];

// ── Shared styles / helpers ──────────────────────────────────────────────────
const FONT_TITLE = '"Bebas Neue", sans-serif';
const FONT_BODY = '"Inter", sans-serif';
const FONT_LABEL = '"Rajdhani", sans-serif';

// ── Carousel component ───────────────────────────────────────────────────────
function Carousel({ items, accentColor }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = items.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % len), 3800);
    return () => clearInterval(t);
  }, [paused, len]);

  const go = (n) => setIdx((i) => (i + n + len) % len);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Track + arrows wrapper */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Overflow-clipped track */}
        <div style={{ overflow: "hidden", borderRadius: "4px" }}>
          <div
            style={{
              display: "flex",
              transform: `translateX(-${idx * 100}%)`,
              transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  minWidth: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "8px 60px 16px",
                }}
              >
                <RuleCard {...item} accentColor={accentColor} />
              </div>
            ))}
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={() => go(-1)}
          style={{
            position: "absolute",
            left: "6px",
            top: "45%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.95)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            zIndex: 10,
            color: accentColor,
            fontFamily: "Georgia, serif",
            flexShrink: 0,
          }}
        >
          ‹
        </button>

        {/* Next arrow */}
        <button
          onClick={() => go(1)}
          style={{
            position: "absolute",
            right: "6px",
            top: "45%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.95)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            zIndex: 10,
            color: accentColor,
            fontFamily: "Georgia, serif",
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === idx ? accentColor : accentColor + "50",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Rule card ────────────────────────────────────────────────────────────────
function RuleCard({ img, name, type, designation, speciality, weakness, description, rules, accentColor }) {
  // System card (no image)
  if (!img) {
    return (
      <div
        style={{
          width: "320px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 56px rgba(0,0,0,0.2)",
          overflow: "hidden",
          flexShrink: 0,
          padding: "24px",
          fontFamily: FONT_BODY,
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            height: "5px",
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`,
            margin: "-24px -24px 20px -24px",
          }}
        />
        
        <h3
          style={{
            fontFamily: FONT_TITLE,
            fontSize: "2rem",
            color: "#2E4148",
            margin: "0 0 8px",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          {name}
        </h3>
        
        {designation && (
          <p
            style={{
              fontSize: "9px",
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 16px",
              fontWeight: 700,
              fontFamily: FONT_LABEL,
            }}
          >
            {designation}
          </p>
        )}
        
        <p
          style={{
            fontSize: "13px",
            color: "#2E4148",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
    );
  }
  
  // Robot/Human card (with image)
  return (
    <div
      style={{
        width: "260px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 56px rgba(0,0,0,0.2)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Top gradient bar */}
      <div
        style={{
          height: "5px",
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`,
        }}
      />

      {/* Image */}
      <div style={{ position: "relative", height: "160px", overflow: "hidden", backgroundColor: accentColor === "#2563eb" ? "#99B6EF" : "#F1BFBF" }}>
        <img
          src={img}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            display: "block",
          }}
        />
        {/* Name overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
            padding: "28px 14px 10px",
          }}
        >
          <p
            style={{
              fontFamily: FONT_TITLE,
              fontSize: "1.6rem",
              color: "white",
              margin: 0,
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: "9px",
              color: accentColor,
              margin: "3px 0 0",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: FONT_LABEL,
            }}
          >
            {type}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "10px 14px 14px", fontFamily: FONT_BODY }}>
        {designation && (
          <p
            style={{
              fontSize: "9px",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 8px",
              fontWeight: 600,
            }}
          >
            {designation}
          </p>
        )}
        
        {/* Speciality */}
        {speciality && (
          <div style={{ marginBottom: "6px", padding: "6px 8px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: "8px", color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px", fontFamily: FONT_LABEL }}>
              ✓ SPECIALITY
            </p>
            <p style={{ fontSize: "9.5px", color: "#166534", margin: 0, lineHeight: 1.3 }}>
              {speciality}
            </p>
          </div>
        )}
        
        {/* Weakness */}
        {weakness && (
          <div style={{ marginBottom: "8px", padding: "6px 8px", backgroundColor: "#fef2f2", borderRadius: "6px", border: "1px solid #fecaca" }}>
            <p style={{ fontSize: "8px", color: "#dc2626", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px", fontFamily: FONT_LABEL }}>
              ⚠ WEAKNESS
            </p>
            <p style={{ fontSize: "9.5px", color: "#991b1b", margin: 0, lineHeight: 1.3 }}>
              {weakness}
            </p>
          </div>
        )}
        
        {/* Description */}
        {description && (
          <div>
            <p style={{ fontSize: "8px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px", fontFamily: FONT_LABEL }}>
              DESCRIPTION
            </p>
            <p style={{ fontSize: "10px", color: "#374151", margin: 0, lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        )}
        
        {/* Legacy rules support for human cards */}
        {rules && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span
                  style={{
                    color: accentColor,
                    fontSize: "9px",
                    flexShrink: 0,
                    marginTop: "4px",
                  }}
                >
                  ▸
                </span>
                <span style={{ fontSize: "11px", color: "#374151", lineHeight: 1.55 }}>
                  {r}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section label row ────────────────────────────────────────────────────────
function SectionMeta({ number, tag, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color,
          fontFamily: FONT_LABEL,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        {number}
      </span>
      <div style={{ flex: 1, height: "1px", background: color + "45" }} />
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color,
          fontFamily: FONT_LABEL,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        {tag}
      </span>
    </div>
  );
}

// ── HEADER SECTION ──────────────────────────────────────────────────────────
function HeaderSection({ onNav, onBack }) {
  const [backHovered, setBackHovered] = useState(false);
  
  return (
    <section
      id="top"
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#07091a",
      }}
    >
      {/* BG image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.28,
          zIndex: 0,
        }}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(10,15,60,0.2) 0%, rgba(5,5,20,0.88) 100%)",
          zIndex: 1,
        }}
      />

      {/* Back Button - Top Left */}
      <button
        onClick={onBack}
        onMouseEnter={() => setBackHovered(true)}
        onMouseLeave={() => setBackHovered(false)}
        style={{
          position: "absolute",
          top: "32px",
          left: "32px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: backHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50px",
          padding: "12px 24px 12px 18px",
          cursor: "pointer",
          fontFamily: FONT_LABEL,
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "white",
          transition: "all 0.3s ease",
          boxShadow: backHovered 
            ? "0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(255,255,255,0.15)" 
            : "0 4px 16px rgba(0,0,0,0.3)",
          transform: backHovered ? "translateX(-4px)" : "translateX(0)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.3s ease",
            transform: backHovered ? "translateX(-3px)" : "translateX(0)",
          }}
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 32px",
          maxWidth: "860px",
          width: "100%",
        }}
      >
        {/* Pre-label */}
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.45em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            margin: "0 0 18px",
            fontFamily: FONT_LABEL,
            fontWeight: 600,
          }}
        >
          OFFICIAL DOCUMENTATION · 2026
        </p>

        {/* Main title */}
        <h1
          style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(4.5rem, 11vw, 9rem)",
            color: "white",
            margin: "0 0 4px",
            lineHeight: 0.92,
            letterSpacing: "0.04em",
          }}
        >
          RULES &amp;
          <br />
          REGULATIONS
        </h1>

        {/* Tri-color rule */}
        <div
          style={{
            width: "90px",
            height: "4px",
            background: "linear-gradient(90deg, #dc2626, #2563eb, #16a34a)",
            margin: "22px auto 22px",
            borderRadius: "2px",
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 42px",
            lineHeight: 1.75,
            maxWidth: "540px",
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: FONT_BODY,
          }}
        >
          The definitive governance framework for all entities — human,
          robotic, and systemic — operating in the digital and physical
          universe.
        </p>

        {/* Nav buttons */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "01  ROBOTS", color: "#dc2626", id: "robots" },
            { label: "02  HUMANS", color: "#2563eb", id: "humans" },
            { label: "03  SYSTEM", color: "#16a34a", id: "system" },
          ].map(({ label, color, id }) => (
            <NavBtn key={id} label={label} color={color} onClick={() => onNav(id)} />
          ))}
        </div>

        {/* Scroll hint */}
        <p
          style={{
            marginTop: "52px",
            fontSize: "10px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: FONT_LABEL,
          }}
        >
          ↓ &nbsp; SCROLL TO EXPLORE
        </p>
      </div>
    </section>
  );
}

function NavBtn({ label, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color : "transparent",
        border: `2px solid ${color}`,
        color: hovered ? "white" : "rgba(255,255,255,0.85)",
        padding: "13px 34px",
        borderRadius: "50px",
        cursor: "pointer",
        fontFamily: FONT_LABEL,
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        transition: "all 0.25s ease",
        boxShadow: hovered ? `0 8px 28px ${color}55` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {label}
    </button>
  );
}

// ── ROBOTS SECTION ──────────────────────────────────────────────────────────
function RobotsSection() {
  return (
    <section
      id="robots"
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#fce0e0",
      }}
    >
      {/* Hero image — left half */}
      <div
        style={{
          width: "42%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={ROBOT_BG}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        {/* Soft right fade to blend with bg */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to right, transparent, #fce0e0)",
          }}
        />
      </div>

      {/* Content — right */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "28px 44px 20px 20px",
          overflow: "hidden",
        }}
      >
        <SectionMeta number="01 / 03" tag="Robot Directives" color="#dc2626" />

        <h2
          style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(3.2rem, 6.5vw, 5.2rem)",
            color: "#dc2626",
            margin: "0 0 4px",
            lineHeight: 0.93,
            letterSpacing: "0.03em",
          }}
        >
          ROBOTS
        </h2>
        <p
          style={{
            fontSize: "12.5px",
            color: "#991b1b",
            margin: "0 0 18px",
            fontFamily: FONT_BODY,
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          Core directives governing all autonomous agents &amp; robotic
          systems. Swipe through all 5 unit classes below.
        </p>

        <Carousel items={ROBOT_CARDS} accentColor="#dc2626" />
      </div>
    </section>
  );
}

// ── HUMANS SECTION ──────────────────────────────────────────────────────────
function HumansSection() {
  return (
    <section
      id="humans"
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#c5d8f2",
      }}
    >
      {/* Content — left */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "28px 20px 20px 44px",
          overflow: "hidden",
        }}
      >
        <SectionMeta number="02 / 03" tag="Human Guidelines" color="#2563eb" />

        <h2
          style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(3.2rem, 6.5vw, 5.2rem)",
            color: "#2563eb",
            margin: "0 0 4px",
            lineHeight: 0.93,
            letterSpacing: "0.03em",
          }}
        >
          HUMANS
        </h2>
        <p
          style={{
            fontSize: "12.5px",
            color: "#1e3a8a",
            margin: "0 0 18px",
            fontFamily: FONT_BODY,
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          Principles every human participant must acknowledge and uphold.
          Meet our two guardian classes below.
        </p>

        <Carousel items={HUMAN_CARDS} accentColor="#2563eb" />
      </div>

      {/* Hero image — right half */}
      <div
        style={{
          width: "42%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#c5d8f2",
        }}
      >
        {/* Soft left fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to left, transparent, #c5d8f2)",
            zIndex: 1,
          }}
        />
        <img
          src={humanLargeImg}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center bottom",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

// ── SYSTEM SECTION ──────────────────────────────────────────────────────────
function SystemSection() {
  return (
    <section
      id="system"
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#e2f0e2",
      }}
    >
      {/* Hero image — left half */}
      <div
        style={{
          width: "42%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#e2f0e2",
        }}
      >
        <img
          src={systemLargeImg}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />
        {/* Soft right fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to right, transparent, #e2f0e2)",
          }}
        />
      </div>

      {/* Content — right */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "28px 44px 20px 20px",
          overflow: "hidden",
        }}
      >
        <SectionMeta number="03 / 03" tag="System Protocols" color="#16a34a" />

        <h2
          style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(3.2rem, 6.5vw, 5.2rem)",
            color: "#2E4148",
            margin: "0 0 4px",
            lineHeight: 0.93,
            letterSpacing: "0.03em",
          }}
        >
          SYSTEM
        </h2>
        <p
          style={{
            fontSize: "12.5px",
            color: "#2E4148",
            margin: "0 0 18px",
            fontFamily: FONT_BODY,
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          The ultimate authority orchestrating every coding battle. System judges, controls, and maintains order.
        </p>

        <Carousel items={SYSTEM_CARDS} accentColor="#16a34a" />
      </div>
    </section>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function RulesPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    const container = containerRef.current;
    if (!el || !container) return;
    container.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  // Theme for custom cursor and footer (purple default)
  const pageTheme = {
    accent: '#a855f7',
    ui: '#d8b4fe',
    thunder: '#6d28d9',
    asteroid: '#c084fc',
    background: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.7), rgba(30, 10, 50, 0.96) 56%, #0a0515 100%)',
  };

  return (
    <>
      <CustomCursor theme={pageTheme} />
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          background: "#000",
        }}
      >
        <HeaderSection onNav={scrollToSection} onBack={handleBackToHome} />
        <RobotsSection />
        <HumansSection />
        <SystemSection />
        <div style={{ scrollSnapAlign: "end" }}>
          <Footer theme={pageTheme} />
        </div>
      </div>
    </>
  );
}
