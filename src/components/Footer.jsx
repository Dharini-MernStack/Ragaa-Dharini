import { useNavigate } from "react-router-dom";
import { COLORS, fonts } from "../styles/theme";

export default function Footer() {
  const navigate = useNavigate();

  const HoverLink = ({ children, onClick }) => (
    <div
      onClick={onClick}
      style={{
        fontFamily: fonts.body,
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 10,
        cursor: "pointer",
        transition: "color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.cream)}
      onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
    >
      {children}
    </div>
  );

  return (
    <footer
      style={{
        padding: "60px 24px 32px",
        background: COLORS.bgCard,
        borderTop: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 24,
                color: COLORS.gold,
                fontStyle: "italic",
                marginBottom: 12,
              }}
            >
              Rāgaa
            </div>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: COLORS.textMuted,
                lineHeight: 1.7,
              }}
            >
              An online academy dedicated to preserving and propagating the art
              of Indian classical music.
            </p>
          </div>

          {/* Academy links */}
          <div>
            <h5
              style={{
                fontFamily: fonts.body,
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Academy
            </h5>
            <HoverLink onClick={() => navigate("/courses")}>Courses</HoverLink>
            <HoverLink onClick={() => navigate("/gurus")}>Gurus</HoverLink>
            <HoverLink onClick={() => navigate("/pricing")}>Pricing</HoverLink>
          </div>

          {/* Resources */}
          <div>
            <h5
              style={{
                fontFamily: fonts.body,
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Resources
            </h5>
            <HoverLink onClick={() => navigate("/blog")}>Blog</HoverLink>
            <HoverLink>Rāga Guide</HoverLink>
            <HoverLink>Notation Library</HoverLink>
          </div>

          {/* Connect */}
          <div>
            <h5
              style={{
                fontFamily: fonts.body,
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Connect
            </h5>
            <HoverLink>Instagram</HoverLink>
            <HoverLink>YouTube</HoverLink>
            <HoverLink>WhatsApp</HoverLink>
            <HoverLink>Email Us</HoverLink>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            © {new Date().getFullYear()} Rāgaa Academy. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            Privacy Policy · Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
}
