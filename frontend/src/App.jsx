import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Resources from "./pages/Resources";
import Students from "./pages/Students";
import Profile from "./pages/Profile";
function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="page-loader">Getting your campus ready…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Landing />} />
    <Route path="/login" element={user ? <Navigate to="/feed" replace /> : <Login />} />
    <Route path="/register" element={user ? <Navigate to="/feed" replace /> : <Register />} />
    <Route path="/feed" element={<Protected><Layout><Feed /></Layout></Protected>} />
    <Route path="/resources" element={<Protected><Layout><Resources /></Layout></Protected>} />
    <Route path="/students" element={<Protected><Layout><Students /></Layout></Protected>} />
    <Route path="/profile" element={<Protected><Layout><Profile /></Layout></Protected>} />
    <Route path="*" element={<div className="not-found"><h1>404</h1><p>This page isn't on the campus map.</p><a href="/">Go home</a></div>} />
  </Routes>;
}
