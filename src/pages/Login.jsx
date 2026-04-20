import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, fonts } from "../styles/theme";
import Btn from "../components/Btn";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signUp, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        const { data, error: err } = await signUp(email, password, name);
        if (err) {
          setError(err.message);
        } else if (data?.user && !data?.session) {
          setSuccess(
            "Check your email for a confirmation link, then sign in!"
          );
          setIsSignup(false);
        } else {
          navigate("/dashboard");
        }
      } else {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err.message);
        } else {
          navigate("/dashboard");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error: err } = await signInWithGoogle();
    if (!err) {
      return;
    }

    const rawMessage = String(err.message || "");
    const providerDisabled =
      rawMessage.includes("Unsupported provider") ||
      rawMessage.includes("provider is not enabled");

    if (providerDisabled) {
      setError(
        "Google login is not enabled in Supabase yet. Enable Google under Supabase Authentication > Providers, then add your Google OAuth Client ID/Secret and callback URL in Google Cloud."
      );
      return;
    }

    setError(rawMessage);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.cream,
    fontFamily: fonts.body,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        background: COLORS.bg,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 48,
          borderRadius: 16,
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 28,
              color: COLORS.gold,
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            Rāgaa
          </div>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: 24,
              color: COLORS.warmWhite,
              marginBottom: 8,
            }}
          >
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: COLORS.textMuted,
            }}
          >
            {isSignup
              ? "Start your musical journey today"
              : "Continue your musical journey"}
          </p>
        </div>

        {/* Error / Success messages */}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(196,91,58,0.12)",
              border: "1px solid rgba(196,91,58,0.3)",
            }}
          >
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: COLORS.accentLight,
              }}
            >
              {error}
            </p>
          </div>
        )}
        {success && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(45,106,79,0.15)",
              border: "1px solid rgba(45,106,79,0.3)",
            }}
          >
            <p
              style={{ fontFamily: fonts.body, fontSize: 13, color: "#7BC9A4" }}
            >
              {success}
            </p>
          </div>
        )}

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignup && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = COLORS.gold)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          )}
          <input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = COLORS.gold)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = COLORS.gold)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <Btn
            style={{
              width: "100%",
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
            onClick={handleSubmit}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </Btn>

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: COLORS.textMuted,
              }}
            >
              {isSignup ? "Already have an account? " : "New to Rāgaa? "}
              <span
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  color: COLORS.gold,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {isSignup ? "Sign In" : "Create Account"}
              </span>
            </span>
          </div>
        </div>

        {/* Google OAuth */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              color: COLORS.textMuted,
              marginBottom: 12,
            }}
          >
            Or continue with
          </p>
          <button
            onClick={handleGoogle}
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bgElevated,
              color: COLORS.cream,
              fontFamily: fonts.body,
              fontSize: 13,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </section>
  );
}
