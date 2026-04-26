import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { COLORS, fonts } from "../styles/theme";
import SectionTag from "../components/SectionTag";
import Btn from "../components/Btn";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.cream,
    fontFamily: fonts.body,
    fontSize: 14,
    boxSizing: "border-box",
    marginTop: 6,
  };

  const labelStyle = {
    fontFamily: fonts.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg }}>
        <p style={{ fontFamily: fonts.accent, fontSize: 18, color: COLORS.creamMuted }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <section style={{ minHeight: "100vh", padding: "120px 24px 80px", background: COLORS.bg }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <SectionTag>Settings</SectionTag>
        <h2 style={{ fontFamily: fonts.display, fontSize: 36, color: COLORS.warmWhite, marginBottom: 32, fontWeight: 600 }}>
          Your <span style={{ color: COLORS.gold }}>Profile</span>
        </h2>

        {error && (
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(196,91,58,0.1)", border: `1px solid ${COLORS.accent}`, color: COLORS.accentLight, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(123,201,164,0.1)", border: "1px solid #7BC9A4", color: "#7BC9A4", marginBottom: 24, fontSize: 14 }}>
            {success}
          </div>
        )}

        <form onSubmit={updateProfile} style={{ display: "grid", gap: 24, background: COLORS.bgCard, padding: 32, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              style={inputStyle}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
            />
            <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>Email cannot be changed here.</p>
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              style={inputStyle}
              placeholder="+91 00000 00000"
            />
          </div>

          <div>
            <label style={labelStyle}>Avatar URL</label>
            <input
              type="url"
              value={profile.avatar_url}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              style={inputStyle}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <Btn style={{ width: "100%", opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? "Saving Changes..." : "Update Profile"}
            </Btn>
          </div>
        </form>
      </div>
    </section>
  );
}
