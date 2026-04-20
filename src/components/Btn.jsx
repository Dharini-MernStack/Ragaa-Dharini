import { useState } from "react";
import { COLORS, fonts } from "../styles/theme";

export default function Btn({ children, variant = "primary", onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);

  const base =
    variant === "primary"
      ? {
          background: hovered ? COLORS.goldLight : COLORS.gold,
          color: COLORS.bg,
          border: "none",
          fontWeight: 700,
        }
      : {
          background: "transparent",
          color: hovered ? COLORS.gold : COLORS.cream,
          border: `1.5px solid ${hovered ? COLORS.gold : COLORS.creamMuted}`,
        };

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        fontFamily: fonts.body,
        fontSize: 14,
        padding: "14px 36px",
        borderRadius: 6,
        cursor: "pointer",
        transition: "all 0.3s ease",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        ...base,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
