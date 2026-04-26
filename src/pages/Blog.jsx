import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { COLORS, fonts } from "../styles/theme";
import SectionTag from "../components/SectionTag";
import GoldDivider from "../components/GoldDivider";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  }

  const cardStyle = {
    background: COLORS.bgCard,
    borderRadius: 16,
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s, border-color 0.3s",
  };

  return (
    <section style={{ minHeight: "100vh", padding: "120px 24px 80px", background: COLORS.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionTag>Musical Wisdom</SectionTag>
          <h2 style={{ fontFamily: fonts.display, fontSize: "clamp(32px, 5vw, 48px)", color: COLORS.warmWhite, fontWeight: 600 }}>
            Resources & <span style={{ color: COLORS.gold, fontStyle: "italic" }}>Insights</span>
          </h2>
          <GoldDivider />
          <p style={{ fontFamily: fonts.accent, fontSize: 19, color: COLORS.creamMuted, maxWidth: 700, margin: "24px auto 0" }}>
            Explore our collection of articles on rāga theory, practice techniques, and the rich history of Carnatic music.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <p style={{ fontFamily: fonts.accent, fontSize: 18, color: COLORS.creamMuted }}>Tuning our instruments...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: COLORS.bgCard, borderRadius: 20, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: fonts.accent, fontSize: 18, color: COLORS.textMuted }}>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={cardStyle}
                onClick={() => navigate(`/blog/${post.slug}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = COLORS.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = COLORS.border;
                }}
              >
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: 200, background: `linear-gradient(135deg, ${COLORS.bgElevated}, ${COLORS.bgCard})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 40 }}>🎵</span>
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {post.tags?.map((tag) => (
                      <span key={tag} style={{ fontSize: 10, color: COLORS.gold, background: "rgba(212,168,67,0.1)", padding: "4px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontFamily: fonts.display, fontSize: 22, color: COLORS.warmWhite, marginBottom: 12, lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: COLORS.creamMuted }}>
                      {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span style={{ fontSize: 12, color: COLORS.gold, fontWeight: 600 }}>Read More →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
