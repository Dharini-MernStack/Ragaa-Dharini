import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, fonts, openWhatsApp } from "../styles/theme";
import Btn from "./Btn";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.hash]);

  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/#courses", label: "Courses" },
    { path: "/gurus", label: "Gurus" },
    { path: "/#pricing", label: "Pricing" },
    { path: "/blog", label: "Resources" },
  ];

  const links = user
    ? [...publicLinks, { path: "/dashboard", label: "Dashboard" }]
    : [...publicLinks, { path: "/login", label: "Login" }];

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }

    if (path.includes("#")) {
      return `${location.pathname}${location.hash}` === path;
    }

    return location.pathname === path;
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(12,10,9,0.95)" : "transparent",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            cursor: "pointer",
          }}
          onClick={() => handleNav("/")}
        >
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.gold,
              fontStyle: "italic",
            }}
          >
            Rāgaa
          </span>
          <span
            style={{
              fontFamily: fonts.accent,
              fontSize: 12,
              color: COLORS.creamMuted,
              letterSpacing: 2,
            }}
          >
            ACADEMY
          </span>
        </div>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", gap: 28, alignItems: "center" }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <span
              key={l.path}
              onClick={() => handleNav(l.path)}
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: isActive(l.path) ? COLORS.gold : COLORS.creamMuted,
                cursor: "pointer",
                transition: "color 0.3s",
                borderBottom: isActive(l.path)
                  ? `1.5px solid ${COLORS.gold}`
                  : "1.5px solid transparent",
                paddingBottom: 2,
              }}
            >
              {l.label}
            </span>
          ))}

          {user ? (
            /* Profile dropdown */
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(212,168,67,0.06)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.accent})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.display,
                    fontSize: 13,
                    color: COLORS.cream,
                    fontWeight: 700,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 12,
                    color: COLORS.cream,
                  }}
                >
                  {displayName}
                </span>
              </div>
              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    width: 200,
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    overflow: "hidden",
                    zIndex: 100,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    onClick={() => handleNav("/dashboard")}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontFamily: fonts.body,
                      fontSize: 13,
                      color: COLORS.cream,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = COLORS.bgElevated)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    My Dashboard
                  </div>
                  <div
                    onClick={handleSignOut}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontFamily: fonts.body,
                      fontSize: 13,
                      color: COLORS.accent,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = COLORS.bgElevated)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Btn
              variant="primary"
              onClick={openWhatsApp}
              style={{ padding: "10px 24px", fontSize: 12 }}
            >
              Book Trial
            </Btn>
          )}
        </div>

        {/* Mobile hamburger */}
        <div
          style={{ display: "none", cursor: "pointer" }}
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          style={{
            background: COLORS.bg,
            padding: "24px",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          {links.map((l) => (
            <div
              key={l.path}
              onClick={() => handleNav(l.path)}
              style={{
                fontFamily: fonts.body,
                fontSize: 15,
                color: COLORS.cream,
                padding: "12px 0",
                cursor: "pointer",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              {l.label}
            </div>
          ))}
          {user && (
            <div
              onClick={handleSignOut}
              style={{
                fontFamily: fonts.body,
                fontSize: 15,
                color: COLORS.accent,
                padding: "12px 0",
                cursor: "pointer",
              }}
            >
              Sign Out
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
