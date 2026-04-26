import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import PlaceholderPage from "./pages/PlaceholderPage";

/* Redirects to /login if not authenticated */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0A09",
          color: "#C9B99A",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
        }}
      >
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

/* Redirects to /dashboard if already logged in */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <div style={{ background: "#0C0A09", minHeight: "100vh", color: "#E7E0D5" }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={<Navigate to="/#courses" replace />}
        />
        <Route
          path="/gurus"
          element={
            <PlaceholderPage
              title="Our Guru"
              description="Dharini's full profile with bio, teaching philosophy, and student reviews."
            />
          }
        />
        <Route
          path="/pricing"
          element={<Navigate to="/#pricing" replace />}
        />
        <Route
          path="/blog"
          element={<Blog />}
        />
        <Route
          path="/blog/:slug"
          element={<PostDetail />}
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found"
              description="This page doesn't exist yet."
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
