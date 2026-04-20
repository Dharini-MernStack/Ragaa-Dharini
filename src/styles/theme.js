export const COLORS = {
  bg: "#0C0A09",
  bgCard: "#1C1917",
  bgElevated: "#292524",
  gold: "#D4A843",
  goldLight: "#E8C97A",
  goldDim: "#A67C2E",
  cream: "#FAF3E0",
  creamMuted: "#C9B99A",
  warmWhite: "#F5F0E8",
  accent: "#C45B3A",
  accentLight: "#E07A5A",
  text: "#E7E0D5",
  textMuted: "#9C8E7E",
  border: "rgba(212,168,67,0.15)",
  overlay: "rgba(12,10,9,0.85)",
  green: "#2D6A4F",
};

export const fonts = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Segoe UI', sans-serif",
  accent: "'Cormorant Garamond', Georgia, serif",
};

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "91XXXXXXXXXX";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'm interested in a free trial class at Rāgaa Academy. 🎵"
)}`;

export const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank");
