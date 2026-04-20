import { COLORS } from "../styles/theme";

export default function GoldDivider({ width = 120 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "0 auto",
        width: "fit-content",
      }}
    >
      <div
        style={{
          width: width / 3,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold})`,
        }}
      />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z"
          fill={COLORS.gold}
        />
      </svg>
      <div
        style={{
          width: width / 3,
          height: 1,
          background: `linear-gradient(90deg, ${COLORS.gold}, transparent)`,
        }}
      />
    </div>
  );
}
