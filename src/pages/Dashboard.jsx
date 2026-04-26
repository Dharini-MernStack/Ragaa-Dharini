import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { COLORS, fonts } from "../styles/theme";
import SectionTag from "../components/SectionTag";
import Btn from "../components/Btn";

export default function Dashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("student");
  const [isAdmin, setIsAdmin] = useState(false);
  const [whitelistApproved, setWhitelistApproved] = useState(true);
  const [whitelistFeatureEnabled, setWhitelistFeatureEnabled] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [courses, setCourses] = useState([]);

  const [adminWhitelist, setAdminWhitelist] = useState([]);
  const [adminEnrollments, setAdminEnrollments] = useState([]);
  const [adminBlogPosts, setAdminBlogPosts] = useState([]);
  const [adminMilestones, setAdminMilestones] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [studentMilestones, setStudentMilestones] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [whitelistForm, setWhitelistForm] = useState({ email: "", note: "" });
  const [enrollmentForm, setEnrollmentForm] = useState({
    student_id: "",
    course_id: "",
    status: "active",
  });
  const [blogForm, setBlogForm] = useState({
    id: null, // for editing
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    tags: "",
    is_published: false,
  });
  const [milestoneForm, setMilestoneForm] = useState({
    student_id: "",
    title: "",
    description: "",
    icon: "🏆",
  });
  const [scheduleForm, setScheduleForm] = useState({
    course_id: "",
    title: "",
    description: "",
    scheduled_at: "",
    duration_minutes: "60",
    meeting_link: "",
  });
  const [recordingForm, setRecordingForm] = useState({
    course_id: "",
    session_id: "",
    title: "",
    description: "",
    video_url: "",
    duration_seconds: "",
    recorded_at: "",
  });

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    setLoading(true);

    try {
      const [profileRes, whitelistRes, notifsRes, recsRes, schedRes, coursesRes, milestonesRes] =
        await Promise.all([
          supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
          user.email
            ? supabase
                .from("whitelisted_users")
                .select("id, email")
                .eq("email", user.email.toLowerCase())
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
          supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
          supabase
            .from("class_recordings")
            .select("*")
            .order("recorded_at", { ascending: false })
            .limit(20),
          supabase
            .from("class_sessions")
            .select("*")
            .eq("status", "scheduled")
            .order("scheduled_at", { ascending: true })
            .limit(20),
          supabase
            .from("courses")
            .select("id, title, level")
            .order("sort_order", { ascending: true }),
          supabase
            .from("milestones")
            .select("*")
            .eq("student_id", user.id)
            .order("awarded_at", { ascending: false }),
        ]);

      const profileRole = profileRes.data?.role || "student";
      const adminMode = profileRole === "admin";

      setRole(profileRole);
      setIsAdmin(adminMode);

      if (whitelistRes.error?.code === "42P01") {
        setWhitelistFeatureEnabled(false);
        setWhitelistApproved(true);
      } else {
        setWhitelistFeatureEnabled(true);
        setWhitelistApproved(adminMode || Boolean(whitelistRes.data));
      }

      setNotifications(notifsRes.data || []);
      setRecordings(recsRes.data || []);
      setSchedule(schedRes.data || []);
      setCourses(coursesRes.data || []);
      setStudentMilestones(milestonesRes.data || []);

      if (coursesRes.data?.length) {
        setScheduleForm((prev) => ({
          ...prev,
          course_id: prev.course_id || coursesRes.data[0].id,
        }));
        setRecordingForm((prev) => ({
          ...prev,
          course_id: prev.course_id || coursesRes.data[0].id,
        }));
      }

      if (adminMode) {
        await Promise.all([loadWhitelist(), loadEnrollments(), loadAllProfiles(), loadAdminBlogPosts(), loadAdminMilestones()]);
      }

      if (!adminMode && activeTab === "admin") {
        setActiveTab("overview");
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    }

    setLoading(false);
  }

  async function loadWhitelist() {
    const { data, error } = await supabase
      .from("whitelisted_users")
      .select("id, email, note, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (error.code === "42P01") {
        setWhitelistFeatureEnabled(false);
      } else {
        setAdminError(error.message);
      }
      return;
    }

    setWhitelistFeatureEnabled(true);
    setAdminWhitelist(data || []);
  }

  async function loadEnrollments() {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        status,
        enrolled_at,
        student:profiles!enrollments_student_id_fkey(id, full_name, email:id),
        course:courses(id, title)
      `)
      .order("enrolled_at", { ascending: false });

    if (error) {
      console.error("Enrollments load error:", error);
      return;
    }

    // Profiles don't have email in the table but we can get it from auth.users via metadata if we had a join,
    // but here we just have profiles. We might need to handle names carefully.
    setAdminEnrollments(data || []);
  }

  async function loadAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Profiles load error:", error);
      return;
    }
    setAllProfiles(data || []);
    if (data?.length > 0) {
      setEnrollmentForm(prev => ({ ...prev, student_id: prev.student_id || data[0].id }));
    }
  }

  async function addEnrollment(e) {
    e.preventDefault();
    if (!enrollmentForm.student_id || !enrollmentForm.course_id) {
      setAdminError("Student and Course are required.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase.from("enrollments").insert({
      student_id: enrollmentForm.student_id,
      course_id: enrollmentForm.course_id,
      status: enrollmentForm.status,
    });

    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Enrollment added successfully.");
      await loadEnrollments();
    }
    setSaving(false);
  }

  async function updateEnrollmentStatus(id, newStatus) {
    setSaving(true);
    const { error } = await supabase
      .from("enrollments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Status updated.");
      await loadEnrollments();
    }
    setSaving(false);
  }

  async function removeEnrollment(id) {
    if (!window.confirm("Are you sure you want to remove this enrollment?")) return;

    setSaving(true);
    const { error } = await supabase.from("enrollments").delete().eq("id", id);

    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Enrollment removed.");
      await loadEnrollments();
    }
    setSaving(false);
  }

  async function loadAdminBlogPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Blog posts load error:", error);
      return;
    }
    setAdminBlogPosts(data || []);
  }

  async function saveBlogPost(e) {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      setAdminError("Title, slug, and content are required.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      cover_image_url: blogForm.cover_image_url,
      tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      is_published: blogForm.is_published,
      published_at: blogForm.is_published ? (blogForm.published_at || new Date().toISOString()) : null,
    };

    let error;
    if (blogForm.id) {
      const { error: err } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", blogForm.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("blog_posts")
        .insert(payload);
      error = err;
    }

    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Blog post saved successfully.");
      setBlogForm({ id: null, title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", is_published: false });
      await loadAdminBlogPosts();
    }
    setSaving(false);
  }

  async function editBlogPost(post) {
    setBlogForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image_url: post.cover_image_url || "",
      tags: post.tags?.join(", ") || "",
      is_published: post.is_published,
      published_at: post.published_at,
    });
    // Scroll to form or switch to a sub-tab if we had one
  }

  async function deleteBlogPost(id) {
    if (!window.confirm("Delete this blog post permanently?")) return;
    setSaving(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Post deleted.");
      await loadAdminBlogPosts();
    }
    setSaving(false);
  }

  async function loadAdminMilestones() {
    const { data, error } = await supabase
      .from("milestones")
      .select(`
        *,
        student:profiles(id, full_name)
      `)
      .order("awarded_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Milestones load error:", error);
      return;
    }
    setAdminMilestones(data || []);
  }

  async function awardMilestone(e) {
    e.preventDefault();
    if (!milestoneForm.student_id || !milestoneForm.title) {
      setAdminError("Student and title are required.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase.from("milestones").insert({
      student_id: milestoneForm.student_id,
      title: milestoneForm.title,
      description: milestoneForm.description,
      icon: milestoneForm.icon,
    });

    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Milestone awarded!");
      setMilestoneForm({ student_id: "", title: "", description: "", icon: "🏆" });
      await loadAdminMilestones();
    }
    setSaving(false);
  }

  async function deleteMilestone(id) {
    if (!window.confirm("Delete this milestone?")) return;
    setSaving(true);
    const { error } = await supabase.from("milestones").delete().eq("id", id);
    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSuccess("Milestone deleted.");
      await loadAdminMilestones();
    }
    setSaving(false);
  }

  async function addWhitelistedUser(e) {
    e.preventDefault();

    const email = whitelistForm.email.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setAdminError("Enter a valid email address to whitelist.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase.from("whitelisted_users").insert({
      email,
      note: whitelistForm.note.trim() || null,
      added_by: user.id,
    });

    if (error) {
      setAdminError(error.message);
      setSaving(false);
      return;
    }

    setWhitelistForm({ email: "", note: "" });
    setAdminSuccess("User added to whitelist.");
    await loadWhitelist();
    setSaving(false);
  }

  async function removeWhitelistedUser(id) {
    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase
      .from("whitelisted_users")
      .delete()
      .eq("id", id);

    if (error) {
      setAdminError(error.message);
      setSaving(false);
      return;
    }

    setAdminSuccess("User removed from whitelist.");
    await loadWhitelist();
    setSaving(false);
  }

  async function createSession(e) {
    e.preventDefault();

    if (!scheduleForm.course_id || !scheduleForm.title || !scheduleForm.scheduled_at) {
      setAdminError("Course, title, and schedule time are required.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase.from("class_sessions").insert({
      course_id: scheduleForm.course_id,
      title: scheduleForm.title.trim(),
      description: scheduleForm.description.trim() || null,
      scheduled_at: new Date(scheduleForm.scheduled_at).toISOString(),
      duration_minutes: Number(scheduleForm.duration_minutes || 60),
      meeting_link: scheduleForm.meeting_link.trim() || null,
      status: "scheduled",
    });

    if (error) {
      setAdminError(error.message);
      setSaving(false);
      return;
    }

    setScheduleForm((prev) => ({
      ...prev,
      title: "",
      description: "",
      scheduled_at: "",
      duration_minutes: "60",
      meeting_link: "",
    }));

    setAdminSuccess("Class scheduled successfully.");
    await loadDashboardData();
    setSaving(false);
  }

  async function uploadRecording(e) {
    e.preventDefault();

    if (!recordingForm.course_id || !recordingForm.title || !recordingForm.video_url) {
      setAdminError("Course, title, and video URL are required.");
      return;
    }

    setSaving(true);
    setAdminError("");
    setAdminSuccess("");

    const { error } = await supabase.from("class_recordings").insert({
      course_id: recordingForm.course_id,
      session_id: recordingForm.session_id || null,
      title: recordingForm.title.trim(),
      description: recordingForm.description.trim() || null,
      video_url: recordingForm.video_url.trim(),
      duration_seconds: recordingForm.duration_seconds
        ? Number(recordingForm.duration_seconds)
        : null,
      recorded_at: recordingForm.recorded_at
        ? new Date(recordingForm.recorded_at).toISOString()
        : new Date().toISOString(),
    });

    if (error) {
      setAdminError(error.message);
      setSaving(false);
      return;
    }

    setRecordingForm((prev) => ({
      ...prev,
      session_id: "",
      title: "",
      description: "",
      video_url: "",
      duration_seconds: "",
      recorded_at: "",
    }));

    setAdminSuccess("Recording uploaded successfully.");
    await loadDashboardData();
    setSaving(false);
  }

  async function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }

  function markAllRead() {
    const unread = notifications.filter((n) => !n.is_read);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    unread.forEach((n) =>
      supabase.from("notifications").update({ is_read: true }).eq("id", n.id)
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (s) => {
    if (!s) return "--";
    return `${Math.floor(s / 60)} min`;
  };

  const tabStyle = (id) => ({
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "10px 20px",
    borderRadius: 8,
    transition: "all 0.3s",
    background: activeTab === id ? "rgba(212,168,67,0.12)" : "transparent",
    color: activeTab === id ? COLORS.gold : COLORS.textMuted,
    border:
      activeTab === id
        ? `1px solid ${COLORS.border}`
        : "1px solid transparent",
  });

  const cardStyle = {
    padding: 20,
    borderRadius: 12,
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    marginBottom: 12,
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.cream,
    fontFamily: fonts.body,
    fontSize: 13,
    boxSizing: "border-box",
  };

  const adminSessions = schedule.slice(0, 20);

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "110px 24px 80px",
        background: COLORS.bg,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <SectionTag>{isAdmin ? "Admin Portal" : "Student Portal"}</SectionTag>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 4vw, 38px)",
              color: COLORS.warmWhite,
              fontWeight: 600,
            }}
          >
            Welcome back, <span style={{ color: COLORS.gold }}>{displayName}</span>
          </h2>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 13,
              color: COLORS.textMuted,
              marginTop: 6,
            }}
          >
            Role: {role}
          </p>
        </div>

        {!loading && !isAdmin && whitelistFeatureEnabled && !whitelistApproved && (
          <div style={{ ...cardStyle, borderColor: COLORS.accent, marginBottom: 24 }}>
            <h3
              style={{
                fontFamily: fonts.display,
                fontSize: 20,
                color: COLORS.warmWhite,
                marginBottom: 8,
              }}
            >
              Awaiting Admin Approval
            </h3>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: COLORS.creamMuted,
                lineHeight: 1.7,
              }}
            >
              Your account is signed in, but access is pending whitelist approval.
              Please contact the academy admin to enable dashboard access.
            </p>
          </div>
        )}

        {!loading && whitelistFeatureEnabled === false && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: COLORS.creamMuted,
              }}
            >
              Whitelist table is not available yet. Run the updated SQL schema in
              Supabase to enable admin-managed user approval.
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <div style={tabStyle("overview")} onClick={() => setActiveTab("overview")}>
            Overview
          </div>
          <div style={tabStyle("schedule")} onClick={() => setActiveTab("schedule")}>
            Schedule ({schedule.length})
          </div>
          <div style={tabStyle("recordings")} onClick={() => setActiveTab("recordings")}>
            Recordings ({recordings.length})
          </div>
          {!isAdmin && (
            <div style={tabStyle("progress")} onClick={() => setActiveTab("progress")}>
              Progress ({studentMilestones.length})
            </div>
          )}
          <div
            style={tabStyle("notifications")}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications{" "}
            {unreadCount > 0 && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  color: COLORS.cream,
                  fontSize: 10,
                  lineHeight: "18px",
                  textAlign: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {isAdmin && (
            <div style={tabStyle("admin")} onClick={() => setActiveTab("admin")}>
              Admin
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div
              style={{
                fontFamily: fonts.accent,
                fontSize: 18,
                color: COLORS.creamMuted,
              }}
            >
              Loading your data...
            </div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 16,
                    marginBottom: 32,
                  }}
                >
                  {[
                    { num: schedule.length, label: "Upcoming Classes", icon: "Schedule" },
                    { num: recordings.length, label: "Recordings", icon: "Recordings" },
                    { num: studentMilestones.length, label: "Milestones", icon: "Awards" },
                    { num: unreadCount, label: "New Notifications", icon: "Alerts" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        ...cardStyle,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: fonts.display,
                          fontSize: 18,
                          color: COLORS.gold,
                        }}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: fonts.display,
                            fontSize: 24,
                            color: COLORS.gold,
                            fontWeight: 700,
                          }}
                        >
                          {s.num}
                        </div>
                        <div
                          style={{
                            fontFamily: fonts.body,
                            fontSize: 11,
                            color: COLORS.textMuted,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {schedule.length > 0 && (
                  <div style={{ ...cardStyle, borderColor: COLORS.gold }}>
                    <h3
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 20,
                        color: COLORS.warmWhite,
                        marginBottom: 12,
                      }}
                    >
                      Next Class
                    </h3>
                    <h4
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 18,
                        color: COLORS.warmWhite,
                        marginBottom: 6,
                      }}
                    >
                      {schedule[0].title}
                    </h4>
                    <p
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 13,
                        color: COLORS.creamMuted,
                      }}
                    >
                      {formatDate(schedule[0].scheduled_at)} · {schedule[0].duration_minutes} min
                    </p>
                    {schedule[0].meeting_link && (
                      <a
                        href={schedule[0].meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: 14,
                          fontFamily: fonts.body,
                          fontSize: 13,
                          color: COLORS.gold,
                        }}
                      >
                        Join class link
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "schedule" && (
              <div>
                <h3
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 22,
                    color: COLORS.warmWhite,
                    marginBottom: 20,
                  }}
                >
                  Class Schedule
                </h3>
                {schedule.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                    <p
                      style={{
                        fontFamily: fonts.accent,
                        fontSize: 16,
                        color: COLORS.textMuted,
                      }}
                    >
                      No upcoming classes scheduled yet.
                    </p>
                  </div>
                ) : (
                  schedule.map((s) => (
                    <div key={s.id} style={cardStyle}>
                      <h4
                        style={{
                          fontFamily: fonts.display,
                          fontSize: 18,
                          color: COLORS.warmWhite,
                          marginBottom: 6,
                        }}
                      >
                        {s.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 13,
                          color: COLORS.creamMuted,
                          marginBottom: 6,
                        }}
                      >
                        {formatDate(s.scheduled_at)} · {s.duration_minutes} min
                      </p>
                      {s.description && (
                        <p
                          style={{
                            fontFamily: fonts.body,
                            fontSize: 13,
                            color: COLORS.textMuted,
                            lineHeight: 1.7,
                            marginBottom: 8,
                          }}
                        >
                          {s.description}
                        </p>
                      )}
                      {s.meeting_link && (
                        <a
                          href={s.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontFamily: fonts.body,
                            fontSize: 13,
                            color: COLORS.gold,
                          }}
                        >
                          Open meeting link
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "recordings" && (
              <div>
                <h3
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 22,
                    color: COLORS.warmWhite,
                    marginBottom: 20,
                  }}
                >
                  Class Recordings
                </h3>
                {recordings.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                    <p
                      style={{
                        fontFamily: fonts.accent,
                        fontSize: 16,
                        color: COLORS.textMuted,
                      }}
                    >
                      No recordings yet. They will appear here after class uploads.
                    </p>
                  </div>
                ) : (
                  recordings.map((r) => (
                    <div key={r.id} style={cardStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontFamily: fonts.body,
                              fontSize: 15,
                              color: COLORS.warmWhite,
                              marginBottom: 4,
                            }}
                          >
                            {r.title}
                          </h4>
                          <p
                            style={{
                              fontFamily: fonts.body,
                              fontSize: 12,
                              color: COLORS.textMuted,
                              marginBottom: 8,
                            }}
                          >
                            {formatDate(r.recorded_at)} · {formatDuration(r.duration_seconds)}
                          </p>
                          {r.description && (
                            <p
                              style={{
                                fontFamily: fonts.body,
                                fontSize: 13,
                                color: COLORS.creamMuted,
                                lineHeight: 1.7,
                              }}
                            >
                              {r.description}
                            </p>
                          )}
                        </div>
                        <a
                          href={r.video_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontFamily: fonts.body,
                            fontSize: 12,
                            color: COLORS.gold,
                            textDecoration: "none",
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            padding: "8px 14px",
                          }}
                        >
                          Open Recording
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "progress" && !isAdmin && (
              <div>
                <h3
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 22,
                    color: COLORS.warmWhite,
                    marginBottom: 24,
                  }}
                >
                  Your Musical Journey
                </h3>
                {studentMilestones.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
                    <p style={{ fontFamily: fonts.accent, fontSize: 18, color: COLORS.textMuted }}>
                      Every great journey begins with a single swara.
                    </p>
                    <p style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, marginTop: 8 }}>
                      Your achievements and milestones will appear here as you progress.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {studentMilestones.map((m) => (
                      <div key={m.id} style={{ ...cardStyle, textAlign: "center", padding: 32 }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>{m.icon || "🏆"}</div>
                        <h4 style={{ fontFamily: fonts.display, fontSize: 20, color: COLORS.gold, marginBottom: 8 }}>{m.title}</h4>
                        <p style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.creamMuted, lineHeight: 1.6 }}>{m.description}</p>
                        <div style={{ marginTop: 20, fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                          Awarded {new Date(m.awarded_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 22,
                      color: COLORS.warmWhite,
                    }}
                  >
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      onClick={markAllRead}
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 12,
                        color: COLORS.gold,
                        cursor: "pointer",
                      }}
                    >
                      Mark all read
                    </span>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
                    <p
                      style={{
                        fontFamily: fonts.accent,
                        fontSize: 16,
                        color: COLORS.textMuted,
                      }}
                    >
                      No notifications yet.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markRead(n.id)}
                      style={{
                        ...cardStyle,
                        cursor: n.is_read ? "default" : "pointer",
                        opacity: n.is_read ? 0.6 : 1,
                        borderLeft: n.is_read
                          ? `1px solid ${COLORS.border}`
                          : `3px solid ${
                              n.type === "reminder"
                                ? COLORS.gold
                                : n.type === "achievement"
                                  ? COLORS.green
                                  : COLORS.accent
                            }`,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 14,
                          color: COLORS.warmWhite,
                          marginBottom: 6,
                        }}
                      >
                        {n.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 13,
                          color: COLORS.creamMuted,
                          lineHeight: 1.6,
                        }}
                      >
                        {n.message}
                      </p>
                      <p
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 11,
                          color: COLORS.textMuted,
                          marginTop: 6,
                        }}
                      >
                        {formatDate(n.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "admin" && isAdmin && (
              <div>
                <h3
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 24,
                    color: COLORS.warmWhite,
                    marginBottom: 18,
                  }}
                >
                  Admin Controls
                </h3>

                {adminError && (
                  <div
                    style={{
                      ...cardStyle,
                      borderColor: COLORS.accent,
                      color: COLORS.accentLight,
                    }}
                  >
                    {adminError}
                  </div>
                )}
                {adminSuccess && (
                  <div
                    style={{
                      ...cardStyle,
                      borderColor: COLORS.green,
                      color: "#7BC9A4",
                    }}
                  >
                    {adminSuccess}
                  </div>
                )}

                <div style={{ ...cardStyle, marginBottom: 22 }}>
                  <h4
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 20,
                      color: COLORS.warmWhite,
                      marginBottom: 14,
                    }}
                  >
                    Manage Enrollments
                  </h4>

                  <form onSubmit={addEnrollment} style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <select
                        value={enrollmentForm.student_id}
                        onChange={(e) =>
                          setEnrollmentForm((prev) => ({ ...prev, student_id: e.target.value }))
                        }
                        style={inputStyle}
                      >
                        <option value="">Select Student</option>
                        {allProfiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name || "Unknown"} ({p.id.slice(0, 5)})
                          </option>
                        ))}
                      </select>
                      <select
                        value={enrollmentForm.course_id}
                        onChange={(e) =>
                          setEnrollmentForm((prev) => ({ ...prev, course_id: e.target.value }))
                        }
                        style={inputStyle}
                      >
                        <option value="">Select Course</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Btn style={{ width: "fit-content", opacity: saving ? 0.7 : 1 }}>
                      Enroll Student
                    </Btn>
                  </form>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fonts.body, fontSize: 13, color: COLORS.cream }}>
                      <thead>
                        <tr style={{ textAlign: "left", borderBottom: `1px solid ${COLORS.border}` }}>
                          <th style={{ padding: "10px 5px", color: COLORS.textMuted }}>Student</th>
                          <th style={{ padding: "10px 5px", color: COLORS.textMuted }}>Course</th>
                          <th style={{ padding: "10px 5px", color: COLORS.textMuted }}>Status</th>
                          <th style={{ padding: "10px 5px", color: COLORS.textMuted }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminEnrollments.length === 0 ? (
                          <tr><td colSpan="4" style={{ padding: 20, textAlign: "center", color: COLORS.textMuted }}>No enrollments found.</td></tr>
                        ) : (
                          adminEnrollments.map((en) => (
                            <tr key={en.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                              <td style={{ padding: "10px 5px" }}>{en.student?.full_name || "Unknown"}</td>
                              <td style={{ padding: "10px 5px" }}>{en.course?.title}</td>
                              <td style={{ padding: "10px 5px" }}>
                                <select
                                  value={en.status}
                                  onChange={(e) => updateEnrollmentStatus(en.id, e.target.value)}
                                  style={{ ...inputStyle, padding: "4px 8px" }}
                                >
                                  <option value="active">Active</option>
                                  <option value="paused">Paused</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td style={{ padding: "10px 5px" }}>
                                <button
                                  onClick={() => removeEnrollment(en.id)}
                                  style={{ background: "transparent", border: "none", color: COLORS.accent, cursor: "pointer", fontSize: 12 }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ ...cardStyle, marginBottom: 22 }}>
                  <h4
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 20,
                      color: COLORS.warmWhite,
                      marginBottom: 14,
                    }}
                  >
                    Whitelist Users
                  </h4>

                  <form onSubmit={addWhitelistedUser} style={{ display: "grid", gap: 10 }}>
                    <input
                      type="email"
                      placeholder="student@email.com"
                      value={whitelistForm.email}
                      onChange={(e) =>
                        setWhitelistForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      style={inputStyle}
                    />
                    <input
                      placeholder="Note (optional)"
                      value={whitelistForm.note}
                      onChange={(e) =>
                        setWhitelistForm((prev) => ({ ...prev, note: e.target.value }))
                      }
                      style={inputStyle}
                    />
                    <Btn style={{ width: "fit-content", opacity: saving ? 0.7 : 1 }}>
                      Add to whitelist
                    </Btn>
                  </form>

                  <div style={{ marginTop: 14 }}>
                    {adminWhitelist.length === 0 ? (
                      <p
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 12,
                          color: COLORS.textMuted,
                        }}
                      >
                        No whitelisted users yet.
                      </p>
                    ) : (
                      adminWhitelist.map((entry) => (
                        <div
                          key={entry.id}
                          style={{
                            borderTop: `1px solid ${COLORS.border}`,
                            padding: "10px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontFamily: fonts.body,
                                fontSize: 13,
                                color: COLORS.warmWhite,
                              }}
                            >
                              {entry.email}
                            </div>
                            {entry.note && (
                              <div
                                style={{
                                  fontFamily: fonts.body,
                                  fontSize: 12,
                                  color: COLORS.textMuted,
                                }}
                              >
                                {entry.note}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeWhitelistedUser(entry.id)}
                            style={{
                              border: `1px solid ${COLORS.border}`,
                              background: "transparent",
                              color: COLORS.accentLight,
                              borderRadius: 8,
                              padding: "6px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div style={{ ...cardStyle, marginBottom: 22 }}>
                  <h4
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 20,
                      color: COLORS.warmWhite,
                      marginBottom: 14,
                    }}
                  >
                    Schedule Class
                  </h4>

                  <form onSubmit={createSession} style={{ display: "grid", gap: 10 }}>
                    <select
                      value={scheduleForm.course_id}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({ ...prev, course_id: e.target.value }))
                      }
                      style={inputStyle}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.level})
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Session title"
                      value={scheduleForm.title}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      style={inputStyle}
                    />
                    <textarea
                      placeholder="Description"
                      value={scheduleForm.description}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                    />
                    <input
                      type="datetime-local"
                      value={scheduleForm.scheduled_at}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({ ...prev, scheduled_at: e.target.value }))
                      }
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      min="15"
                      step="5"
                      value={scheduleForm.duration_minutes}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          duration_minutes: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                    <input
                      placeholder="Meeting link (optional)"
                      value={scheduleForm.meeting_link}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({ ...prev, meeting_link: e.target.value }))
                      }
                      style={inputStyle}
                    />
                    <Btn style={{ width: "fit-content", opacity: saving ? 0.7 : 1 }}>
                      Save class schedule
                    </Btn>
                  </form>
                </div>

                <div style={cardStyle}>
                  <h4
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 20,
                      color: COLORS.warmWhite,
                      marginBottom: 14,
                    }}
                  >
                    Award Milestones
                  </h4>

                  <form onSubmit={awardMilestone} style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <select
                        value={milestoneForm.student_id}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, student_id: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Select Student</option>
                        {allProfiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                      </select>
                      <input
                        placeholder="Milestone Title (e.g. Geetham Mastery)"
                        value={milestoneForm.title}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 4fr", gap: 10 }}>
                      <select
                        value={milestoneForm.icon}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, icon: e.target.value })}
                        style={inputStyle}
                      >
                        {["🏆", "⭐", "🎵", "📜", "🎓", "🎤", "🧘", "🔥"].map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <input
                        placeholder="Description (optional)"
                        value={milestoneForm.description}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <Btn style={{ width: "fit-content", opacity: saving ? 0.7 : 1 }}>Award Milestone</Btn>
                  </form>

                  <div style={{ display: "grid", gap: 10 }}>
                    {adminMilestones.map(m => (
                      <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
                        <div>
                          <span style={{ marginRight: 8 }}>{m.icon}</span>
                          <span style={{ color: COLORS.warmWhite, fontSize: 14 }}>{m.title}</span>
                          <span style={{ color: COLORS.textMuted, fontSize: 12, marginLeft: 8 }}>→ {m.student?.full_name}</span>
                        </div>
                        <button onClick={() => deleteMilestone(m.id)} style={{ background: "transparent", border: "none", color: COLORS.accent, cursor: "pointer", fontSize: 12 }}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={cardStyle}>
                  <h4
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 20,
                      color: COLORS.warmWhite,
                      marginBottom: 14,
                    }}
                  >
                    Blog & Resources Management
                  </h4>

                  <form onSubmit={saveBlogPost} style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input
                        placeholder="Title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        style={inputStyle}
                      />
                      <input
                        placeholder="Slug (e.g. raga-mayamalavagowla)"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <input
                      placeholder="Excerpt (short summary)"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      style={inputStyle}
                    />
                    <textarea
                      placeholder="Content (full article)"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      style={{ ...inputStyle, minHeight: 150, resize: "vertical" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input
                        placeholder="Cover Image URL"
                        value={blogForm.cover_image_url}
                        onChange={(e) => setBlogForm({ ...blogForm, cover_image_url: e.target.value })}
                        style={inputStyle}
                      />
                      <input
                        placeholder="Tags (comma separated)"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={blogForm.is_published}
                        onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                      />
                      <label htmlFor="is_published" style={{ color: COLORS.cream, fontSize: 13 }}>Published</label>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <Btn style={{ width: "fit-content", opacity: saving ? 0.7 : 1 }}>
                        {blogForm.id ? "Update Post" : "Create Post"}
                      </Btn>
                      {blogForm.id && (
                        <Btn variant="outline" type="button" onClick={() => setBlogForm({ id: null, title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", is_published: false })}>
                          Cancel Edit
                        </Btn>
                      )}
                    </div>
                  </form>

                  <div style={{ display: "grid", gap: 10 }}>
                    {adminBlogPosts.length === 0 ? (
                      <p style={{ color: COLORS.textMuted, fontSize: 13 }}>No posts yet.</p>
                    ) : (
                      adminBlogPosts.map(post => (
                        <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
                          <div>
                            <div style={{ color: COLORS.warmWhite, fontSize: 14 }}>{post.title}</div>
                            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>
                              {post.is_published ? "Published" : "Draft"} · {post.slug}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => editBlogPost(post)} style={{ background: "transparent", border: "none", color: COLORS.gold, cursor: "pointer", fontSize: 12 }}>Edit</button>
                            <button onClick={() => deleteBlogPost(post.id)} style={{ background: "transparent", border: "none", color: COLORS.accent, cursor: "pointer", fontSize: 12 }}>Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
