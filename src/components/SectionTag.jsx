import { fonts, COLORS } from "../styles/theme";

export default function SectionTag({ children }) {
  return (
    <span
      style={{
        fontFamily: fonts.body,
        fontSize: 11,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: COLORS.gold,
        fontWeight: 600,
        display: "block",
        marginBottom: 12,
      }}
    >
      {children}
    </span>
  );
}
