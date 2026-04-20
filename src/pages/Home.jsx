import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { COLORS, fonts, openWhatsApp } from "../styles/theme";
import SectionTag from "../components/SectionTag";
import GoldDivider from "../components/GoldDivider";
import Btn from "../components/Btn";

/* ───────────────── Hero ───────────────── */
function Hero() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        background: `radial-gradient(ellipse at 50% 20%, rgba(212,168,67,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 80%, rgba(196,91,58,0.05) 0%, transparent 50%),
                      ${COLORS.bg}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `1px solid ${COLORS.border}`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "1px solid rgba(196,91,58,0.1)",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s ease",
        }}
      >
        <SectionTag>Where Tradition Meets Mastery</SectionTag>
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(42px, 7vw, 82px)",
            fontWeight: 700,
            color: COLORS.warmWhite,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          Discover the{" "}
          <span style={{ color: COLORS.gold, fontStyle: "italic" }}>Soul</span>{" "}
          of
          <br />
          Carnatic Music
        </h1>
      </div>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s ease 0.3s",
        }}
      >
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: "clamp(18px, 2.5vw, 24px)",
            color: COLORS.creamMuted,
            maxWidth: 580,
            lineHeight: 1.7,
            marginBottom: 48,
            fontWeight: 300,
          }}
        >
          Learn from a dedicated guru in an intimate online academy rooted in
          centuries of tradition, crafted for the modern seeker of rāga and tāla.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: visible ? 1 : 0,
          transition: "all 1s ease 0.5s",
        }}
      >
        <Btn onClick={() => navigate("/#courses")}>Explore Courses</Btn>
        <Btn variant="outline" onClick={openWhatsApp}>
          Book a Free Trial
        </Btn>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 48,
          marginTop: 80,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: visible ? 1 : 0,
          transition: "all 1s ease 0.7s",
        }}
      >
        {[
          { num: "500+", label: "Students Taught" },
          { num: "6+", label: "Years Teaching" },
          { num: "98%", label: "Satisfaction Rate" },
          { num: "1000+", label: "Classes Conducted" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.gold,
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 12,
                color: COLORS.textMuted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── About ───────────────── */
function AboutSection() {
  const cards = [
    {
      icon: "🎵",
      title: "Carnatic Vocal",
      desc: "Classical vocal training from foundational swaras to advanced krithis and expressive manodharma singing.",
    },
    {
      icon: "🪷",
      title: "Structured Practice",
      desc: "Curated practice routines, guided riyaz sessions, and personalised feedback to accelerate your growth.",
    },
    {
      icon: "📿",
      title: "Theory & Heritage",
      desc: "Explore rāga lakshana, tāla structures, sahitya, and the rich history of our tradition.",
    },
  ];

  return (
    <section style={{ padding: "100px 24px", background: COLORS.bgCard }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <SectionTag>Our Philosophy</SectionTag>
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(28px, 4vw, 44px)",
            color: COLORS.warmWhite,
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          Rooted in{" "}
          <span style={{ color: COLORS.gold, fontStyle: "italic" }}>
            Guru-Shishya
          </span>{" "}
          Parampara
        </h2>
        <GoldDivider />
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 20,
            color: COLORS.creamMuted,
            lineHeight: 1.8,
            maxWidth: 720,
            margin: "32px auto 0",
            fontWeight: 300,
          }}
        >
          At Rāgaa, we honour the sacred bond between teacher and student. Every
          lesson is a journey into the depths of swara, rāga, and tāla — guided
          by Dharini, who carries forward an authentic chain of musical wisdom.
          Whether you are a complete beginner or an advancing practitioner, the
          pathways are designed to nurture your unique musical voice.
        </p>

        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 60,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {cards.map((c) => (
            <div
              key={c.title}
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                padding: 36,
                borderRadius: 12,
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                textAlign: "center",
                transition: "transform 0.3s, border-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{c.icon}</div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: 20,
                  color: COLORS.warmWhite,
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  color: COLORS.textMuted,
                  lineHeight: 1.7,
                }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Courses Preview ───────────────── */
function CoursesPreview() {
  const navigate = useNavigate();
  const courses = [
    {
      level: "Foundation",
      title: "Swara Sadhana",
      duration: "3 months",
      sessions: "24 sessions",
      price: "₹4,999",
      color: "#2D6A4F",
      desc: "Begin your journey with sruti, swara exercises, basic rāgas like Mayamalavagowla, and simple devotional songs.",
    },
    {
      level: "Intermediate",
      title: "Rāga Deepam",
      duration: "6 months",
      sessions: "48 sessions",
      price: "₹8,999",
      color: COLORS.goldDim,
      desc: "Dive into rāga elaboration, kritis by the Trinity, neraval practice, and intermediate tāla patterns.",
      featured: true,
    },
    {
      level: "Specialty",
      title: "Compositions Lab",
      duration: "Ongoing",
      sessions: "Flexible",
      price: "₹2,499/mo",
      color: "#7B4F9E",
      desc: "Deep-dive into specific composers: Thyagaraja, Dikshitar, Syama Sastri, Purandaradasa, and contemporary works.",
    },
  ];

  return (
    <section id="courses" style={{ padding: "100px 24px", background: COLORS.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionTag>Curated Learning Paths</SectionTag>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: COLORS.warmWhite,
              fontWeight: 600,
            }}
          >
            Courses Crafted with{" "}
            <span style={{ fontStyle: "italic", color: COLORS.gold }}>
              Devotion
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 24,
          }}
        >
          {courses.map((c) => (
            <div
              key={c.title}
              style={{
                padding: 32,
                borderRadius: 14,
                background: COLORS.bgCard,
                border: c.featured
                  ? `1.5px solid ${COLORS.gold}`
                  : `1px solid ${COLORS.border}`,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {c.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: -30,
                    background: COLORS.gold,
                    color: COLORS.bg,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 36px",
                    transform: "rotate(45deg)",
                    fontFamily: fonts.body,
                    letterSpacing: 1,
                  }}
                >
                  POPULAR
                </div>
              )}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c.color,
                  marginBottom: 16,
                }}
              />
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  color: COLORS.textMuted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {c.level}
              </div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: 24,
                  color: COLORS.warmWhite,
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: COLORS.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                {c.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {[c.duration, c.sessions].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      color: COLORS.creamMuted,
                      background: "rgba(212,168,67,0.08)",
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 22,
                    color: COLORS.gold,
                    fontWeight: 700,
                  }}
                >
                  {c.price}
                </span>
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: COLORS.creamMuted,
                    cursor: "pointer",
                  }}
                >
                  Learn More →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Btn variant="outline" onClick={() => navigate("/#pricing")}>
            View Pricing Plans
          </Btn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Pricing ───────────────── */
function PricingSection() {
  const plans = [
    {
      type: "Regular",
      title: "4 Sessions / Month",
      price: "₹1,500/mo",
      sessions: "1 class per week",
      desc: "Ideal for steady learning with guided swara practice and one focused class each week.",
      accent: "#5B8A72",
    },
    {
      type: "Popular",
      title: "8 Sessions / Month",
      price: "₹2,000/mo",
      sessions: "2 classes per week",
      desc: "Accelerated growth track with twice-weekly sessions for faster repertoire and manodharma development.",
      accent: COLORS.gold,
      featured: true,
    },
    {
      type: "Package",
      title: "Structured Course Packs",
      price: "From ₹4,999",
      sessions: "Level-based curriculum",
      desc: "Foundation and intermediate pathways with progressive milestones, assignments, and performance prep.",
      accent: COLORS.accent,
    },
  ];

  return (
    <section id="pricing" style={{ padding: "100px 24px", background: COLORS.bgCard }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionTag>Flexible Plans</SectionTag>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: COLORS.warmWhite,
              fontWeight: 600,
            }}
          >
            Pricing for Every{" "}
            <span style={{ fontStyle: "italic", color: COLORS.gold }}>
              Aspirant
            </span>
          </h2>
          <p
            style={{
              fontFamily: fonts.accent,
              fontSize: 19,
              color: COLORS.creamMuted,
              lineHeight: 1.8,
              maxWidth: 640,
              margin: "20px auto 0",
            }}
          >
            Choose a rhythm that matches your schedule while staying rooted in
            traditional learning. Upgrade anytime as your practice deepens.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 22,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.title}
              style={{
                background: COLORS.bg,
                borderRadius: 16,
                border: plan.featured
                  ? `1.5px solid ${COLORS.gold}`
                  : `1px solid ${COLORS.border}`,
                padding: 30,
                position: "relative",
              }}
            >
              {plan.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontFamily: fonts.body,
                    fontSize: 10,
                    color: COLORS.bg,
                    background: COLORS.gold,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    padding: "5px 10px",
                    borderRadius: 20,
                  }}
                >
                  Most Chosen
                </span>
              )}

              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: plan.accent,
                  marginBottom: 16,
                }}
              />

              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  color: COLORS.textMuted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {plan.type}
              </div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: 28,
                  color: COLORS.warmWhite,
                  margin: "8px 0 6px",
                }}
              >
                {plan.title}
              </h3>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 30,
                  color: COLORS.gold,
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {plan.price}
              </div>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: COLORS.creamMuted,
                  marginBottom: 14,
                }}
              >
                {plan.sessions}
              </p>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: COLORS.textMuted,
                  lineHeight: 1.7,
                }}
              >
                {plan.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Btn onClick={openWhatsApp}>Book Free Trial and Discuss Plan</Btn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Guru Section ───────────────── */
function GuruSection() {
  return (
    <section style={{ padding: "100px 24px", background: COLORS.bgCard }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionTag>Meet Your Guru</SectionTag>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: COLORS.warmWhite,
              fontWeight: 600,
            }}
          >
            Learn from{" "}
            <span style={{ fontStyle: "italic", color: COLORS.gold }}>
              Dharini
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 48,
            borderRadius: 20,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              marginBottom: 28,
              background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontSize: 44,
              color: COLORS.cream,
              fontWeight: 700,
              border: `3px solid ${COLORS.gold}`,
            }}
          >
            D
          </div>
          <h3
            style={{
              fontFamily: fonts.display,
              fontSize: 28,
              color: COLORS.warmWhite,
              marginBottom: 8,
            }}
          >
            Dharini
          </h3>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 14,
              color: COLORS.gold,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            Certified Carnatic Vocalist
          </p>
          <GoldDivider width={80} />
          <p
            style={{
              fontFamily: fonts.accent,
              fontSize: 18,
              color: COLORS.creamMuted,
              lineHeight: 1.8,
              maxWidth: 560,
              margin: "24px auto 0",
              fontWeight: 300,
            }}
          >
            With over 6 years of dedicated teaching experience, Dharini brings
            warmth, patience, and deep musical knowledge to every class. Trained
            under the guidance of{" "}
            <span style={{ color: COLORS.gold, fontWeight: 500 }}>
              Sri Chakrapani G
            </span>
            , she carries forward a rich lineage of Carnatic vocal tradition,
            making even complex concepts accessible and joyful for students of
            all levels.
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "6+ Years", sub: "Teaching Experience" },
              { label: "Sri Chakrapani G", sub: "Trained Under" },
              { label: "All Levels", sub: "Beginner to Advanced" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "16px 24px",
                  borderRadius: 10,
                  background: "rgba(212,168,67,0.06)",
                  border: `1px solid ${COLORS.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 16,
                    color: COLORS.gold,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: COLORS.textMuted,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Testimonials ───────────────── */
function Testimonials() {
  const [active, setActive] = useState(0);
  const testimonials = [
    {
      name: "Ananya R.",
      location: "Chennai",
      text: "Dharini transformed my understanding of Carnatic music. Her patience and depth of knowledge made every class a revelation. I went from barely knowing swaras to performing my first concert in 8 months.",
    },
    {
      name: "Karthik S.",
      location: "Bangalore",
      text: "As someone living abroad, finding authentic Carnatic training was difficult. Dharini not only taught technique but transmitted the bhakti behind every krithi. Her classes feel like home.",
    },
    {
      name: "Meera P.",
      location: "Mumbai",
      text: "My daughter started at age 7 and Dharini's structured yet gentle approach has been incredible. She now practices voluntarily and sings with a confidence that moves everyone who hears her.",
    },
  ];

  useEffect(() => {
    const i = setInterval(
      () => setActive((a) => (a + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <section style={{ padding: "100px 24px", background: COLORS.bg }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <SectionTag>Student Voices</SectionTag>
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(28px, 4vw, 40px)",
            color: COLORS.warmWhite,
            marginBottom: 48,
            fontWeight: 600,
          }}
        >
          Stories of{" "}
          <span style={{ fontStyle: "italic", color: COLORS.gold }}>
            Transformation
          </span>
        </h2>

        <div style={{ position: "relative", minHeight: 200 }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                position: i === active ? "relative" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                opacity: i === active ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            >
              <p
                style={{
                  fontFamily: fonts.accent,
                  fontSize: 20,
                  color: COLORS.cream,
                  lineHeight: 1.8,
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                "{t.text}"
              </p>
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: COLORS.gold,
                    fontWeight: 600,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: COLORS.textMuted,
                  }}
                >
                  {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 32,
          }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? COLORS.gold : COLORS.bgElevated,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Why Ragaa ───────────────── */
function WhyRagaa() {
  const features = [
    { icon: "🎧", title: "Class Recordings", desc: "Every session recorded and accessible in your personal library." },
    { icon: "🔔", title: "Smart Notifications", desc: "Timely reminders for classes, practice, assignments, and events." },
    { icon: "📊", title: "Progress Tracking", desc: "Dashboards showing your journey through ragas and milestones." },
    { icon: "🌐", title: "Learn Anywhere", desc: "HD live sessions with pristine audio for Carnatic nuances." },
    { icon: "📚", title: "Rich Resources", desc: "Blog posts, notation sheets, reference recordings, and tools." },
    { icon: "🎓", title: "Certification", desc: "Earn certificates as you complete each level of your journey." },
  ];

  return (
    <section style={{ padding: "100px 24px", background: COLORS.bgCard }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionTag>The Rāgaa Difference</SectionTag>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 4vw, 40px)",
              color: COLORS.warmWhite,
              fontWeight: 600,
            }}
          >
            Everything You Need to{" "}
            <span style={{ fontStyle: "italic", color: COLORS.gold }}>
              Flourish
            </span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                gap: 16,
                padding: 24,
                borderRadius: 10,
                background: "rgba(212,168,67,0.03)",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = COLORS.border)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>
                {f.icon}
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 17,
                    color: COLORS.warmWhite,
                    marginBottom: 6,
                  }}
                >
                  {f.title}
                </h4>
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    color: COLORS.textMuted,
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── CTA ───────────────── */
function CTASection() {
  return (
    <section
      style={{
        padding: "100px 24px",
        textAlign: "center",
        background: `radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.1) 0%, transparent 70%), ${COLORS.bg}`,
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <GoldDivider width={80} />
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(28px, 5vw, 48px)",
            color: COLORS.warmWhite,
            margin: "32px 0 16px",
            fontWeight: 600,
          }}
        >
          Begin Your Musical{" "}
          <span style={{ color: COLORS.gold, fontStyle: "italic" }}>
            Odyssey
          </span>
        </h2>
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 18,
            color: COLORS.creamMuted,
            lineHeight: 1.7,
            marginBottom: 40,
            fontWeight: 300,
          }}
        >
          Your first lesson with Dharini is free. No commitment, no pressure —
          just the pure joy of discovering your voice through Carnatic music.
          Reach out on WhatsApp to get started.
        </p>
        <Btn onClick={openWhatsApp}>Book Your Free Trial Class</Btn>
      </div>
    </section>
  );
}

/* ───────────────── Page Export ───────────────── */
export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.slice(1);
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    // Offset keeps the section heading visible below the fixed navbar.
    const y = target.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, [location.hash, location.pathname]);

  return (
    <>
      <Hero />
      <AboutSection />
      <CoursesPreview />
      <PricingSection />
      <GuruSection />
      <Testimonials />
      <WhyRagaa />
      <CTASection />
    </>
  );
}
