import { COLORS, fonts } from "../styles/theme";
import SectionTag from "../components/SectionTag";

export default function PlaceholderPage({ title, description }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px",
        background: COLORS.bg,
        textAlign: "center",
      }}
    >
      <SectionTag>Coming Soon</SectionTag>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: 40,
          color: COLORS.warmWhite,
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: fonts.accent,
          fontSize: 18,
          color: COLORS.creamMuted,
          maxWidth: 500,
        }}
      >
        {description}
      </p>
    </section>
  );
}
