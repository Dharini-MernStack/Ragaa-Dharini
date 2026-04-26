import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { COLORS, fonts } from "../styles/theme";
import GoldDivider from "../components/GoldDivider";
import Btn from "../components/Btn";

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg }}>
        <p style={{ fontFamily: fonts.accent, fontSize: 18, color: COLORS.creamMuted }}>Reading the manuscript...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24, textAlign: "center" }}>
        <h2 style={{ fontFamily: fonts.display, fontSize: 32, color: COLORS.warmWhite, marginBottom: 16 }}>Post Not Found</h2>
        <p style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>The article you are looking for might have been moved or removed.</p>
        <Btn onClick={() => navigate("/blog")}>Back to Blog</Btn>
      </div>
    );
  }

  return (
    <article style={{ minHeight: "100vh", background: COLORS.bg }}>
      {/* Hero Header */}
      <div style={{ width: "100%", height: "50vh", position: "relative", overflow: "hidden" }}>
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${COLORS.bgElevated}, ${COLORS.bgCard})` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(12,10,9,0.8) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 60px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {post.tags?.map((tag) => (
                <span key={tag} style={{ fontSize: 11, color: COLORS.bg, background: COLORS.gold, padding: "4px 10px", borderRadius: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 style={{ fontFamily: fonts.display, fontSize: "clamp(32px, 5vw, 56px)", color: COLORS.warmWhite, lineHeight: 1.1, marginBottom: 20 }}>
              {post.title}
            </h1>
            <p style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.creamMuted }}>
              Published on {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
        <div 
          style={{ 
            fontFamily: fonts.body, 
            fontSize: 18, 
            color: COLORS.cream, 
            lineHeight: 1.8,
            whiteSpace: "pre-wrap" // Simple way to preserve formatting, ideally use a markdown parser
          }}
        >
          {post.content}
        </div>

        <div style={{ marginTop: 80, borderTop: `1px solid ${COLORS.border}`, paddingTop: 40, textAlign: "center" }}>
          <h4 style={{ fontFamily: fonts.display, fontSize: 24, color: COLORS.warmWhite, marginBottom: 16 }}>Share this knowledge</h4>
          <GoldDivider />
          <div style={{ marginTop: 32 }}>
            <Btn variant="outline" onClick={() => navigate("/blog")}>← Back to all articles</Btn>
          </div>
        </div>
      </div>
    </article>
  );
}
